import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { clearTokens } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data as { id: string; email: string };
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // client-side only logout
      clearTokens();
      return true;
    },
    onSuccess: () => {
      qc.clear();
      navigate('/login', { replace: true });
    },
  });

  if (meQuery.isLoading) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-12">
        <p>Đang tải thông tin người dùng…</p>
      </section>
    );
  }

  if (meQuery.isError) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-md border border-red-600 bg-red-50 p-3 text-sm text-red-700">
          Không thể tải thông tin người dùng.
        </div>
      </section>
    );
  }

  const user = meQuery.data!;

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold">Thông tin tài khoản của tôi</h2>
          <p className="text-sm text-gray-700">ID: {user.id}</p>
          <p className="text-sm text-gray-700">Email: {user.email}</p>
        </div>
      </div>
      <button
        className="btn btn-outline"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
      </button>
    </section>
  );
}

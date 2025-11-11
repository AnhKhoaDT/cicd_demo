import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { setAccessToken, setRefreshToken } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

type AuthTab = 'login' | 'signup';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email for the account'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type SignupValues = z.infer<typeof signupSchema>;

export default function Auth({ initialTab = 'login' as AuthTab }) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const navigate = useNavigate();

  // Signup form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupValues) => {
      const res = await api.post('/user/register', data);
      return res.data as { message: string };
    },
    onSuccess: () => {
      reset();
      navigate('/', { state: { flash: 'Đăng ký thành công!' }, replace: true });
    },
  });

  // Login form
  const loginForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: SignupValues) => {
      const res = await api.post('/auth/login', data);
      return res.data as { accessToken: string; refreshToken: string; user: { id: string; email: string } };
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      navigate('/dashboard', { replace: true });
    },
  });

  const Title = () => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">
        {tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
      </h1>
    </div>
  );

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <div className="card-body">
          <Title />

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
              {loginMutation.isError && (
                <div className="rounded-md border border-red-600 bg-red-50 p-3 text-sm text-red-700">
                  {(loginMutation.error as any)?.response?.data?.message || 'Đăng nhập thất bại'}
                </div>
              )}
              <div>
                <label htmlFor="login-email" className="label">Email</label>
                <input id="login-email" type="email" className="input" placeholder="you@example.com" {...loginForm.register('email')} />
                {loginForm.formState.errors.email && <p className="error">{loginForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <input id="login-password" type="password" className="input" placeholder="••••••••" {...loginForm.register('password')} />
                {loginForm.formState.errors.password && <p className="error">{loginForm.formState.errors.password.message}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Đang đăng nhập…' : 'Log in'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit((d) => signupMutation.mutate(d))} className="space-y-4">
              {signupMutation.isError && (
                <div className="rounded-md border border-red-600 bg-red-50 p-3 text-sm text-red-700">
                  {(signupMutation.error as any)?.response?.data?.message || 'Registration failed'}
                </div>
              )}
              <div>
                <label className="label" htmlFor="signup-email">Email</label>
                <input id="signup-email" type="email" className="input" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p className="error">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" className="input" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="error">{errors.password.message}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>
          )}
          
        </div>
         <p className="text-sm text-gray-600 text-center mb-4">
        {tab === 'login' ? (
          <>
            Chưa có tài khoản?{' '}
            <button type="button" onClick={() => setTab('signup')} className="text-blue-600 hover:underline">
              Sign up
            </button>
          </>
        ) : (
          <>
            Bạn đã có tài khoản?{' '}
            <button type="button" onClick={() => setTab('login')} className="text-blue-600 hover:underline">
              Login
            </button>
          </>
        )}
      </p>
      </div>
    </section>
  );
}

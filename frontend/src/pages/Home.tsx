import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const state = (location.state as { flash?: string } | null) || null;
    if (state?.flash) {
      setFlash(state.flash);
      // Clear state so the banner doesn’t reappear on refresh/back
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {flash && (
        <div className="mb-6 rounded-md border border-green-600 bg-green-50 p-3 text-sm text-green-700">
          {flash}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome to IA03 User Registration</h1>
          <p className="mt-4 text-gray-600">
            This demo showcases a simple registration flow with a NestJS backend and a React frontend.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/login')}
            >
              I already have an account
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold mb-2">What’s inside?</h2>
            <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>Registration with validation and server-side checks</li>
              <li>Friendly UI with Tailwind CSS</li>
              <li>React Router & React Query for smooth UX</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, clearTokens } from './auth';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL, withCredentials: true });

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function subscribeTokenRefresh() {
  return new Promise<string>((resolve, reject) => {
    pendingQueue.push({ resolve, reject });
  });
}

function publishNewToken(token: string) {
  pendingQueue.forEach((p) => p.resolve(token));
  pendingQueue = [];
}

function publishRefreshFailed(err: any) {
  pendingQueue.forEach((p) => p.reject(err));
  pendingQueue = [];
}

// 401 handler with refresh flow
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    if (status === 401 && !original._retry) {
      original._retry = true;
      const storedRefresh = localStorage.getItem('refresh_token');
      if (!storedRefresh) {
        clearTokens();
        // redirect to login
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const newToken = await subscribeTokenRefresh();
          original.headers = original.headers || {};
          (original.headers as any)['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      isRefreshing = true;
      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: storedRefresh },
          { withCredentials: true }
        );
        const newAccess = (res.data as any)?.accessToken as string;
        if (!newAccess) throw new Error('No access token in refresh response');
        setAccessToken(newAccess);
        publishNewToken(newAccess);
        original.headers = original.headers || {};
        (original.headers as any)['Authorization'] = `Bearer ${newAccess}`;
        return api(original);
      } catch (err) {
        publishRefreshFailed(err);
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

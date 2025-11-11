import { useEffect, useState } from 'react';
import axios from 'axios';
import { setAccessToken, getRefreshToken, clearTokens, getAccessToken } from './auth';

export function useEnsureAccessToken(baseURL: string) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'failed'>('idle');

  useEffect(() => {
    let mounted = true;
    // Nếu đã có access token (cùng phiên), coi như sẵn sàng
    const at = getAccessToken();
    if (at) {
      setStatus('ready');
      return () => { mounted = false; };
    }

    const rt = getRefreshToken();
    if (!rt) {
      setStatus('failed');
      return () => { mounted = false; };
    }

    setStatus('checking');
    axios
      .post(
        `${baseURL.replace(/\/$/, '')}/auth/refresh`,
        { refreshToken: rt },
        { withCredentials: true }
      )
      .then((res) => {
        const at = (res.data as any)?.accessToken as string | undefined;
        if (at) {
          setAccessToken(at);
          if (mounted) setStatus('ready');
        } else {
          clearTokens();
          if (mounted) setStatus('failed');
        }
      })
      .catch(() => {
        clearTokens();
        if (mounted) setStatus('failed');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return status;
}

import apiClient from '../services/api/client';
import { refreshTokens } from '../services/api/auth';

// ponytail: single promise guard — replace with a queue if multi-tab token sync needed
let refreshing: Promise<string> | null = null;

export function setupInterceptors(): void {
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiClient.interceptors.response.use(
    (r) => r,
    async (error: { config: { _retry?: boolean; headers: Record<string, string> }; response?: { status: number } }) => {
      const original = error.config;
      if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
      original._retry = true;

      const storedRefresh = localStorage.getItem('refreshToken');
      if (!storedRefresh) return Promise.reject(error);

      refreshing ??= refreshTokens(storedRefresh).then((t) => {
        localStorage.setItem('accessToken', t.accessToken);
        localStorage.setItem('refreshToken', t.refreshToken);
        refreshing = null;
        return t.accessToken;
      });

      const token = await refreshing;
      original.headers.Authorization = `Bearer ${token}`;
      return apiClient.request(original);
    },
  );
}

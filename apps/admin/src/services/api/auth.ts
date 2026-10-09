import type { AdminLoginResponse, AuthTokens } from '@petlanka/types';
import api from './client';

export const adminLogin = (body: { email: string; password: string }) =>
  api.post<AdminLoginResponse>('/v1/admin/auth/login', body).then((r) => r.data);

export const refreshTokens = (refreshToken: string) =>
  api.post<AuthTokens>('/v1/admin/auth/refresh', { refreshToken }).then((r) => r.data);

export const logout = (refreshToken: string) =>
  api.post('/v1/admin/auth/logout', { refreshToken });

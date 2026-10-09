import type { OtpRequestResponse, OtpVerifyResponse, AuthTokens } from '@petlanka/types';
import api from './client';

export const requestOtp = (body: { email?: string; phone?: string; nic?: string }) =>
  api.post<OtpRequestResponse>('/v1/client/auth/otp/request', body).then((r) => r.data);

export const verifyOtp = (body: { email?: string; phone?: string; code: string }) =>
  api.post<OtpVerifyResponse>('/v1/client/auth/otp/verify', body).then((r) => r.data);

export const registerClient = (body: {
  fullName: string;
  nic: string;
  province: string;
  district: string;
  city: string;
  streetAddress: string;
}) => api.post<{ id: string; fullName: string | null }>('/v1/client/auth/register', body).then((r) => r.data);

export const refreshTokens = (refreshToken: string) =>
  api.post<AuthTokens>('/v1/client/auth/refresh', { refreshToken }).then((r) => r.data);

export const logout = (refreshToken: string) =>
  api.post('/v1/client/auth/logout', { refreshToken });

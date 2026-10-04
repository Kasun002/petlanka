import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => config);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error),
);

export default apiClient;

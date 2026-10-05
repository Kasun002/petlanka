// Shared API types between frontend and backend.
// Only add types here that are genuinely shared (e.g. API response shapes).

export * from './auth';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
}

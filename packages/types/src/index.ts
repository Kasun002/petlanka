// Shared API types between frontend and backend.
// Only add types here that are genuinely shared (e.g. API response shapes).

export * from './auth';
export * from './validation';

// Static Sri Lanka address reference data — used by client AddressFields and backend address validation.
export { default as provinces } from './data/provinces.json';
export { default as districts } from './data/districts.json';
export { default as cities } from './data/cities.json';

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

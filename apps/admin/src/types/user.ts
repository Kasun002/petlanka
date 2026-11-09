export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'OFFICER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  district: string;
  lastLogin: string;
  status: 'ACTIVE' | 'INACTIVE';
}

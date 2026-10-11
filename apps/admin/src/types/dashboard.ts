// TODO: replace with API response types when /dashboard endpoint exists
export type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEW';

export interface DashStat {
  id: string;
  value: string;
  label: string;
  iconColor: string;
  iconBg: string;
}

export interface RecentApplication {
  id: string;
  applicant: string;
  pet: string;
  type: string;
  district: string;
  submitted: string;
  status: AppStatus;
}

import type { DashStat } from './dashboard';

export type ReportSummary = DashStat;

export interface MonthlyData {
  month: string;
  applications: number;
  approved: number;
}

export interface DistrictData {
  district: string;
  count: number;
}

export interface ReportData {
  summary: ReportSummary[];
  monthly: MonthlyData[];
  byDistrict: DistrictData[];
}

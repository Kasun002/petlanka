import dashboardData from '../data/dashboard.json';
import type { DashStat, RecentApplication } from '../types/dashboard';
import StatCard from '../components/dashboard/StatCard';
import ApplicationsTable from '../components/dashboard/ApplicationsTable';

// TODO: replace with API call when /dashboard endpoint exists
const stats = dashboardData.stats as DashStat[];
const recentApplications = dashboardData.recentApplications as RecentApplication[];

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-[22px]">
        {stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      </div>
      <ApplicationsTable applications={recentApplications} />
    </div>
  );
}

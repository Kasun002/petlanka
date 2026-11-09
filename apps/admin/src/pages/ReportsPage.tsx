import { useTranslation } from 'react-i18next';
import type { ReportData } from '../types/report';
import rawData from '../data/reports.json';
import Card from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import MonthlyBarChart from '../components/reports/MonthlyBarChart';
import DistrictTable from '../components/reports/DistrictTable';

const data = rawData as ReportData;

export default function ReportsPage() {
  const { t } = useTranslation('reports');

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>

      <div className="grid grid-cols-4 gap-4">
        {data.summary.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-6">
          <MonthlyBarChart data={data.monthly} />
        </Card>
        <Card className="p-6">
          <DistrictTable data={data.byDistrict} />
        </Card>
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import type { MonthlyData } from '../../types/report';

interface Props { data: MonthlyData[] }

export default function MonthlyBarChart({ data }: Readonly<Props>) {
  const { t } = useTranslation('reports');
  const max = Math.max(...data.map((d) => d.applications));

  return (
    <div>
      <h3 className="text-[13.5px] font-bold mb-5">{t('monthly.title')}</h3>
      <div className="space-y-3">
        {data.map((row) => (
          <div key={row.month} className="flex items-center gap-3">
            <span className="text-[12px] text-muted w-8 flex-shrink-0">{row.month}</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-5 rounded-md bg-primary/80 transition-all"
                  style={{ width: `${(row.applications / max) * 100}%` }}
                />
                <span className="text-[11.5px] text-gray-600 flex-shrink-0">{row.applications}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 rounded-md bg-[#E3F2ED]"
                  style={{ width: `${(row.approved / max) * 100}%` }}
                />
                <span className="text-[10.5px] text-muted flex-shrink-0">{row.approved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <span className="text-[11.5px] text-muted">{t('monthly.applications')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#E3F2ED]" />
          <span className="text-[11.5px] text-muted">{t('monthly.approved')}</span>
        </div>
      </div>
    </div>
  );
}

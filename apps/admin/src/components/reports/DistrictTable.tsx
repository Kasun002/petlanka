import { useTranslation } from 'react-i18next';
import type { DistrictData } from '../../types/report';

interface Props { data: DistrictData[] }

export default function DistrictTable({ data }: Readonly<Props>) {
  const { t } = useTranslation('reports');
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div>
      <h3 className="text-[13.5px] font-bold mb-4">{t('byDistrict.title')}</h3>
      <div className="space-y-2.5">
        {sorted.map((row) => {
          const pct = Math.round((row.count / total) * 100);
          return (
            <div key={row.district}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12.5px] text-gray-700">{row.district}</span>
                <span className="text-[12px] text-muted">{row.count} <span className="text-[11px]">({pct}%)</span></span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

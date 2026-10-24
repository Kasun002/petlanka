import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Application } from '../../types/application';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  rows: Application[];
}

const th = 'px-4 py-3 font-semibold text-left';
const td = 'px-4 py-3.5';

export default function ApplicationsTable({ rows }: Readonly<Props>) {
  const { t } = useTranslation('applications');
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
            <th className={th}>{t('table.id')}</th>
            <th className={th}>{t('table.applicant')}</th>
            <th className={th}>{t('table.pet')}</th>
            <th className={th}>{t('table.type')}</th>
            <th className={th}>{t('table.district')}</th>
            <th className={th}>{t('table.submitted')}</th>
            <th className={th}>{t('table.status')}</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {rows.map((app, i) => (
            <tr
              key={app.id}
              className={`${i < rows.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
            >
              <td className={`${td} font-mono text-[12px] text-muted`}>{app.id}</td>
              <td className={`${td} font-semibold text-gray-900`}>{app.applicant}</td>
              <td className={`${td} text-gray-700`}>{app.pet} <span className="text-muted">({app.species})</span></td>
              <td className={`${td} text-gray-600`}>{app.type}</td>
              <td className={`${td} text-gray-600`}>{app.district}</td>
              <td className={`${td} text-gray-500`}>{app.submitted}</td>
              <td className={td}><StatusBadge status={app.status} /></td>
              <td className={td}>
                <button
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="text-[12.5px] text-primary font-semibold hover:underline"
                >
                  {t('review.title')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

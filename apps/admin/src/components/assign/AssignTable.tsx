import { useTranslation } from 'react-i18next';
import type { AssignRequest } from '../../types/assign';

interface Props {
  rows: AssignRequest[];
  onAssign: (req: AssignRequest) => void;
}

const th = 'px-4 py-3 font-semibold text-left';
const td = 'px-4 py-3.5';

const PRIORITY_STYLES: Record<string, string> = {
  HIGH:   'bg-[#FBE9E7] text-[#C0362C]',
  NORMAL: 'bg-surface text-muted',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING:  'bg-[#FCF0DA] text-[#B4740C]',
  ASSIGNED: 'bg-[#EAF2FB] text-[#2461C7]',
  COMPLETE: 'bg-[#E5F5EC] text-[#1E8A5F]',
};

export default function AssignTable({ rows, onAssign }: Readonly<Props>) {
  const { t } = useTranslation('assign');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
            <th className={th}>{t('table.id')}</th>
            <th className={th}>{t('table.applicant')}</th>
            <th className={th}>{t('table.type')}</th>
            <th className={th}>{t('table.district')}</th>
            <th className={th}>{t('table.submitted')}</th>
            <th className={th}>{t('table.priority')}</th>
            <th className={th}>{t('table.assignedTo')}</th>
            <th className={th}>{t('table.status')}</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {rows.map((req, i) => (
            <tr
              key={req.id}
              className={`${i < rows.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
            >
              <td className={`${td} font-mono text-[12px] text-muted`}>{req.id}</td>
              <td className={`${td} font-semibold text-gray-900`}>{req.applicant}</td>
              <td className={`${td} text-gray-600`}>{req.type}</td>
              <td className={`${td} text-gray-600`}>{req.district}</td>
              <td className={`${td} text-gray-500 text-[12px]`}>{req.submitted}</td>
              <td className={td}>
                <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] ${PRIORITY_STYLES[req.priority]}`}>
                  {t(`priority.${req.priority}`)}
                </span>
              </td>
              <td className={`${td} text-gray-600 text-[12.5px]`}>
                {req.assignedTo ? req.assignedTo : <span className="text-muted italic">{t('unassigned')}</span>}
              </td>
              <td className={td}>
                <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] ${STATUS_STYLES[req.status]}`}>
                  {t(`status.${req.status}`)}
                </span>
              </td>
              <td className={td}>
                {req.status !== 'COMPLETE' && (
                  <button
                    onClick={() => onAssign(req)}
                    className="text-[12.5px] text-primary font-semibold hover:underline"
                  >
                    {req.assignedTo ? t('reassign') : t('assign')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

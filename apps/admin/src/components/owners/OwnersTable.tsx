import { useTranslation } from 'react-i18next';
import type { Owner } from '../../types/owner';
import StatusBadge from '../ui/StatusBadge';

interface Props { rows: Owner[] }

const th = 'px-4 py-3 font-semibold text-left';
const td = 'px-4 py-3.5';

export default function OwnersTable({ rows }: Readonly<Props>) {
  const { t } = useTranslation('owners');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
            <th className={th}>{t('table.id')}</th>
            <th className={th}>{t('table.name')}</th>
            <th className={th}>{t('table.nic')}</th>
            <th className={th}>{t('table.phone')}</th>
            <th className={th}>{t('table.district')}</th>
            <th className={th}>{t('table.petCount')}</th>
            <th className={th}>{t('table.status')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((owner, i) => (
            <tr
              key={owner.id}
              className={`${i < rows.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
            >
              <td className={`${td} font-mono text-[12px] text-muted`}>{owner.id}</td>
              <td className={`${td} font-semibold text-gray-900`}>{owner.name}</td>
              <td className={`${td} text-gray-600 font-mono text-[12px]`}>{owner.nic}</td>
              <td className={`${td} text-gray-600`}>{owner.phone}</td>
              <td className={`${td} text-gray-600`}>{owner.district}</td>
              <td className={`${td} text-center font-semibold text-gray-700`}>{owner.petCount}</td>
              <td className={td}><StatusBadge status={owner.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

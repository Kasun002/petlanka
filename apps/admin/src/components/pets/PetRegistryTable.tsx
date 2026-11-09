import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../types/pet';
import StatusBadge from '../ui/StatusBadge';

interface Props { rows: Pet[] }

const th = 'px-4 py-3 font-semibold text-left';
const td = 'px-4 py-3.5';

export default function PetRegistryTable({ rows }: Readonly<Props>) {
  const { t } = useTranslation('pets');
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
            <th className={th}>{t('table.id')}</th>
            <th className={th}>{t('table.name')}</th>
            <th className={th}>{t('table.species')}</th>
            <th className={th}>{t('table.breed')}</th>
            <th className={th}>{t('table.owner')}</th>
            <th className={th}>{t('table.district')}</th>
            <th className={th}>{t('table.expiry')}</th>
            <th className={th}>{t('table.status')}</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {rows.map((pet, i) => (
            <tr
              key={pet.id}
              className={`${i < rows.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
            >
              <td className={`${td} font-mono text-[12px] text-muted`}>{pet.id}</td>
              <td className={`${td} font-semibold text-gray-900`}>{pet.name}</td>
              <td className={`${td} text-gray-700`}>{pet.species}</td>
              <td className={`${td} text-gray-600`}>{pet.breed}</td>
              <td className={`${td} text-gray-700`}>{pet.owner}</td>
              <td className={`${td} text-gray-600`}>{pet.district}</td>
              <td className={`${td} text-gray-500 text-[12px]`}>{pet.licenceExpiry}</td>
              <td className={td}><StatusBadge status={pet.status} /></td>
              <td className={td}>
                <button
                  onClick={() => navigate(`/pets/${pet.id}`)}
                  className="text-[12.5px] text-primary font-semibold hover:underline"
                >
                  {t('detail.title')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

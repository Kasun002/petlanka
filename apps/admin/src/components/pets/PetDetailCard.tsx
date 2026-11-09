import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../types/pet';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

interface Props { pet: Pet }

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-black/[0.05] last:border-0">
      <span className="text-[12px] text-muted w-32 flex-shrink-0 pt-px">{label}</span>
      <span className="text-[13px] text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export default function PetDetailCard({ pet }: Readonly<Props>) {
  const { t } = useTranslation('pets');
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[17px] font-bold">{pet.name}</h3>
            <p className="text-[12px] text-muted mt-0.5">{pet.id}</p>
          </div>
          <StatusBadge status={pet.status} />
        </div>
        <h4 className="text-[11.5px] font-bold text-muted uppercase tracking-wide mb-2">{t('detail.basicInfo')}</h4>
        <InfoRow label={t('table.species')}      value={pet.species} />
        <InfoRow label={t('table.breed')}        value={pet.breed} />
        <InfoRow label={t('detail.dob')}         value={pet.dob} />
        <InfoRow label={t('detail.microchip')}   value={pet.microchip} />
      </Card>

      <Card className="p-5">
        <h4 className="text-[11.5px] font-bold text-muted uppercase tracking-wide mb-2">{t('detail.licenceInfo')}</h4>
        <InfoRow label={t('detail.registered')}  value={pet.registered} />
        <InfoRow label={t('detail.expiry')}      value={pet.licenceExpiry} />
        <InfoRow label={t('table.district')}     value={pet.district} />
      </Card>

      <Card className="p-5">
        <h4 className="text-[11.5px] font-bold text-muted uppercase tracking-wide mb-2">{t('detail.ownerInfo')}</h4>
        <InfoRow label={t('table.owner')} value={pet.owner} />
        <InfoRow label="Owner ID"         value={pet.ownerId} />
        <button
          onClick={() => navigate(`/owners`)}
          className="mt-3 text-[12.5px] text-primary font-semibold hover:underline"
        >
          {t('detail.viewOwner')} →
        </button>
      </Card>
    </div>
  );
}

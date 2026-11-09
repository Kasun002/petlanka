import { useTranslation } from 'react-i18next';
import type { Application } from '../../types/application';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  app: Application;
}

function InfoRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-black/[0.05] last:border-0">
      <span className="text-[12px] text-muted w-32 flex-shrink-0 pt-px">{label}</span>
      <span className="text-[13px] text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export default function ApplicationDetail({ app }: Readonly<Props>) {
  const { t } = useTranslation('applications');

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13.5px] font-bold">{t('review.appId')}: {app.id}</h3>
          <StatusBadge status={app.status} />
        </div>
        <InfoRow label={t('review.type')}      value={app.type} />
        <InfoRow label={t('review.district')}  value={app.district} />
        <InfoRow label={t('review.submitted')} value={app.submitted} />
      </Card>

      <Card className="p-5">
        <h3 className="text-[13.5px] font-bold mb-3">{t('detail.applicantInfo')}</h3>
        <InfoRow label={t('detail.nic')}   value={app.nic} />
        <InfoRow label={t('detail.phone')} value={app.phone} />
        <InfoRow label={t('detail.email')} value={app.email} />
      </Card>

      <Card className="p-5">
        <h3 className="text-[13.5px] font-bold mb-3">{t('detail.petInfo')}</h3>
        <InfoRow label={t('detail.species')}   value={app.species} />
        <InfoRow label={t('detail.breed')}     value={app.breed} />
        <InfoRow label={t('detail.dob')}       value={app.dob} />
        <InfoRow label={t('detail.microchip')} value={app.microchip} />
      </Card>
    </div>
  );
}

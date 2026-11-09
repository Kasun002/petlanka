import { useTranslation } from 'react-i18next';
import type { UserProfile } from '../../types/profile';

interface Props {
  profile: UserProfile;
}

export default function ProfileInfoCard({ profile }: Readonly<Props>) {
  const { t } = useTranslation('profile');

  const rows = [
    { label: t('fullName'),      value: profile.fullName },
    { label: t('nic'),           value: profile.nic },
    { label: t('phone'),         value: profile.phone },
    { label: t('email'),         value: profile.email ?? '—' },
    { label: t('province'),      value: profile.address.province },
    { label: t('district'),      value: profile.address.district },
    { label: t('city'),          value: profile.address.city },
    { label: t('streetAddress'), value: profile.address.streetAddress },
  ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/[0.05]">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-start gap-4 px-4 py-3">
          <span className="text-[12px] text-muted flex-shrink-0 pt-0.5">{label}</span>
          <span className="text-[13px] font-medium text-right break-words max-w-[60%]">{value}</span>
        </div>
      ))}
    </div>
  );
}

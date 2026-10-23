import { useTranslation } from 'react-i18next';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE:  { bg: '#E5F5EC', color: '#1E8A5F' },
  EXPIRES: { bg: '#FCF0DA', color: '#B4740C' },
  PENDING: { bg: '#FCF0DA', color: '#B4740C' },
  EXPIRED: { bg: '#FBE9E7', color: '#C0362C' },
};

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Readonly<Props>) {
  const { t } = useTranslation('common');
  const { bg, color } = BADGE_STYLES[status] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span
      style={{ background: bg, color }}
      className="inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px]"
    >
      {t(`status.${status}`, { defaultValue: status })}
    </span>
  );
}

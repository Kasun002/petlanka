import type { DashStat } from '../../types/dashboard';

const STAT_ICONS: Record<string, (color: string) => React.ReactNode> = {
  pets: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <circle cx="7" cy="8.5" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="17" cy="8.5" r="1.5" />
      <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
    </svg>
  ),
  licences: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" className="block flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pending: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <path d="M4 13.5 6.5 5h11L20 13.5" />
      <path d="M4 13.5v5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-5" />
    </svg>
  ),
  revenue: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <path d="M4 20V10M10 20V4M16 20v-7M20 20H4" />
    </svg>
  ),
};

interface Props {
  stat: DashStat;
}

export default function StatCard({ stat }: Props) {
  const renderIcon = STAT_ICONS[stat.id];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-[18px]">
      <div
        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-3.5"
        style={{ background: stat.iconBg }}
      >
        {renderIcon?.(stat.iconColor)}
      </div>
      <p className="text-[24px] font-bold font-display">{stat.value}</p>
      <p className="text-[12.5px] text-muted mt-[3px]">{stat.label}</p>
    </div>
  );
}

import type { HomeNotification, NotificationType } from '../../types/home';

const ICON_STYLES: Record<NotificationType, { bg: string; stroke: string }> = {
  action:   { bg: '#EFEAFB', stroke: '#5B3FA8' },
  reminder: { bg: '#FCF0DA', stroke: '#B4740C' },
  success:  { bg: '#E5F5EC', stroke: '#1E8A5F' },
  info:     { bg: '#EAF2FB', stroke: '#2461C7' },
};

function NotificationIcon({ type }: { type: NotificationType }) {
  if (type === 'action') return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5a8.5 8.5 0 1 0 5.2 15.2L21 20l-1.3-3.8A8.5 8.5 0 0 0 12 3.5Z" />
      <path d="M12 8v5M12 15.5h.01" />
    </svg>
  );
  if (type === 'reminder') return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10a8 8 0 0 1 14-4.5M20 14a8 8 0 0 1-14 4.5" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </svg>
  );
  if (type === 'success') return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

interface Props {
  notification: HomeNotification;
  isLast?: boolean;
}

export default function NotificationItem({ notification, isLast = false }: Props) {
  const { bg, stroke } = ICON_STYLES[notification.type];
  return (
    <div className={`flex gap-3 px-4 py-3.5 ${isLast ? '' : 'border-b border-black/[0.06]'}`}>
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ background: bg, color: stroke }}
      >
        <NotificationIcon type={notification.type} />
      </div>
      <div>
        <p className="text-[13px] font-semibold leading-snug">{notification.title}</p>
        <p className="text-[11.5px] text-muted mt-0.5">{notification.subtitle}</p>
      </div>
    </div>
  );
}

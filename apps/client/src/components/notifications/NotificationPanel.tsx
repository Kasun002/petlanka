import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ClientNotification, ClientNotificationType } from '../../types/notification';

interface Props {
  notifications: ClientNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const TYPE_ICON: Record<ClientNotificationType, React.ReactNode> = {
  action: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <path d="M12 3.5a8.5 8.5 0 1 0 5.2 15.2L21 20l-1.3-3.8A8.5 8.5 0 0 0 12 3.5Z" />
      <path d="M12 8v5M12 15.5h.01" />
    </svg>
  ),
  reminder: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 1.5" />
    </svg>
  ),
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

const TYPE_COLOR: Record<ClientNotificationType, string> = {
  action:   'bg-[#EFEAFB] text-[#5B3FA8]',
  reminder: 'bg-[#FCF0DA] text-[#B4740C]',
  success:  'bg-[#E5F5EC] text-[#1E8A5F]',
  info:     'bg-[#EAF2FB] text-[#2461C7]',
};

export default function NotificationPanel({ notifications, onRead, onReadAll, onClose, anchorRef }: Readonly<Props>) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose, anchorRef]);

  const handleClick = (n: ClientNotification) => {
    onRead(n.id);
    onClose();
    navigate(n.route);
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-[calc(100%+10px)] right-0 z-50 w-[min(340px,calc(100vw-2rem))] bg-white rounded-2xl shadow-xl border border-black/[0.08] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange text-white leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={onReadAll} className="text-[11.5px] text-primary font-semibold hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-black/[0.04]">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-muted">No notifications</div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface ${!n.read ? 'bg-[#FAFDF9]' : ''}`}
            >
              <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5 ${TYPE_COLOR[n.type]}`}>
                {TYPE_ICON[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-snug ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {n.title}
                </p>
                <p className="text-[11.5px] text-muted mt-0.5 truncate">{n.body}</p>
                <p className="text-[11px] text-muted/70 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

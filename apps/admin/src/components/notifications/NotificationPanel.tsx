import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Notification {
  id: string;
  type: 'application' | 'assign' | 'expiry';
  title: string;
  body: string;
  route: string;
  read: boolean;
  time: string;
}

interface Props {
  notifications: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  application: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <path d="M4 13.5 6.5 5h7L16 13.5" /><path d="M4 13.5v3.5h12v-3.5" /><path d="M4 13.5h3l1 1.5h4l1-1.5H16" />
    </svg>
  ),
  assign: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <rect x="3.5" y="3" width="10" height="13" rx="1.5" />
      <path d="M6.5 3V2.5A1.5 1.5 0 0 1 8 1h2a1.5 1.5 0 0 1 1.5 1.5V3" />
      <path d="M6.2 10l1.8 1.8 3.8-3.8" />
    </svg>
  ),
  expiry: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
      <circle cx="9" cy="9" r="7" /><path d="M9 5.5V9l2.5 1.5" />
    </svg>
  ),
};

const TYPE_COLOR: Record<Notification['type'], string> = {
  application: 'bg-[#E3F2ED] text-primary',
  assign:      'bg-[#EAF2FB] text-[#2461C7]',
  expiry:      'bg-[#FCF0DA] text-[#B4740C]',
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

  const handleClick = (n: Notification) => {
    onRead(n.id);
    navigate(n.route);
    onClose();
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
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onReadAll}
            className="text-[11.5px] text-primary font-semibold hover:underline"
          >
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

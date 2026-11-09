import { useRef, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import NotificationPanel from '../components/notifications/NotificationPanel';
import notificationsData from '../data/notifications.json';
import type { ClientNotification } from '../types/notification';

export default function AppShell() {
  useAuth();
  const { t } = useTranslation('shell');
  // ponytail: replace with user.fullName from /me when endpoint exists
  const name = 'there';

  const [notifs, setNotifs] = useState<ClientNotification[]>(notificationsData as ClientNotification[]);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const TABS = [
    {
      to: '/home', label: t('nav.home'),
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>,
    },
    {
      to: '/pets', label: t('nav.myPets'),
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block"><circle cx="7" cy="8.5" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="17" cy="8.5" r="1.6" /><path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" /></svg>,
    },
    {
      to: '/apply', label: t('nav.apply'),
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="block"><path d="M12 5v14M5 12h14" /></svg>,
    },
    {
      to: '/profile', label: t('nav.profile'),
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" /></svg>,
    },
  ];

  const NAV_LINKS = [
    { to: '/home', label: t('nav.home') },
    { to: '/pets', label: t('nav.myPets') },
    { to: '/apply', label: t('nav.apply') },
    { to: '/profile', label: t('nav.profile') },
  ];

  const bellButton = (stroke: string, border: string) => (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setNotifOpen((o) => !o)}
        className={`w-10 h-10 md:w-[38px] md:h-[38px] rounded-xl md:rounded-[10px] flex items-center justify-center relative transition-colors ${border} ${notifOpen ? 'opacity-80' : ''}`}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block">
          <path d="M6 10a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </button>
      {unreadCount > 0 && (
        <span className="absolute -top-[4px] -right-[4px] min-w-[16px] h-[16px] px-[3px] rounded-full bg-orange text-white text-[9px] font-bold flex items-center justify-center leading-none pointer-events-none">
          {unreadCount}
        </span>
      )}
      {notifOpen && (
        <NotificationPanel
          notifications={notifs}
          onRead={markRead}
          onReadAll={markAllRead}
          onClose={() => setNotifOpen(false)}
          anchorRef={bellRef}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      {/* Mobile top header */}
      <header className="md:hidden bg-primary rounded-b-[22px] px-[22px] pt-[22px] pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12.5px] text-white/75 mb-0.5">{t('header.greeting')}</p>
            <h1 className="text-[20px] font-bold text-white font-display">{name}</h1>
          </div>
          {bellButton('#fff', 'bg-white/[0.14]')}
        </div>
      </header>

      {/* Desktop top nav */}
      <header className="hidden md:flex h-[72px] bg-white border-b border-black/[0.08] px-10 items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block">
                <circle cx="7" cy="8.5" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="17" cy="8.5" r="1.6" />
                <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
              </svg>
            </div>
            <span className="font-display font-bold text-[15.5px]">PetLanka</span>
          </div>
          <nav className="flex gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors ${isActive ? 'bg-[#E3F2ED] text-primary' : 'text-gray-600 hover:bg-surface'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <LanguageSwitcher />
          {bellButton('#0F7A63', 'bg-white border border-black/[0.1] shadow-sm hover:bg-surface')}
          <div className="w-[38px] h-[38px] rounded-[10px] bg-primary flex items-center justify-center text-white font-bold text-[13px]">
            KP
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-[72px] md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex bg-white border-t border-black/[0.08] pb-3.5 pt-2.5 z-10">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 text-[10.5px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

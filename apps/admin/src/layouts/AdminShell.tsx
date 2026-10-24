import { useRef, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api/auth';
import dashboardData from '../data/dashboard.json';
import notifData from '../data/notifications.json';
import NotificationPanel, { type Notification } from '../components/notifications/NotificationPanel';

const { navBadges } = dashboardData;

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සි' },
  { code: 'ta', label: 'த' },
];

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/': 'nav.dashboard',
  '/applications': 'nav.applications',
  '/owners': 'nav.owners',
  '/pets': 'nav.petRegistry',
  '/reports': 'nav.reports',
  '/assign': 'nav.assignRequests',
  '/users': 'nav.usersRoles',
  '/settings': 'nav.settings',
};

// sub-pages inherit parent title
const PAGE_TITLE_PREFIXES: [string, string][] = [
  ['/applications/', 'nav.applications'],
  ['/pets/',         'nav.petRegistry'],
];

type NavItem = { to: string; labelKey: string; badge?: number; icon: React.ReactNode };
type NavGroup = { headingKey?: string; items: NavItem[] };

// All nav SVGs use viewBox="0 0 24 24" — coordinates are in 24-unit space
const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        to: '/', labelKey: 'nav.dashboard',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className="block flex-shrink-0">
            <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
          </svg>
        ),
      },
      {
        to: '/applications', labelKey: 'nav.applications', badge: navBadges.applications,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <path d="M4 15 7 5h10l3 10" /><path d="M4 15v5a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 20v-5" />
            <path d="M4 15h5l1.5 2h3L15 15h5" />
          </svg>
        ),
      },
      {
        to: '/pets', labelKey: 'nav.petRegistry',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <circle cx="7" cy="8" r="2" /><circle cx="12" cy="5.5" r="2" /><circle cx="17" cy="8" r="2" />
            <path d="M9 14.5c-2.5.7-4 2.7-3.8 5 .2 2.2 2 3.3 4 2.6 1-.4 2-.4 3 0 .5.2.9.3 1.4.1.9-.3 1.8-.3 2.6 0 2 .7 3.8-.4 4-2.6.2-2.3-1.3-4.3-3.8-5-2.3-.7-5-.7-7.4 0Z" />
          </svg>
        ),
      },
      {
        to: '/owners', labelKey: 'nav.owners',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <circle cx="9" cy="7" r="3.5" /><path d="M2 21c1-4 3.5-6 7-6s6 2 7 6" />
            <circle cx="18.5" cy="8.5" r="2.5" /><path d="M16 14.5c2.5.5 4 2.3 4.5 5" />
          </svg>
        ),
      },
      {
        to: '/reports', labelKey: 'nav.reports',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <path d="M4 20V12M9 20V6M14 20v-8M19 20v-5M4 20h15" />
          </svg>
        ),
      },
    ],
  },
  {
    headingKey: 'nav.operations',
    items: [
      {
        to: '/assign', labelKey: 'nav.assignRequests', badge: navBadges.assignRequests,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <rect x="5" y="4" width="14" height="17" rx="2" />
            <path d="M9 4V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
            <path d="M9 13l2 2 4-4" />
          </svg>
        ),
      },
    ],
  },
  {
    headingKey: 'nav.administration',
    items: [
      {
        to: '/users', labelKey: 'nav.usersRoles',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <circle cx="9" cy="7" r="3.5" /><path d="M2 21c1-4 3.5-6 7-6s6 2 7 6" />
            <path d="M18 9l3-1v3c0 2.5-1.3 4-3 4.8-1.7-.8-3-2.3-3-4.8V8l3 1Z" />
          </svg>
        ),
      },
      {
        to: '/settings', labelKey: 'nav.settings',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
          </svg>
        ),
      },
    ],
  },
];

function NavItemRow({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const { t } = useTranslation('shell');
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
          isActive ? 'bg-[#E3F2ED] text-primary' : 'text-gray-700 hover:bg-surface'
        }`
      }
    >
      {item.icon}
      <span className="flex-1">{t(item.labelKey)}</span>
      {item.badge !== undefined && (
        <span className="bg-orange text-white text-[10.5px] font-bold px-1.5 py-px rounded-[6px]">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

export default function AdminShell() {
  const { clearAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('shell');

  const pageTitleKey =
    PAGE_TITLE_KEYS[location.pathname] ??
    PAGE_TITLE_PREFIXES.find(([prefix]) => location.pathname.startsWith(prefix))?.[1] ??
    'nav.dashboard';
  const pageTitle = t(pageTitleKey);

  const [notifs, setNotifs]        = useState<Notification[]>(notifData.list as Notification[]);
  const [notifOpen, setNotifOpen]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = () => setSidebarOpen(false);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markRead    = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  // ponytail: display name stored at login; replace with user context when /me exists
  const displayName = localStorage.getItem('adminDisplayName') ?? 'Admin';
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    const rt = localStorage.getItem('refreshToken');
    if (rt) logout(rt).catch(() => {});
    clearAuth();
    navigate('/login', { replace: true });
  };

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block">
            <circle cx="7" cy="8" r="2" /><circle cx="12" cy="5.5" r="2" /><circle cx="17" cy="8" r="2" />
            <path d="M9 14.5c-2.5.7-4 2.7-3.8 5 .2 2.2 2 3.3 4 2.6 1-.4 2-.4 3 0 .5.2.9.3 1.4.1.9-.3 1.8-.3 2.6 0 2 .7 3.8-.4 4-2.6.2-2.3-1.3-4.3-3.8-5-2.3-.7-5-.7-7.4 0Z" />
          </svg>
        </div>
        <span className="font-display font-bold text-[15.5px]">PetLanka</span>
      </div>

      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-2' : ''}>
          {group.headingKey && (
            <p className="text-[10.5px] font-bold text-muted tracking-wide uppercase px-[14px] mt-4 mb-1.5">
              {t(group.headingKey)}
            </p>
          )}
          {group.items.map((item) => (
            <NavItemRow key={item.to} item={item} onClick={closeSidebar} />
          ))}
        </div>
      ))}

      <button
        onClick={() => { closeSidebar(); handleLogout(); }}
        className="mt-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#C0362C] hover:bg-red-50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
          <path d="M10 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
          <path d="M16 17l5-5-5-5" /><path d="M21 12H10" />
        </svg>
        {t('nav.logout')}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden font-body">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — drawer on mobile, static on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[236px] bg-white border-r border-black/[0.08]
        flex flex-col py-[22px] px-[14px] overflow-y-auto
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0
      `}>
        {sidebarContent}
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-[60px] lg:h-[68px] flex-shrink-0 bg-white border-b border-black/[0.08] flex items-center gap-3 px-4 lg:px-8">
          {/* Burger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="block">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          {/* Page title */}
          <h1 className="text-[16px] lg:text-[18px] font-bold font-display flex-1 truncate">{pageTitle}</h1>

          {/* Desktop: search + lang */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 block" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A968A" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" />
              </svg>
              <input
                placeholder={t('header.searchPlaceholder')}
                className="w-[260px] h-10 rounded-[10px] border border-black/[0.14] pl-9 pr-3.5 text-[13px] bg-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-0.5 bg-surface p-[3px] rounded-lg text-[11.5px] font-bold">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  className={i18n.resolvedLanguage === code
                    ? 'px-2 py-[5px] rounded-md bg-white text-primary'
                    : 'px-2 py-[5px] text-muted'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bell + avatar (always visible) */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Language switcher mobile */}
            <div className="flex lg:hidden gap-0.5 bg-surface p-[3px] rounded-lg text-[11px] font-bold">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  className={i18n.resolvedLanguage === code
                    ? 'px-1.5 py-1 rounded-md bg-white text-primary'
                    : 'px-1.5 py-1 text-muted'}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Notifications bell */}
            <div className="relative">
              <button
                ref={bellRef}
                onClick={() => setNotifOpen((o) => !o)}
                className={`w-9 h-9 lg:w-[38px] lg:h-[38px] rounded-[10px] border flex items-center justify-center relative transition-colors shadow-sm ${notifOpen ? 'bg-[#E3F2ED] border-primary/30' : 'bg-white border-black/[0.1] hover:bg-surface'}`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block">
                  <path d="M6 10a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-[4px] -right-[4px] min-w-[16px] h-[16px] px-[3px] rounded-full bg-orange text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>
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

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 lg:w-[38px] lg:h-[38px] rounded-[10px] bg-primary-dark flex items-center justify-center text-white font-bold text-[12px] lg:text-[13px] flex-shrink-0">
                {initials}
              </div>
              <div className="hidden lg:block leading-tight">
                <p className="text-[13px] font-bold">{displayName}</p>
                <span className="text-[9.5px] font-bold tracking-wide px-1.5 py-px rounded-[5px] bg-[#E3F2ED] text-primary-dark uppercase">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

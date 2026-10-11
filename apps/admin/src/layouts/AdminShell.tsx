import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardData from '../data/dashboard.json';

const { navBadges } = dashboardData;

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/applications': 'Applications',
  '/pets': 'Pet Registry',
  '/owners': 'Owners',
  '/reports': 'Reports',
  '/assign': 'Assign Requests',
  '/users': 'Users & Roles',
  '/settings': 'Settings',
};

type NavItem = { to: string; label: string; badge?: number; icon: React.ReactNode };
type NavGroup = { heading?: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        to: '/', label: 'Dashboard',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.3" /></svg>,
      },
      {
        to: '/applications', label: 'Applications', badge: navBadges.applications,
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13.5 6.5 5h11L20 13.5" /><path d="M4 13.5v5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-5" /><path d="M4 13.5h4.5l1 2h5l1-2H20" /></svg>,
      },
      {
        to: '/pets', label: 'Pet Registry',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="8.5" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="17" cy="8.5" r="1.5" /><path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" /></svg>,
      },
      {
        to: '/owners', label: 'Owners',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M2.5 19c1-3.2 3.4-5 6.5-5s5.5 1.8 6.5 5" /><circle cx="18" cy="9" r="2.3" /><path d="M15.5 14.2c2.2.4 3.8 1.9 4.5 4.3" /></svg>,
      },
      {
        to: '/reports', label: 'Reports',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M20 20H4" /></svg>,
      },
    ],
  },
  {
    heading: 'Operations',
    items: [
      {
        to: '/assign', label: 'Assign Requests', badge: navBadges.assignRequests,
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4.5" width="14" height="16" rx="2" /><path d="M9 4.5V3.8A1.8 1.8 0 0 1 10.8 2h2.4A1.8 1.8 0 0 1 15 3.8v.7" /><path d="M8.7 13.2l2.1 2.1L15.3 11" /></svg>,
      },
    ],
  },
  {
    heading: 'Administration',
    items: [
      {
        to: '/users', label: 'Users & Roles',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M2.5 19c1-3.2 3.4-5 6.5-5s5.5 1.8 6.5 5" /><path d="M16.8 10.3l3.2-1.2v2.7c0 2.4-1.3 3.9-3.2 4.6-1.9-.7-3.2-2.2-3.2-4.6V9.1l3.2 1.2Z" /></svg>,
      },
      {
        to: '/settings', label: 'Settings',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.8 1.8 0 1 1-3.7 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.8 1.8 0 1 1 0-3.7h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1A1.8 1.8 0 1 1 7.9 3.7l.1.1a1.5 1.5 0 0 0 1.7.3H10a1.5 1.5 0 0 0 .9-1.4v-.2a1.8 1.8 0 1 1 3.7 0v.1a1.5 1.5 0 0 0 .9 1.4h.1a1.5 1.5 0 0 0 1.7-.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.8 1.8 0 1 1 0 3.7h-.1a1.5 1.5 0 0 0-1.4.9Z" /></svg>,
      },
    ],
  },
];

function NavItemRow({ item, exact }: { item: NavItem; exact?: boolean }) {
  const location = useLocation();
  const isActive = exact ? location.pathname === item.to : location.pathname.startsWith(item.to) && (item.to !== '/' || location.pathname === '/');
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
        isActive ? 'bg-[#E3F2ED] text-primary' : 'text-gray-700 hover:bg-surface'
      }`}
    >
      {item.icon}
      <span className="flex-1">{item.label}</span>
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
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin';

  // ponytail: display name stored at login; replace with user context when /me exists
  const displayName = localStorage.getItem('adminDisplayName') ?? 'Admin';
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden font-body">
      {/* Sidebar */}
      <aside className="w-[236px] flex-shrink-0 bg-white border-r border-black/[0.08] flex flex-col py-[22px] px-[14px] overflow-y-auto">
        <div className="flex items-center gap-2.5 px-2 mb-7">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center">
            <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="8.5" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="17" cy="8.5" r="1.6" />
              <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
            </svg>
          </div>
          <span className="font-display font-bold text-[15.5px]">PetLanka</span>
        </div>

        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-2' : ''}>
            {group.heading && (
              <p className="text-[10.5px] font-bold text-muted tracking-wide uppercase px-[14px] mt-4 mb-1.5">
                {group.heading}
              </p>
            )}
            {group.items.map((item) => (
              <NavItemRow key={item.to} item={item} />
            ))}
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#C0362C] hover:bg-red-50 transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
            <path d="M15 16l4-4-4-4" /><path d="M19 12H9" />
          </svg>
          Log out
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-[68px] flex-shrink-0 bg-white border-b border-black/[0.08] flex items-center justify-between px-8">
          <h1 className="text-[18px] font-bold font-display">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-[11px]" width="17" height="17" fill="none" stroke="#9A968A" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                placeholder="Search applications, pets, owners…"
                className="w-[300px] h-10 rounded-[10px] border border-black/[0.14] pl-9 pr-3.5 text-[13px] bg-surface focus:outline-none focus:border-primary"
              />
            </div>
            <button className="w-[38px] h-[38px] rounded-[10px] bg-surface flex items-center justify-center relative">
              <svg width="17" height="17" fill="none" stroke="#4A5551" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
              <span className="absolute top-[6px] right-[7px] w-[6px] h-[6px] rounded-full bg-orange" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-primary-dark flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-bold">{displayName}</p>
                <span className="text-[9.5px] font-bold tracking-wide px-1.5 py-px rounded-[5px] bg-[#E3F2ED] text-primary-dark uppercase">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

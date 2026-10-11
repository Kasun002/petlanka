import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = [
  {
    to: '/home', label: 'Home',
    icon: <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>,
  },
  {
    to: '/pets', label: 'My Pets',
    icon: <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="8.5" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="17" cy="8.5" r="1.6" /><path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" /></svg>,
  },
  {
    to: '/apply', label: 'Apply',
    icon: <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  },
  {
    to: '/profile', label: 'Profile',
    icon: <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" /></svg>,
  },
];

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/pets', label: 'My Pets' },
  { to: '/apply', label: 'Apply for Licence' },
  { to: '/profile', label: 'Profile' },
];

// ponytail: greeting name is a placeholder until /me endpoint provides user profile
function useGreetingName(): string {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return 'there';
    const u = JSON.parse(raw) as { id?: string };
    return u.id ? 'there' : 'there';
  } catch {
    return 'there';
  }
}

export default function AppShell() {
  useAuth(); // ensure user is available (AuthRoute handles redirect if not)
  const name = useGreetingName();

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      {/* Mobile top header */}
      <header className="md:hidden bg-primary rounded-b-[22px] px-[22px] pt-[22px] pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12.5px] text-white/75 mb-0.5">Good morning</p>
            <h1 className="text-[20px] font-bold text-white font-display">{name}</h1>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white/[0.14] flex items-center justify-center relative">
            <svg width="19" height="19" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute top-[7px] right-[8px] w-[7px] h-[7px] rounded-full bg-orange border-[1.5px] border-primary" />
          </button>
        </div>
      </header>

      {/* Desktop top nav */}
      <header className="hidden md:flex h-[72px] bg-white border-b border-black/[0.08] px-10 items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center">
              <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="flex gap-0.5 bg-surface p-[3px] rounded-lg text-[11.5px] font-bold">
            <span className="px-2 py-[5px] rounded-md bg-white text-primary">EN</span>
            <span className="px-2 py-[5px] text-muted">සි</span>
            <span className="px-2 py-[5px] text-muted">த</span>
          </div>
          <button className="w-[38px] h-[38px] rounded-[10px] bg-surface flex items-center justify-center relative">
            <svg width="17" height="17" fill="none" stroke="#4A5551" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute top-[6px] right-[7px] w-[6px] h-[6px] rounded-full bg-orange" />
          </button>
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

import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Today', icon: '📝' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Header - desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-emerald-600 dark:text-emerald-400">Day</span>Pulse
        </h1>
        <nav className="flex gap-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`
              }
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-4xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around py-2 z-50">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs gap-0.5 px-3 py-1 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

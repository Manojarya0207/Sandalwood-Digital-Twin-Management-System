import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Digital Twin', icon: '🌲' },
  { path: '/lorawan', label: 'LoRaWAN', icon: '📡' },
  { path: '/water', label: 'Water Mgt', icon: '💧' },
  { path: '/trees', label: 'Tree Mgt', icon: '📋' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-inner">S</div>
        <h1 className="font-bold text-slate-800 tracking-tight">Sandalwood OS</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active 
                  ? 'bg-blue-50 text-blue-600 font-medium shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-xl drop-shadow-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center font-medium">
        v1.0.0-beta
      </div>
    </aside>
  );
};

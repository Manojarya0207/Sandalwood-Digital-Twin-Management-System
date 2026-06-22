import { useLocation } from 'react-router-dom';
import { useFarmStore } from '../../store/farmStore';

export const TopBar = () => {
  const metadata = useFarmStore((s) => s.metadata);
  const location = useLocation();
  
  const titleMap: Record<string, string> = {
    '/': '3D Digital Twin',
    '/lorawan': 'LoRaWAN Network',
    '/water': 'Water Management',
    '/trees': 'Tree Management',
    '/reports': 'Reports & Analytics',
    '/settings': 'System Settings'
  };

  const currentTitle = titleMap[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">{currentTitle}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-inner">
          {metadata?.farmName || 'Sandalwood Estate'}
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
          {metadata?.ownerName?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};

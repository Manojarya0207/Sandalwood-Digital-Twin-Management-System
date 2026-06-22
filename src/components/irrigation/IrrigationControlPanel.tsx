import { useIrrigationStore } from '../../store/irrigationStore';

export const IrrigationControlPanel = () => {
  const {
    borewellOn,
    lateralValves,
    toggleBorewell,
    toggleLateralValve
  } = useIrrigationStore();

  const rowZPositions = [-32, -21, -10, 1, 12, 23, 34];

  return (
    <div className="absolute top-20 right-6 z-40 w-88 bg-slate-950/80 backdrop-blur-lg rounded-2xl border border-slate-800 text-slate-100 shadow-2xl p-5 select-none font-sans transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <svg className="w-5 h-5 text-sky-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="font-bold tracking-wider text-sm uppercase text-slate-200">System Controller</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-sky-950/50 border border-sky-800/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-sky-400">
          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping"></span>
          <span>Digital Twin Link</span>
        </div>
      </div>

      {/* Borewell Pump Control */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Primary Source</h4>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">Borewell Pump</h3>
          </div>
          <button
            onClick={toggleBorewell}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
              borewellOn ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                borewellOn ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Pump Details */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${borewellOn ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
            <span className="font-medium text-slate-300">{borewellOn ? 'Gushing Flow' : 'Pump Stopped'}</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-slate-200">{borewellOn ? '45.8 LPM' : '0.0 LPM'}</span>
          </div>
        </div>
      </div>

      {/* Lateral Pipelines Section */}
      <div>
        <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2.5 px-1">Pipeline Lateral Valves</h4>
        
        <div className="space-y-2">
          {rowZPositions.map((z, idx) => {
            const isOpen = lateralValves[idx];
            return (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-900/60 rounded-lg border border-slate-800/65 px-3.5 py-2.5 hover:border-slate-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${isOpen ? 'bg-sky-950/50 text-sky-400' : 'bg-slate-800/80 text-slate-500'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Lateral Row {idx + 1}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Location Z: {z}m</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] uppercase font-semibold ${isOpen ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                  <button
                    onClick={() => toggleLateralValve(idx)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                      isOpen ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                        isOpen ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

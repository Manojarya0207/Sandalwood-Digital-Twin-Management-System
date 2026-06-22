import { useIrrigationStore } from '../store/irrigationStore';

export default function WaterManagementPage() {
  const {
    borewellOn,
    lateralValves,
    toggleBorewell,
    toggleLateralValve,
    waterLevel
  } = useIrrigationStore();

  const rowZPositions = [-32, -21, -10, 1, 12, 23, 34];
  const activeLaterals = lateralValves.filter(Boolean).length;

  return (
    <div className="min-h-full w-full p-6 font-sans bg-[#F8F9FB] text-[#1E293B]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-[#E8EDF3]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E293B]">
            Irrigation Control Hub
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Monitor and operate water source pumps and pipeline network distribution.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 mt-4 md:mt-0 bg-[#DCEBFF] text-[#4A90E2] font-semibold text-xs px-3 py-1.5 rounded-lg border border-sky-200">
          <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-ping"></span>
          <span>System Status: Fully Connected</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-[#E8EDF3] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider">
            <span>Borewell Pump</span>
            <span className={`w-2.5 h-2.5 rounded-full ${borewellOn ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300'}`}></span>
          </div>
          <div className="text-2xl font-bold text-[#1E293B] mt-2.5">
            {borewellOn ? 'RUNNING' : 'STANDBY'}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Flow Rate: <span className="font-mono text-[#4A90E2] font-semibold">{borewellOn ? '45.8 LPM' : '0.0 LPM'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EDF3] p-5 shadow-sm">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
            Active Lateral Valves
          </div>
          <div className="text-2xl font-bold text-[#1E293B] mt-2.5">
            {activeLaterals} / 7
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Distribution efficiency: <span className="font-semibold text-emerald-600">{Math.round((activeLaterals / 7) * 100)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EDF3] p-5 shadow-sm">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
            Est. Pressure
          </div>
          <div className="text-2xl font-bold text-[#1E293B] mt-2.5">
            {borewellOn ? '2.4 Bar' : '0.0 Bar'}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Safe operating range: 1.5 - 3.0 Bar
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EDF3] p-5 shadow-sm">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
            Reservoir Volume
          </div>
          <div className="text-2xl font-bold text-[#1E293B] mt-2.5 font-mono">
            {Math.round(waterLevel * 250).toLocaleString()} L
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Capacity: <span className="font-bold text-[#4A90E2]">{waterLevel.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Main Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Water Level & Borewell pump controller */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pond Water Level Monitoring */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1E293B] mb-1">Pond Water Level</h2>
            <p className="text-xs text-[#64748B] mb-5">Real-time status of the primary irrigation reservoir.</p>

            <div className="space-y-4">
              {/* Radial or linear wave representation */}
              <div className="relative w-full h-32 bg-[#F8F9FB] rounded-xl border border-[#E8EDF3] flex flex-col items-center justify-center overflow-hidden">
                {/* Animated wave layer */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#DCEBFF] opacity-60 transition-all duration-300 ease-out"
                  style={{ height: `${waterLevel}%` }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#6FAFF7] opacity-45 transition-all duration-300 ease-out animate-pulse"
                  style={{ height: `${Math.max(0, waterLevel - 5)}%`, animationDuration: '4s' }}
                />
                
                {/* Text Indicator */}
                <div className="z-10 text-center">
                  <span className="text-3xl font-extrabold text-[#1E293B] font-mono tracking-tight">
                    {waterLevel.toFixed(1)}%
                  </span>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold mt-1">
                    Reservoir Capacity
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-[#E8EDF3] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6FAFF7] to-[#4A90E2] transition-all duration-300"
                  style={{ width: `${waterLevel}%` }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#E8EDF3]">
                <div>
                  <span className="text-[#64748B] block">Current Volume</span>
                  <span className="font-bold text-[#1E293B] font-mono">
                    {Math.round(waterLevel * 250).toLocaleString()} L
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Max Capacity</span>
                  <span className="font-bold text-[#1E293B] font-mono">
                    25,000 L
                  </span>
                </div>
              </div>

              {/* Flow telemetry */}
              <div className="bg-[#F8F9FB] border border-[#E8EDF3] rounded-xl p-3 text-xs flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Net Flow Rate</span>
                <span className={`font-bold font-mono ${
                  (borewellOn ? 5 : 0) - (activeLaterals * 1) > 0 
                    ? 'text-emerald-600' 
                    : (borewellOn ? 5 : 0) - (activeLaterals * 1) < 0 
                      ? 'text-rose-600' 
                      : 'text-slate-500'
                }`}>
                  {((borewellOn ? 5.0 : 0.0) - (activeLaterals * 1.0)).toFixed(1)}% / s
                </span>
              </div>
            </div>
          </div>

          {/* Primary Source control */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1E293B] mb-1">Source Control</h2>
            <p className="text-xs text-[#64748B] mb-6">Start/Stop water supply from the borewell aquifer.</p>

            <div className="bg-[#F8F9FB] rounded-xl border border-[#E8EDF3] p-5 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                borewellOn ? 'bg-[#DCEBFF] text-[#4A90E2] shadow-[0_0_12px_rgba(74,144,226,0.2)]' : 'bg-slate-100 text-slate-400'
              }`}>
                <svg className={`w-8 h-8 ${borewellOn ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div className="font-bold text-[#1E293B] text-base mb-1">
                Borewell Submersible Pump
              </div>
              <div className="text-xs text-[#64748B] mb-5">
                Target: Delivery Pipe to Water Pond
              </div>

              <button
                onClick={toggleBorewell}
                className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer ${
                  borewellOn 
                    ? 'bg-[#4A90E2] text-white hover:bg-[#357abd] shadow-[#4A90E2]/20' 
                    : 'bg-slate-700 text-white hover:bg-slate-800'
                }`}
              >
                {borewellOn ? 'TURN OFF PUMP' : 'TURN ON PUMP'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: 7 lateral pipeline valves list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">Valves & Laterals</h2>
                <p className="text-xs text-[#64748B]">Individually control dripping activity across the farm rows.</p>
              </div>
              <span className="text-xs font-semibold text-[#4A90E2] bg-[#DCEBFF] px-2.5 py-1 rounded-full border border-sky-100 font-mono">
                PVC BALL VALVES
              </span>
            </div>

            <div className="divide-y divide-[#E8EDF3]">
              {rowZPositions.map((z, idx) => {
                const isOpen = lateralValves[idx];
                return (
                  <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-colors duration-150">
                    <div className="flex items-center space-x-4">
                      {/* Valve symbol */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isOpen 
                          ? 'bg-[#DCEBFF] border-blue-200 text-[#4A90E2]' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1E293B]">Lateral Line Row {idx + 1}</div>
                        <div className="text-xs text-[#64748B] font-mono">Position Z: {z}m • Drip Emitters Connected</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isOpen 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>
                        {isOpen ? 'FLOW OPEN' : 'CLOSED'}
                      </span>

                      {/* Custom toggle button using the color palette */}
                      <button
                        onClick={() => toggleLateralValve(idx)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isOpen ? 'bg-[#4A90E2]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            isOpen ? 'translate-x-5' : 'translate-x-0'
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
      </div>
    </div>
  );
}

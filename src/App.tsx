import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeStorage } from './data/localStorage';

import { useFarmStore } from './store/farmStore';
import { useSensorStore } from './store/sensorStore';
import { useGatewayStore } from './store/gatewayStore';
import { useMotorStore } from './store/motorStore';
import { useWaterStore } from './store/waterStore';

import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { PageWrapper } from './components/layout/PageWrapper';

import DigitalTwinPage from './pages/DigitalTwinPage';
import WaterManagementPage from './pages/WaterManagementPage';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  const initFarm = useFarmStore((s) => s.initialize);
  const initSensor = useSensorStore((s) => s.initialize);
  const initGateway = useGatewayStore((s) => s.initialize);
  const initMotor = useMotorStore((s) => s.initialize);
  const initWater = useWaterStore((s) => s.initialize);

  useEffect(() => {
    const seed = initializeStorage();
    initFarm(seed.farmMetadata, seed.zones, seed.trees);
    initSensor(seed.sensors);
    initGateway(seed.gateways);
    initMotor(seed.motors);
    initWater(seed.waterSystem);
    setIsInitializing(false);
  }, [initFarm, initSensor, initGateway, initMotor, initWater]);

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen w-screen bg-slate-50">Initializing Sandbox...</div>;
  }

  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden text-slate-800 bg-slate-50 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col relative bg-slate-50">
          <TopBar />
          <main className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<DigitalTwinPage />} />
              <Route path="/lorawan" element={<PageWrapper className="p-6"><div className="glass-panel p-8">LoRaWAN Network</div></PageWrapper>} />
              <Route path="/water" element={<WaterManagementPage />} />
              <Route path="/trees" element={<PageWrapper className="p-6"><div className="glass-panel p-8">Tree Management</div></PageWrapper>} />
              <Route path="/reports" element={<PageWrapper className="p-6"><div className="glass-panel p-8">Reports</div></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper className="p-6"><div className="glass-panel p-8">Settings</div></PageWrapper>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;


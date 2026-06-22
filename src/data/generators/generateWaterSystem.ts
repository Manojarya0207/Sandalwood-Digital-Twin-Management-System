import type { WaterSystem, Pipeline } from '../../types/water.types';
import { POND_MAX_VOLUME, TANK_CAPACITY } from '../../constants';
import { randomRange } from '../../utils/mathUtils';

export const generateWaterSystem = (): WaterSystem => {
  const history = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    history.push({
      timestamp: new Date(now - i * 86400000).toISOString(),
      level: Math.round(randomRange(60, 95))
    });
  }
  
  const dailyConsumption = [];
  for (let i = 90; i >= 0; i--) {
    dailyConsumption.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      liters: Math.round(randomRange(5000, 15000))
    });
  }
  
  // Basic pipeline layout: Main trunk from NW to center, then branches
  const pipelines: Pipeline[] = [
    {
      pipelineId: 'PL-MAIN-01',
      name: 'Main Trunk A',
      diameterM: 0.5,
      lengthM: 200,
      pressureBar: 3.2,
      path: [{ x: -140, y: -0.5, z: -140 }, { x: 0, y: -0.5, z: 0 }]
    }
  ];
  
  // 11 more branches
  for (let i = 0; i < 11; i++) {
    const angle = (i / 11) * Math.PI * 2;
    const endX = Math.cos(angle) * 100;
    const endZ = Math.sin(angle) * 100;
    
    pipelines.push({
      pipelineId: `PL-BR-${(i + 1).toString().padStart(2, '0')}`,
      name: `Branch ${i + 1}`,
      diameterM: 0.2,
      lengthM: 100,
      pressureBar: randomRange(2.0, 3.0),
      path: [{ x: 0, y: -0.5, z: 0 }, { x: endX, y: -0.5, z: endZ }]
    });
  }
  
  return {
    pond: {
      levelPercent: 85,
      volumeLiters: POND_MAX_VOLUME * 0.85,
      pH: 7.2,
      turbidity: 15,
      surfaceAreaSqM: 2500,
      history
    },
    tank: {
      capacityLiters: TANK_CAPACITY,
      currentLiters: TANK_CAPACITY * 0.9,
      inletFlowLPM: 150,
      outletFlowLPM: 120,
      lastRefill: new Date().toISOString()
    },
    pipelines,
    dailyConsumption
  };
};

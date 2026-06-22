import type { Motor } from '../../types/motor.types';
import { randomRange } from '../../utils/mathUtils';

export const generateMotors = (): Motor[] => {
  const motors: Motor[] = [];
  
  // 6 Running, 3 Idle, 1 Maintenance
  const states: ('Running' | 'Idle' | 'Maintenance')[] = [
    'Running', 'Running', 'Running', 'Running', 'Running', 'Running',
    'Idle', 'Idle', 'Idle',
    'Maintenance'
  ];
  
  for (let i = 0; i < 10; i++) {
    const state = states[i];
    
    // Position near the pump house / main lines
    // Let's place them linearly along a pipe or grouped
    const x = -140 + i * 10;
    const z = -140;
    
    motors.push({
      motorId: `MTR-${(i + 1).toString().padStart(2, '0')}`,
      name: `Pump Motor ${i + 1}`,
      state,
      powerKw: 5.5,
      voltage: Math.round(randomRange(390, 410)),
      currentAmps: state === 'Running' ? Math.round(randomRange(8, 12)) : 0,
      totalRuntimeHours: Math.round(randomRange(100, 1000)),
      lastServiceDate: new Date(Date.now() - randomRange(10, 100) * 86400000).toISOString(),
      position: { x, z }
    });
  }
  
  return motors;
};

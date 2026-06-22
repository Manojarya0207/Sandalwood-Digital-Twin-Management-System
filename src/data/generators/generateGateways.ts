import type { Gateway } from '../../types/gateway.types';
import { randomRange } from '../../utils/mathUtils';

const GATEWAY_POSITIONS = [
  { x: 0, z: 0, name: 'Center Hub' },
  { x: 160, z: -160, name: 'NE Relay' },
  { x: -160, z: -160, name: 'NW Relay' },
  { x: 160, z: 160, name: 'SE Relay' },
  { x: -160, z: 160, name: 'SW Relay' }
];

export const generateGateways = (): Gateway[] => {
  return GATEWAY_POSITIONS.map((pos, index) => {
    return {
      gatewayId: `GW-0${index + 1}`,
      name: pos.name,
      position: { x: pos.x, z: pos.z },
      status: Math.random() > 0.1 ? 'online' : 'offline',
      signalStrength: Math.round(randomRange(60, 100)), // dBm-ish (positive score here)
      connectedDevices: 5, // Will be updated if needed based on sensors
      lastHeartbeat: new Date().toISOString(),
      firmwareVersion: '1.2.4',
      uptimeHours: Math.round(randomRange(24, 720))
    };
  });
};

import { create } from 'zustand';
import type { Sensor, SensorAlert, SensorType } from '../types/sensor.types';

interface SensorState {
  sensors: Sensor[];
  alerts: SensorAlert[];
  initialize: (sensors: Sensor[]) => void;
  updateReading: (sensorId: string, value: number) => void;
  getSensorsByType: (type: SensorType) => Sensor[];
  getSensorById: (id: string) => Sensor | undefined;
}

export const useSensorStore = create<SensorState>((set, get) => ({
  sensors: [],
  alerts: [],
  initialize: (sensors) => {
    // Generate initial alerts
    const alerts: SensorAlert[] = [];
    sensors.forEach(s => {
      if (s.currentReading < s.alertMin || s.currentReading > s.alertMax) {
        alerts.push({
          sensorId: s.sensorId,
          message: `${s.name} reading out of bounds: ${s.currentReading}${s.unit}`,
          timestamp: new Date().toISOString(),
          severity: 'warning'
        });
      }
    });
    set({ sensors, alerts });
  },
  updateReading: (sensorId, value) => {
    set((state) => {
      const sensors = state.sensors.map(s => {
        if (s.sensorId === sensorId) {
          const now = new Date().toISOString();
          const history = [...s.history, { timestamp: now, value }];
          // keep last 720
          if (history.length > 720) history.shift();
          return { ...s, currentReading: value, history, lastSync: now };
        }
        return s;
      });
      return { sensors };
    });
  },
  getSensorsByType: (type) => get().sensors.filter(s => s.type === type),
  getSensorById: (id) => get().sensors.find(s => s.sensorId === id)
}));

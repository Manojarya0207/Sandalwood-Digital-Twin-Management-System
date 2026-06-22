import type { Sensor, SensorType, SensorReading } from '../../types/sensor.types';
import { SENSOR_TYPE_COUNTS } from '../../constants';
import { randomGaussian, randomRange } from '../../utils/mathUtils';

const GATEWAY_IDS = ['GW-01', 'GW-02', 'GW-03', 'GW-04', 'GW-05'];

const generateHistory = (type: SensorType): SensorReading[] => {
  const history: SensorReading[] = [];
  const now = Date.now();
  // 720 hours = 30 days
  let baseValue = 0;
  switch(type) {
    case 'Soil Moisture': baseValue = 40; break; // %
    case 'Temperature': baseValue = 25; break; // C
    case 'Humidity': baseValue = 60; break; // %
    case 'Water Level': baseValue = 80; break; // %
    case 'Flow Meter': baseValue = 100; break; // L/min
    case 'pH Sensor': baseValue = 6.5; break;
  }
  
  for (let i = 720; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600 * 1000).toISOString();
    let value = baseValue;
    if (type === 'pH Sensor') {
       value += randomRange(-0.2, 0.2);
    } else {
       value += randomGaussian(0, baseValue * 0.1);
    }
    history.push({ timestamp, value: Number(Math.max(0, value).toFixed(2)) });
  }
  return history;
};

export const generateSensors = (): Sensor[] => {
  const sensors: Sensor[] = [];
  let idCounter = 1;
  
  for (const [type, count] of Object.entries(SENSOR_TYPE_COUNTS)) {
    for (let i = 0; i < count; i++) {
      let unit = '';
      let alertMin = 0;
      let alertMax = 100;
      
      switch(type as SensorType) {
        case 'Soil Moisture': unit = '%'; alertMin = 20; alertMax = 80; break;
        case 'Temperature': unit = '°C'; alertMin = 10; alertMax = 40; break;
        case 'Humidity': unit = '%'; alertMin = 30; alertMax = 90; break;
        case 'Water Level': unit = '%'; alertMin = 10; alertMax = 95; break;
        case 'Flow Meter': unit = 'L/min'; alertMin = 10; alertMax = 200; break;
        case 'pH Sensor': unit = 'pH'; alertMin = 5.5; alertMax = 7.5; break;
      }
      
      const history = generateHistory(type as SensorType);
      
      sensors.push({
        sensorId: `SEN-${idCounter.toString().padStart(3, '0')}`,
        name: `${type} ${i + 1}`,
        type: type as SensorType,
        gatewayId: GATEWAY_IDS[randomRange(0, GATEWAY_IDS.length - 1) | 0],
        position: { x: randomRange(-300, 300), z: randomRange(-300, 300) },
        currentReading: history[history.length - 1].value,
        unit,
        batteryPercent: Math.round(randomRange(20, 100)),
        isOnline: Math.random() > 0.05,
        lastSync: new Date().toISOString(),
        history,
        calibrationOffset: 0,
        alertMin,
        alertMax
      });
      idCounter++;
    }
  }
  
  return sensors;
};

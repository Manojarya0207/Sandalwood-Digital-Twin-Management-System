import { generateZones, generateTrees } from './generators/generateTrees';
import { generateSensors } from './generators/generateSensors';
import { generateGateways } from './generators/generateGateways';
import { generateMotors } from './generators/generateMotors';
import { generateWaterSystem } from './generators/generateWaterSystem';

export interface SeedData {
  farmMetadata: any;
  zones: any[];
  trees: any[];
  sensors: any[];
  gateways: any[];
  motors: any[];
  waterSystem: any;
}

export const generateSeedData = (): SeedData => {
  const zones = generateZones();
  const trees = generateTrees(zones, 5000);
  const sensors = generateSensors();
  const gateways = generateGateways();
  const motors = generateMotors();
  const waterSystem = generateWaterSystem();
  
  const farmMetadata = {
    farmName: 'Sandalwood Estate Alpha',
    ownerName: 'Manoj Sarya',
    gpsCoordinates: '12.9716 N, 77.5946 E',
    totalAcres: 100,
    currencyUnit: 'USD'
  };
  
  return {
    farmMetadata,
    zones,
    trees,
    sensors,
    gateways,
    motors,
    waterSystem
  };
};

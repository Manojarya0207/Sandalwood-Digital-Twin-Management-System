import type { Tree, Zone, GrowthStage } from '../../types/tree.types';
import { randomGaussian, randomInt, randomRange } from '../../utils/mathUtils';

const ZONE_NAMES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Zone G', 'Zone H', 'Zone I', 'Zone J'];

export const generateZones = (): Zone[] => {
  const zones: Zone[] = [];
  const cols = 2;
  const rows = 5;
  const width = 640 / cols; // 320
  const height = 640 / rows; // 128
  
  let i = 0;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const minX = -320 + c * width;
      const maxX = minX + width;
      const minZ = -320 + r * height;
      const maxZ = minZ + height;
      
      zones.push({
        zoneId: `Z${i + 1}`,
        name: ZONE_NAMES[i],
        bounds: { minX, maxX, minZ, maxZ },
        treeCount: 0 // Will be populated
      });
      i++;
    }
  }
  return zones;
};

export const generateTrees = (zones: Zone[], count: number = 5000): Tree[] => {
  const trees: Tree[] = [];
  
  // Trees are planted on a grid with some jitter
  // ~5000 trees -> grid of ~70x70
  const gridSize = Math.ceil(Math.sqrt(count));
  const spacing = 640 / gridSize;
  
  let treeIdNum = 1;
  
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      if (trees.length >= count) break;
      
      const posX = -320 + x * spacing + randomRange(-2, 2);
      const posZ = -320 + z * spacing + randomRange(-2, 2);
      
      // Find zone
      const zone = zones.find(
        z => posX >= z.bounds.minX && posX <= z.bounds.maxX && posZ >= z.bounds.minZ && posZ <= z.bounds.maxZ
      ) || zones[0];
      
      zone.treeCount++;
      
      const ageYears = randomInt(1, 15);
      const baseHealth = Math.min(100, Math.max(0, randomGaussian(85, 10))); // 70-95% skew
      const health = Math.round(baseHealth);
      
      let growthStage: GrowthStage = 'Seedling';
      if (ageYears > 10) growthStage = 'Mature';
      else if (ageYears > 3) growthStage = 'Sapling';
      
      const heightMeters = ageYears * 0.5 + randomRange(-0.5, 0.5);
      
      const now = new Date();
      const growthHistory = [];
      for (let m = 0; m < 12; m++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - m);
        growthHistory.unshift({
          timestamp: date.toISOString(),
          heightMeters: Math.max(0, heightMeters - (m * 0.05)),
        });
      }
      
      trees.push({
        treeId: `T${treeIdNum.toString().padStart(4, '0')}`,
        zoneId: zone.zoneId,
        position: { x: posX, z: posZ },
        health,
        ageYears,
        heightMeters: Number(Math.max(0, heightMeters).toFixed(2)),
        growthStage,
        lastSensorReadingDate: now.toISOString(),
        growthHistory,
      });
      
      treeIdNum++;
    }
  }
  
  return trees;
};

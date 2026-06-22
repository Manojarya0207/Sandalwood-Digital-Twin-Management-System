import { generateSeedData, type SeedData } from './seedData';

const STORAGE_PREFIX = 'sdtms_';

export const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage (quota exceeded or disabled). Will keep in memory.`);
    }
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        console.error(`Error parsing data for key ${key}`, e);
        return null;
      }
    }
  }
  return null;
};

export const clearStorage = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(window.localStorage);
    for (const key of keys) {
      if (key.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    }
  }
};

let inMemoryTrees: any = null;

export const initializeStorage = (): SeedData => {
  const isInitialized = loadFromStorage<boolean>('initialized');
  if (!isInitialized) {
    console.log('Seeding demo data...');
    const seed = generateSeedData();
    saveToStorage('farm', seed.farmMetadata);
    saveToStorage('zones', seed.zones);
    saveToStorage('trees', seed.trees);
    saveToStorage('sensors', seed.sensors);
    saveToStorage('gateways', seed.gateways);
    saveToStorage('motors', seed.motors);
    saveToStorage('waterSystem', seed.waterSystem);
    saveToStorage('initialized', true);
    inMemoryTrees = seed.trees;
    return seed;
  }
  
  const loadedTrees = loadFromStorage('trees');
  let trees = loadedTrees;
  if (!trees) {
    if (inMemoryTrees) {
      trees = inMemoryTrees;
    } else {
      // Regenerate trees on reload if they couldn't fit in localStorage
      const zones = loadFromStorage<any[]>('zones') || [];
      // Dynamic import or we already have access to generateTrees
      // Wait, we can just use the generateSeedData() and extract trees
      console.log('Regenerating trees due to missing localStorage data...');
      trees = generateSeedData().trees;
      inMemoryTrees = trees;
    }
  }
  
  return {
    farmMetadata: loadFromStorage('farm'),
    zones: loadFromStorage('zones') || [],
    trees,
    sensors: loadFromStorage('sensors') || [],
    gateways: loadFromStorage('gateways') || [],
    motors: loadFromStorage('motors') || [],
    waterSystem: loadFromStorage('waterSystem'),
  };
};

export const resetToDemoData = (): SeedData => {
  clearStorage();
  return initializeStorage();
};

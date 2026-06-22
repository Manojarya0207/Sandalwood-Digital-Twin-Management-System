import { create } from 'zustand';
import type { WaterSystem } from '../types/water.types';

interface WaterState {
  system: WaterSystem | null;
  initialize: (system: WaterSystem) => void;
}

export const useWaterStore = create<WaterState>((set) => ({
  system: null,
  initialize: (system) => set({ system })
}));

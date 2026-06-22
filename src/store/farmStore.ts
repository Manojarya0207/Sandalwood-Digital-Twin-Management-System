import { create } from 'zustand';
import type { Tree, Zone, FarmMetadata, TreeFilters } from '../types/tree.types';

interface FarmState {
  metadata: FarmMetadata | null;
  zones: Zone[];
  trees: Tree[];
  filters: TreeFilters;
  setFilters: (filters: Partial<TreeFilters>) => void;
  initialize: (metadata: FarmMetadata, zones: Zone[], trees: Tree[]) => void;
  getFilteredTrees: () => Tree[];
}

export const useFarmStore = create<FarmState>((set, get) => ({
  metadata: null,
  zones: [],
  trees: [],
  filters: {
    healthMin: 0, healthMax: 100,
    ageMin: 0, ageMax: 50,
    heightMin: 0, heightMax: 50,
    zones: [], growthStages: [], search: ''
  },
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  initialize: (metadata, zones, trees) => set({ metadata, zones, trees }),
  getFilteredTrees: () => {
    const { trees, filters } = get();
    return trees.filter(t => {
      if (t.health < filters.healthMin || t.health > filters.healthMax) return false;
      if (t.ageYears < filters.ageMin || t.ageYears > filters.ageMax) return false;
      if (t.heightMeters < filters.heightMin || t.heightMeters > filters.heightMax) return false;
      if (filters.zones.length > 0 && !filters.zones.includes(t.zoneId)) return false;
      if (filters.growthStages.length > 0 && !filters.growthStages.includes(t.growthStage)) return false;
      if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        if (!t.treeId.toLowerCase().includes(lowerSearch) && !t.zoneId.toLowerCase().includes(lowerSearch)) return false;
      }
      return true;
    });
  }
}));

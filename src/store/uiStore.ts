import { create } from 'zustand';
import type { CameraMode, ActivePanel } from '../types/ui.types';

interface UIState {
  isUndergroundView: boolean;
  cameraMode: CameraMode;
  activePanel: ActivePanel | null;
  selectedEntityId: string | null;
  toggleUndergroundView: () => void;
  setCameraMode: (mode: CameraMode) => void;
  openPanel: (panel: ActivePanel, entityId: string) => void;
  closePanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isUndergroundView: false,
  cameraMode: 'Orbit',
  activePanel: null,
  selectedEntityId: null,
  toggleUndergroundView: () => set((state) => ({ isUndergroundView: !state.isUndergroundView })),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  openPanel: (activePanel, selectedEntityId) => set({ activePanel, selectedEntityId }),
  closePanel: () => set({ activePanel: null, selectedEntityId: null })
}));

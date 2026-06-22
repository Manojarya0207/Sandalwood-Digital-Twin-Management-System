import { create } from 'zustand';
import type { IrrigationSchedule } from '../types/water.types';

interface IrrigationState {
  flowRateLPM: number;
  pressureBar: number;
  schedules: IrrigationSchedule[];
  sessionConsumptionLiters: number;
  borewellOn: boolean;
  lateralValves: boolean[];
  selectedPipeId: string | null;
  waterLevel: number;
  updateSession: (flowRate: number, pressure: number) => void;
  incrementConsumption: (liters: number) => void;
  addSchedule: (schedule: IrrigationSchedule) => void;
  toggleBorewell: () => void;
  toggleLateralValve: (index: number) => void;
  setSelectedPipeId: (id: string | null) => void;
  setWaterLevel: (level: number) => void;
  setBorewell: (on: boolean) => void;
}

export const useIrrigationStore = create<IrrigationState>((set) => ({
  flowRateLPM: 0,
  pressureBar: 0,
  schedules: [],
  sessionConsumptionLiters: 0,
  borewellOn: true,
  lateralValves: [true, true, true, true, true, true, true],
  selectedPipeId: null,
  waterLevel: 50.0,
  updateSession: (flowRateLPM, pressureBar) => set({ flowRateLPM, pressureBar }),
  incrementConsumption: (liters) => set((s) => ({ sessionConsumptionLiters: s.sessionConsumptionLiters + liters })),
  addSchedule: (schedule) => set((s) => ({ schedules: [...s.schedules, schedule] })),
  toggleBorewell: () => set((state) => ({ borewellOn: !state.borewellOn })),
  toggleLateralValve: (index) => set((state) => ({
    lateralValves: state.lateralValves.map((val, idx) => idx === index ? !val : val)
  })),
  setSelectedPipeId: (selectedPipeId) => set({ selectedPipeId }),
  setWaterLevel: (waterLevel) => set({ waterLevel }),
  setBorewell: (borewellOn) => set({ borewellOn })
}));

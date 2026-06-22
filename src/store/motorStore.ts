import { create } from 'zustand';
import type { Motor } from '../types/motor.types';

interface MotorState {
  motors: Motor[];
  initialize: (motors: Motor[]) => void;
  updateMotorState: (motorId: string, state: Motor['state']) => void;
  getRunningMotors: () => Motor[];
}

export const useMotorStore = create<MotorState>((set, get) => ({
  motors: [],
  initialize: (motors) => set({ motors }),
  updateMotorState: (motorId, state) => set((s) => ({
    motors: s.motors.map(m => m.motorId === motorId ? { ...m, state } : m)
  })),
  getRunningMotors: () => get().motors.filter(m => m.state === 'Running')
}));

import { create } from 'zustand';
import type { Gateway } from '../types/gateway.types';

interface GatewayState {
  gateways: Gateway[];
  initialize: (gateways: Gateway[]) => void;
}

export const useGatewayStore = create<GatewayState>((set) => ({
  gateways: [],
  initialize: (gateways) => set({ gateways })
}));

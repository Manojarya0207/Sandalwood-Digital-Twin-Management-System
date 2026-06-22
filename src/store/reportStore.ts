import { create } from 'zustand';

export interface Report {
  id: string;
  type: string;
  timestamp: string;
  url?: string;
  status: 'generating' | 'completed' | 'failed';
}

interface ReportState {
  reports: Report[];
  isGenerating: boolean;
  progress: number;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  setGenerating: (isGenerating: boolean, progress?: number) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  isGenerating: false,
  progress: 0,
  addReport: (report) => set((s) => ({ reports: [report, ...s.reports].slice(0, 5) })),
  updateReport: (id, updates) => set((s) => ({
    reports: s.reports.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  setGenerating: (isGenerating, progress = 0) => set({ isGenerating, progress })
}));

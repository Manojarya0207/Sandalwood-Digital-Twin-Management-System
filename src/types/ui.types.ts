import type { CAMERA_MODES, REPORT_TYPES } from '../constants'

export type CameraMode = (typeof CAMERA_MODES)[number]
export type ReportType = (typeof REPORT_TYPES)[number]
export type UnitSystem = 'Metric' | 'Imperial'
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
export type IrrigationStatus = 'Active' | 'Scheduled' | 'Off'

export interface UserPreferences {
  unitSystem: UnitSystem
  defaultCameraMode: CameraMode
  dateFormat: DateFormat
}

export interface GeneratedReport {
  id: string
  type: ReportType
  format: 'PDF' | 'Excel'
  generatedAt: string
  dateRange: { start: string; end: string }
  blobUrl: string
  fileName: string
}

export interface ReportConfig {
  type: ReportType
  startDate: string
  endDate: string
  zones: string[]
  metrics: string[]
}

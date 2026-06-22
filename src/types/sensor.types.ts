import type { SENSOR_TYPES } from '../constants'

export type SensorType = (typeof SENSOR_TYPES)[number]

export interface SensorReading {
  timestamp: string
  value: number
}

export interface Sensor {
  sensorId: string
  name: string
  type: SensorType
  gatewayId: string
  position: { x: number; z: number }
  currentReading: number
  unit: string
  batteryPercent: number
  isOnline: boolean
  lastSync: string
  history: SensorReading[]
  calibrationOffset: number
  alertMin: number
  alertMax: number
}

export interface SensorAlert {
  sensorId: string
  message: string
  timestamp: string
  severity: 'warning' | 'info'
}

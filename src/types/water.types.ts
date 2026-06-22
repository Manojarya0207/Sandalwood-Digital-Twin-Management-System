export interface Pipeline {
  pipelineId: string
  name: string
  diameterM: number
  lengthM: number
  pressureBar: number
  path: { x: number; y: number; z: number }[]
}

export interface WaterLevelPoint {
  timestamp: string
  level: number
}

export interface DailyConsumption {
  date: string
  liters: number
}

export interface WaterSystem {
  pond: {
    levelPercent: number
    volumeLiters: number
    pH: number
    turbidity: number
    surfaceAreaSqM: number
    history: WaterLevelPoint[]
  }
  tank: {
    capacityLiters: number
    currentLiters: number
    inletFlowLPM: number
    outletFlowLPM: number
    lastRefill: string
  }
  pipelines: Pipeline[]
  dailyConsumption: DailyConsumption[]
}

export interface IrrigationSchedule {
  zoneId: string
  startTime: string
  durationMinutes: number
  targetMoisturePercent: number
  motorId: string
}

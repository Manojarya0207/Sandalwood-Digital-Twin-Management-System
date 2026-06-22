import type { GROWTH_STAGES } from '../constants'

export type GrowthStage = (typeof GROWTH_STAGES)[number]

export interface TreeGrowthPoint {
  timestamp: string
  heightMeters: number
}

export interface Tree {
  treeId: string
  zoneId: string
  position: { x: number; z: number }
  health: number
  ageYears: number
  heightMeters: number
  growthStage: GrowthStage
  lastSensorReadingDate: string
  growthHistory: TreeGrowthPoint[]
}

export interface Zone {
  zoneId: string
  name: string
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
  treeCount: number
}

export interface FarmMetadata {
  farmName: string
  ownerName: string
  gpsCoordinates: string
  totalAcres: number
  currencyUnit: string
}

export interface TreeFilters {
  healthMin: number
  healthMax: number
  ageMin: number
  ageMax: number
  heightMin: number
  heightMax: number
  zones: string[]
  growthStages: GrowthStage[]
  search: string
}

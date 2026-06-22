export const FARM_SIZE = 640
export const TREE_COUNT = 5000
export const SENSOR_COUNT = 25
export const GATEWAY_COUNT = 5
export const MOTOR_COUNT = 10
export const ZONE_COUNT = 10
export const POND_MAX_VOLUME = 4000000
export const TANK_CAPACITY = 50000

export const ZONES = Array.from({ length: ZONE_COUNT }, (_, i) => `Zone-${String.fromCharCode(65 + i)}`)

export const GROWTH_STAGES = ['Seedling', 'Sapling', 'Juvenile', 'Mature', 'Harvestable'] as const

export const SENSOR_TYPES = [
  'Soil Moisture',
  'Temperature',
  'Humidity',
  'Water Level',
  'Flow Meter',
  'pH Sensor',
] as const

export const SENSOR_TYPE_COUNTS: Record<(typeof SENSOR_TYPES)[number], number> = {
  'Soil Moisture': 8,
  Temperature: 5,
  Humidity: 4,
  'Water Level': 3,
  'Flow Meter': 3,
  'pH Sensor': 2,
}

export const CAMERA_MODES = ['Orbit', 'Drone', 'Top', 'Walkthrough'] as const

export const REPORT_TYPES = [
  'Farm Summary',
  'Tree Health',
  'Water Consumption',
  'Sensor Data',
  'LoRaWAN Network',
] as const

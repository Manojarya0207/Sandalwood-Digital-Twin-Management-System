export type MotorState = 'Running' | 'Idle' | 'Maintenance'

export interface Motor {
  motorId: string
  zoneId: string
  position: { x: number; z: number }
  state: MotorState
  runtimeHours: number
  efficiencyPercent: number
  nextServiceDate: string
  flowRateLPM: number
}

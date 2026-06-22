export type GatewayStatus = 'Online' | 'Offline'

export interface Gateway {
  gatewayId: string
  name: string
  position: { x: number; z: number }
  positionDescription: string
  frequencyBand: string
  status: GatewayStatus
  signalStrength: number
  connectedSensorIds: string[]
  uplinkCount: number
  packetLossPercent: number
  lastHeartbeat: string
  uptimePercent: number
}

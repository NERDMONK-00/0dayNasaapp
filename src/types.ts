export type AstronautId = 'aster' | 'jade' | 'niko'
export type ScenarioId =
  | 'normal'
  | 'dehydration'
  | 'fever'
  | 'sleep'
  | 'co2'
  | 'spo2'

export type AlertLevel = 'normal' | 'warning' | 'critical'

export interface CrewMember {
  id: AstronautId
  name: string
  role: string
  accent: string
}

export interface VitalReading {
  astronautId: AstronautId
  timestamp: number
  hr: number
  hrv: number
  spo2: number
  temp: number
  resp: number
  co2: number
  sleepHours: number
}

export interface SignalBaseline {
  mean: number
  stdev: number
  count: number
}

export interface AlertItem {
  id: string
  astronautId: AstronautId
  level: AlertLevel
  title: string
  reason: string
  action: string
  timestamp: number
}

export interface MissionState {
  astronauts: CrewMember[]
  selectedAstronautId: AstronautId
  currentReadings: Record<AstronautId, VitalReading>
  history: Record<AstronautId, VitalReading[]>
  alerts: AlertItem[]
  baselines: Record<AstronautId, Record<string, SignalBaseline>>
}

export interface DataSource {
  subscribe: (callback: (reading: VitalReading) => void) => () => void
}

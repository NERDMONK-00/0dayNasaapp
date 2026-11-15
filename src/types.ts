export type AstronautId = 'aster' | 'jade' | 'niko'
export type ScenarioId =
  | 'normal'
  | 'dehydration'
  | 'fever'
  | 'sleep'
  | 'co2'
  | 'spo2'
  | 'solar-storm'

export type AlertLevel = 'normal' | 'warning' | 'critical' | 'watch'

export interface CrewMember {
  id: AstronautId
  name: string
  role: string
  accent: string
  age: number
  missionDays: number
  evaExperienceHours: number
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
  median?: number
  mad?: number
  isWarmedUp?: boolean
}

export interface AlertItem {
  id: string
  astronautId: AstronautId
  level: AlertLevel
  title: string
  reason: string
  action: string
  timestamp: number
  what?: string
  whyItMatters?: string
  evidence?: string
  category?: 'cardiac' | 'oxygen' | 'thermal' | 'respiratory' | 'environment' | 'sleep' | 'radiation'
}

export type SpaceWeatherStatus = 'calm' | 'elevated' | 'storm'

export interface SpaceWeatherEvent {
  id: string
  type: 'FLR' | 'CME' | 'SEP' | 'GST'
  title: string
  severity: string
  timestamp: number
  details: string
}

export interface RiskScore {
  total: number
  physiology: number
  environment: number
  spaceWeather: number
  band: 'normal' | 'watch' | 'critical'
  dominantFactor: string
}

export interface EVASlot {
  hourOffset: number
  timeLabel: string
  readiness: 'go' | 'caution' | 'no-go'
  score: number
  reasons: string[]
}

export interface BenchmarkResult {
  condition: 'A' | 'B' | 'C'
  conditionName: string
  sensitivity: number
  medianTimeToDetection: number
  falseAlarmsPerDay: number
  precision: number
  latencyMs: number
}

export interface ScenarioBenchmark {
  scenario: ScenarioId
  label: string
  conditionCSensitivity: number
  conditionCTimeToDetection: number
}

export interface MissionState {
  astronauts: CrewMember[]
  selectedAstronautId: AstronautId
  currentReadings: Record<AstronautId, VitalReading>
  history: Record<AstronautId, VitalReading[]>
  alerts: AlertItem[]
  baselines: Record<AstronautId, Record<string, SignalBaseline>>
  spaceWeather: {
    status: SpaceWeatherStatus
    isLive: boolean
    events: SpaceWeatherEvent[]
    kpIndex: number
    solarWindSpeed: number
  }
}

export interface DataSource {
  subscribe: (callback: (reading: VitalReading) => void) => () => void
}

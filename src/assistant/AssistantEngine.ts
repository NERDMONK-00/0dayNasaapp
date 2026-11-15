import type { AlertItem, AstronautId, CrewMember, SignalBaseline, VitalReading } from '../types'

export type AssistantTone = 'normal' | 'warning' | 'critical'

export interface AssistantContext {
  selectedAstronautId: AstronautId
  selectedAstronaut: CrewMember
  currentReading: VitalReading
  history: VitalReading[]
  alerts: AlertItem[]
  baselines: Record<string, SignalBaseline>
  allCrew: CrewMember[]
  allReadings: Record<AstronautId, VitalReading>
  missionStatus: AssistantTone
}

export interface AssistantReply {
  text: string
  suggestions?: string[]
}

export interface AssistantEngine {
  reply(message: string, context: AssistantContext): AssistantReply
}

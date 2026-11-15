import type { AlertLevel, SignalBaseline, VitalReading } from '../types'
import type { AssistantContext, AssistantEngine, AssistantReply } from './AssistantEngine'

const DEFAULT_SUGGESTIONS = [
  'Summarize today',
  'Explain this alert',
  'What should I do now?',
  'Compare crew members',
]

export class RuleBasedEngine implements AssistantEngine {
  reply(message: string, context: AssistantContext): AssistantReply {
    const normalized = message.toLowerCase().trim()

    if (!normalized) {
      return {
        text: `I’m Orbitkat, your mission-support assistant. I can summarize ${context.selectedAstronaut.name}'s vitals, explain alerts, or compare crew status.`,
        suggestions: DEFAULT_SUGGESTIONS,
      }
    }

    if (normalized.includes('summarize today') || normalized.includes('summary')) {
      return this.summarizeToday(context)
    }

    if (normalized.includes('why is my') || normalized.includes('why is ') || normalized.includes('hrv') || normalized.includes('hr ') || normalized.includes('spo2') || normalized.includes('oxygen')) {
      return this.explainVital(context, normalized)
    }

    if (normalized.includes('alert') || normalized.includes('explain this alert')) {
      return this.explainAlert(context)
    }

    if (normalized.includes('what should i do now') || normalized.includes('what should i do') || normalized.includes('action')) {
      return this.whatShouldIDo(context)
    }

    if (normalized.includes('how does this app work') || normalized.includes('how does the app') || normalized.includes('app work')) {
      return this.describeApp(context)
    }

    if (normalized.includes('scenario') || normalized.includes('run a scenario') || normalized.includes('how do i run')) {
      return this.describeScenarios(context)
    }

    if (normalized.includes('compare') || normalized.includes('crew')) {
      return this.compareCrew(context)
    }

    if (normalized.includes('hello') || normalized.includes('hi')) {
      return {
        text: `Hello. I’m Orbitkat, and I’m watching ${context.selectedAstronaut.name}’s status. ${this.peekStatus(context)}.`,
        suggestions: DEFAULT_SUGGESTIONS,
      }
    }

    return {
      text: this.defaultReply(context),
      suggestions: DEFAULT_SUGGESTIONS,
    }
  }

  private summarizeToday(context: AssistantContext): AssistantReply {
    const reading = context.currentReading
    const missionState = this.getStatusPhrase(context.missionStatus)
    const active = context.alerts.length ? context.alerts.map((item) => item.title).join(', ') : 'none'

    return {
      text: `Decision support only: ${context.selectedAstronaut.name} is in a ${missionState} state. Current vitals are HR ${reading.hr.toFixed(1)} bpm, HRV ${reading.hrv.toFixed(1)} ms, SpO₂ ${reading.spo2.toFixed(1)}%, temp ${reading.temp.toFixed(1)}°C, sleep ${reading.sleepHours.toFixed(1)} h, and CO₂ ${reading.co2.toFixed(0)} ppm. Active alerts: ${active}.`,
      suggestions: ['Explain this alert', 'What should I do now?', 'Compare crew members'],
    }
  }

  private explainVital(context: AssistantContext, normalized: string): AssistantReply {
    const reading = context.currentReading
    const baselineHr = context.baselines.hr ?? { mean: reading.hr, stdev: 0, count: 1 }
    const baselineHrv = context.baselines.hrv ?? { mean: reading.hrv, stdev: 0, count: 1 }
    const baselineSpo2 = context.baselines.spo2 ?? { mean: reading.spo2, stdev: 0, count: 1 }

    const hrZ = this.zScore(reading.hr, baselineHr)
    const spo2Z = this.zScore(reading.spo2, baselineSpo2)

    const reasons: string[] = []

    if (normalized.includes('hrv') || normalized.includes('hr')) {
      reasons.push(`HR is ${reading.hr.toFixed(1)} bpm against a baseline of ${baselineHr.mean.toFixed(1)} ± ${baselineHr.stdev.toFixed(1)} bpm (z=${hrZ.toFixed(2)}).`)
    }

    if (normalized.includes('hrv')) {
      reasons.push(`HRV is ${reading.hrv.toFixed(1)} ms against a baseline of ${baselineHrv.mean.toFixed(1)} ± ${baselineHrv.stdev.toFixed(1)} ms (z=${this.zScore(reading.hrv, baselineHrv).toFixed(2)}).`)
    }

    if (normalized.includes('spo2') || normalized.includes('oxygen')) {
      reasons.push(`SpO₂ is ${reading.spo2.toFixed(1)}% against a baseline of ${baselineSpo2.mean.toFixed(1)} ± ${baselineSpo2.stdev.toFixed(1)}% (z=${spo2Z.toFixed(2)}).`)
    }

    const summary = reasons.join(' ')

    return {
      text: `Decision support only: ${summary} This indicates how far the current value sits from the astronaut’s personal trend. Suggested action: verify hydration, exertion, and recovery load, then continue monitoring with the next reading.`,
      suggestions: ['What should I do now?', 'Explain this alert'],
    }
  }

  private explainAlert(context: AssistantContext): AssistantReply {
    const alert = context.alerts[0]

    if (!alert) {
      return {
        text: 'No active alerts are firing right now. All current measurements are within the current safety thresholds for this crew member.',
        suggestions: ['Summarize today', 'Compare crew members'],
      }
    }

    const reading = context.currentReading
    const baseline = context.baselines
    const relevantBaseline = baseline.hr ?? { mean: reading.hr, stdev: 0, count: 1 }
    const z = this.zScore(reading.hr, relevantBaseline)

    return {
      text: `Decision support only: ${alert.title} is active because ${alert.reason}. The current HR is ${reading.hr.toFixed(1)} bpm versus a baseline of ${relevantBaseline.mean.toFixed(1)} ± ${relevantBaseline.stdev.toFixed(1)} bpm, z=${z.toFixed(2)}. Suggested action: ${alert.action}`,
      suggestions: ['What should I do now?', 'Summarize today'],
    }
  }

  private whatShouldIDo(context: AssistantContext): AssistantReply {
    const alert = context.alerts[0]

    if (alert) {
      return {
        text: `Decision support only: follow the current alert plan first: ${alert.action}. Re-check the current readings, reduce workload, and verify the affected signal before deciding whether to escalate.`,
        suggestions: ['Explain this alert', 'Summarize today'],
      }
    }

    return {
      text: `Decision support only: continue the normal mission flow and keep monitoring. For ${context.selectedAstronaut.name}, the current readings are in range. Review sleep, hydration, and exertion trends if the next cycle drifts upward.`,
      suggestions: ['Summarize today', 'Compare crew members'],
    }
  }

  private describeApp(_context: AssistantContext): AssistantReply {
    return {
      text: 'This app is a browser-only health dashboard for a crewed mission. It tracks each astronaut’s personal baseline, calculates z-scores against that baseline, and flags hard safety thresholds with explainable actions. The simulator can be switched to dehydration, sleep debt, fever, CO₂ rise, and SpO₂ drop scenarios without needing a backend.',
      suggestions: ['How do I run a scenario?', 'Compare crew members'],
    }
  }

  private describeScenarios(_context: AssistantContext): AssistantReply {
    return {
      text: 'Use the scenario buttons in the main dashboard. They switch the simulator into normal, dehydration, fever onset, sleep deprivation, CO₂ rise, or SpO₂ drop modes so you can test each alert path in the browser.',
      suggestions: ['Summarize today', 'Explain this alert'],
    }
  }

  private compareCrew(context: AssistantContext): AssistantReply {
    const rows = context.allCrew.map((crewMember) => {
      const reading = context.allReadings[crewMember.id]
      const level = this.levelForReading(reading)
      return `${crewMember.name}: HR ${reading.hr.toFixed(1)} bpm, SpO₂ ${reading.spo2.toFixed(1)}%, temp ${reading.temp.toFixed(1)}°C, status ${level}.`
    })

    return {
      text: `Comparison snapshot: ${rows.join(' ')}`,
      suggestions: ['Summarize today', 'Explain this alert'],
    }
  }

  private defaultReply(context: AssistantContext): string {
    return `I’m Orbitkat. The current focus is ${context.selectedAstronaut.name}. I can explain the active readings, summarize today, compare crew members, or walk you through the app’s mission-control flow.`
  }

  private peekStatus(context: AssistantContext): string {
    if (context.missionStatus === 'critical') {
      return 'there is an active critical watch'
    }
    if (context.missionStatus === 'warning') {
      return 'there is a monitoring watch in progress'
    }
    return 'everything is looking stable'
  }

  private getStatusPhrase(level: AlertLevel): string {
    if (level === 'critical') return 'critical'
    if (level === 'warning') return 'warning'
    return 'normal'
  }

  private zScore(value: number, baseline: SignalBaseline): number {
    if (!baseline || baseline.stdev === 0 || !Number.isFinite(baseline.stdev)) {
      return 0
    }

    return (value - baseline.mean) / baseline.stdev
  }

  private levelForReading(reading: VitalReading): AlertLevel {
    if (reading.hr > 115 || reading.spo2 < 90 || reading.temp >= 38.1 || reading.co2 > 1200) {
      return 'critical'
    }
    if (reading.hr > 90 || reading.spo2 < 95 || reading.temp >= 37.8 || reading.sleepHours < 5) {
      return 'warning'
    }
    return 'normal'
  }
}

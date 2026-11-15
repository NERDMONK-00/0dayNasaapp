import type { AstronautId, DataSource, ScenarioId, VitalReading } from '../types'

const crewIds: AstronautId[] = ['aster', 'jade', 'niko']

const baseReadings: Record<AstronautId, Omit<VitalReading, 'timestamp' | 'astronautId'>> = {
  aster: {
    hr: 68,
    hrv: 52,
    spo2: 98,
    temp: 36.8,
    resp: 15,
    co2: 780,
    sleepHours: 7.8,
  },
  jade: {
    hr: 71,
    hrv: 48,
    spo2: 97,
    temp: 36.7,
    resp: 16,
    co2: 820,
    sleepHours: 8.1,
  },
  niko: {
    hr: 66,
    hrv: 55,
    spo2: 99,
    temp: 36.9,
    resp: 14,
    co2: 760,
    sleepHours: 7.5,
  },
}

const starters: Record<ScenarioId, Partial<Record<keyof Omit<VitalReading, 'astronautId' | 'timestamp'>, number>>> = {
  normal: {},
  dehydration: {
    hr: 92,
    hrv: 35,
    spo2: 96,
    temp: 36.9,
    resp: 20,
    co2: 900,
    sleepHours: 6.2,
  },
  fever: {
    hr: 104,
    hrv: 30,
    spo2: 95,
    temp: 38.4,
    resp: 22,
    co2: 840,
    sleepHours: 6.7,
  },
  sleep: {
    hr: 88,
    hrv: 28,
    spo2: 95,
    temp: 37.0,
    resp: 19,
    co2: 930,
    sleepHours: 4.1,
  },
  co2: {
    hr: 82,
    hrv: 41,
    spo2: 96,
    temp: 36.9,
    resp: 22,
    co2: 1800,
    sleepHours: 7.0,
  },
  spo2: {
    hr: 78,
    hrv: 40,
    spo2: 88,
    temp: 36.8,
    resp: 24,
    co2: 1100,
    sleepHours: 7.0,
  },
}

export class SimulatorSource implements DataSource {
  private intervalId: number | undefined
  private subscribers = new Set<(reading: VitalReading) => void>()
  private currentScenario: ScenarioId = 'normal'
  private timeStep = 0

  subscribe(callback: (reading: VitalReading) => void): () => void {
    this.subscribers.add(callback)

    if (!this.intervalId) {
      this.start()
    }

    return () => {
      this.subscribers.delete(callback)
      if (this.subscribers.size === 0 && this.intervalId) {
        window.clearInterval(this.intervalId)
        this.intervalId = undefined
      }
    }
  }

  setScenario(scenario: ScenarioId): void {
    this.currentScenario = scenario
  }

  private start(): void {
    this.intervalId = window.setInterval(() => {
      for (const astronautId of crewIds) {
        const reading = this.generateReading(astronautId)
        for (const cb of this.subscribers) {
          cb(reading)
        }
      }
    }, 1800)
  }

  private generateReading(astronautId: AstronautId): VitalReading {
    const base = baseReadings[astronautId]
    const scenarioMix = starters[this.currentScenario]

    const circadianWave = Math.sin(this.timeStep / 5 + (astronautId === 'aster' ? 0 : astronautId === 'jade' ? 2 : 4))
    const noise = (Math.random() - 0.5) * 6

    const hr = clamp(
      (base.hr + circadianWave * 10 + (scenarioMix.hr ?? 0) - base.hr * 0.1 + noise) * (this.currentScenario === 'normal' ? 1 : 1.05),
      45,
      140,
    )

    const hrv = clamp(
      (base.hrv + Math.cos(this.timeStep / 7 + 1) * 8 + (scenarioMix.hrv ?? 0) - base.hrv * 0.1),
      10,
      80,
    )

    const spo2 = clamp(
      (base.spo2 + Math.sin(this.timeStep / 9) * 0.8 + (scenarioMix.spo2 ?? 0) - base.spo2 * 0.05),
      80,
      100,
    )

    const temp = clamp(
      base.temp + Math.sin(this.timeStep / 6) * 0.3 + (scenarioMix.temp ?? 0) - base.temp * 0.05,
      35.4,
      40.5,
    )

    const resp = clamp(
      (base.resp + Math.sin(this.timeStep / 4) * 2 + (scenarioMix.resp ?? 0) - base.resp * 0.05),
      10,
      30,
    )

    const co2 = clamp(
      (base.co2 + Math.sin(this.timeStep / 8) * 120 + (scenarioMix.co2 ?? 0) - base.co2 * 0.08),
      400,
      2400,
    )

    const sleepHours = clamp(
      base.sleepHours + Math.sin(this.timeStep / 10) * 0.9 + (scenarioMix.sleepHours ?? 0) - base.sleepHours * 0.08,
      2,
      10,
    )

    this.timeStep += 1

    return {
      astronautId,
      timestamp: Date.now(),
      hr: roundValue(hr),
      hrv: roundValue(hrv),
      spo2: roundValue(spo2),
      temp: roundValue(temp),
      resp: roundValue(resp),
      co2: roundValue(co2),
      sleepHours: roundValue(sleepHours),
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function roundValue(value: number): number {
  return Number(value.toFixed(1))
}

export const simulator = new SimulatorSource()

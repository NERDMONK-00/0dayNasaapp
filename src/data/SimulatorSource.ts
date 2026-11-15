import type { AstronautId, DataSource, ScenarioId, VitalReading } from '../types'

const crewIds: AstronautId[] = ['aster', 'jade', 'niko']

interface CrewSimParams {
  x0: Omit<VitalReading, 'timestamp' | 'astronautId'>
  circadianAmp: { hr: number; temp: number; resp: number; hrv: number }
  phase: number
}

const crewParams: Record<AstronautId, CrewSimParams> = {
  aster: {
    x0: { hr: 66, hrv: 55, spo2: 98.4, temp: 36.7, resp: 14.5, co2: 780, sleepHours: 7.6 },
    circadianAmp: { hr: 6.2, temp: 0.35, resp: 1.8, hrv: 6.5 },
    phase: 0.2,
  },
  jade: {
    x0: { hr: 71, hrv: 49, spo2: 97.8, temp: 36.8, resp: 15.8, co2: 810, sleepHours: 7.9 },
    circadianAmp: { hr: 5.8, temp: 0.4, resp: 1.6, hrv: 5.2 },
    phase: 1.8,
  },
  niko: {
    x0: { hr: 64, hrv: 58, spo2: 98.9, temp: 36.6, resp: 13.9, co2: 760, sleepHours: 7.4 },
    circadianAmp: { hr: 6.8, temp: 0.38, resp: 2.0, hrv: 7.0 },
    phase: 3.5,
  },
}

export class SimulatorSource implements DataSource {
  private intervalId: number | undefined
  private subscribers = new Set<(reading: VitalReading) => void>()
  private currentScenario: ScenarioId = 'normal'
  private timeStep = 0
  private rampStep = 0
  // AR(1) error terms per astronaut and signal
  private arErrors: Record<AstronautId, { hr: number; hrv: number; temp: number; resp: number; spo2: number; co2: number }> = {
    aster: { hr: 0, hrv: 0, temp: 0, resp: 0, spo2: 0, co2: 0 },
    jade: { hr: 0, hrv: 0, temp: 0, resp: 0, spo2: 0, co2: 0 },
    niko: { hr: 0, hrv: 0, temp: 0, resp: 0, spo2: 0, co2: 0 },
  }

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

  getScenario(): ScenarioId {
    return this.currentScenario
  }

  setScenario(scenario: ScenarioId): void {
    this.currentScenario = scenario
    this.rampStep = 0
  }

  private start(): void {
    this.intervalId = window.setInterval(() => {
      this.timeStep += 1
      this.rampStep = Math.min(this.rampStep + 1, 60) // 60-step transition saturation

      for (const astronautId of crewIds) {
        const reading = this.generateReading(astronautId)
        for (const cb of this.subscribers) {
          cb(reading)
        }
      }
    }, 1500)
  }

  private updateAR(prev: number, rho: number, sigma: number): number {
    const whiteNoise = (Math.random() + Math.random() - 1) * Math.sqrt(3) * sigma
    return rho * prev + whiteNoise
  }

  private generateReading(astronautId: AstronautId): VitalReading {
    const p = crewParams[astronautId]
    const err = this.arErrors[astronautId]

    // AR(1) drift updates (rho ~ 0.72)
    err.hr = this.updateAR(err.hr, 0.72, 1.2)
    err.hrv = this.updateAR(err.hrv, 0.70, 1.4)
    err.temp = this.updateAR(err.temp, 0.85, 0.04)
    err.resp = this.updateAR(err.resp, 0.65, 0.4)
    err.spo2 = this.updateAR(err.spo2, 0.80, 0.15)
    err.co2 = this.updateAR(err.co2, 0.88, 12)

    // Circadian component: sin(2*pi*(t - phase)/24h)
    const circadian = Math.sin((this.timeStep * 0.1) + p.phase)

    // Scenario shift s(t) with ramp
    const ramp = Math.min(this.rampStep / 12, 1.0)
    let sHr = 0
    let sHrv = 0
    let sSpo2 = 0
    let sTemp = 0
    let sResp = 0
    let sCo2 = 0
    let sSleep = 0

    switch (this.currentScenario) {
      case 'dehydration':
        sHr = 24 * ramp
        sHrv = -20 * ramp
        sTemp = 0.45 * ramp
        sResp = 3.5 * ramp
        sSleep = -0.8 * ramp
        break
      case 'fever':
        sTemp = 1.9 * ramp
        sHr = 32 * ramp
        sResp = 6.2 * ramp
        sHrv = -22 * ramp
        break
      case 'sleep':
        sSleep = -3.4 * ramp
        sHr = 15 * ramp
        sHrv = -26 * ramp
        sResp = 2.0 * ramp
        break
      case 'co2':
        sCo2 = 980 * ramp
        sResp = 6.5 * ramp
        sHr = 12 * ramp
        sHrv = -14 * ramp
        break
      case 'spo2':
        sSpo2 = -9.2 * ramp
        sResp = 7.0 * ramp
        sHr = 16 * ramp
        break
      case 'solar-storm':
        // Solar storm affects space weather and causes autonomic stress
        sHr = 10 * ramp
        sHrv = -12 * ramp
        break
      case 'normal':
      default:
        break
    }

    const hr = clamp(p.x0.hr + p.circadianAmp.hr * circadian + err.hr + sHr, 42, 155)
    const hrv = clamp(p.x0.hrv - (p.circadianAmp.hrv * 0.5 * circadian) + err.hrv + sHrv, 12, 95)
    const spo2 = clamp(p.x0.spo2 + err.spo2 + sSpo2, 78, 100)
    const temp = clamp(p.x0.temp + p.circadianAmp.temp * circadian + err.temp + sTemp, 35.0, 41.0)
    const resp = clamp(p.x0.resp + p.circadianAmp.resp * circadian + err.resp + sResp, 8, 38)
    const co2 = clamp(p.x0.co2 + err.co2 + sCo2, 450, 2600)
    const sleepHours = clamp(p.x0.sleepHours + sSleep + (Math.sin(this.timeStep * 0.05) * 0.2), 3.0, 9.5)

    return {
      astronautId,
      timestamp: Date.now(),
      hr: round(hr, 1),
      hrv: round(hrv, 1),
      spo2: round(spo2, 1),
      temp: round(temp, 2),
      resp: round(resp, 1),
      co2: round(co2, 0),
      sleepHours: round(sleepHours, 1),
    }
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function round(val: number, decimals: number): number {
  const f = Math.pow(10, decimals)
  return Math.round(val * f) / f
}

export const simulator = new SimulatorSource()

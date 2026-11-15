import type { AlertLevel, AlertItem, AstronautId, SignalBaseline, VitalReading } from '../types'

const BASELINE_WINDOW = 20

export function calculateBaseline(history: VitalReading[], field: keyof Omit<VitalReading, 'timestamp' | 'astronautId'>): SignalBaseline {
  const values = history.slice(-BASELINE_WINDOW).map((reading) => Number(reading[field]))

  if (values.length === 0) {
    return { mean: 0, stdev: 0, count: 0 }
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(values.length - 1, 1)

  return {
    mean,
    stdev: Math.sqrt(variance),
    count: values.length,
  }
}

export function getZScore(value: number, baseline: SignalBaseline): number {
  if (!baseline.stdev || baseline.stdev === 0) {
    return 0
  }

  return (value - baseline.mean) / baseline.stdev
}

export function evaluateThresholds(reading: VitalReading): AlertItem[] {
  const alerts: AlertItem[] = []

  if (reading.hr > 115 || reading.hr < 48) {
    alerts.push({
      id: `hr-${reading.timestamp}`,
      astronautId: reading.astronautId,
      level: 'critical',
      title: 'Cardiac stress alert',
      reason: `Resting HR ${reading.hr} bpm outside safe range`,
      action: 'Reduce workload and verify hydration status immediately.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.spo2 < 90) {
    alerts.push({
      id: `spo2-${reading.timestamp}`,
      astronautId: reading.astronautId,
      level: 'critical',
      title: 'Oxygen saturation drop',
      reason: `SpO2 dropped to ${reading.spo2}%`,
      action: 'Switch to emergency oxygen protocol and check cabin pressure.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.temp >= 38.1) {
    alerts.push({
      id: `temp-${reading.timestamp}`,
      astronautId: reading.astronautId,
      level: 'warning',
      title: 'Fever onset',
      reason: `Body temperature reached ${reading.temp.toFixed(1)}°C`,
      action: 'Check for infection, reduce exertion, and continue monitoring.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.co2 > 1200) {
    alerts.push({
      id: `co2-${reading.timestamp}`,
      astronautId: reading.astronautId,
      level: 'warning',
      title: 'Cabin CO2 rise',
      reason: `CO2 level reached ${reading.co2} ppm`,
      action: 'Increase fresh-air circulation and inspect ventilation systems.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.sleepHours < 5) {
    alerts.push({
      id: `sleep-${reading.timestamp}`,
      astronautId: reading.astronautId,
      level: 'warning',
      title: 'Sleep debt',
      reason: `Sleep is ${reading.sleepHours.toFixed(1)} hours in the last cycle`,
      action: 'Prioritize rest and reduce task load before the next shift.',
      timestamp: reading.timestamp,
    })
  }

  if (alerts.length === 0) {
    return []
  }

  return alerts
}

export function buildExplainableAlert(reading: VitalReading, history: VitalReading[], astronautId: AstronautId): AlertItem[] {
  const alerts: AlertItem[] = []
  const hrBaseline = calculateBaseline(history, 'hr')
  const sleepBaseline = calculateBaseline(history, 'sleepHours')

  const hrZ = getZScore(reading.hr, hrBaseline)
  const sleepZ = getZScore(reading.sleepHours, sleepBaseline)

  if (Math.abs(hrZ) > 2 || reading.hr > 90) {
    alerts.push({
      id: `explain-hr-${reading.timestamp}`,
      astronautId,
      level: hrZ > 2 ? 'warning' : 'normal',
      title: 'Cardiovascular trend deviation',
      reason: `Resting HR ${reading.hr} bpm vs baseline ${hrBaseline.mean.toFixed(1)} ± ${hrBaseline.stdev.toFixed(1)}`,
      action: 'Evaluate exertion, hydration, and recovery load.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.sleepHours < 5 || Math.abs(sleepZ) > 1.5) {
    alerts.push({
      id: `explain-sleep-${reading.timestamp}`,
      astronautId,
      level: reading.sleepHours < 5 ? 'warning' : 'normal',
      title: 'Recovery risk',
      reason: `Sleep ${reading.sleepHours.toFixed(1)}h; recent trend is ${sleepBaseline.mean.toFixed(1)}h baseline`,
      action: 'Schedule restorative sleep and reduce cognitive load.',
      timestamp: reading.timestamp,
    })
  }

  if (reading.spo2 < 92) {
    alerts.push({
      id: `explain-spo2-${reading.timestamp}`,
      astronautId,
      level: 'critical',
      title: 'SpO2 anomaly',
      reason: `SpO2 ${reading.spo2}% is falling sharply relative to normal baselines`,
      action: 'Check breathing circuit, habitat pressure, and emergency procedures.',
      timestamp: reading.timestamp,
    })
  }

  return alerts
}

export function classifyStatus(value: number, normalMin: number, normalMax: number, warningMin: number, warningMax: number): AlertLevel {
  if (value < normalMin || value > normalMax) {
    return 'critical'
  }
  if (value < warningMin || value > warningMax) {
    return 'warning'
  }
  return 'normal'
}

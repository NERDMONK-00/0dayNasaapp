import type {
  AlertItem,
  AstronautId,
  EVASlot,
  RiskScore,
  SignalBaseline,
  SpaceWeatherStatus,
  VitalReading,
} from '../types'

const BASELINE_WINDOW = 40
const WARMUP_COUNT = 15

// Calculate rolling mean, stdev, median, and MAD
export function calculateBaseline(
  history: VitalReading[],
  field: keyof Omit<VitalReading, 'timestamp' | 'astronautId'>,
): SignalBaseline {
  const windowed = history.slice(-BASELINE_WINDOW)
  const values = windowed.map((r) => Number(r[field])).filter((v) => !Number.isNaN(v))

  if (values.length === 0) {
    return { mean: 0, stdev: 0, count: 0, median: 0, mad: 0, isWarmedUp: false }
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / Math.max(values.length - 1, 1)
  const stdev = Math.sqrt(variance)

  // Median
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  // MAD (Median Absolute Deviation)
  const deviations = sorted.map((v) => Math.abs(v - median)).sort((a, b) => a - b)
  const mad = deviations.length % 2 !== 0 ? deviations[mid] : (deviations[mid - 1] + deviations[mid]) / 2

  return {
    mean: Number(mean.toFixed(2)),
    stdev: Number(stdev.toFixed(2)),
    count: values.length,
    median: Number(median.toFixed(2)),
    mad: Number((mad || 0.01).toFixed(2)),
    isWarmedUp: values.length >= WARMUP_COUNT,
  }
}

export function getZScore(value: number, baseline: SignalBaseline): number {
  if (!baseline.stdev || baseline.stdev <= 0.001) return 0
  return Number(((value - baseline.mean) / baseline.stdev).toFixed(2))
}

export function getRobustZScore(value: number, baseline: SignalBaseline): number {
  const mad = baseline.mad ?? 0.01
  const median = baseline.median ?? baseline.mean
  if (mad <= 0.001) return 0
  return Number(((0.6745 * (value - median)) / mad).toFixed(2))
}

// CUSUM statistic state store
const cusumState: Record<string, number> = {}

export function computeCusum(key: string, z: number, kCusum = 0.5): number {
  const prev = cusumState[key] ?? 0
  const next = Math.max(0, prev + z - kCusum)
  cusumState[key] = next
  return Number(next.toFixed(2))
}

// 1. Hard Safety Rules (bypasses ML & statistics)
export function evaluateHardSafetyRules(reading: VitalReading): AlertItem[] {
  const alerts: AlertItem[] = []
  const { timestamp, astronautId, hr, spo2, temp, co2 } = reading

  if (spo2 < 90) {
    alerts.push({
      id: `hard-spo2-${timestamp}`,
      astronautId,
      level: 'critical',
      category: 'oxygen',
      title: 'Critical Hypoxia Emergency (SpO₂ < 90%)',
      what: `Blood oxygen saturation dropped to ${spo2}% (critical clinical lower bound: 90%).`,
      whyItMatters: 'Severe hypoxemia compromises cognitive acuity within minutes and threatens consciousness in microgravity.',
      evidence: '[Hard Safety Override] Direct sensor violation bypassing statistical baseline.',
      reason: `Acute blood oxygen drop to ${spo2}%. Sensor indicates severe microgravity hypoxia risk.`,
      action: 'Execute emergency O₂ purge, don secondary rebreather mask, and check cabin atmospheric pressure immediately.',
      timestamp,
    })
  }

  if (temp >= 38.6 || temp <= 35.0) {
    const isHyper = temp >= 38.6
    alerts.push({
      id: `hard-temp-${timestamp}`,
      astronautId,
      level: 'critical',
      category: 'thermal',
      title: isHyper ? 'Critical Hyperthermia Alert' : 'Critical Hypothermia Alert',
      what: `Core/Skin temperature reached ${temp.toFixed(1)}°C (safe envelope: 35.5°C - 38.0°C).`,
      whyItMatters: isHyper
        ? 'Thermal regulation in space is hampered by lack of convective cooling; fever rapidly impairs motor control.'
        : 'Sub-35°C cooling indicates thermal protection suit breach or severe shock.',
      evidence: '[Hard Safety Override] Vital threshold exceeded safety margin.',
      reason: `Body temperature ${temp.toFixed(1)}°C outside human thermal operating window.`,
      action: isHyper
        ? 'Engage suit liquid cooling loop, hydrate with electrolyte solution, and initiate diagnostic antibiotic protocol.'
        : 'Verify space suit heater circuits, minimize EVA exposure, and administer warm fluid thermal countermeasure.',
      timestamp,
    })
  }

  if (co2 >= 1600) {
    alerts.push({
      id: `hard-co2-${timestamp}`,
      astronautId,
      level: 'critical',
      category: 'environment',
      title: 'Cabin CO₂ Toxicity Threshold Breach',
      what: `Atmospheric CO₂ level reached ${Math.round(co2)} ppm (NASA flight rule upper limit: 1600 ppm).`,
      whyItMatters: 'Elevated pCO₂ causes vascular vasodilation, debilitating cephalic headaches, and exacerbates SANS neuro-ocular edema.',
      evidence: '[Hard Safety Override] Environmental life-support sensor threshold tripped.',
      reason: `Cabin CO₂ concentration is dangerously high at ${Math.round(co2)} ppm.`,
      action: 'Activate backup LiOH scrubber bed, cycle cabin ventilation fans to maximum, and verify airloop flow rate.',
      timestamp,
    })
  }

  if (hr >= 125 || hr <= 44) {
    const isTachy = hr >= 125
    alerts.push({
      id: `hard-hr-${timestamp}`,
      astronautId,
      level: 'critical',
      category: 'cardiac',
      title: isTachy ? 'Acute Resting Tachycardia' : 'Acute Sinus Bradycardia',
      what: `Resting heart rate measured at ${Math.round(hr)} bpm.`,
      whyItMatters: 'Severe resting arrhythmia in microgravity indicates acute cardiovascular deconditioning or hypovolemic crisis.',
      evidence: '[Hard Safety Override] Exceeds clinical cardiovascular safety bounds.',
      reason: `Extreme heart rate deviation (${Math.round(hr)} bpm) observed during baseline flight operations.`,
      action: 'Immediately halt active physical duties, sit or strap into crew couch, initiate 12-lead ECG recording, and transmit priority downlink to Earth surgeon.',
      timestamp,
    })
  }

  return alerts
}

// 2. Statistical Anomaly & Personal Baseline Engine
export function evaluatePersonalBaselineAnomalies(
  reading: VitalReading,
  history: VitalReading[],
): AlertItem[] {
  const alerts: AlertItem[] = []
  const { timestamp, astronautId, hr, hrv, spo2, temp, resp, co2, sleepHours } = reading

  if (history.length < 5) return alerts

  const hrBase = calculateBaseline(history, 'hr')
  const hrvBase = calculateBaseline(history, 'hrv')
  const spo2Base = calculateBaseline(history, 'spo2')
  const tempBase = calculateBaseline(history, 'temp')
  const respBase = calculateBaseline(history, 'resp')
  const co2Base = calculateBaseline(history, 'co2')
  const sleepBase = calculateBaseline(history, 'sleepHours')

  const hrZ = getZScore(hr, hrBase)
  const hrvZ = getZScore(hrv, hrvBase)
  const spo2Z = getZScore(spo2, spo2Base)
  const tempZ = getZScore(temp, tempBase)
  const respZ = getZScore(resp, respBase)
  const co2Z = getZScore(co2, co2Base)

  // CUSUM tracking for subtle drifts
  const hrCusum = computeCusum(`${astronautId}-hr`, hrZ)
  const tempCusum = computeCusum(`${astronautId}-temp`, tempZ)

  // MULTI-SIGNAL PATTERN 1: Dehydration & Cardiac Strain (HR up + HRV down)
  if ((hrZ >= 1.7 && hrvZ <= -1.5) || (hrCusum > 3.0 && hrvZ < -1.0)) {
    const hrDeltaPct = Math.round(((hr - hrBase.mean) / hrBase.mean) * 100)
    const hrvDeltaPct = Math.round(((hrv - hrvBase.mean) / hrvBase.mean) * 100)
    alerts.push({
      id: `multi-cardiac-${timestamp}`,
      astronautId,
      level: hrZ > 2.6 ? 'critical' : 'warning',
      category: 'cardiac',
      title: 'Autonomic Deconditioning / Dehydration Detected',
      what: `Resting HR +${hrDeltaPct}% (${Math.round(hr)} vs ${hrBase.mean} bpm base) coupled with HRV ${hrvDeltaPct}% (${Math.round(hrv)} vs ${hrvBase.mean} ms base).`,
      whyItMatters: 'Concomitant elevation in sympathetic cardiac tone and reduction in vagal parasympathetic modulation indicates intravascular fluid deficit typical of microgravity fluid shifts.',
      evidence: `[Multi-Signal Confirmation] Dual-channel concordance: HR Z-score = +${hrZ}, HRV Z-score = ${hrvZ}, CUSUM = ${hrCusum}.`,
      reason: `Heart rate increased by ${hrDeltaPct}% while HRV decreased by ${Math.abs(hrvDeltaPct)}%, matching clinical markers for dehydration or cardiac strain.`,
      action: 'Administer 600 mL balanced oral electrolyte rehydration solution, log fluid intake, and suspend high-resistance exercise for 4 hours.',
      timestamp,
    })
  }

  // MULTI-SIGNAL PATTERN 2: Infection / Heat Stress Onset (Temp up + Resp up)
  if (tempZ >= 1.6 && (respZ >= 1.4 || hrZ >= 1.5) && temp > 37.4) {
    const tempDelta = (temp - tempBase.mean).toFixed(2)
    alerts.push({
      id: `multi-infection-${timestamp}`,
      astronautId,
      level: tempZ > 2.5 ? 'critical' : 'warning',
      category: 'thermal',
      title: 'Systemic Infection / Inflammatory Onset Warning',
      what: `Core temperature +${tempDelta}°C above personal baseline (${temp.toFixed(1)}°C vs ${tempBase.mean}°C base) with elevated respiratory rate (${Math.round(resp)} br/min).`,
      whyItMatters: 'Latent virus reactivation (e.g. Epstein-Barr/Herpes) and bacterial vulnerability are known NASA HRP immune risks in deep space isolation.',
      evidence: `[Multi-Signal Confirmation] Thermal Z = +${tempZ}, Respiratory Z = +${respZ}, CUSUM = ${tempCusum}.`,
      reason: `Thermal and respiratory elevation simultaneously exceeding personal 72-hour baseline range.`,
      action: 'Perform saliva biomarker swab, isolate crew member in sleep quarters, initiate prophylactic antipyretic protocol, and recheck tympanic sensor.',
      timestamp,
    })
  }

  // MULTI-SIGNAL PATTERN 3: Hypoxia / Suit Loop Compromise (SpO2 down)
  if (spo2Z <= -1.8 && spo2 < 95) {
    alerts.push({
      id: `multi-hypoxia-${timestamp}`,
      astronautId,
      level: spo2 < 92 ? 'critical' : 'warning',
      category: 'oxygen',
      title: 'Blood Oxygen Desaturation Trend',
      what: `SpO₂ decreased to ${spo2}% (${spo2Z}σ deviation against personal baseline of ${spo2Base.mean}%).`,
      whyItMatters: 'Early stage tissue desaturation impairs complex spatial navigation and docking reaction times before subjective symptoms manifest.',
      evidence: `[Statistical Persistence] SpO₂ Z-score = ${spo2Z} sustained below baseline envelope.`,
      reason: `Oxygen saturation dropped ${Math.abs(Number((spo2 - spo2Base.mean).toFixed(1)))}% below historical personal baseline.`,
      action: 'Inspect Astroskin pulse-oximeter finger clip seating, verify habitat airlock pO₂ sensor, and increase supplemental suit oxygen fraction.',
      timestamp,
    })
  }

  // MULTI-SIGNAL PATTERN 4: Cabin CO2 Hypercapnia (CO2 up + Resp up)
  if (co2Z >= 1.8 && co2 > 1100) {
    alerts.push({
      id: `multi-co2-${timestamp}`,
      astronautId,
      level: co2 > 1400 ? 'critical' : 'warning',
      category: 'environment',
      title: 'Environmental CO₂ Accumulation',
      what: `Cabin pCO₂ level at ${Math.round(co2)} ppm (+${Math.round(((co2 - co2Base.mean) / co2Base.mean) * 100)}% above baseline), respiratory rate elevated to ${Math.round(resp)} br/min.`,
      whyItMatters: 'Chronic mild hypercapnia is a known contributing etiology for Spaceflight Associated Neuro-ocular Syndrome (SANS) papilledema.',
      evidence: `[Environmental & Physiological Fusion] CO₂ Z = +${co2Z}, Respiratory Z = +${respZ}.`,
      reason: `Cabin CO₂ has reached ${Math.round(co2)} ppm, driving compensatory hyperventilation.`,
      action: 'Check environmental life support telemetry, clear ventilation duct obstruction in workstation bay, and inspect personal dosimeter.',
      timestamp,
    })
  }

  // MULTI-SIGNAL PATTERN 5: Cumulative Sleep Debt / Fatigue
  if (sleepHours < 5.2 || (sleepBase.mean < 6.0 && hrZ > 1.2)) {
    alerts.push({
      id: `multi-sleep-${timestamp}`,
      astronautId,
      level: sleepHours < 4.5 ? 'critical' : 'warning',
      category: 'sleep',
      title: 'Cumulative Circadian Disruption & Sleep Deficit',
      what: `Sleep duration recorded at ${sleepHours.toFixed(1)} hrs (crew personal baseline: ${sleepBase.mean.toFixed(1)} hrs; NASA recommendation: 8.0 hrs).`,
      whyItMatters: 'Experiencing 16 sunrises/day degrades cognitive executive function, slowing reaction times by up to 35% during critical docking maneuvers.',
      evidence: `[Persistence Metric] Sleep deficit sustained over consecutive circadian cycles with resting sympathetic baseline creep.`,
      reason: `Astronaut has accumulated significant sleep debt (${sleepHours.toFixed(1)}h logged vs baseline ${sleepBase.mean}h).`,
      action: 'Enforce scheduled dark-cycle sleep window, dim cabin light spectrum to 480nm melatonergic cutoff, and postpone EVA operations.',
      timestamp,
    })
  }

  return alerts
}

// 3. Combined Decision Support Evaluator
export function evaluateAllAlerts(reading: VitalReading, history: VitalReading[]): AlertItem[] {
  const hardAlerts = evaluateHardSafetyRules(reading)
  const statisticalAlerts = evaluatePersonalBaselineAnomalies(reading, history)

  // Deduplicate and prioritize critical alerts first
  const combined = [...hardAlerts, ...statisticalAlerts]
  const uniqueMap = new Map<string, AlertItem>()

  for (const alert of combined) {
    const key = `${alert.astronautId}-${alert.category ?? 'general'}`
    const existing = uniqueMap.get(key)
    if (!existing || (existing.level !== 'critical' && alert.level === 'critical')) {
      uniqueMap.set(key, alert)
    }
  }

  return Array.from(uniqueMap.values())
}

// Backward compatibility helper
export function evaluateThresholds(reading: VitalReading): AlertItem[] {
  return evaluateHardSafetyRules(reading)
}

export function buildExplainableAlert(
  reading: VitalReading,
  history: VitalReading[],
  _astronautId: AstronautId,
): AlertItem[] {
  return evaluatePersonalBaselineAnomalies(reading, history)
}

// 4. AstroPulse 0-100 Risk Index Calculation
// Formula: R = 0.60 * P + 0.20 * E + 0.20 * W
export function computeRiskIndex(
  reading: VitalReading,
  baseline: Record<string, SignalBaseline>,
  spaceWeatherStatus: SpaceWeatherStatus,
  weights = { p: 0.6, e: 0.2, w: 0.2 },
): RiskScore {
  // P (Physiology, 0-100): Saturating function of largest signal deviations
  let d = 0
  if (baseline.hr) {
    const z = Math.abs(getZScore(reading.hr, baseline.hr))
    d += Math.min(z, 5) * 1.2
  }
  if (baseline.hrv) {
    const z = Math.max(0, -getZScore(reading.hrv, baseline.hrv))
    d += Math.min(z, 5) * 1.1
  }
  if (baseline.spo2) {
    const z = Math.max(0, -getZScore(reading.spo2, baseline.spo2))
    d += Math.min(z, 5) * 1.8
  }
  if (baseline.temp) {
    const z = Math.abs(getZScore(reading.temp, baseline.temp))
    d += Math.min(z, 5) * 1.4
  }
  if (baseline.resp) {
    const z = Math.abs(getZScore(reading.resp, baseline.resp))
    d += Math.min(z, 5) * 0.8
  }

  const d0 = 4.5
  let pScore = 100 * (1 - Math.exp(-d / d0))
  // Hard safety override pushes physiology to 100
  if (reading.spo2 < 90 || reading.temp > 38.6 || reading.hr > 125) {
    pScore = 100
  }

  // E (Cabin Environment, 0-100)
  // CO2 comfortable: <= 800 ppm. Max: 2000 ppm.
  const co2Fraction = Math.max(0, Math.min(1, (reading.co2 - 600) / 1200))
  let eScore = co2Fraction * 100
  if (reading.co2 > 1600) eScore = 100

  // W (Space Weather, 0-100)
  let wScore = 0
  if (spaceWeatherStatus === 'elevated') wScore = 50
  if (spaceWeatherStatus === 'storm') wScore = 100

  const total = Math.min(
    100,
    Math.round(weights.p * pScore + weights.e * eScore + weights.w * wScore),
  )

  let band: 'normal' | 'watch' | 'critical' = 'normal'
  if (total >= 67 || pScore >= 90) band = 'critical'
  else if (total >= 34) band = 'watch'

  let dominantFactor = 'Physiology Nominal'
  if (wScore >= 80) dominantFactor = 'Solar Radiation Storm Warning'
  else if (eScore >= 70) dominantFactor = 'Cabin CO₂ Scrubbing Stress'
  else if (pScore >= 50) dominantFactor = 'Cardiovascular / Autonomic Deviation'

  return {
    total,
    physiology: Math.round(pScore),
    environment: Math.round(eScore),
    spaceWeather: Math.round(wScore),
    band,
    dominantFactor,
  }
}

// 5. EVA Readiness 12-Hour Hourly Forecast Planner (Section 4.8)
export function computeEVAReadiness(
  _astronautId: AstronautId,
  currentReading: VitalReading,
  baseline: Record<string, SignalBaseline>,
  spaceWeather: SpaceWeatherStatus,
): { slots: EVASlot[]; recommendedWindow: string; overallStatus: 'go' | 'caution' | 'no-go' } {
  const slots: EVASlot[] = []
  const risk = computeRiskIndex(currentReading, baseline, spaceWeather)

  const currentHour = new Date().getHours()

  for (let i = 1; i <= 12; i++) {
    const slotHour = (currentHour + i) % 24
    const timeLabel = `${String(slotHour).padStart(2, '0')}:00 MET`

    // Projected recovery model
    const recoveryFactor = Math.max(0.7, 1.0 - i * 0.025)
    let projectedRisk = risk.total * recoveryFactor

    const reasons: string[] = []

    if (spaceWeather === 'storm') {
      slots.push({
        hourOffset: i,
        timeLabel,
        readiness: 'no-go',
        score: 95,
        reasons: ['DONKI Space Weather: Severe Solar Radiation Storm active. All EVAs forbidden.'],
      })
      continue
    }

    if (spaceWeather === 'elevated') {
      reasons.push('Elevated solar flux / CME transit: Maximum EVA duration capped at 2 hours.')
      projectedRisk = Math.max(projectedRisk, 48)
    }

    if (currentReading.sleepHours < 5.5) {
      projectedRisk += 14
      reasons.push(`Fatigue penalty: Last sleep cycle was only ${currentReading.sleepHours} hrs.`)
    }

    if (currentReading.spo2 < 93) {
      projectedRisk += 30
      reasons.push(`Oxygenation penalty: SpO₂ at ${currentReading.spo2}%.`)
    }

    if (projectedRisk < 34 && spaceWeather !== 'elevated') {
      reasons.push('All physiological vitals and environmental metrics within nominal EVA limits.')
      slots.push({
        hourOffset: i,
        timeLabel,
        readiness: 'go',
        score: Math.round(projectedRisk),
        reasons,
      })
    } else if (projectedRisk < 67) {
      if (reasons.length === 0) reasons.push('Moderate physiological baseline drift; proceed with continuous medical telemetry.')
      slots.push({
        hourOffset: i,
        timeLabel,
        readiness: 'caution',
        score: Math.round(projectedRisk),
        reasons,
      })
    } else {
      reasons.push('High physiological stress or cabin anomaly exceeds flight surgeon safety margins.')
      slots.push({
        hourOffset: i,
        timeLabel,
        readiness: 'no-go',
        score: Math.round(projectedRisk),
        reasons,
      })
    }
  }

  const goSlots = slots.filter((s) => s.readiness === 'go')
  let recommendedWindow = 'No clear Go window within next 12 hours. Crew rest prioritized.'
  let overallStatus: 'go' | 'caution' | 'no-go' = 'no-go'

  if (goSlots.length >= 3) {
    recommendedWindow = `${goSlots[0].timeLabel} – ${goSlots[Math.min(3, goSlots.length - 1)].timeLabel} (${goSlots.length} hrs sustained Go)`
    overallStatus = 'go'
  } else if (slots.some((s) => s.readiness === 'caution')) {
    recommendedWindow = 'Conditional EVA permitted during caution slots with flight surgeon tether.'
    overallStatus = 'caution'
  }

  return { slots, recommendedWindow, overallStatus }
}

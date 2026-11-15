import { useEffect, useMemo, useState } from 'react'
import { simulator } from '../data/SimulatorSource'
import { calculateBaseline, evaluateAllAlerts } from '../processing/anomaly'
import type {
  AlertItem,
  AstronautId,
  CrewMember,
  MissionState,
  ScenarioId,
  SignalBaseline,
  SpaceWeatherEvent,
  SpaceWeatherStatus,
  VitalReading,
} from '../types'

const crew: CrewMember[] = [
  {
    id: 'aster',
    name: 'Aster Vance',
    role: 'Mission Commander',
    accent: '#38bdf8', // Cyber cyan
    age: 41,
    missionDays: 142,
    evaExperienceHours: 64,
  },
  {
    id: 'jade',
    name: 'Dr. Jade Chen',
    role: 'Biomedical Officer & EVA Lead',
    accent: '#10b981', // Bio emerald
    age: 38,
    missionDays: 142,
    evaExperienceHours: 48,
  },
  {
    id: 'niko',
    name: 'Niko Mercer',
    role: 'Flight Systems Engineer',
    accent: '#f59e0b', // Solar amber
    age: 35,
    missionDays: 142,
    evaExperienceHours: 32,
  },
]

// Pre-seed realistic initial history for each astronaut
function generateSeedHistory(astronautId: AstronautId): VitalReading[] {
  const seed: VitalReading[] = []
  const now = Date.now()
  const baseHr = astronautId === 'aster' ? 66 : astronautId === 'jade' ? 71 : 64
  const baseHrv = astronautId === 'aster' ? 55 : astronautId === 'jade' ? 49 : 58

  for (let i = 40; i >= 1; i--) {
    const timestamp = now - i * 1500
    const drift = Math.sin(i * 0.2) * 2
    seed.push({
      astronautId,
      timestamp,
      hr: Math.round(baseHr + drift + (Math.random() - 0.5) * 3),
      hrv: Math.round(baseHrv - drift * 0.5 + (Math.random() - 0.5) * 4),
      spo2: Number((98.2 + (Math.random() - 0.5) * 0.8).toFixed(1)),
      temp: Number((36.7 + (Math.random() - 0.5) * 0.2).toFixed(2)),
      resp: Math.round(15 + (Math.random() - 0.5) * 2),
      co2: Math.round(780 + (Math.random() - 0.5) * 40),
      sleepHours: Number((7.6 + (Math.random() - 0.5) * 0.4).toFixed(1)),
    })
  }
  return seed
}

const defaultSpaceWeatherEvents: SpaceWeatherEvent[] = [
  {
    id: 'donki-flr-882',
    type: 'FLR',
    title: 'Solar Flare Active (M2.1 Class)',
    severity: 'Moderate',
    timestamp: Date.now() - 3600000 * 2,
    details: 'AR3615 active region emission observed by GOES-18. High frequency radio fade on sunlit hemisphere.',
  },
  {
    id: 'donki-cme-104',
    type: 'CME',
    title: 'Coronal Mass Ejection Earth/Mars Track',
    severity: 'Calm',
    timestamp: Date.now() - 3600000 * 18,
    details: 'Halo CME detected with bulk speed 420 km/s. Anticipated glancing blow to martian orbital transit path.',
  },
]

export function useMissionState() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<AstronautId>('aster')
  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('normal')
  const [spaceWeatherStatus, setSpaceWeatherStatus] = useState<SpaceWeatherStatus>('calm')
  const [isSpaceWeatherLive, setIsSpaceWeatherLive] = useState(true)

  const [currentReadings, setCurrentReadings] = useState<Record<AstronautId, VitalReading>>(() => {
    const asterSeed = generateSeedHistory('aster')
    const jadeSeed = generateSeedHistory('jade')
    const nikoSeed = generateSeedHistory('niko')
    return {
      aster: asterSeed[asterSeed.length - 1],
      jade: jadeSeed[jadeSeed.length - 1],
      niko: nikoSeed[nikoSeed.length - 1],
    }
  })

  const [history, setHistory] = useState<Record<AstronautId, VitalReading[]>>(() => ({
    aster: generateSeedHistory('aster'),
    jade: generateSeedHistory('jade'),
    niko: generateSeedHistory('niko'),
  }))

  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const [baselines, setBaselines] = useState<Record<AstronautId, Record<string, SignalBaseline>>>(() => {
    const fields = ['hr', 'hrv', 'spo2', 'temp', 'resp', 'co2', 'sleepHours'] as const
    const initial: Record<AstronautId, Record<string, SignalBaseline>> = {
      aster: {},
      jade: {},
      niko: {},
    }
    for (const a of ['aster', 'jade', 'niko'] as const) {
      const h = generateSeedHistory(a)
      for (const f of fields) {
        initial[a][f] = calculateBaseline(h, f)
      }
    }
    return initial
  })

  useEffect(() => {
    const unsubscribe = simulator.subscribe((reading) => {
      setCurrentReadings((prev) => ({
        ...prev,
        [reading.astronautId]: reading,
      }))

      setHistory((prev) => {
        const currentList = prev[reading.astronautId] ?? []
        const updatedList = [...currentList, reading].slice(-120)
        const next = {
          ...prev,
          [reading.astronautId]: updatedList,
        }

        // Recompute baselines
        const fields = ['hr', 'hrv', 'spo2', 'temp', 'resp', 'co2', 'sleepHours'] as const
        const updatedBaselines = { ...baselines }
        for (const f of fields) {
          updatedBaselines[reading.astronautId][f] = calculateBaseline(updatedList, f)
        }
        setBaselines(updatedBaselines)

        // Evaluate live alerts
        const activeAlerts = evaluateAllAlerts(reading, updatedList)
        setAlerts((prevAlerts) => {
          // Keep alerts for other astronauts and merge current
          const others = prevAlerts.filter((a) => a.astronautId !== reading.astronautId)
          return [...activeAlerts, ...others].slice(0, 16)
        })

        return next
      })
    })

    return unsubscribe
  }, [baselines])

  const setScenario = (scenario: ScenarioId) => {
    setCurrentScenario(scenario)
    simulator.setScenario(scenario)
    if (scenario === 'solar-storm') {
      setSpaceWeatherStatus('storm')
    } else if (spaceWeatherStatus === 'storm') {
      setSpaceWeatherStatus('calm')
    }
  }

  const setSpaceWeather = (status: SpaceWeatherStatus) => {
    setSpaceWeatherStatus(status)
  }

  const missionState = useMemo<MissionState>(
    () => ({
      astronauts: crew,
      selectedAstronautId,
      currentReadings,
      history,
      alerts,
      baselines,
      spaceWeather: {
        status: spaceWeatherStatus,
        isLive: isSpaceWeatherLive,
        events: defaultSpaceWeatherEvents,
        kpIndex: spaceWeatherStatus === 'storm' ? 7.8 : spaceWeatherStatus === 'elevated' ? 4.5 : 2.1,
        solarWindSpeed: spaceWeatherStatus === 'storm' ? 680 : spaceWeatherStatus === 'elevated' ? 510 : 380,
      },
    }),
    [
      selectedAstronautId,
      currentReadings,
      history,
      alerts,
      baselines,
      spaceWeatherStatus,
      isSpaceWeatherLive,
    ],
  )

  return {
    missionState,
    selectedAstronautId,
    setSelectedAstronautId,
    currentScenario,
    setScenario,
    setAlerts,
    spaceWeatherStatus,
    setSpaceWeather,
    isSpaceWeatherLive,
    setIsSpaceWeatherLive,
    simulator,
  }
}

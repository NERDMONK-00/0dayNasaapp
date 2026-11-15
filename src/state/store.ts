import { useEffect, useMemo, useState } from 'react'
import { simulator } from '../data/SimulatorSource'
import type { AlertItem, AstronautId, CrewMember, MissionState, VitalReading } from '../types'

const crew: CrewMember[] = [
  { id: 'aster', name: 'Aster', role: 'Commander', accent: '#4ade80' },
  { id: 'jade', name: 'Jade', role: 'Biomedical Officer', accent: '#60a5fa' },
  { id: 'niko', name: 'Niko', role: 'Systems Engineer', accent: '#fbbf24' },
]

const emptyReading = (astronautId: AstronautId): VitalReading => ({
  astronautId,
  timestamp: Date.now(),
  hr: 70,
  hrv: 50,
  spo2: 98,
  temp: 36.8,
  resp: 15,
  co2: 800,
  sleepHours: 7,
})

export function useMissionState() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<AstronautId>('aster')
  const [currentReadings, setCurrentReadings] = useState<Record<AstronautId, VitalReading>>({
    aster: emptyReading('aster'),
    jade: emptyReading('jade'),
    niko: emptyReading('niko'),
  })
  const [history, setHistory] = useState<Record<AstronautId, VitalReading[]>>({
    aster: [],
    jade: [],
    niko: [],
  })
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [baselines, setBaselines] = useState<Record<AstronautId, Record<string, { mean: number; stdev: number; count: number }>>>({
    aster: {},
    jade: {},
    niko: {},
  })

  useEffect(() => {
    const unsubscribe = simulator.subscribe((reading) => {
      setCurrentReadings((previous) => ({
        ...previous,
        [reading.astronautId]: reading,
      }))

      setHistory((previous) => {
        const next = {
          ...previous,
          [reading.astronautId]: [...(previous[reading.astronautId] ?? []), reading].slice(-120),
        }

        const baselineFields = ['hr', 'hrv', 'spo2', 'temp', 'resp', 'co2', 'sleepHours'] as const
        const nextBaselines = { ...baselines }

        for (const field of baselineFields) {
          const values = next[reading.astronautId].map((entry) => Number(entry[field]))
          if (values.length > 0) {
            const mean = values.reduce((sum, value) => sum + value, 0) / values.length
            const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(values.length - 1, 1)
            nextBaselines[reading.astronautId][field] = {
              mean,
              stdev: Math.sqrt(variance),
              count: values.length,
            }
          }
        }

        setBaselines(nextBaselines)
        return next
      })
    })

    return unsubscribe
  }, [])

  const missionState = useMemo<MissionState>(
    () => ({
      astronauts: crew,
      selectedAstronautId,
      currentReadings,
      history,
      alerts,
      baselines,
    }),
    [selectedAstronautId, currentReadings, history, alerts, baselines],
  )

  return {
    missionState,
    selectedAstronautId,
    setSelectedAstronautId,
    setAlerts,
    simulator,
  }
}

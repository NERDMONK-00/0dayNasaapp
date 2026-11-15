import { useMemo } from 'react'
import { useMissionState } from '../state/store'
import type { AlertLevel } from '../types'
import { RuleBasedEngine } from '../assistant/RuleBasedEngine'

export function useDashboardContext() {
  const { missionState, selectedAstronautId } = useMissionState()

  const selectedAstronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const currentReading = missionState.currentReadings[selectedAstronautId]
  const alerts = missionState.alerts.filter((alert) => alert.astronautId === selectedAstronautId)
  const baselines = missionState.baselines[selectedAstronautId] ?? {}
  const missionStatus: AlertLevel = alerts.some((alert) => alert.level === 'critical')
    ? 'critical'
    : alerts.some((alert) => alert.level === 'warning')
      ? 'warning'
      : 'normal'

  return useMemo(
    () => ({
      engine: new RuleBasedEngine(),
      context: {
        selectedAstronautId,
        selectedAstronaut,
        currentReading,
        history: missionState.history[selectedAstronautId] ?? [],
        alerts,
        baselines,
        allCrew: missionState.astronauts,
        allReadings: missionState.currentReadings,
        missionStatus,
      },
    }),
    [alerts, baselines, currentReading, missionState.astronauts, missionState.currentReadings, missionState.history, missionStatus, selectedAstronaut, selectedAstronautId],
  )
}

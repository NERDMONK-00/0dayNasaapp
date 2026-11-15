import { useMissionState } from '../state/store'
import { SignalChart } from '../components/SignalChart'
import { BodyModel3D } from '../components/BodyModel3D'
import {
  computeEVAReadiness,
  computeRiskIndex,
  getRobustZScore,
  getZScore,
} from '../processing/anomaly'

export function AstronautPage() {
  const {
    missionState,
    selectedAstronautId,
    setSelectedAstronautId,
    spaceWeatherStatus,
  } = useMissionState()

  const astronaut =
    missionState.astronauts.find((p) => p.id === selectedAstronautId) ?? missionState.astronauts[0]
  const current = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []
  const baselines = missionState.baselines[selectedAstronautId] ?? {}
  const alerts = missionState.alerts.filter((a) => a.astronautId === selectedAstronautId)

  const risk = computeRiskIndex(current, baselines, spaceWeatherStatus)
  const eva = computeEVAReadiness(selectedAstronautId, current, baselines, spaceWeatherStatus)

  // Baseline telemetry calculations
  const hrBase = baselines.hr ?? { mean: 68, stdev: 3.5, count: 40, isWarmedUp: true }
  const hrvBase = baselines.hrv ?? { mean: 52, stdev: 4.8, count: 40, isWarmedUp: true }
  const spo2Base = baselines.spo2 ?? { mean: 98.2, stdev: 0.6, count: 40, isWarmedUp: true }
  const tempBase = baselines.temp ?? { mean: 36.7, stdev: 0.15, count: 40, isWarmedUp: true }

  const hrZ = getZScore(current.hr, hrBase)
  const hrRobustZ = getRobustZScore(current.hr, hrBase)
  const hrvZ = getZScore(current.hrv, hrvBase)
  const spo2Z = getZScore(current.spo2, spo2Base)
  const tempZ = getZScore(current.temp, tempBase)


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-white/10 pb-4">
        <div>
          <span className="page-kicker">Crew Clinical Profile & Telemetry</span>
          <h1 className="page-title text-2xl sm:text-3xl">
            {astronaut.name} — {astronaut.role}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Age: {astronaut.age} • Mission Day: {astronaut.missionDays} • Cumulative EVA: {astronaut.evaExperienceHours} hrs • Astroskin ID: BIO-{selectedAstronautId.toUpperCase()}-01
          </p>
        </div>

        {/* Crew Switcher Pills */}
        <div className="flex gap-2">
          {missionState.astronauts.map((astro) => {
            const isSelected = astro.id === selectedAstronautId
            const displayName = astro.name.replace(/^(Commander|Lt\.|Dr\.)\s*/i, '').split(' ')[0]
            return (
              <button
                key={astro.id}
                type="button"
                onClick={() => setSelectedAstronautId(astro.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs transition border ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50 text-blue-900 font-semibold shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/15 hover:text-white'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: astro.accent }}
                />
                <span className="font-semibold">{displayName}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Top Telemetry & Baseline Engine Status Banner */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        {/* Heart Rate & Z-Score */}
        <div className="hud-card">
          <div className="flex justify-between text-slate-400">
            <span>HEART RATE</span>
            <span className={Math.abs(hrZ) > 2 ? 'text-amber-600 font-semibold' : 'text-gray-400'}>
              z = {hrZ > 0 ? `+${hrZ}` : hrZ}σ
            </span>
          </div>
          <p
            className={`mt-1 text-2xl font-bold ${
              current.hr > 115 ? 'text-rose-600' : current.hr > 90 ? 'text-amber-600' : 'text-white'
            }`}
          >
            {Math.round(current.hr)} bpm
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Baseline: {hrBase.mean} ± {hrBase.stdev} | Robust z: {hrRobustZ}
          </p>
        </div>

        {/* HRV & Parasympathetic Tone */}
        <div className="hud-card">
          <div className="flex justify-between text-slate-400">
            <span>HRV (RMSSD)</span>
            <span className={hrvZ < -1.5 ? 'text-amber-600 font-semibold' : 'text-gray-400'}>
              z = {hrvZ > 0 ? `+${hrvZ}` : hrvZ}σ
            </span>
          </div>
          <p
            className={`mt-1 text-2xl font-bold ${
              current.hrv < 30 ? 'text-rose-600' : current.hrv < 40 ? 'text-amber-600' : 'text-white'
            }`}
          >
            {Math.round(current.hrv)} ms
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Baseline: {hrvBase.mean} ± {hrvBase.stdev} ms
          </p>
        </div>

        {/* Blood Oxygen SpO2 */}
        <div className="hud-card">
          <div className="flex justify-between text-slate-400">
            <span>PULSE OX (SpO₂)</span>
            <span className={current.spo2 < 93 ? 'text-rose-600 font-semibold' : 'text-gray-400'}>
              z = {spo2Z > 0 ? `+${spo2Z}` : spo2Z}σ
            </span>
          </div>
          <p
            className={`mt-1 text-2xl font-bold ${
              current.spo2 < 90 ? 'text-rose-600' : current.spo2 < 94 ? 'text-amber-600' : 'text-emerald-700'
            }`}
          >
            {current.spo2.toFixed(1)}%
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Hard Critical Bound: &lt; 90.0%
          </p>
        </div>

        {/* Core / Skin Temperature */}
        <div className="hud-card">
          <div className="flex justify-between text-slate-400">
            <span>CORE TEMP</span>
            <span className={tempZ > 1.8 ? 'text-rose-600 font-semibold' : 'text-gray-400'}>
              z = {tempZ > 0 ? `+${tempZ}` : tempZ}σ
            </span>
          </div>
          <p
            className={`mt-1 text-2xl font-bold ${
              current.temp > 38.2 ? 'text-rose-600' : current.temp > 37.6 ? 'text-amber-600' : 'text-white'
            }`}
          >
            {current.temp.toFixed(1)}°C
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Baseline: {tempBase.mean}°C ± {tempBase.stdev}°C
          </p>
        </div>
      </div>

      {/* 3D Telemetry Twin + 12-Hour EVA Planner */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: 3D Spacesuit Model Inspector */}
        <div className="lg:col-span-6">
          <BodyModel3D status={risk.band} reading={current} />
        </div>

        {/* Right: EVA 12-Hour Schedule & Clinical Decision Guidance */}
        <div className="lg:col-span-6 space-y-6">
          {/* EVA Matrix */}
          <div className="hud-card">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="page-kicker">Section 4.8 Protocol</span>
                <h3 className="font-display text-lg font-bold text-white">
                  12-Hour Hourly EVA Readiness Matrix
                </h3>
              </div>
              <span
                className={`hud-chip ${
                  eva.overallStatus === 'go'
                    ? 'hud-chip-ok'
                    : eva.overallStatus === 'caution'
                      ? 'hud-chip-warn'
                      : 'hud-chip-crit'
                }`}
              >
                EVA: {eva.overallStatus.toUpperCase()}
              </span>
            </div>

            <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/50 p-3 text-xs leading-relaxed text-slate-300">
              <strong className="text-blue-600">Recommended Spacewalk Window:</strong>{' '}
              {eva.recommendedWindow}
            </div>

            {/* 12 Hourly Slot Breakdown */}
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
              {eva.slots.map((slot) => {
                const isGo = slot.readiness === 'go'
                const isCaution = slot.readiness === 'caution'
                return (
                  <div
                    key={slot.hourOffset}
                    className={`flex items-start justify-between gap-3 rounded-lg border p-2.5 text-xs transition ${
                      isGo
                        ? 'border-emerald-200 bg-emerald-50/60'
                        : isCaution
                          ? 'border-amber-200 bg-amber-50/60'
                          : 'border-rose-200 bg-rose-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          {slot.timeLabel} (+{slot.hourOffset}h)
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border ${
                            isGo
                              ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                              : isCaution
                                ? 'border-amber-200 bg-amber-100 text-amber-900'
                                : 'border-rose-200 bg-rose-100 text-rose-800'
                          }`}
                        >
                          {slot.readiness}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {slot.reasons.join(' ')}
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-slate-400 text-[11px]">
                      Risk {slot.score}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Personal Baseline Calibration Stats */}
          <div className="hud-card font-mono text-xs">
            <span className="page-kicker">Section 4.2 Baselining</span>
            <h3 className="font-display text-base font-bold text-white mb-2">
              Adaptive Baseline Parameters
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="rounded bg-slate-950/50 p-2 border border-white/10">
                <span className="text-[10px] text-gray-400 block">ROLLING WINDOW (W)</span>
                <span className="font-bold text-blue-600">72.0 Hours (120 pts)</span>
              </div>
              <div className="rounded bg-slate-950/50 p-2 border border-white/10">
                <span className="text-[10px] text-gray-400 block">WARM-UP STATE</span>
                <span className="font-bold text-emerald-700">Calibrated & Active</span>
              </div>
              <div className="rounded bg-slate-950/50 p-2 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Z-SCORE THRESHOLD (k)</span>
                <span className="font-bold text-amber-300">Watch: 2.0 | Crit: 3.0</span>
              </div>
              <div className="rounded bg-slate-950/50 p-2 border border-white/10">
                <span className="text-[10px] text-gray-400 block">PERSISTENCE RULE</span>
                <span className="font-bold text-blue-600">m = 4 of n = 6 samples</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Channel Live Signal Charts with Baseline Envelope */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="page-kicker">Continuous Telemetry Streams</span>
            <h3 className="font-display text-xl font-bold text-white">
              Live Biometric & Environmental Waveforms
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Sample Rate: 1 reading / 1.5s • Window: 30 samples
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SignalChart
            title="Heart Rate"
            data={history}
            valueKey="hr"
            unit="bpm"
            color="#00f0ff"
            baseline={hrBase}
          />
          <SignalChart
            title="Heart Rate Variability (RMSSD)"
            data={history}
            valueKey="hrv"
            unit="ms"
            color="#38bdf8"
            baseline={hrvBase}
          />
          <SignalChart
            title="Blood Oxygen Saturation (SpO₂)"
            data={history}
            valueKey="spo2"
            unit="%"
            color="#10b981"
            baseline={spo2Base}
          />
          <SignalChart
            title="Core & Skin Temperature"
            data={history}
            valueKey="temp"
            unit="°C"
            color="#f59e0b"
            baseline={tempBase}
          />
          <SignalChart
            title="Respiratory Rate"
            data={history}
            valueKey="resp"
            unit="br/min"
            color="#818cf8"
            baseline={baselines.resp}
          />
          <SignalChart
            title="Cabin Atmospheric CO₂"
            data={history}
            valueKey="co2"
            unit="ppm"
            color="#ec4899"
            baseline={baselines.co2}
          />
        </div>
      </section>

      {/* Active Alerts for this Crew Member */}
      {alerts.length > 0 && (
        <section className="hud-card border-amber-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-lg font-bold text-white">
              Clinical Deviations for {astronaut.name} ({alerts.length})
            </h3>
            <span className="hud-chip hud-chip-warn">ACTION REQUIRED</span>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`rounded-xl border p-4 text-xs transition ${
                  al.level === 'critical'
                    ? 'border-rose-200 bg-rose-50/70'
                    : 'border-amber-200 bg-amber-50/70'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{al.title}</span>
                  <span className={`hud-chip ${al.level === 'critical' ? 'hud-chip-crit' : 'hud-chip-warn'}`}>
                    {al.level.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2 text-slate-300">
                  <div className="rounded bg-slate-900/60 border border-white/10 p-2.5">
                    <span className="font-mono text-[10px] text-blue-600 uppercase font-semibold">Observation</span>
                    <p className="mt-0.5">{al.what ?? al.reason}</p>
                  </div>
                  <div className="rounded bg-slate-900/60 border border-white/10 p-2.5">
                    <span className="font-mono text-[10px] text-amber-700 uppercase font-semibold">Clinical Consequence</span>
                    <p className="mt-0.5">{al.whyItMatters ?? al.reason}</p>
                  </div>
                </div>
                <div className="mt-2.5 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  Action: {al.action}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clean Mission Page Footer */}
      <footer className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div>
          <span>AstroPulse Clinical Decision Support • Bio-Telemetry Standard: ISO/IEEE 11073</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/references" className="hover:text-blue-600 transition">24 NASA HRP Citations</a>
          <span>•</span>
          <a href="/team" className="hover:text-blue-600 transition">Team Nepal</a>
        </div>
      </footer>
    </div>
  )
}

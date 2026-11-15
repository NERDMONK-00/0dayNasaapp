# 0dayNasaapp

# Astronaut Health Monitoring

A mission-control web app for monitoring astronaut vital signs in a browser-only environment. It uses a built-in simulator, learns each astronaut's personal baseline, flags anomalies using z-scores and thresholds, and explains each alert with a clear reason and action.

## What it does

- Live dashboard for heart rate, HRV, SpO2, temperature, respiratory rate, sleep hours, and cabin CO2
- Multi-astronaut view for 3 crew members
- Rolling baseline tracking per astronaut
- Hard safety thresholds that do not depend on ML
- Simple anomaly detection layer for future model integration
- Explainable alerts with why + suggested action
- Scenario triggers for normal, dehydration, fever, sleep debt, CO2 rise, and SpO2 drop
- No cloud dependency: all logic runs locally in the browser

## Project architecture

- Data source layer: simulator and future hardware adapters
- Processing layer: baseline calculation, z-score analysis, threshold checks
- State layer: astronaut selection, history log, current readings, active alerts
- UI layer: card layout, charts, scenario controls, alert history

### Data source contract

The app depends on a single interface:

- `DataSource.subscribe(callback)`

This means the UI and processing logic can stay unchanged when swapping from the built-in simulator to real hardware.

## Folder structure

```text
src/
  components/
    MetricCard.tsx
    SignalChart.tsx
  data/
    dataSource.ts
    HardwareSource.ts
    SimulatorSource.ts
  processing/
    anomaly.ts
  state/
    store.ts
  types.ts
  App.tsx
  main.tsx
  index.css
```

## Short plan

1. Build a data-source abstraction so simulator and hardware share the same contract.
2. Generate realistic astronaut vitals with a simulator and scenario buttons.
3. Track rolling baselines and calculate z-score deviations.
4. Add hard safety rules for critical conditions.
5. Surface explainable alerts in the dashboard UI.
6. Prepare the project for future hardware integration with a documented stub.

## Getting started

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local Vite URL in your browser.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
```

## How to test it

1. Start the app.
2. Switch between crew members in the top bar.
3. Click the scenario buttons to simulate health issues.
4. Watch the cards and charts update.
5. Use the alert scan to generate and review why the app triggered warnings.

## Real hardware integration roadmap

The app is built so hardware can be connected later without changing the rest of the system.

### Planned path

1. Create a `HardwareSource` implementation in `src/data/HardwareSource.ts`.
2. Connect to a local device via WebSocket, Web Serial, or Web Bluetooth.
3. Translate sensor payloads into the common format:

```ts
{
  astronautId,
  timestamp,
  hr,
  hrv,
  spo2,
  temp,
  resp,
  co2,
  sleepHours,
}
```

4. Keep the processing and UI layers untouched.

## GitHub publishing

This project is ready to be pushed to GitHub.

```bash
git init
git add .
git commit -m "Initial commit: astronaut health monitoring system"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Hackathon notes

This is intentionally simple and easy to explain:

- local browser app
- no backend required
- clear architecture
- future hardware-ready design
- compelling mission control UX

## License

MIT

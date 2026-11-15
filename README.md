# 0dayNasaapp

# Astronaut Health Monitoring

A cinematic astronaut health monitoring dashboard for a browser-only mission control experience. The app tracks crew vitals, learns each astronaut’s personal baseline, flags anomalies using z-scores and hard thresholds, and explains alerts with clear reasoning and suggested actions.

## What it does

- Live multi-astronaut monitoring for heart rate, HRV, SpO₂, temperature, respiration, sleep hours, and CO₂
- Rolling baseline tracking per astronaut
- Rule-based anomaly detection and explainable alert generation
- Mission-control UI with a deep-space theme
- Local Orbitkat assistant that reads current mission context and explains alerts in plain language
- Simulator-driven scenarios for normal, dehydration, fever, sleep debt, CO₂ rise, and SpO₂ drop
- No backend required; all logic runs locally in the browser

## Route map

- `/` — Home
- `/astronauts` — Astronaut crew status
- `/test` — Run simulation scenarios
- `/results` — Mission report and recommended actions
- `/how-it-works` — Data flow and monitoring logic
- `/about` — Problem, stack, credits, limitations

## Project architecture

- Data source layer: simulator and future hardware adapters
- Processing layer: baseline calculation, z-score analysis, threshold checks
- State layer: astronaut selection, history log, current readings, active alerts
- UI layer: cinematic space theme, HUD panels, charts, multi-page mission experience
- Assistant layer: local Orbitkat rule-based assistant, ready for future LLM swap

## Orbitkat mascot assistant

The app includes a persistent mascot assistant named Orbitkat, a space-cat astronaut that appears at the bottom-right on every page.

- The mascot uses a Sketchfab iframe embed with the NASA-style model and hidden UI clutter.
- If the embed cannot load or the browser is offline, a simple 2D fallback cat-astronaut avatar is used so the app never breaks.
- Orbitkat reads from the current app state: selected astronaut, vitals, baselines, alerts, and crew context.
- Medical answers are framed as decision support, not diagnosis.

### Credit

Mascot: Orbitkat by @orbitkat.art (Sketchfab)  
Model: NASA

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
2. Open the Home page and review the cinematic mission HUD.
3. Move between the astronaut, test, and results pages.
4. Toggle scenarios and watch alerts update with explainable actions.
5. Open the Orbitkat assistant and ask for a summary or alert explanation.

## Hardware integration roadmap

The app is intentionally built around a shared `DataSource` abstraction so future hardware can plug in without changing the rest of the system.

### Planned path

1. Create a `HardwareSource` implementation in `src/data/HardwareSource.ts`.
2. Connect to local devices via WebSocket, Web Serial, or Web Bluetooth.
3. Translate readings to the common mission format:

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

4. Keep processing and UI logic unchanged.

## GitHub publishing

```bash
git add .
git commit -m "Refine mission UI and orbital dashboard"
git push origin main
```

## Hackathon notes

This is intentionally simple, browser-first, and easy to explain:

- local simulation and analytics
- no backend required
- clear mission logic
- future hardware-ready design
- cinematic NASA-inspired presentation

## License

MIT

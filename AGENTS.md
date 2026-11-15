---
name: nasapp-agent
description: "Use when working in this astronaut health monitoring project. Keep the app browser-only, use the simulator/data-source abstraction, preserve separation between data, processing, state, and UI, and keep changes simple and hackathon-friendly."
---

# AGENTS.md

## Project overview
This repository contains a NASA Space Apps Challenge prototype for an astronaut health monitoring dashboard.

The app tracks vital signs for multiple astronauts, learns their personal baselines, flags anomalies, and explains alerts with a clear reason and suggested action.

## Core rules
- Keep the project as a front-end app only. No backend is required.
- Use React + Vite + TypeScript.
- Use Tailwind CSS for styling.
- Recharts is used for live signal charts.
- The architecture must stay layered:
  - data source
  - processing
  - state
  - UI
- Do not put UI rendering logic inside processing code.
- Keep the logic simple and understandable for a hackathon team.
- Resist over-engineering. Prefer clear code over abstraction for abstraction's sake.

## Data source contract
- The app must follow a `DataSource` pattern with a single method:
  - `subscribe(callback)`
- The current implementation is `SimulatorSource`.
- Future hardware should be added through a `HardwareSource` stub without changing the rest of the app.
- The shared reading format should remain consistent:
  - `astronautId`
  - `timestamp`
  - `hr`
  - `hrv`
  - `spo2`
  - `temp`
  - `resp`
  - `co2`
  - `sleepHours`

## Health logic expectations
- Maintain per-astronaut rolling baselines using mean and standard deviation.
- Use z-score-based anomaly detection.
- Keep rule-based hard thresholds for critical conditions.
- Explain alerts with a reason and a suggested action.
- Support at least 3 crew members.
- Include scenario triggers for:
  - Normal
  - Dehydration
  - Fever onset
  - Sleep deprivation
  - CO2 rise
  - Sudden SpO2 drop

## UI expectations
- Mission control / command-center look and feel.
- Dark theme preferred.
- Mobile-friendly layouts.
- Show signal cards and live charts.
- Include alert history log.
- Keep status colors consistent: normal, warning, critical.

## Code conventions
- Use TypeScript types for shared domain models.
- Prefer explicit names over clever abstractions.
- Add short comments only where helpful.
- Keep components small and readable.
- Prefer simple state management and local browser logic.

## Validation
- Run `npm run build` before finalizing changes.
- Keep the app runnable locally with `npm run dev -- --host 0.0.0.0`.
- Preserve the simulator-driven demo behavior so the app remains demo-ready without any cloud dependency.

## Publishing notes
- This project is intended to be published to GitHub and optionally deployed to Vercel/Netlify for review.
- Keep the README clear enough for non-technical teammates to understand the app.
- Document hardware migration in a simple, practical way.

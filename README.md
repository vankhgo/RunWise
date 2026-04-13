# Runwise

A recommendation-first running planner that helps people decide what run to do today in under a minute.

## Overview

Runwise is a consumer-facing web app for runners who want structure without heavy training software. Users set a few practical constraints (distance, time, intensity, goal, location), and Runwise returns a clear run recommendation with a weather-aware note, plus lightweight save/history flows.

## Problem

Most running apps are built around tracking the run after it starts. The harder moment often happens before that: deciding what to do today.

Common friction:
- "How hard should I run today?"
- "Do I have enough time for this distance?"
- "Should weather change my plan?"

That planning uncertainty creates decision fatigue and missed sessions.

## Solution

Runwise focuses on one job: helping users make a sensible run decision quickly.

Product approach:
- Recommendation-first UX (not tracker-first UX)
- Rule-based, explainable logic (no fake AI claims)
- Weather-aware adjustments that improve practicality
- Lightweight persistence for repeat use (Saved Plans + History)

## Key Features

- Planner form with:
  - Target distance
  - Available time
  - Preferred intensity
  - Run goal
  - Structured location selector (`Country` -> `Location`)
- Rule-based recommendation engine with:
  - Recommendation title
  - Label
  - Explanation
  - Weather-aware note
  - Suggested distance/duration/intensity
- Saved Plans flow:
  - Save recommendation
  - Duplicate-safe save behavior
  - Reuse saved plan
- History flow:
  - Recent recommendations
  - Reuse historical inputs
- Lightweight stat pills for quick context
- Responsive, consumer-facing UI with subtle motion

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui-style components
- **Animation:** Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **Persistence:** Supabase (with local fallback in MVP flow)
- **Weather:** Open-Meteo adapter

## Screens / Product Preview

Add screenshots to `docs/screenshots/` and reference them below.

Recommended captures:
1. Planner default state
2. Recommendation result state
3. Saved Plans tab
4. History tab
5. Weather-unavailable fallback note state

Placeholder paths:
- `docs/screenshots/planner.png`
- `docs/screenshots/recommendation.png`
- `docs/screenshots/saved-plans.png`
- `docs/screenshots/history.png`
- `docs/screenshots/weather-fallback.png`

## Demo Instructions

### Option A: Local demo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: `http://localhost:3000`

### Option B: Production-style local run

```bash
npm install
npm run build
npm run start
```

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure env

```bash
cp .env.example .env.local
```

### 3) Run development server

```bash
npm run dev
```

## Environment Variables

Current env template is in `.env.example`.

Required for Supabase mode:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional weather config:
- `WEATHER_CACHE_TTL_MIN` (default: `15`)

Notes:
- If Supabase is not fully configured, the app falls back to local persistence for demo usability.
- Do not commit `.env.local`.

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build production bundle
- `npm run start` - Run built app
- `npm run lint` - Lint checks
- `npm run typecheck` - TypeScript checks

## Project Structure (Brief)

```txt
src/
  app/
    page.tsx
    api/
      recommendations/route.ts
      weather/route.ts
  components/
    runwise/
    ui/
  features/
    planner/
    recommendation/
  lib/
    weather/
    persistence/
  types/
```

## Future Improvements

- Authentication refinement for persistent cross-device history
- Expanded recommendation tuning based on usage patterns
- Better empty/loading/error micro-interactions
- Basic analytics instrumentation for product iteration
- Test suite expansion (unit + integration + e2e)

## Notes for Portfolio / Product Thinking

### Why this project exists

Runwise was built to solve a specific pre-run decision problem, not to replicate full fitness platforms.

### Product decisions

- **Recommendation-first, not route-tracking-first:** focuses on daily decision quality.
- **Rule-based MVP logic:** transparent and practical without pretending to be AI coaching.
- **Weather-aware by default:** small but meaningful context layer that improves trust.
- **Lightweight architecture:** enough persistence and UX depth to feel like a real product, without overbuilding.

### Known MVP tradeoffs

- Curated location list instead of global place search
- No live GPS tracking, social features, or advanced analytics
- Weather adapter is intentionally simple and resilient-first

## Additional Product Docs

Detailed product/design/engineering specs are included in the repo:
- `PRD.md`
- `FEATURE_SPEC.md`
- `TECH_SPEC.md`
- `UI_UX_SPEC.md`
- `DESIGN_SYSTEM.md`
- `SUPABASE_SCHEMA.md`

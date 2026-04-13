# Runwise Product Requirements Document (PRD)

## Overview

Runwise is a recommendation-first running planner. Users provide a few practical inputs (target distance, available time, preferred intensity, run goal, country, location), and the app returns a clear run suggestion with an explanation and weather-aware adjustment note.

Runwise is intentionally lightweight. It is not a tracker, route planner, or analytics suite. The product promise is simple: help users quickly decide what kind of run to do today.

## Problem Statement

Runners often skip runs or make inconsistent choices because daily planning is mentally expensive. Existing products either:

- focus on post-run tracking rather than pre-run decision support, or
- overwhelm users with advanced training complexity.

Runwise addresses the "what should I run today?" moment with a fast, explainable workflow.

## User Pain Points

- Decision fatigue before each run.
- Uncertainty about matching run type to available time.
- Difficulty adjusting plans for weather conditions.
- Too many settings and metrics in traditional running apps.
- Lack of confidence in whether today should be easy, steady, or harder.

## Target Users

### Primary

- Casual to intermediate runners (18-45) running 2-6 times per week.
- Goal-driven wellness users who care about consistency, not elite optimization.

### Secondary

- Returning runners rebuilding routine.
- Busy professionals who need quick, practical daily planning.

## Jobs To Be Done

- "When I have limited time, help me choose a sensible run quickly."
- "When weather is poor, help me adjust safely without overthinking."
- "When I want to run consistently, give me a recommendation I can trust."
- "When I liked a plan, let me save it for reuse."
- "When I want context, show my recent planning history in a lightweight way."

## Product Goals

- Reduce pre-run decision time to under 30 seconds for most sessions.
- Increase planning consistency through clear recommendations.
- Keep UX simple and consumer-friendly while still feeling premium.
- Provide transparent recommendation logic with no "black box" behavior.
- Build an MVP foundation that can evolve without architectural rewrite.

## Non-Goals

- Real-time run tracking (GPS, pace stream, maps).
- Social/community mechanics.
- Deep physiological analytics and coaching logic.
- Periodized training calendar management.
- Complex onboarding or credential-heavy auth flows.

## Core Use Cases

1. User opens app, enters planned distance/time/intensity/goal, receives recommendation.
2. User receives weather-aware suggestion (for heat/rain/wind) and adjusts expectations.
3. User saves a recommendation for future reuse.
4. User checks recent recommendation history.
5. User scans stat pills to stay oriented (recent planning activity).

## User Stories

- As a runner, I want to enter my available time so recommendations fit my day.
- As a runner, I want run intensity choices to be simple and understandable.
- As a runner, I want weather context included so I avoid unrealistic sessions.
- As a runner, I want an explanation so I understand why this run was suggested.
- As a runner, I want to save useful plans so I can reuse proven options.
- As a runner, I want history so I can avoid repeating unsuitable sessions.
- As a runner, I want the interface to feel calm and lightweight, not technical.

## MVP Scope

### In Scope

- Planner tab with form fields:
  - Target distance
  - Available time
  - Preferred intensity
  - Run goal
  - Country and location selectors
- Recommendation output card:
  - Recommendation title
  - Recommendation label
  - Explanation
  - Weather-aware note
- Saved Plans tab with card list
- History tab with list of recent recommendations
- Stat pills (lightweight summary)
- Weather API integration for recommendation adjustment
- Supabase persistence for recommendations and saved plans
- Responsive UI with subtle Framer Motion transitions

### Out of Scope

- Route or map generation
- GPS tracking, sensor sync, wearables
- Social feed, comments, likes
- Advanced trend analytics and coaching chat
- Training calendar generation

## Success Metrics (MVP)

### Product Metrics

- Recommendation completion rate: >= 80% of planner submissions return a recommendation.
- Time-to-recommendation (P50): <= 2.0 seconds from submit.
- Save action rate: >= 20% of generated recommendations saved.
- Repeat usage indicator: >= 35% of users generate 3+ recommendations in 14 days.

### UX Metrics

- Form abandonment rate: < 20%.
- Error rate (validation + API failures): < 5% of submissions.
- Weather fallback transparency: 100% of weather failures show explicit fallback note.

### Engineering Metrics

- Core page LCP (mobile target): <= 2.8s on production hosting baseline.
- Recommendation API error rate: < 1% server-side failures.

## Risks

- Weather dependency may reduce trust if data is stale or unavailable.
- Overly rigid rules could feel generic if not tuned.
- Lack of account model can limit cross-device continuity in MVP.
- Recommendation quality may be perceived as "too simple" without clear explanations.

## Mitigations

- Include clear weather fallback behavior and timestamped weather snapshot.
- Keep recommendation explanations specific to user inputs.
- Persist all generated recommendations for transparent history.
- Instrument recommendation outcomes to tune rule thresholds post-launch.

## Future Evolution

- Optional personalization profile (weekly volume preference, terrain preference).
- Smarter adaptation layer based on recent history (without turning into heavy analytics).
- Optional anonymous-to-account upgrade for cross-device continuity.
- Route suggestions as optional companion feature (explicitly separate from MVP).
- Training blocks and progressive goals as later modules.

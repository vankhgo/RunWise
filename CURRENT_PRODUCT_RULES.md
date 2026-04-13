# Runwise Current Product Rules (MVP)

## Purpose

This document defines the explicit product rules for Runwise MVP behavior. These rules are normative for implementation, QA, and content consistency.

## Rule Set A: Planner Input Rules

### Required Inputs

- `target_distance_km` (number)
- `available_time_min` (number)
- `preferred_intensity` (`easy` | `moderate` | `hard`)
- `run_goal` (`consistency` | `endurance` | `speed` | `recovery` | `stress_relief`)

### Required Location Inputs

- `location_country_code` (`MY` | `SG` | `ID` | `TH` | `AU` | `NZ`)
- `location_place_value` (must be a supported place for the selected country)

### Validation Rules

- `target_distance_km` must be between `1` and `30`.
- `available_time_min` must be between `15` and `180`.
- `preferred_intensity` must be one of the allowed enum values.
- `run_goal` must be one of the allowed enum values.
- `location_country_code` must be one of the supported country enums.
- `location_place_value` must match the selected `location_country_code`.

## Rule Set B: Default Values

When opening Planner for a first-time session:

- `target_distance_km = 5`
- `available_time_min = 45`
- `preferred_intensity = moderate`
- `run_goal = consistency`
- `location_country_code = MY`
- `location_place_value = kuching` (default place for `MY`)

When a user has previous submissions:

- Prefill from last submitted planner inputs.

## Rule Set C: Recommendation Engine Rules

MVP engine is deterministic and rule-based. No AI/LLM inference is used.

### Base Pace Assumptions

- `easy`: 7.2 min/km
- `moderate`: 6.1 min/km
- `hard`: 5.1 min/km

### Time Feasibility Rule

1. Estimate needed time: `target_distance_km * pace_by_intensity`.
2. If estimate exceeds available time by >10%, reduce suggested distance to fit available time.
3. Suggested distance must never fall below 1.5 km.

### Goal Modifier Rules

- `recovery`: force easy effort profile regardless of selected hard intensity.
- `speed`: prioritize shorter, quality-focused sessions (tempo-lite structure).
- `endurance`: prefer steady sustained effort near time limit.
- `consistency`: prioritize achievable, moderate session completion.
- `stress_relief`: bias toward easy continuous effort and lower pressure framing.

### Weather Modifier Rules

- Heat rule: if `temp_c >= 30`, reduce suggested distance by 20% and cap intensity to `moderate`.
- Rain rule: if `precip_mm >= 2` or condition indicates rain, downgrade one intensity level.
- Wind rule: if `wind_kph >= 25`, avoid high-intensity recommendation labels.
- Severe rule: if `temp_c >= 35` or storm condition, recommend short easy run or indoor alternative.

### Recommendation Types

- `easy_flow_run`
- `tempo_lite_session`
- `recovery_jog`
- `steady_endurance_run`
- `heat_adjusted_short_run`
- `weather_adjusted_easy_run`

## Rule Set D: Recommendation Output Expectations

Every successful recommendation must include:

- `title` (human-readable run suggestion)
- `label` (short intensity/structure badge)
- `explanation` (1-3 sentences tied to user inputs)
- `weather_note` (present even if weather unavailable)
- `suggested_distance_km`
- `suggested_duration_min`
- `recommended_intensity`

### Explanation Quality Rule

Explanation must explicitly reference at least two of:

- available time
- run goal
- intensity preference
- weather condition

## Rule Set E: Weather Note Rules

- If weather data is available, `weather_note` must include at least one concrete factor (temperature, rain, wind).
- If weather data is unavailable, show: `"Weather data unavailable. Recommendation is based on your inputs only."`
- Weather note must not block recommendation generation.

## Rule Set F: Saved Plan Rules

- A user can save only generated recommendations.
- Duplicate save of the same recommendation is prevented (`user_id + recommendation_id` unique).
- Saved plan may include optional `custom_name` and `notes`.
- Saved plans are listed newest first.

## Rule Set G: History Rules

- Every successful recommendation generation creates a history entry.
- History is derived from `recommendations` records ordered by `created_at DESC`.
- Default history view loads last 30 entries.

## Rule Set H: Required vs Optional Field Rules

- Recommendation can be generated with required fields only.
- Country and location are required planner fields in MVP.
- If an invalid country/place combination is provided, backend normalizes to a supported default.

## Rule Set I: MVP Simplification Rules

- No route generation logic.
- No GPS or live-tracking state.
- No wearable or health-device ingestion.
- No social graph or sharing feed.
- No calendar planning engine.
- No personalized ML model training.

## Rule Set J: Out-of-Scope Enforcement Rules

The UI and backend must reject or ignore implementation proposals that introduce:

- map/route builders,
- live activity tracking,
- coaching chatbot behaviors,
- advanced analytics dashboards,
- multi-week training periodization.

# Runwise Feature Specification (MVP)

## 1. Planner Form

### Description

Primary input form where users specify today’s running constraints and intent.

### User Goal

Enter key constraints quickly and get a relevant recommendation.

### Fields / Controls

- Target Distance (`number` input, km)
- Available Time (`number` input, minutes)
- Preferred Intensity (`select`: easy, moderate, hard)
- Run Goal (`select`: consistency, endurance, speed, recovery, stress relief)
- Country (`select`)
- Location (`select`, filtered by selected country)
- Submit CTA: `Get Recommendation`
- Secondary CTA: `Reset`

### Behavior

- Validate required fields inline before submission.
- Submit disabled while recommendation request is in-flight.
- On submit success, recommendation card is displayed in the planner result panel.
- Last successful inputs are persisted for quick repeat usage.

### Acceptance Criteria

- Required fields cannot be empty.
- Invalid range values show clear inline validation.
- Valid submission always triggers recommendation generation attempt.
- Loading state appears within 100ms of submit action.

### Edge Cases

- Very high distance with low time: recommendation auto-adjusts distance.
- Invalid country/place combinations are prevented in UI and normalized safely server-side.

## 2. Recommendation Result Card

### Description

Primary output panel and visual focal point of the product.

### User Goal

Understand exactly what run to do today and why.

### Fields / Output Elements

- Recommendation Title (for example: "Easy 5K Flow Run")
- Recommendation Label/Badge (for example: "Easy" or "Tempo-lite")
- Explanation text
- Suggested distance and duration
- Recommended intensity
- Save Plan action

### Behavior

- Appears after successful planner submission.
- Replaces prior recommendation in Planner context.
- Content changes are motion-animated subtly (fade/slide).

### Acceptance Criteria

- Card always contains title, label, explanation, and weather note.
- Output reflects current submission, not stale values.
- Save action confirms success and updates Saved Plans tab.

### Edge Cases

- If recommendation service fails, show retry state with retained form inputs.

## 3. Weather-Aware Note

### Description

Supporting note in recommendation card that explains weather impact.

### User Goal

Trust that today’s recommendation is context-aware and practical.

### Inputs / Dependencies

- Location from planner (if present)
- Weather snapshot from Weather API

### Behavior

- Adds weather context (heat/rain/wind) to recommendation framing.
- Falls back to neutral explanatory note when weather unavailable.

### Acceptance Criteria

- Weather note always renders.
- Weather-unavailable state uses explicit fallback copy.
- Weather note never blocks recommendation display.

### Edge Cases

- API timeout: show fallback note, still show recommendation.

## 4. Saved Plans

### Description

Card-based list of user-saved recommendations for reuse.

### User Goal

Keep useful run plans and quickly revisit them.

### Fields / Controls

- Saved plan cards with:
  - title
  - label
  - explanation snippet
  - created date
- Optional custom name / note
- Remove from saved action
- Reuse action (prefill planner)

### Behavior

- Save action in recommendation card persists selected recommendation.
- Duplicate saves are prevented.
- Cards shown newest first.

### Acceptance Criteria

- Saved plan appears immediately after save.
- Duplicate save returns non-blocking "already saved" state.
- Remove action updates UI and persistence.

### Edge Cases

- No saved items: show friendly empty state with CTA to Planner tab.

## 5. History

### Description

List-oriented record of recent generated recommendations.

### User Goal

Review recent planning decisions and avoid repetitive or unsuitable patterns.

### Fields / Controls

- History list rows with:
  - timestamp
  - recommendation title
  - key input summary (distance/time/intensity/goal)
  - weather summary tag
- Optional quick action: `Use Again`

### Behavior

- Every successful recommendation generation creates a history entry.
- List sorted descending by timestamp.

### Acceptance Criteria

- History tab displays persisted recommendations.
- Each row is traceable to a recommendation record.
- Empty history has dedicated no-data state.

### Edge Cases

- Large history: paginate or load in chunks after first 30 rows.

## 6. Stat Pills / Lightweight Summary Layer

### Description

Compact metrics row supporting orientation without creating dashboard complexity.

### User Goal

Get quick context on planning momentum.

### Stat Set (MVP)

- Plans in last 7 days
- Saved plans count
- Most-used intensity (last 14 days)

### Behavior

- Values update after relevant actions (recommendation generated, plan saved).
- Stat pills remain secondary to recommendation card.

### Acceptance Criteria

- Stat values are accurate against persisted data.
- Stat layer remains visually lightweight.

### Edge Cases

- No data yet: show zero-state values (`0`, `-`, or "N/A").

## 7. Location Selection

### Description

Country + place selection used for weather-aware recommendations.

### User Goal

Get weather-aware recommendations for current or intended run area.

### Controls

- Country select (supported countries only)
- Location select (options update based on selected country)

### Behavior

- Country and location are required planner inputs.
- Selecting a country updates location options and picks a valid default place.

### Acceptance Criteria

- Recommendation generation requires a valid country/place combination.
- Changing country keeps location selection valid without user confusion.

## 8. Recommendation Explanation

### Description

Human-readable rationale tied to submitted inputs and conditions.

### User Goal

Understand why this recommendation makes sense today.

### Behavior

- Explanation references input constraints and run goal.
- Weather impact is either embedded or reflected in adjacent weather note.

### Acceptance Criteria

- Explanation is specific (not generic template-only filler).
- At least two user input dimensions are mentioned.

## 9. Tabs / Navigation (Planner, Saved, History)

### Description

Top-level app navigation across three primary contexts.

### User Goal

Move between plan creation, saved plans, and recent history without friction.

### Controls

- Segmented tabs or tablist component:
  - Planner
  - Saved Plans
  - History

### Behavior

- Planner is default tab on load.
- Tab changes preserve content state when practical.
- Tab transitions are subtle and fast.

### Acceptance Criteria

- Keyboard and pointer navigation both supported.
- Active tab is clearly visible.
- Mobile layout preserves clear tab affordance.

## 10. Global UI States (Cross-Feature)

### Loading States

- Planner submit loading
- Recommendation card skeleton
- Saved and history list loading placeholders

### Empty States

- No recommendation yet (Planner default)
- No saved plans
- No history entries

### Error/Fallback States

- Recommendation service failure
- Weather unavailable fallback note
- Persistence failure messaging with retry guidance

# Runwise Screen Inventory

## 1. Home / Planner (Default)

### Purpose

Allow users to input run constraints and generate today’s recommendation.

### Key Components

- Header / hero area
- Tab navigation (Planner active)
- Planner form
- Primary CTA (`Get Recommendation`)
- Recommendation result card container
- Stat pills row

### Main Actions

- Submit planner form
- Reset planner fields
- Save generated recommendation
- Switch to Saved Plans or History tabs

### Notes

- This is the primary user journey and must remain fast and uncluttered.

## 2. Recommendation-Focused Main State

### Purpose

Present a clear, trustworthy run recommendation after form submission.

### Key Components

- Recommendation title
- Recommendation label badge
- Explanation block
- Weather-aware note block
- Suggested distance/time/intensity metadata
- Save action

### Main Actions

- Save recommendation
- Generate a new recommendation

### Notes

- Recommendation panel is the visual focal point of the experience.

## 3. Saved Plans Tab

### Purpose

Show user-saved recommendations for quick reuse.

### Key Components

- Tab navigation (Saved active)
- Saved plan card list
- Card metadata (title, label, date)
- Optional note/custom name display
- Reuse and remove actions

### Main Actions

- Reuse saved plan (prefill Planner)
- Remove saved plan
- Navigate back to Planner

### Notes

- Card-based layout supports fast scan and recognition.

## 4. History Tab

### Purpose

Provide chronological view of recent recommendations.

### Key Components

- Tab navigation (History active)
- History list rows
- Timestamp
- Input summary (distance/time/intensity/goal)
- Weather summary tag
- Optional `Use Again` action

### Main Actions

- Review recent recommendation context
- Reuse historical recommendation inputs

### Notes

- Keep list lightweight and non-analytical.

## 5. Empty State: No Recommendation Yet

### Purpose

Guide first-time users to submit planner inputs.

### Key Components

- Placeholder card area
- Short onboarding copy
- Primary CTA emphasis

### Main Actions

- Fill planner and submit

### Notes

- Should reduce intimidation and encourage first action.

## 6. Empty State: No Saved Plans

### Purpose

Explain saved tab purpose and redirect to planner flow.

### Key Components

- Empty illustration/icon
- Brief explanation
- CTA: `Create and save your first plan`

### Main Actions

- Jump to Planner tab

### Notes

- Keep tone supportive, not warning-oriented.

## 7. Empty State: No History

### Purpose

Clarify that history appears after generating recommendations.

### Key Components

- Empty list placeholder
- Informative text
- CTA: `Generate your first recommendation`

### Main Actions

- Navigate to Planner tab

### Notes

- Reinforces product loop.

## 8. Loading State: Recommendation In Progress

### Purpose

Provide immediate feedback after planner submission.

### Key Components

- Disabled submit button with spinner/text
- Recommendation skeleton card

### Main Actions

- Wait (no additional required action)

### Notes

- Should feel quick and stable, no layout shifts.

## 9. Loading State: Saved/History Fetch

### Purpose

Communicate data retrieval for tab content.

### Key Components

- Skeleton rows/cards
- Persistent tab context

### Main Actions

- Wait

### Notes

- Avoid blank white states while loading.

## 10. Weather-Unavailable State

### Purpose

Maintain trust when weather data cannot be retrieved.

### Key Components

- Recommendation still present
- Explicit fallback weather note

### Main Actions

- Proceed with recommendation
- Optionally retry with location update

### Notes

- This is a degraded success state, not a hard error state.

## 11. Error State: Recommendation Request Failed

### Purpose

Handle non-weather recommendation generation failures.

### Key Components

- Inline error message
- Retry CTA
- Retained form inputs

### Main Actions

- Retry submission

### Notes

- Keep errors actionable and concise.

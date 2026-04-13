# Runwise Backend Handoff

## Domain Overview

Runwise backend supports a recommendation-first planning workflow:

1. Receive planner input.
2. Resolve weather context.
3. Run deterministic recommendation rules.
4. Persist generated recommendation.
5. Persist user save actions.
6. Return data for Planner, Saved, and History views.

This is a lightweight product backend, not a telemetry or GPS backend.

## Backend Responsibilities

- Validate planner payload on server.
- Fetch and normalize weather snapshot.
- Apply rule-based recommendation engine.
- Persist recommendation records.
- Handle save/unsave plan operations.
- Return history and saved plan lists.
- Return summary counts for stat pills.

## Supabase Responsibilities

- Store canonical recommendation records.
- Store saved plan entries.
- Enforce basic data constraints and indexes.
- Support read patterns for Saved and History tabs.
- Optionally enforce RLS via anonymous session `user_id`.

## Required Tables

- `recommendations`
- `saved_plans`

History is derived from `recommendations` in MVP and does not require a separate table.

## Relationships

- `saved_plans.recommendation_id -> recommendations.id` (many saved entries to one recommendation record by ownership scope).
- `recommendations.user_id` and `saved_plans.user_id` must align for save operations.

## Expected Write Flows

### Flow 1: Generate Recommendation

1. Receive planner input.
2. Validate input.
3. Resolve weather data (or fallback unavailable state).
4. Generate recommendation output.
5. Insert row into `recommendations`.
6. Return recommendation payload.

### Flow 2: Save Recommendation

1. Receive `recommendation_id` and optional `custom_name` / `notes`.
2. Validate recommendation exists for current user.
3. Insert into `saved_plans` if not already existing.
4. Return updated saved plan list or success status.

### Flow 3: Unsave Recommendation

1. Receive `saved_plan_id`.
2. Validate ownership.
3. Soft delete (archive) or hard delete based on product decision (MVP: hard delete).
4. Return success status.

## Expected Read Flows

### Planner Tab

- Last planner defaults (optional from latest recommendation input snapshot).
- Latest recommendation (optional).
- Stat pills summary.

### Saved Plans Tab

- Query `saved_plans` joined with recommendation snapshot data.
- Sort by `created_at DESC`.

### History Tab

- Query `recommendations` sorted by `created_at DESC`, limit 30.

## Validation Responsibilities

### Backend Validates

- Required planner fields and value ranges.
- Enum values for intensity and goal.
- Save operations only for owned recommendation rows.
- Duplicate save prevention.

### Frontend Validates

- Early field validation for UX.
- Basic type/shape validation before request submission.

Backend remains source of truth for all enforcement.

## Seed / Demo Data Recommendations

Provide 12-20 seeded recommendation records with mixed:

- intensity levels
- run goals
- weather contexts
- saved vs unsaved states

Include examples like:

- Easy 5K Flow Run
- 30-minute Tempo-lite Session
- Heat-aware Short Run
- Recovery Jog

This ensures the portfolio/demo environment has realistic screens immediately.

## Backend Priorities (Build Order)

1. Recommendation generation endpoint with weather fallback.
2. `recommendations` persistence + history query.
3. `saved_plans` insert/query/delete.
4. Stats aggregation query.
5. Reliability improvements (retry, timeout handling, logs).

## Operational Notes

- Weather API errors must never block recommendation response.
- Recommendation engine should be pure and testable (function-level tests).
- Keep write operations idempotent where practical (especially save action).

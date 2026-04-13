# Runwise Frontend Scaffold Plan

## Objectives

- Build a clean implementation skeleton aligned with the existing mockup direction.
- Keep clear feature boundaries so planner, recommendation, saved, and history evolve independently.
- Enable fast MVP delivery without architectural rework.

## Recommended Next.js Route Structure

```txt
src/app/
  layout.tsx
  page.tsx                  # main Runwise experience (Planner/Saved/History tabs)
  api/
    recommendations/route.ts
    weather/route.ts
```

MVP keeps all primary UX in `/` for minimal navigation overhead and strong recommendation-first flow.

## Component Organization

```txt
src/components/runwise/
  AppShell.tsx
  TopTabs.tsx
  RecommendationCard.tsx
  WeatherNote.tsx
  StatPills.tsx
  PlannerForm.tsx
  SavedPlanCard.tsx
  HistoryItem.tsx
  states/
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx
```

Use `src/components/ui/*` for shadcn primitives and build feature-specific composition in `components/runwise`.

## Feature Boundaries

```txt
src/features/planner/
src/features/recommendation/
src/features/saved-plans/
src/features/history/
src/features/stats/
```

Each feature owns:

- types
- schemas
- service functions
- view-model hooks
- unit tests

## Shared UI Components

- `TopTabs`
- `RecommendationCard`
- `WeatherNote`
- `StatPills`
- `RunMetaRow` (distance/time/intensity summary)
- `SectionCard`

Shared components must be presentation-focused and domain-agnostic where possible.

## Motion Component Guidance

Create focused wrappers in `src/components/runwise/motion/`:

- `FadeInCard`
- `TabContentTransition`
- `StaggerGroup`

Rules:

- Only apply motion wrappers at section boundaries.
- Keep animation configs centralized to prevent inconsistent timing.

## Service Layer Recommendations

```txt
src/lib/services/
  recommendationService.ts
  weatherService.ts
  savedPlansService.ts
  historyService.ts
  statsService.ts
```

Service layer responsibilities:

- API calls
- response normalization
- domain-safe return types
- no UI logic

## Hooks Organization

```txt
src/features/planner/hooks/usePlannerForm.ts
src/features/recommendation/hooks/useRecommendation.ts
src/features/saved-plans/hooks/useSavedPlans.ts
src/features/history/hooks/useHistory.ts
src/features/stats/hooks/useStats.ts
```

Hooks should expose minimal state contracts to keep components simple.

## Form and Schema Files

```txt
src/features/planner/schemas/plannerSchema.ts
src/features/planner/types/planner.types.ts
src/features/recommendation/types/recommendation.types.ts
src/types/weather.types.ts
```

- `plannerSchema.ts` is the single validation source for planner inputs.
- Shared domain enums should be imported, not duplicated.

## Page Implementation Sequence

1. Build app shell and tab structure in `page.tsx`.
2. Implement Planner form UI with static local recommendation preview.
3. Add rule-based recommendation service wiring.
4. Integrate weather service + weather note fallback.
5. Add save action and Saved Plans tab wiring.
6. Add History tab wiring from recommendations table.
7. Add stat pills aggregation and refresh logic.
8. Apply final motion and responsive polishing.

## Scaffold Guardrails

- Keep business rules out of JSX files.
- Keep schema and domain constants centralized.
- Prefer composition over deeply nested page components.
- Do not introduce route sprawl for MVP.

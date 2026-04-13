# Runwise Technical Specification

## Architecture Overview

Runwise uses a Next.js App Router architecture with a recommendation-first UI and a lightweight backend integration model:

- Frontend renders Planner/Saved/History experiences.
- Recommendation generation runs in server-side domain logic (deterministic rules).
- Supabase stores recommendation history and saved plans.
- Weather API enriches recommendation generation with current conditions.

Data flow is request-driven, not stream-driven. No real-time tracking pipeline is required for MVP.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- React Hook Form + Zod

## Rationale for Stack Choices

- Next.js App Router: clear separation of server/client responsibilities, ergonomic route handling.
- TypeScript: safer domain logic and API contracts.
- Tailwind + shadcn/ui: fast, consistent component styling for consumer-grade UI.
- Framer Motion: subtle, high-quality transitions without heavy animation overhead.
- Supabase: low-friction persistence and managed Postgres for MVP.
- RHF + Zod: predictable validation and form ergonomics.

## Next.js App Structure

- Use `src/app` for routes and layout.
- Keep planner interaction page-centric under a single main route for MVP (`/`).
- Implement API handlers under `src/app/api/*` for weather proxying and explicit backend boundaries where needed.
- Keep recommendation domain logic in `src/features/recommendation/domain` rather than route files.

## shadcn/ui Usage

- Use shadcn primitives for `Button`, `Input`, `Select`, `Tabs`, `Card`, `Badge`, `Skeleton`, `Toast`.
- Extend with Runwise variants through class composition, not ad-hoc inline styles.
- Keep component contracts narrow and predictable.

## Tailwind Role

- Primary styling layer for spacing, layout, responsive behavior, and utility composition.
- Theme tokens declared in CSS variables and consumed via Tailwind classes.
- Avoid one-off style drift; compose with reusable class recipes where repeated.

## Framer Motion Usage Strategy

Use motion for state clarity, not decoration:

- Recommendation card entrance after submit.
- Tab content transitions (Planner/Saved/History).
- Staggered stat pill reveal on initial load.
- Reduced-motion fallback using `prefers-reduced-motion`.

Target durations:

- Micro interactions: 120-180ms
- Content transitions: 180-260ms

## Supabase Integration Strategy

- Persist recommendations and saved plans in Postgres.
- Use Supabase client helpers already present in `src/lib/supabase`.
- Use anonymous session or equivalent MVP session strategy for user scoping.
- Enforce row ownership with RLS when user identity is available.

## Weather API Integration Strategy

- Isolate provider logic behind weather service adapter.
- Fetch current weather at recommendation request time.
- Normalize response into internal `WeatherSnapshot` model.
- Cache responses briefly (for example 15 minutes) by location key.

## Recommended Folder Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    api/
      weather/route.ts
      recommendations/route.ts
  features/
    planner/
      components/
      schemas/
      hooks/
      types/
    recommendation/
      components/
      domain/
      services/
      types/
    saved-plans/
      components/
      services/
      hooks/
    history/
      components/
      services/
      hooks/
    stats/
      components/
      services/
  components/
    runwise/
      tabs/
      cards/
      pills/
    ui/   (shadcn generated + variants)
  lib/
    supabase/
    weather/
    utils/
  types/
    api.ts
    domain.ts
```

## Domain Models

```ts
export type PlannerInput = {
  targetDistanceKm: number;
  availableTimeMin: number;
  preferredIntensity: "easy" | "moderate" | "hard";
  runGoal: "consistency" | "endurance" | "speed" | "recovery" | "stress_relief";
  locationCountryCode: "MY" | "SG" | "ID" | "TH" | "AU" | "NZ";
  locationPlaceValue: string;
};

export type WeatherSnapshot = {
  status: "ok" | "unavailable";
  tempC?: number;
  precipMm?: number;
  windKph?: number;
  condition?: string;
  source?: string;
  observedAt?: string;
};

export type RecommendationOutput = {
  type:
    | "easy_flow_run"
    | "tempo_lite_session"
    | "recovery_jog"
    | "steady_endurance_run"
    | "heat_adjusted_short_run"
    | "weather_adjusted_easy_run";
  title: string;
  label: string;
  explanation: string;
  weatherNote: string;
  suggestedDistanceKm: number;
  suggestedDurationMin: number;
  recommendedIntensity: "easy" | "moderate" | "hard";
};
```

## State Management Approach

- Use local UI state for tab, loading, and transient interaction state.
- Use RHF form state for planner inputs.
- Use server-driven reads for Saved/History data.
- Avoid global client state library in MVP unless proven necessary.

## Form Handling (React Hook Form)

- One planner form instance at root of Planner tab.
- Controlled shadcn inputs/selects via RHF `Controller` where needed.
- Persist last successful planner payload locally for convenience.

## Validation Strategy (Zod)

- Shared Zod schema for planner input.
- Client-side pre-submit validation + server-side validation re-check.
- Normalize values (trim, parse numbers, clamp ranges) before domain execution.

## Data Fetching Approach

- Recommendation generation: server action or API route mutation.
- Saved/History listing: server component fetch on load + client refresh on mutation.
- Weather fetch: server-side only through adapter/proxy to avoid exposing provider implementation details.

## Environment Variables

Minimum:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only tasks)
- `WEATHER_PROVIDER` (default `open-meteo`)
- `WEATHER_CACHE_TTL_MIN` (default `15`)
- `DEFAULT_LOCATION_LAT`
- `DEFAULT_LOCATION_LON`

Optional:

- `WEATHER_API_KEY` (for providers that require keys)

## Error Handling Strategy

- Validation errors: inline field feedback.
- Recommendation generation error: non-blocking alert + retry CTA.
- Weather failure: fallback weather note, no hard failure.
- Supabase write failure: toast + safe retry path.

## Responsiveness Guidance

- Mobile-first single-column layout for planner and recommendation card.
- Desktop: recommendation card remains focal in upper fold.
- Tabs stay touch-friendly with minimum 44px target height.
- Stat pills wrap gracefully across breakpoints.

## Future Extensibility

- Recommendation engine should be interface-driven to support future strategy variants.
- Weather adapter should allow provider swapping without UI changes.
- Data model should support optional user profile extensions without table redesign.
- Keep feature modules isolated to avoid cross-feature coupling.

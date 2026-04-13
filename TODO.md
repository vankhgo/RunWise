# Runwise MVP TODO Checklist

## Setup

- [ ] Install required dependencies (`framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`)
- [ ] Verify Next.js App Router baseline and Tailwind/shadcn setup
- [ ] Configure `.env.local` for Supabase and weather settings
- [ ] Confirm Supabase project connectivity from server and client

## App Shell

- [ ] Build main page shell with hero/recommendation-first layout
- [ ] Implement top tab navigation (Planner, Saved Plans, History)
- [ ] Add shared section card and spacing system
- [ ] Add global loading/empty/error state components

## Planner Feature

- [ ] Create planner schema (`plannerSchema.ts`) with Zod
- [ ] Build Planner form UI with shadcn inputs/selects
- [ ] Wire React Hook Form integration
- [ ] Add validation messaging and field constraints
- [ ] Persist last successful planner inputs locally

## Recommendation Logic

- [ ] Implement deterministic recommendation engine module
- [ ] Add goal modifiers (consistency/endurance/speed/recovery/stress relief)
- [ ] Add time feasibility adjustment rule
- [ ] Return standardized recommendation payload (title/label/explanation/weather note)
- [ ] Add unit tests for recommendation rule branches

## Weather Integration

- [ ] Implement weather service adapter (Open-Meteo MVP)
- [ ] Add geocoding + current weather normalization
- [ ] Apply weather modifiers in recommendation engine
- [ ] Implement fallback note when weather is unavailable
- [ ] Add short-lived weather cache (15 min)

## Saved Plans

- [ ] Create save recommendation action
- [ ] Build saved plans card list UI
- [ ] Implement duplicate-save prevention UX
- [ ] Implement remove saved plan action
- [ ] Add reuse action to prefill planner

## History

- [ ] Persist every successful recommendation to `recommendations`
- [ ] Build history list UI (newest first)
- [ ] Include compact input/weather summary per entry
- [ ] Add no-history empty state
- [ ] Add `Use Again` history action

## UI Polish

- [ ] Refine recommendation card visual prominence
- [ ] Apply stat pills design and hierarchy
- [ ] Ensure spacing/radius consistency across tabs
- [ ] Add responsive adjustments for small screens
- [ ] Final copy pass for recommendation and weather tone

## Motion

- [ ] Add recommendation card entrance transition
- [ ] Add tab content transitions
- [ ] Add subtle stat pill stagger animation
- [ ] Implement `prefers-reduced-motion` fallback
- [ ] Validate no disruptive layout shifts from motion

## Supabase Setup

- [ ] Create `recommendations` table
- [ ] Create `saved_plans` table
- [ ] Add indexes and updated-at triggers
- [ ] Configure RLS policies for user-owned rows
- [ ] Seed demo data for portfolio-ready states

## Testing

- [ ] Unit test planner schema validation
- [ ] Unit test recommendation engine outputs for key scenarios
- [ ] Integration test recommendation generation flow
- [ ] Integration test save/remove/history flows
- [ ] Manual mobile + desktop QA pass

## Portfolio Readiness

- [ ] Populate realistic demo recommendations and saves
- [ ] Capture clean screenshots (Planner, Saved, History)
- [ ] Verify empty/loading/error/weather-unavailable states
- [ ] Write short architecture summary in README
- [ ] Run final consistency check against docs and implementation

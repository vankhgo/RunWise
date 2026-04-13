# Runwise MVP Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working, polished, recommendation-first Runwise MVP with planner, rule-based recommendations, weather-aware notes, saved plans, history, stats, subtle motion, and Supabase-ready persistence.

**Architecture:** Implement a modular App Router frontend with feature folders, API route-backed recommendation/weather logic, and a client persistence adapter that uses Supabase when available (fallback to local storage when blocked). Keep business rules centralized and deterministic. Keep UI recommendation-first.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, Framer Motion, React Hook Form, Zod, Supabase.

---

## Chunk 1: Foundation and Shell

### Task 1: Dependencies and scripts

**Files:**
- Modify: `package.json`

- [ ] Add dependencies: `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Add script: `typecheck`
- [ ] Install and lock dependencies
- [ ] Run `npm run lint` and `npm run typecheck`

### Task 2: Shared domain and UI primitives

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/components/ui/{input.tsx,label.tsx,select.tsx,textarea.tsx,card.tsx,badge.tsx,skeleton.tsx}`

- [ ] Define canonical domain types/enums shared across features
- [ ] Add shadcn-style UI wrappers and ensure class consistency
- [ ] Validate imports compile

### Task 3: App shell and design foundation

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Replace: `src/app/page.tsx`
- Create: `src/components/runwise/*`

- [ ] Build recommendation-first shell with tabs (Planner/Saved/History)
- [ ] Create focal recommendation panel, stat pills, empty states
- [ ] Add motion primitives and reduced-motion-safe defaults
- [ ] Run lint/typecheck/build

## Chunk 2: Planner + Rules + Weather

### Task 4: Planner schema and form

**Files:**
- Create: `src/features/planner/schemas/plannerSchema.ts`
- Create: `src/features/planner/hooks/usePlannerForm.ts`
- Create: `src/features/planner/components/PlannerForm.tsx`

- [ ] Implement RHF + Zod with required defaults/ranges
- [ ] Add field-level validation and submit UX states
- [ ] Verify required/optional behavior matches product rules

### Task 5: Recommendation engine

**Files:**
- Create: `src/features/recommendation/domain/recommendation-engine.ts`
- Create: `src/features/recommendation/types.ts`

- [ ] Implement deterministic rules from CURRENT_PRODUCT_RULES.md
- [ ] Generate title, label, explanation, weather note, suggested distance/time/intensity
- [ ] Add basic unit-like validation helper tests (if no test runner, use deterministic assertions in dev check script-free)

### Task 6: Weather adapter and API routes

**Files:**
- Create: `src/lib/weather/openMeteo.ts`
- Create: `src/app/api/weather/route.ts`
- Create: `src/app/api/recommendations/route.ts`

- [ ] Implement geocode + current weather normalization
- [ ] Add timeout/fallback behavior
- [ ] POST recommendations route validates request, fetches weather, applies rules, returns payload
- [ ] Verify fallback path does not block recommendation

## Chunk 3: Persistence + Saved + History + Polish

### Task 7: Persistence adapter (Supabase first, local fallback)

**Files:**
- Create: `src/lib/persistence/{types.ts,local-repo.ts,supabase-repo.ts,index.ts}`
- Create: `src/lib/session/anonymous.ts`

- [ ] Implement repository contract for recommendation history/saved plans/stats
- [ ] Use Supabase when env + anonymous session available
- [ ] Fallback to localStorage seamlessly when unavailable

### Task 8: Saved plans and history UI wiring

**Files:**
- Create/Modify: `src/features/saved-plans/*`
- Create/Modify: `src/features/history/*`
- Modify: `src/app/page.tsx`

- [ ] Save recommendation action
- [ ] Saved plans card list and empty state
- [ ] History list and empty state (last 30)
- [ ] Reuse action prefills planner inputs

### Task 9: Stat pills, polish, accessibility

**Files:**
- Modify: `src/components/runwise/*`
- Modify: `src/app/globals.css`

- [ ] Stat pills wired to live repository stats
- [ ] Loading/error/empty state polishing
- [ ] Keyboard and ARIA checks for tabs/forms/actions
- [ ] Mobile responsiveness and subtle Framer Motion pass

### Task 10: Verification and hardening

**Files:**
- Modify: `README.md` (implementation notes if needed)

- [ ] Run: `npm run lint`
- [ ] Run: `npm run typecheck`
- [ ] Run: `npm run build`
- [ ] Functional sanity checklist for planner/recommendation/weather/saved/history/tabs
- [ ] Fix all identified critical issues and rerun checks


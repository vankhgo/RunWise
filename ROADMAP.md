# Runwise Roadmap

## Phase 0: Planning and Alignment

### Goals

- Lock product scope for recommendation-first MVP.
- Align product, UX, and engineering on a single source of truth.

### Deliverables

- PRD and feature spec approved.
- Product rules approved.
- Baseline data model and weather integration plan approved.

### Included

- Documentation foundation.
- Recommendation rule framework definition.
- MVP boundaries and non-goals.

### Deferred

- Any implementation beyond scaffolding.

### Dependencies

- Existing mockup direction and IA.
- Stakeholder sign-off on scope.

### Exit Criteria

- All core docs reviewed and internally consistent.
- Build sequence and owner handoff plan defined.

## Phase 1: Design Foundation and App Shell

### Goals

- Establish the UI shell and visual language from the mockup direction.
- Set up base architecture and shared components.

### Deliverables

- App shell with hero area and Planner/Saved/History tabs.
- Base card layout, stat pills, and form control styles.
- Motion primitives and responsive breakpoints.

### Included

- Next.js route layout.
- shadcn/ui base components and tokens.
- Framer Motion micro-interaction primitives.

### Deferred

- Final recommendation logic tuning.
- Production observability.

### Dependencies

- Tailwind + shadcn setup.
- Design system definitions.

### Exit Criteria

- Shell is responsive and visually aligned with mockup.
- Navigation between Planner/Saved/History is working.

## Phase 2: Planner + Recommendation MVP

### Goals

- Deliver core planning and recommendation workflow end-to-end.

### Deliverables

- Planner form with validation.
- Rule-based recommendation engine.
- Recommendation card with label, explanation, and weather note placeholder.

### Included

- Form submission flow.
- Recommendation output rendering.
- Input/output domain model wiring.

### Deferred

- Advanced personalization.
- Recommendation experimentation framework.

### Dependencies

- Feature spec and product rules.
- RHF + Zod integration.

### Exit Criteria

- User can generate recommendation successfully from valid inputs.
- Explanations and labels render consistently.

## Phase 3: Saved/History + Weather Integration

### Goals

- Add persistence and weather-aware adjustments.

### Deliverables

- Supabase tables and policies.
- Save recommendation flow.
- History list with recent recommendation entries.
- Weather API adapter and fallback handling.

### Included

- Recommendations persistence.
- Saved plans persistence.
- Weather-based rule adjustment and note generation.

### Deferred

- Multi-provider weather failover.
- Cross-device account migration UX.

### Dependencies

- Supabase project configured.
- Weather provider selected.

### Exit Criteria

- Saved and history tabs show real persisted data.
- Weather-unavailable fallback behaves gracefully.

## Phase 4: Polish and Portfolio Hardening

### Goals

- Improve trust, quality, and presentation readiness.

### Deliverables

- Loading, empty, and error states polished.
- Accessibility checks and motion reduction support.
- Basic analytics events and smoke tests.
- Copy refinement for recommendation trust.

### Included

- UI consistency pass.
- Performance pass.
- Portfolio-level demo data and screenshots.

### Deferred

- Major new feature additions.

### Dependencies

- Core MVP complete.
- Stable schema and APIs.

### Exit Criteria

- MVP feels production-like for demo and evaluation.
- Core journey tested across desktop and mobile.

## Phase 5: Future Expansion

### Goals

- Add optional depth while preserving lightweight product identity.

### Potential Deliverables

- Personal preferences profile.
- Weekly plan suggestions.
- Optional route suggestions module.
- Enhanced recommendation tuning from behavior data.

### Included

- Features that improve recommendation relevance.

### Deferred

- Enterprise/team use cases.
- Full training analytics platform.

### Dependencies

- MVP usage signals.
- Product validation from real users.

### Exit Criteria

- Each expansion maps to validated user demand.
- Complexity remains bounded and aligned with product promise.

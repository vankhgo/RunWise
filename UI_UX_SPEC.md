# Runwise UI/UX Specification

## Product Feel

Runwise should feel:

- clean
- modern
- rounded
- premium but calm
- slightly sporty without aggressive performance culture

It should not feel like an admin dashboard, operations panel, or metrics-heavy training tool.

## Interaction Goals

- Help users get from "not sure what to run" to "clear plan" quickly.
- Keep cognitive load low at every step.
- Make recommendation trust explicit through explanation and weather context.
- Keep navigation shallow (Planner, Saved, History only).

## Layout Model

- Single main consumer-facing page shell.
- Hero/recommendation section near top, visually dominant.
- Tabbed content areas for Planner, Saved Plans, History.
- Rounded card surfaces with clear spacing rhythm.

## Hierarchy Principles

1. Recommendation card is primary focal point.
2. Planner form is primary interaction source.
3. Weather note and explanation are trust-building secondary layers.
4. Stat pills are tertiary contextual support.

## Content Priorities

### Planner Tab

- Inputs first
- Primary CTA: `Get Recommendation`
- Recommendation card immediately below/adjacent depending on viewport

### Saved Plans Tab

- Saved cards first
- Reuse and remove actions visible but lightweight

### History Tab

- Chronological list focused on recent planning actions
- Inputs summary and weather summary visible per row

## Screen Flow

1. Open app -> Planner tab active.
2. Fill/adjust planner inputs.
3. Submit -> loading transition.
4. Recommendation card appears with explanation + weather note.
5. Optional save action.
6. User checks Saved or History via tabs.
7. User returns to Planner with minimal friction.

## Recommendation Card as Focal Point

The recommendation card must:

- occupy prominent visual space above the fold where possible,
- include strong title and concise label,
- provide explanation that references user constraints,
- include weather-aware note as supporting confidence signal,
- clearly offer save action.

## Form Structure

Form order:

1. Target distance
2. Available time
3. Preferred intensity
4. Run goal
5. Optional location
6. Primary CTA

Rationale: starts with concrete constraints, then effort intent, then context.

## Saved/History UX

### Saved Plans

- Card-based for scanability.
- Emphasize recognizability of plan title/label.
- Keep actions minimal (`Use Again`, `Remove`).

### History

- List-based for chronological readability.
- Prioritize timestamp + recommendation title + compact input summary.
- Keep each item lightweight to avoid dashboard feel.

## Weather Note Presentation

- Present as a compact supportive block in recommendation card.
- Use icon + muted accent styling.
- Keep language practical (for example: hydration, pace adjustment, caution).
- If weather unavailable, use explicit neutral fallback message.

## Motion Principles

- Subtle, purposeful, calm.
- Use motion to communicate state changes, not to decorate static UI.
- Animate recommendation appearance and tab content transitions.
- Respect reduced-motion preferences.

## Mobile Responsiveness

- Mobile-first single-column layout.
- Inputs and CTA must be thumb-friendly.
- Recommendation card appears quickly after submit without disorienting jumps.
- Tabs remain easy to tap and visually distinct.

## Accessibility Considerations

- Semantic tablist and form labels.
- Clear focus states for all interactive elements.
- Contrast-compliant text and badge variants.
- `aria-live` or equivalent for recommendation update announcement.
- Motion reduction support for users preferring minimal animation.

## Tone and Microcopy

- Supportive and practical.
- No military/performance-jargon tone.
- Recommendation language should feel confident but not absolute.
- Weather notes should guide adjustments, not alarm users.

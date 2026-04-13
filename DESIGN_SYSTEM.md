# Runwise Design System Specification

## Design Intent

Runwise visual language should communicate calm confidence and everyday athletic utility. The experience should feel premium and modern without becoming intense, technical, or gamified.

## Color Direction

### Core Palette

- Background: `#F5F7FA`
- Surface: `#FFFFFF`
- Surface Subtle: `#EEF2F7`
- Text Primary: `#0F172A`
- Text Secondary: `#475569`
- Border: `#E2E8F0`

### Brand / Action Palette

- Primary: `#0F766E` (teal, calm sporty anchor)
- Primary Hover: `#115E59`
- Primary Soft: `#CCFBF1`
- Accent: `#0EA5E9` (sky accent for highlights)

### Feedback Colors

- Success: `#16A34A`
- Warning: `#D97706`
- Error: `#DC2626`

### Gradient Guidance

Use restrained background gradients only on hero/recommendation zones, for example:

- `linear-gradient(135deg, #F8FBFF 0%, #ECFDF5 100%)`

## Typography

- Primary UI font: `Geist Sans` (or `Manrope` if design refresh requires)
- Optional heading accent: `Sora` for key display titles
- Mono (rare): `Geist Mono`

Type scale:

- Display: 36/44
- H1: 30/38
- H2: 24/32
- H3: 20/28
- Body: 16/24
- Small: 14/20
- Caption: 12/16

## Spacing System

Base spacing unit: `4px`

Common steps:

- `4, 8, 12, 16, 20, 24, 32, 40, 48`

Layout rhythm:

- Section gaps: 24-32px
- Card internal padding: 20-24px
- Form field vertical gap: 14-16px

## Radius System

Rounded aesthetic is core to Runwise.

- Inputs: 12px
- Buttons: 12-14px
- Standard cards: 20px
- Hero/recommendation card: 24-28px
- Pills/badges: full or 999px where appropriate

## Elevation / Shadows

- Base card: subtle shadow (`0 1px 2px rgba(15,23,42,0.05)`)
- Focal card: medium soft shadow (`0 8px 24px rgba(15,23,42,0.08)`)
- Hover (desktop only): slightly increased softness, no harsh contrast

## Card Usage

- Cards are primary surface pattern.
- Keep card count visually balanced to avoid clutter.
- Recommendation card gets strongest visual weight.
- Saved plans use medium-emphasis cards.
- History uses list rows with lighter surfaces.

## Button Hierarchy

- Primary button: recommendation action, solid teal.
- Secondary button: outline or soft surface.
- Tertiary text action: low-emphasis actions (for example remove).

States:

- default
- hover
- focus-visible
- disabled
- loading

## Form Control Styling

- shadcn input/select as baseline.
- 12px radius and calm border contrast.
- Clear focus ring color derived from primary.
- Error state uses red border + helper text.

## Badge Styling

- Recommendation label badge should be compact and high-contrast enough to scan quickly.
- Weather tags use muted tinted backgrounds.
- Avoid noisy multi-color badge systems.

## Tabs Styling

- Segmented, rounded tablist.
- Active tab uses elevated or filled style.
- Inactive tabs remain readable with clear hover/focus states.

## Stat Pill Styling

- Compact rounded pills with soft tinted backgrounds.
- One key value + one short label.
- Keep typography lightweight to avoid dashboard tone.

## Recommendation Panel Styling

- Largest rounded card in viewport context.
- Include title, label, explanation, weather note, and save action.
- Weather note should read as contextual support, not warning banner.

## Motion Guidance (Framer Motion)

Use motion sparingly:

- Recommendation reveal: fade + slight upward translation.
- Tab content switch: short cross-fade/slide.
- Stat pills: small stagger on first render.

Motion settings:

- standard ease: `easeOut`
- duration range: 0.16-0.26s
- reduced motion: disable transforms, preserve opacity-only where possible

## Icon Usage (lucide-react)

- Use outline icons with consistent stroke width.
- Recommended icon contexts:
  - Weather note
  - Distance/time/intensity metadata
  - Save and history affordances
- Avoid decorative icon overload.

## Component Consistency Rules

- Reuse shared variants before creating new one-off styles.
- Keep visual density moderate and breathable.
- Any new component must preserve rounded, calm, consumer-facing language.

---
name: Obsidian & Ivory
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#4c4549'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#7d7579'
  outline-variant: '#cec4c8'
  surface-tint: '#685b63'
  primary: '#0b0409'
  on-primary: '#ffffff'
  primary-container: '#261c23'
  on-primary-container: '#91828b'
  inverse-primary: '#d3c2cb'
  secondary: '#615c6b'
  on-secondary: '#ffffff'
  secondary-container: '#e7dff1'
  on-secondary-container: '#676271'
  tertiary: '#675f2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b7ac74'
  on-tertiary-container: '#474012'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dee7'
  primary-fixed-dim: '#d3c2cb'
  on-primary-fixed: '#221920'
  on-primary-fixed-variant: '#4f434b'
  secondary-fixed: '#e7dff1'
  secondary-fixed-dim: '#cbc3d5'
  on-secondary-fixed: '#1d1a26'
  on-secondary-fixed-variant: '#494553'
  tertiary-fixed: '#f0e3a6'
  tertiary-fixed-dim: '#d3c78c'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#4f4719'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  button-text:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 32px
  margin-x: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 64px
  section-padding: 120px
---

## Brand & Style

This design system is built on a foundation of "Quiet Sophistication." It balances the authoritative, editorial feel of traditional publishing with the sleek, high-efficiency functionalism of modern SaaS. The brand personality is human-centric, expressive, and conversational.

The aesthetic follows a **Editorial Modernism** style: 
- **Spacious Layouts:** Heavy use of off-white (#F9F8F6) to provide breathing room and a premium "paper" feel.
- **Intentional Contrast:** The deep obsidian (#261C23) provides a grounding force, used for primary actions and key text to ensure high legibility and a sense of permanence.
- **Soft Accents:** Lavender and pastel yellow are used sparingly to highlight interactive elements and data visualizations, preventing the UI from feeling overly corporate.
- **Tactile Softness:** Large radii (24-32px) and subtle borders create a "physical" card-based interface that feels approachable and friendly.

## Colors

The palette is anchored by high-contrast neutrals with soft, pastel functional accents.

- **Background (Neutral):** #F9F8F6 (Ivory) is the primary canvas, used for page backgrounds and large sections.
- **Primary (Obsidian):** #261C23 is used for primary buttons, headings, and core UI elements.
- **Secondary (Lavender):** #EBE3F5 is used for background highlights, active states in selection components, and decorative containers.
- **Tertiary (Yellow):** #FDF0B2 acts as an attention-grabber for feature highlights or small callouts.
- **Surface (White):** #FFFFFF is reserved for floating cards and input fields to separate them from the ivory background.

## Typography

The typography system relies on the tension between the organic, literary feel of **Playfair Display** and the clean, geometric efficiency of **Plus Jakarta Sans**.

- **Serif (Playfair Display):** Used for headlines, large quotes, and narrative storytelling elements. It should always have tight letter-spacing when used in large sizes.
- **Sans-Serif (Plus Jakarta Sans):** Used for all UI controls, navigation, body copy, and instructional text. 
- **Hierarchy Rule:** Never use the Serif for functional UI elements (buttons, inputs, labels). Use the Sans-Serif for these to maintain a "tool" feel versus the "story" feel of the headlines.

## Layout & Spacing

The layout employs a **Fluid Grid** model with generous margins to mimic editorial design.

- **Grid:** A 12-column layout on desktop with a 32px gutter.
- **Rhythm:** Use an 8px base unit for all component-level spacing. 
- **Sectioning:** Large vertical gaps (120px+) between major landing page sections help differentiate the value propositions.
- **Mobile:** Transition to a 4-column grid with 16px gutters and 24px side margins. Horizontal padding on sections should be reduced, but vertical breathing room should remain high.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Soft Shadows** rather than stark borders.

- **Base Layer:** The Ivory (#F9F8F6) background.
- **Component Layer:** Pure White (#FFFFFF) cards or Lavender (#EBE3F5) containers sit on top of the ivory base.
- **Shadows:** Use extremely soft, low-opacity shadows (Blur: 40px, Spread: -10px, Color: #261C23 at 8% opacity) to lift cards off the background without creating "weight."
- **Focus States:** High-contrast 2px borders using the Obsidian color are used to indicate active focus on input fields.

## Shapes

The design system favors highly organic, exaggerated roundedness to feel soft and approachable.

- **Primary Buttons:** Always use a full capsule (9999px) radius.
- **Cards & Hero Mockups:** Use a 32px radius. For smaller nested elements (like integration icons or input fields), use 12px-16px.
- **Input Fields:** Use a 16px radius to maintain the soft language while fitting more content.

## Components

### Buttons
- **Primary:** Obsidian (#261C23) background, White (#FFFFFF) text, capsule shape. Bold weight.
- **Secondary:** Transparent background, 1px Obsidian border, Obsidian text.
- **Ghost:** No background or border, Obsidian text, underline on hover.

### Cards & Integration Tiles
- **Integration Cards:** Pure White background, 1px subtle border (#EBEBEB), 24px radius. Content should be centered with high internal padding (32px).
- **Hover State:** Apply the soft ambient shadow and lift the card slightly (-4px).

### Navigation
- **Header:** Sticky, blurred ivory background (backdrop-filter: blur(10px)). Logo on the left, primary CTA on the right.
- **Links:** Plus Jakarta Sans, 14px, Semi-bold.

### Auth Overlays & Modals
- **Backdrop:** Ivory (#F9F8F6) at 90% opacity or a blur effect.
- **Container:** 32px radius, pure white background, centered. Use the Lavender (#EBE3F5) for secondary informational blocks inside the modal.

### Input Fields
- **Default:** White background, 1px #EBEBEB border, 16px radius, Jakarta Sans body text.
- **Active:** 2px Obsidian border.
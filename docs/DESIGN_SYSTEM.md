# Backroom — Design System

*Opinionated. Prescriptive. Non-negotiable in the same way as the TDD discipline in the build prompt.*

This document is the visual and interaction contract for Backroom. It exists because "make it look good" is not a brief, and the default Claude Code aesthetic without this kind of guardrail is stock-standard AI-slop. Follow this document.

---

## 1. Design philosophy

Backroom is a precision tool for people who measure things for a living. The interface should feel the same way: **precise, measured, confident, restrained**.

Three commitments:

1. **Typography does the heavy lifting.** Not colour. Not effects. Not illustrations.
2. **One opinion, carried everywhere.** The same rules about spacing, corners, motion, colour intensity apply to every screen. Consistency is the whole game.
3. **Density over spaciousness.** Users live here for hours. They need information per square inch, not whitespace meditation. We are not Notion. We are closer to Linear.

---

## 2. The bar

These products define the level Backroom operates at. Study them. Match their discipline.

| Product | What to steal |
|---|---|
| **Linear** | Density, keyboard-first interaction, command palette, colour restraint, status-as-colour, the "everything is fast" feeling |
| **Raycast** | Dark-mode-first aesthetic, monospace-adjacent precision, confident use of a single bright accent |
| **Height** | Typographic hierarchy, flat surfaces, table design, minimal ornament |
| **Plane** | Modern open-source product polish; proves this level is achievable in our stack |
| **Vercel** | Display type, monochrome discipline, the "engineered" feel |
| **Notion** | Warm neutrals done well. We borrow less from Notion than the others |

**Explicitly not the bar**: Monday, ClickUp, Asana, Jira. Their aesthetic is corporate-PM. We compete with them on capability and undercut them on aesthetic.

---

## 3. Anti-patterns (the AI-slop checklist)

Reviewers (including Claude Code in self-review) should fail any PR that contains these. Not as a style nitpick — as a scope violation.

- Generic blue primary (`#0070F3`, `blue-500`, `blue-600`, the Bootstrap default)
- Purple-to-pink gradients anywhere
- Glass morphism / backdrop-blur as a default surface treatment
- Drop shadows larger than `shadow-sm` on interactive elements (cards, buttons, modals get minimal shadows; floating panels get one)
- Corner radius larger than 8px on cards, 6px on buttons, 4px on inputs. No "rounded-2xl everywhere"
- Pill-shaped buttons (full rounded). Reserved for tags/chips only
- Hover scale transforms (`hover:scale-105`, `hover:scale-110`). Interactive feedback is colour and border, not size
- Sparkle icons, wand icons, star icons to indicate "AI" or "magic"
- Generic dashboard clip-art or people-looking-at-laptops illustrations
- Emoji as UI elements (in microcopy fine, in the actual interface no)
- `Inter` as the default font without a considered reason
- `font-family: system-ui, -apple-system` fallback stacks with no primary font
- Tailwind-default palette used directly (`bg-slate-50`, `text-gray-900`) without being mapped to semantic tokens
- Hero sections with three vague buzzword bullets and a gradient
- "Sign up for free" or "Get started" as the only CTAs with no context
- Bento grids where every card has a different size and purpose, creating visual noise
- `z-50` stacks or arbitrary z-index values; use the defined elevation scale

If you catch yourself reaching for any of these, stop. You are in slop territory.

---

## 4. Colour system

### Palette: dark-mode-first

Backroom is dark-mode-first. Light mode is fully supported as an explicit toggle, but the design language is built on the dark aesthetic and light mode is a considered translation, not the origin.

**Define these as CSS variables in `globals.css` and map to Tailwind via `tailwind.config.ts`. Never use raw hex in components.**

### Dark mode (primary)

```css
/* Surfaces */
--bg-base:        #0A0A0B;  /* page background, warm near-black */
--bg-elevated:    #131315;  /* cards, panels */
--bg-higher:      #1C1C1F;  /* modals, popovers, command palette */
--bg-highest:     #252529;  /* tooltips, floating menus over modals */

/* Borders */
--border-subtle:  #26262B;
--border-default: #2E2E33;
--border-strong:  #3A3A42;

/* Text */
--text-primary:   #F4F4F1;  /* warm off-white, 95% opacity feel */
--text-secondary: #A8A8A3;
--text-tertiary:  #6B6B66;
--text-disabled:  #4A4A45;

/* Brand accent — Volt */
--accent:         #C5F82A;  /* primary interactive, links, focus rings */
--accent-hover:   #D4FF3F;
--accent-active:  #B6E322;
--accent-subtle:  #1F2A0B;  /* backgrounds for accent chips, accented rows */
--accent-dim:     #8FBA1F;  /* for text on accent-subtle surfaces */

/* Semantic */
--success:        #4ADE80;
--success-subtle: #0C1F14;
--warning:        #FBBF24;
--warning-subtle: #2A1F08;
--danger:         #FB7185;
--danger-subtle:  #2A0F13;
--info:           #60A5FA;
--info-subtle:    #0E1C2C;

/* Status colours for workflow states */
--status-open:       #9CA3AF;  /* neutral grey */
--status-active:     #C5F82A;  /* volt */
--status-waiting:    #FBBF24;  /* amber */
--status-blocked:    #FB7185;  /* coral */
--status-done:       #4ADE80;  /* emerald */
```

### Light mode (translation)

```css
--bg-base:        #FAFAF7;  /* warm off-white, not pure white */
--bg-elevated:    #FFFFFF;
--bg-higher:      #FFFFFF;
--bg-highest:     #FFFFFF;

--border-subtle:  #EEEEE9;
--border-default: #DADAD3;
--border-strong:  #B8B8B0;

--text-primary:   #0A0A0B;
--text-secondary: #555551;
--text-tertiary:  #8A8A85;
--text-disabled:  #B0B0AB;

--accent:         #6B8F1A;  /* darkened volt for accessibility on white */
--accent-hover:   #7FA620;
--accent-active:  #587717;
--accent-subtle:  #EEF7D4;
--accent-dim:     #86A614;

--success:        #16A34A;
--success-subtle: #DCFCE7;
--warning:        #D97706;
--warning-subtle: #FEF3C7;
--danger:         #DC2626;
--danger-subtle:  #FEE2E2;
--info:           #2563EB;
--info-subtle:    #DBEAFE;
```

### Rules

- **Volt is the signature colour.** Used for the active state indicator, focus rings, one primary CTA per view, the logomark, and active status. Never for decoration. If a volt element does not carry meaning, delete the colour.
- **No volt on volt.** Volt-on-dark is the signature. Do not stack volt text on a volt background.
- **Semantic colours are for state, not decoration.** A red border means error, a green dot means done. Never use semantic colour to make something "stand out".
- **Status colours are workflow states, not random hues.** A 'waiting' item is amber everywhere — in the queue, on the dashboard, in the digest email.

---

## 5. Typography

### Font stack

**Primary sans**: Geist Sans (by Vercel, SIL Open Font License)
**Primary mono**: Geist Mono
**Fallback stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` — only as CSS fallback, never as the primary

Install via `next/font/google` if Geist is added to Google Fonts, or self-host via `next/font/local` from the Geist package. Use `font-display: swap`.

### Type scale

Use semantic classes, not raw sizes. Defined in Tailwind config.

| Token | Size / Line | Weight | Use |
|---|---|---|---|
| `display-lg` | 48/52 | 600 | Marketing hero only |
| `display-md` | 36/40 | 600 | Empty-state headlines |
| `display-sm` | 28/32 | 600 | Page titles |
| `heading-lg` | 22/28 | 600 | Section headings |
| `heading-md` | 18/24 | 600 | Subsection headings, card titles |
| `heading-sm` | 15/20 | 600 | Table headers, form group labels |
| `body-lg` | 16/24 | 400 | Prose, documentation |
| `body-md` | 14/20 | 400 | **Default body**, most UI text |
| `body-sm` | 13/18 | 400 | Secondary UI, metadata |
| `caption` | 12/16 | 500 | Labels, pills, uppercase tags |
| `mono-md` | 13/20 | 400 | IDs, timestamps, code |
| `mono-sm` | 12/16 | 400 | Row IDs, subtle numeric |

### Rules

- **Default body size is 14px, not 16px.** Linear is 14. Height is 14. Consumer apps use 16 because most users scan. Backroom users read. Density matters.
- **Line height is tight in UI, loose in prose.** UI tokens are all 1.3-1.4. Prose is 1.5.
- **Font weights used**: 400 (body), 500 (emphasis, labels), 600 (headings). No 700-900 weights anywhere.
- **No italic for emphasis.** Use colour or weight.
- **Numeric columns use `font-feature-settings: "tnum"`** (tabular numbers) so columns align.
- **Uppercase only for caption-style labels**, never for headlines, with `letter-spacing: 0.05em`.

---

## 6. Spacing and layout

### Grid

4px base unit. Tailwind's default spacing scale is compatible. Use these tokens consistently:

```
space-1:  4px    (micro gaps within a component)
space-2:  8px    (default inline gap)
space-3:  12px   (component internal padding)
space-4:  16px   (default block gap)
space-5:  20px
space-6:  24px   (section gap)
space-8:  32px   (large section gap)
space-10: 40px
space-12: 48px   (major section gap)
space-16: 64px   (page-level gap)
```

### Layout widths

- **App content max-width**: 1440px for dashboards, 1280px for other pages
- **Text reading max-width**: 720px for prose
- **Sidebar width**: 240px default, 64px collapsed (icons only)
- **Page gutter**: 24px on mobile, 32px on tablet, 48px on desktop, 64px on wide

### Density

Interior padding of common components:

- Button: `py-1.5 px-3` (6px vertical, 12px horizontal) for default, `py-1 px-2.5` for small, `py-2 px-4` for large
- Input: `py-2 px-3` (8px vertical, 12px horizontal)
- Card: `p-4` or `p-6` depending on content density
- Table row: `py-2` (8px vertical), tight
- List item: `py-2.5 px-3` (10px vertical, 12px horizontal)

---

## 7. Corners and borders

### Radius

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | Tables, lists, bar charts |
| `radius-sm` | 4px | Inputs, tags, chips |
| `radius-md` | 6px | Buttons |
| `radius-lg` | 8px | Cards, panels |
| `radius-xl` | 12px | Modals, popovers |
| `radius-full` | 9999px | Avatar, status dot, switch toggle |

**Never use `rounded-2xl` or higher on general components.** Only on specific pill/tag contexts.

### Border

- Default border: 1px `var(--border-default)`
- Subtle border: 1px `var(--border-subtle)` for internal dividers
- Focus: 2px `var(--accent)` with 2px offset
- Never use double borders or decorative border styles

---

## 8. Elevation and shadows

Dark mode handles elevation primarily with **surface colour**, not shadow. Use shadows sparingly.

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md:  0 4px 8px -2px rgba(0, 0, 0, 0.4);
--shadow-lg:  0 12px 24px -4px rgba(0, 0, 0, 0.5);
```

Use `shadow-sm` on popovers and dropdowns. `shadow-md` on modals. `shadow-lg` only on toasts and floating panels. Never on static cards.

In light mode, shadows are more prominent:

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 8px -2px rgba(0, 0, 0, 0.08);
--shadow-lg:  0 12px 24px -4px rgba(0, 0, 0, 0.1);
```

---

## 9. Motion

### Principles

1. **Motion informs, never entertains.** Every animation should answer "what just happened" or "what is about to happen".
2. **Fast.** Default duration is 150ms. Slow is 250ms. Anything over 400ms is banned outside of explicit page transitions.
3. **Linear curves for instant feedback, ease-out for reveals, spring only for drag interactions.**
4. **Respect `prefers-reduced-motion`.** All non-essential motion collapses to opacity fades or instant state changes.

### Durations

```css
--duration-fast:    100ms;  /* hover, focus, small state changes */
--duration-default: 150ms;  /* most transitions */
--duration-slow:    250ms;  /* reveals, modals, drawers */
--duration-page:    300ms;  /* page transitions, full-screen changes */
```

### Easing

```css
--ease-linear:     cubic-bezier(0, 0, 1, 1);
--ease-out:        cubic-bezier(0.16, 1, 0.3, 1);     /* reveals */
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);      /* default */
--ease-spring:     cubic-bezier(0.5, 1.56, 0.64, 1);  /* drag release only */
```

### What does and does not animate

**Animates:**
- Modal open/close (fade + scale 0.96 → 1)
- Drawer slide-in (translate)
- Toast enter/exit (slide + fade)
- Skeleton shimmer (very subtle, 2s loop)
- Status change in kanban (position tween)
- Command palette open (fade + 4px slide down)
- Dropdown menu reveal

**Does not animate:**
- Text content changes
- Number changes (except countdown timers, which tick)
- Page content on route change (fade only if at all)
- Hover states (instant colour change is fine)
- Focus rings (instant)

---

## 10. Iconography

### Library

**Lucide Icons** as the base set (already in the stack). Use at 16px in dense UI, 20px at default, 24px only in empty states and headers.

### Rules

- **Icon + text together by default.** Icon-only buttons are rare and require an accessible label
- **Icon colour matches text colour.** Icons are not independent visual elements; they're typography
- **Line-style icons only**, never filled (except checkmarks, close X)
- **No decorative icons.** Every icon is tied to an action or status
- **Consistent stroke width**. Lucide defaults to 2px; keep it

### Custom icons

If a custom icon is needed (e.g. a distinctive mark for Backroom's logo), it must:
- Match Lucide's visual weight and stroke
- Render correctly at 16, 20, 24px
- Be a single SVG with no filters or complex paths
- Be added to `components/icons/` with a named export

---

## 11. Component principles

### Buttons

Three variants only: **primary**, **secondary**, **ghost**. No tertiary, no "outlined", no "soft".

- **Primary**: volt background, dark text. One per view. For the single most important action
- **Secondary**: subtle border, default background, default text. For supporting actions
- **Ghost**: no border, no background, default text with hover background. For navigation and tertiary actions

Three sizes: **sm** (24px tall), **md** (32px tall, default), **lg** (40px tall, rare).

States:
- `hover`: background intensifies one step, no scale, no shadow change
- `active`: background intensifies two steps
- `focus-visible`: 2px accent ring with 2px offset
- `disabled`: opacity 0.5, no pointer events
- `loading`: spinner replaces icon, text stays, click disabled

### Inputs

- Single border, no internal shadow
- Focus: 2px accent ring, border colour matches
- Error: 2px danger ring, border colour matches, error text below in `danger` colour
- Placeholder: `text-tertiary`, never italic
- Labels **always above** the input, never placeholder-as-label

### Tables

Linear-style. This is where Backroom spends most of its visual budget.

- No zebra striping
- 1px subtle border rows
- Hover: row background to `bg-elevated`
- Selected: row background to `accent-subtle`
- Sort indicator: small chevron next to column name, volt when active
- Numeric columns right-aligned with tabular numbers
- Date columns: relative time ("2h ago") with full timestamp on hover

### Cards

- `bg-elevated`, 1px subtle border, 8px radius, no shadow
- Internal padding `p-4` or `p-6`
- Card title: `heading-md`
- Card body: `body-md`
- Cards do not scale on hover. Cards do not have gradients. Cards do not have glow effects

### Forms

- Labels above, always
- Error messages below, never as tooltips
- Helper text below label, before input, in `text-tertiary`
- Form actions (submit, cancel) grouped right-aligned, primary on the right
- Required fields marked with `*` in `danger` colour next to label
- Optional fields marked with `(optional)` in `text-tertiary` after label
- Never both

### Empty states

Every list view has a designed empty state. Never show a blank area.

Empty state components:
- An illustration or icon at 64px in `text-tertiary`
- A `heading-md` headline describing the state
- A `body-md` paragraph in `text-secondary` explaining what goes here
- A primary CTA if there's an obvious next action

No generic "No data" with a sad face.

---

## 12. Data visualisation

### Chart palette

Sequence for categorical data. **Not the same as semantic colours.**

```
--chart-1: #C5F82A   (volt)
--chart-2: #60A5FA   (blue)
--chart-3: #FBBF24   (amber)
--chart-4: #F472B6   (pink)
--chart-5: #34D399   (emerald)
--chart-6: #A78BFA   (violet)
--chart-7: #FB923C   (orange)
--chart-8: #22D3EE   (cyan)
```

Use in this order. Never more than 6 at once in a single chart.

### Rules

- **Charts are flat.** No gradients. No drop shadows. No 3D.
- **Gridlines are subtle.** `border-subtle` colour at 50% opacity.
- **Axis labels are `body-sm` in `text-secondary`.**
- **Value labels on bars** only if there are fewer than 8 bars. Otherwise rely on axis.
- **Tooltips on hover** in all interactive charts, using the tooltip component.
- **Lines are 2px thick.** Area fills at 10% opacity.
- **Do not use colour as the only distinction.** Line charts also use different dash patterns. Bar charts use different shades. Accessible to colour-blind users.

### Library

**Recharts** for most charts (in the stack). Consider **Visx** or **D3** only if Recharts can't express the chart.

---

## 13. Microcopy and voice

### Voice

- **Direct.** "Create task", not "Would you like to create a task?"
- **Confident.** "This will delete 14 items." Not "Are you sure you want to delete?"
- **Precise.** "Estimated 2 hours, logged 1h 47m." Not "About two hours or so."
- **No jargon.** "Requests", "tasks", "people", "departments". Never "tickets", "sprints", "epics".
- **No apologising.** Error messages explain what happened and what to do. "Request failed. Check your connection and try again." Not "Oops! Sorry, something went wrong."
- **No marketing-speak.** "Time tracking". Not "Empowering teams with intelligent time insights."

### Button labels

Verbs. Specific. "Assign to Marcus", not "Assign". "Create request", not "Submit".

### Empty state copy

- Headline: what this screen is, when populated
- Body: one sentence about how to populate it, with a CTA if there's an action

Example for empty queue:
- Headline: "Nothing on your plate"
- Body: "When someone assigns you a request, it appears here. You can also create a task yourself."
- CTA: "New task"

### Error copy

Three parts:
1. What happened ("Couldn't submit the request")
2. Why, if useful ("Network connection lost")
3. What to do ("Try again, or save a draft")

No smiley faces. No exclamation marks in errors.

---

## 14. Logo and brand marks

The logomark is out of scope for Claude Code to design. The wordmark, however:

**Wordmark**: "Backroom" set in Geist Sans, weight 600, letter-spacing -0.02em. All lowercase or sentence case — never uppercase.

**Symbolmark (placeholder until designed)**: a 4×4 grid with the top-right corner cell filled in volt. References a minimal sport-science test scoresheet. Can be rendered at 16, 20, 24, 32, 48, 64px.

Final logo design is a human task, not Claude Code's. Use the placeholder until then.

---

## 15. Mode toggle

- Default: dark mode
- Toggle in user menu, three states: System, Light, Dark
- Persist preference in the `profiles` table, not localStorage alone
- SSR renders the correct mode without a flash (use `next-themes` or equivalent)

---

## 16. Responsive strategy

- **Desktop-first for authenticated app**: design at 1440px, scale down. Features may be simplified on mobile (queue becomes list only, no kanban; dashboards stack)
- **Mobile-first for public intake form**: design at 375px, scale up
- **Breakpoints**: 640 (sm), 768 (md), 1024 (lg), 1280 (xl), 1536 (2xl)
- **Minimum supported width**: 360px. Below that, show a message recommending a larger screen

---

## 17. Accessibility

- WCAG 2.1 AA is the floor. Target AAA where it doesn't compromise the density
- Colour contrast: minimum 4.5:1 for body text, 3:1 for large text
- Focus visible on every interactive element
- Keyboard navigation works for every action (use the command palette as the universal keyboard accessor)
- Screen reader labels on icon-only buttons, status indicators, and charts
- No information conveyed by colour alone
- `prefers-reduced-motion` honoured across all animation

---

## 18. Review checklist

Before merging any UI work, the PR must pass this self-review:

- [ ] No anti-pattern from section 3 present
- [ ] Colours used via CSS variables, not raw hex or Tailwind defaults
- [ ] Typography uses semantic tokens from the scale
- [ ] Corners, spacing, motion match the tokens in this document
- [ ] Empty states designed, not placeholders
- [ ] Error states designed
- [ ] Loading states use skeletons, not spinners, where feasible
- [ ] Hover, focus, active, disabled states all defined
- [ ] Keyboard navigation verified manually
- [ ] Screen reader test: tab through the page, confirm everything announces correctly
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Dark mode renders correctly
- [ ] Light mode renders correctly
- [ ] Mobile (360px) renders without horizontal scroll

---

## 19. Inspiration gallery (reference, not copy)

For concrete visual reference during the build, study these specific screens:

- Linear: Issue detail page, the command palette (cmd-k), the cycle view
- Raycast: Main launcher, the extension detail view
- Height: The task inbox, the table view
- Vercel: Project dashboard, the deployment detail
- Plane: The workspace onboarding flow

Open these products, inspect specific elements, and reference them in PRs when making design decisions. Do not literal-copy, but absorb the discipline.

---

*Design system version 1.0. Update with intent. Small additions are welcome; reversals of direction require explicit discussion.*

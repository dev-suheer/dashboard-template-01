# Tidra design tour

Live demo: https://demo.codeandchill.store/tidra

Inspected 17 November 2026. Signed in as **Isla Macrae**, Head of Crewing, Shore office, Port Skerrow. The demo clock is frozen at **10:40, Tuesday 3 November 2026**. Product name in the rail: **Tidra**, subtitle **Skerrow Line crew desk**.

This is a crew desk for a fictional ferry line: two ships, a terminal, and a shore office. 112 people, six departments, one payroll.

- 11 sidebar sections
- 27 routes
- One typeface: Urbanist
- Motion engine: GSAP 3.15.0, plus one View Transitions theme switch

---

## Shell

The app is a hash router. `document.documentElement` carries `data-theme` (`light` or `dark`) and, when the sidebar is collapsed, the class `is-rail`.

### Sidebar

Collapsed rail is **76px** (`--side-rail`). Expanded width is **236px** (`--side-w`). Shortcut to fold or expand is **`[`**. Below 1280px the sidebar is always a rail. Tablets always use the rail. Settings → Appearance calls this **Icon rail**: “Fold the sidebar to icons.”

Brand mark is a stroke icon of a rising sun over two wave lines. Expanded, the wordmark is **Tidra** with **Skerrow Line crew desk** underneath.

Nav groups under the label **Crew desk**:

| Item | Route | Badge |
| --- | --- | --- |
| Overview | `#/overview` | |
| Crew | `#/crew` | |
| Attendance | `#/attendance` | 2 |
| Time off | `#/leave` | 6 |
| Payroll | `#/payroll` | |
| Performance | `#/performance` | |
| Hiring | `#/hiring` | 5 |
| Onboarding | `#/onboarding` | |
| Insights | `#/insights` | |
| Settings | `#/settings` | |
| Support | `#/support` | |

The active item is one shared pill (`.snav__pill`), not a separate background on each link. The pill moves by animating `clip-path` (see Motion).

The foot of the rail shows a live duty count (**62 / 83**, “crew on duty across two ships and the terminal”) with a breathing green dot, and the theme toggle. The toggle’s accessible name is **Dark mode** in light theme and **Light mode** in dark theme.

### Top bar

- Breadcrumb of the current section and sub-page
- Search field: “Search crew, sailings, requests…” with a **⌘K** hint
- Live clock and date: **10:40 · Tuesday 3 November**
- Link **10 to approve** → `#/leave/requests`
- Notifications button, **3 unread**
- Teal **Create** button
- Account button: **Isla Macrae**, initials **IM**, green presence dot

A coral **Buy this template** pill sits over the bottom-right corner and links to `https://codeandchill.store/checkout?item=tidra&ref=preview`.

There is a skip link, “Skip to content”, targeting `#main`.

### World the UI is about

**Ships and places**

| Id | Name | Run | Kind |
| --- | --- | --- | --- |
| corran | MV Corran | Skerrow ⇄ Inchmor | Car ferry, 420 capacity |
| brae | MV Brae Lass | Skerrow ⇄ Rennay | Island ferry, 140 capacity |
| shore | Skerrow terminal | Port Skerrow | Ticket hall and linkspan |

**Departments** (headcount on the directory chips)

| Id | Name | People | Work |
| --- | --- | --- | --- |
| deck | Deck | 26 | Masters, mates, bosuns and able seamen |
| engine | Engine room | 16 | Engineers, motormen and electro-technical officers |
| galley | Galley | 12 | Cooks and galley hands, crew and passenger meals |
| cafe | Onboard service | 20 | The café, the shop and the passenger lounge |
| terminal | Terminal | 22 | Tickets, the linkspan and vehicle marshalling |
| office | Shore office | 16 | Crewing, finance, fleet maintenance and bookings |

Bases used as filters: Corran, Brae Lass, Terminal. Contract filters: Full-time, Part-time, Seasonal, Probation, Notice.

**People team** (Support)

- Isla Macrae, Head of Crewing
- Dev Sharma, Crewing coordinator
- Hours Mon–Fri, 8:00–18:00
- crewing@skerrowline.co.uk
- 01631 600 214
- Urgent, out of hours: duty officer at the terminal

Company on payslips: **Skerrow Line Ferries Ltd**. Currency is locked to **GBP · £**.

---

## Motion

Almost nothing is a CSS animation. The stylesheets define three keyframes and a handful of transitions. Page changes, counting numbers, the sidebar pill, and buttons that lean toward the cursor are GSAP 3.15 (including the Flip plugin). The View Transitions API is used once, for the theme switch.

### Shared rules

- Design-token ease: `--ease: cubic-bezier(.22, 1, .36, 1)`. A long ease-out that arrives quickly and settles.
- Durations below assume reduced motion is off.
- `prefers-reduced-motion: reduce` makes the GSAP helper return duration **0**, and a CSS media query forces every transition and animation to **0.001ms**.
- Hover effects (magnetic buttons, lift) only bind when the device matches `(hover: hover) and (pointer: fine)`.
- There is a global time-scale helper so the whole GSAP timeline can be slowed. The demo does not expose that in the UI.

### CSS keyframes

| Name | Frames | Used on |
| --- | --- | --- |
| `flash` | 0% color `var(--accent)` → 100% `inherit` | `.is-flash`, duration 1s, `var(--ease)` |
| `breathe` | 0% and 100% opacity 0.1, 50% opacity 0.45 | `.live::after`, 2s ease-in-out, infinite |
| `breathe-ring` | 0% and 100% opacity 0.4, 50% opacity 1 | `.steps li.is-now .steps__dot::before`, 2.2s ease-in-out, infinite |

Other CSS transitions:

| Selector | Transition |
| --- | --- |
| `.top::after` | opacity 0.25s. A fade under the top bar once the page has scrolled. |
| `.stair` | custom property `--stair-c` over 0.45s `cubic-bezier(.65, 0, .35, 1)`. Turned off under reduced motion. |
| `.rt-gname > .ico` | `transition: none` |
| `::view-transition-old(root)`, `::view-transition-new(root)` | `animation: none`, so the browser’s default crossfade does not play |

### Entrance, built once and reused

| Gesture | From | To | Timing | Where it shows |
| --- | --- | --- | --- | --- |
| Headline letters | 115% below, 6° rotation | Resting, upright | 0.85s `power4.out`, 22ms stagger, optional delay | Every page title. The string is split into words, then characters (`.word` > `.ch`). The original text is kept as `aria-label`. Overflow is hidden so letters rise into place. |
| Cards rise | opacity 0, 26px down, scale 0.985 | opaque, y 0, scale 1 | 0.8s `expo.out`, 60ms stagger | KPI tiles, cards, panels on load |
| Rows rise | opacity 0, 12px down (x optional) | resting | 0.55s `power3.out`, 40ms stagger | Table rows, list items, directory, duty list |
| Cards tilt in | opacity 0, 40px down, rotation ±2.5° (alternating), scale 0.95 | upright, scale 1 | 0.85s `back.out(1.4)`, 70ms stagger | Chunkier objects such as joiner cards |
| Bars grow | `scaleX` or `scaleY` 0 | 1 | 0.9s `expo.out`, 30ms stagger | Heatmap cells, payroll bars, meters. Transform origin at the start of the bar. |
| Pop in | scale 0.6, opacity 0 | scale 1, opacity 1 | 0.6s `back.out(3)`, 50ms stagger | Small marks, status dots, rating stars |
| Count up | previous number | target number | default 1.2s `power3.out` | KPI figures. The node remembers the last value so a revisit does not restart from zero. |

Overview-specific entrance on top of those helpers:

- Sailing blocks grow from the left: `scaleX` 0 → 1, opacity 0 → 1, 0.7s, 35ms stagger, delay 0.35s.
- Labels on those sailings fade up 6px, 0.4s, 25ms stagger, delay 0.2s.
- The red “now” line drops in with `scaleY` 0 → 1, 0.8s, delay 1s.

Page modules call the same helpers with small local tweens. Typical stagger on a page is 0.06s for cards, then a later stagger for rows (around 0.012–0.05s) and a delay of 0.1–0.4s so the title lands first.

### Changing page

Sub-pages inside one section (Directory → Chain of command, On duty → Roster, and so on) do not remount the shell.

**Leave.** Cards, KPIs and lanes fade, drop 8px and scale to 0.985. The page head, tabs, toolbar and chips fade and rise 6px. The whole view slides 16px in the direction of travel. Duration **0.18s**, ease `power2.in`, stagger 8ms.

**Arrive.** The new view slides in from 26px on the opposite side. Duration **0.7s**, ease `expo.out`.

**Direction.** Forward tabs slide left. Back tabs slide right. The sign is stored from the previous tab index so the incoming slide matches the outgoing one.

A swap that starts before the previous one finishes is ignored until the timeline completes. The document title updates immediately, so a too-fast click can show the new title over the old view until the animation’s `onComplete` commits the new tree. A full load of the hash always paints the right page. Reduced motion skips the timeline and swaps immediately.

### Continuous and interactive

| Name | Behavior | Timing |
| --- | --- | --- |
| Live dot | The green presence dot (sidebar duty count, “Running” on the watch) breathes. A ring behind it pulses. | 2s ease-in-out, infinite. Keyframe `breathe`, opacity 0.1 ↔ 0.45. |
| Step ring | The current onboarding step grows a soft accent ring (`--accent-soft`). | 2.2s ease-in-out, infinite. Keyframe `breathe-ring`, opacity 0.4 ↔ 1. Inset −5px, circle. |
| Sidebar pill | One element. Its `clip-path` inset is tweened so the pill stretches toward the new item, then the far edge catches up. Radius 13px. If the target has not moved, or opacity is 0, it snaps. | Leading edge 0.36s `power3.out`. Trailing edge 0.55s `power3.inOut`. The cross axis 0.45s `power3.inOut`. |
| Theme switch | A circle clip grows from the theme button (center of the control, fallback 40px from the left and 40px off the bottom) out to the far corner of the viewport, revealing the new theme. | 450ms `cubic-bezier(.65, 0, .35, 1)` on `::view-transition-new(root)`. If View Transitions or reduced motion is unavailable, the theme attribute flips with no animation. |
| Magnetic buttons | Elements with `.magnetic` shift 20% of the pointer offset from center in X and 28% in Y, then return home on pointer leave. | `quickTo`, 0.5s `power3.out`. |
| Lift | Elements with `data-lift` rise 4px on hover, only after the page intro flag is set. | 0.45s in, 0.5s out, `power3.out`. |
| Approve flash | Adding `.is-flash` runs the CSS color flash. At the same time the node pops from y −4 and scale 1.08 back to rest. | CSS `flash` 1s with `--ease`, plus 0.55s `back.out(2.4)`. |
| Shake | A rejected field or action jitters on X. | Keyframes 0, −8, 7, −5, 3, 0 over 0.42s `power2.out`. |
| Icon pop | A clicked icon scales from 0.7 to 1. | 0.55s `back.out(3)`. |
| Meter | A progress `<i>` fills from `scaleX: 0` to the ratio. | 1s `expo.out`, delay 0.15s. |
| FAQ answer | An open answer unclips. | `clip-path` from `inset(0 0 100% 0)` to `inset(0 0 0% 0)`, plus opacity, `power3.inOut`. |
| Hire card | Dragging a candidate scales the card and tilts it. | scale 1.04, rotation −1.5°, 0.25s `back.out(1.6)`. |
| Stars | Review stars scale from 0.6 to 1. | 0.5s, 40ms stagger. |
| Scroll shade | The gradient under the top bar fades in once the page scrolls. | opacity 0.25s. |

---

## Color

Theme lives on `data-theme`. Light is the default. Settings → Appearance offers three choices:

| Id | Name | Subtitle |
| --- | --- | --- |
| light | Light | Cool grey, white cards |
| dark | Dark | Near-black, for the night audit |
| system | Match the device | Follows the phone or laptop |

Each option is a button with a miniature preview (`.theme__pic`) and a check on the current one. Saved on this device.

Light accent is a deep ferry teal and paints white text. Dark accent is a luminous cyan and paints near-black text, so buttons flip their ink with the theme. Status colors follow the same idea: deep inks in light, pastels in dark.

### Surfaces and type

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#e4e7eb` | `#0b0f12` | Page field |
| `--ink` | `#101820` | `#e9eef1` | Primary text |
| `--ink-2` | `#2f3a45` | `#c9d2d8` | Secondary text |
| `--muted` | `#55606b` | `#94a0aa` | Meta, timestamps, hints |
| `--card` | `#fcfdfd` | `#141a1f` | Cards |
| `--panel` | `#fdfefe` | `#182027` | Inset panels |
| `--paper` | `#fdfdfb` | `#fdfdfb` | Unchanged paper, print-like slips |
| `--paper-ink` | `#101820` | `#101820` | Ink on paper |
| `--mono-ink` | `#101820` | `#101820` | |
| `--line` | `#10182013` | `#e6f0f516` | Hairline |
| `--line-2` | `#10182026` | `#e6f0f529` | Stronger divider |
| `--rim` | `#10182029` | `#e6f0f529` | Outer rim |
| `--glass-rim` | `#10182014` | `#e6f0f516` | |
| `--glass-hi` | transparent | transparent | |
| `--glass-top` | transparent | transparent | |
| `--side-bg` | `#fcfdfd` | `#141a1f` | Sidebar |
| `--side-ink` | `#101820` | `#e9eef1` | |
| `--side-muted` | `#5d6873` | `#94a0aa` | Idle nav |
| `--side-hover` | `#1018200d` | `#e6f0f50f` | Nav hover |
| `--side-well` | `#10182009` | `#e6f0f50a` | |
| `--side-line` | `#10182014` | `#e6f0f517` | |
| `--side-pill` | `#0b7383` | `#3dbccb` | Active nav pill (same as accent) |
| `--side-pill-ink` | `#ffffff` | `#03252a` | |

### Accent

| Token | Light | Dark |
| --- | --- | --- |
| `--accent` | `#0b7383` | `#3dbccb` |
| `--accent-from` | `#128597` | `#52c8d6` |
| `--accent-to` | `#086573` | `#2aa9b9` |
| `--accent-hi` | `#08636f` | `#55c9d6` |
| `--accent-text` | `#075f6b` | `#66d3df` |
| `--accent-ink` | `#ffffff` | `#03252a` |
| `--accent-soft` | `#0b73831f` | `#3dbccb26` |
| `--accent-soft-solid` | `#d3e8eb` | `#123238` |
| `--accent-glow` | `#0b73835c` | `#3dbccb4d` |
| `--sig` | `#0b7383` | `#3dbccb` |
| `--sig-text` | `#075f6b` | `#66d3df` |
| `--sig-soft` | `#0b73831f` | `#3dbccb26` |
| `--data` | `#0b7383` | `#3dbccb` |

Primary buttons, links, the nav pill, and chart data all use the accent.

### Status

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--good` | `#18703f` | `#5fd39a` | In, running, approved |
| `--good-soft` | `#1d7a461f` | `#5fd39a24` | |
| `--in` | `#1d7a46` | `#5fd39a` | Signed in |
| `--in-soft` | `#1d7a461f` | `#5fd39a24` | |
| `--in-text` | `#18693c` | `#6fdba5` | |
| `--bad` | `#b2213a` | `#ff8a96` | Short-crewed, declined, errors |
| `--bad-soft` | `#c4223a1a` | `#ff8a9624` | |
| `--warn` | `#965200` | `#f3b25c` | Waiting, review |
| `--warn-soft` | `#cd780a26` | `#f3b25c26` | |
| `--info` | `#2257a6` | `#86b8f5` | Informational |
| `--info-soft` | `#2257a61a` | `#86b8f524` | |
| `--now` | `#d0493a` | `#ff8a7a` | The vertical “now” line on today’s sailings |
| `--out` | `#9aa3ad` | `#67717b` | Signed out, sailed-past |

### Department inks

Six departments keep a fixed hue everywhere: dots, tags, heatmap rows, payroll bars. Light uses a deep ink. Dark uses a lighter tint of the same hue. Avatar and tag washes (`--h0` … `--h6`) are the pale partners and stay the same in both themes.

| Dept | Token | Light | Dark | Wash |
| --- | --- | --- | --- | --- |
| (neutral wash) | `--h0` | `#e2e6ea` | `#e2e6ea` | |
| Deck | `--c1` / `--h1` | `#2f5d9e` | `#7ea6e6` | `#d4e1f2` |
| Engine room | `--c2` / `--h2` | `#c0612f` | `#ec8a5a` | `#f4dccd` |
| Galley | `--c3` / `--h3` | `#b8890f` | `#e1b446` | `#f2e4b8` |
| Onboard service | `--c4` / `--h4` | `#1f8a74` | `#4fc3a6` | `#cde9df` |
| Terminal | `--c5` / `--h5` | `#d0566b` | `#f08597` | `#f6d6dc` |
| Shore office | `--c6` / `--h6` | `#6b7785` | `#a3aeba` | `#dfe3e8` |

### KPI washes

The four overview and duty tiles are tinted paper, not white. Dark versions are deep stained panels with light ink (`--tile-ink` `#101820` / `#e9eef1`, muted `#101820ad` / `#e9eef1b8`).

| Token | Light | Dark | Seen as |
| --- | --- | --- | --- |
| `--tile-1` | `#cde8e5` | `#113032` | On duty, sea-green |
| `--tile-2` | `#f1e4c4` | `#322a15` | Late / crewed-to-minimum, sand |
| `--tile-3` | `#d5e3f3` | `#15253a` | No-shows / off today, blue |
| `--tile-4` | `#f5dbd2` | `#3a211b` | Off today / open berths, clay |

On the duty page the four tiles read as sand (on duty), blue (late), sea-green (no-shows), clay (off today). On overview they are sea-green, sand, blue, clay in that order.

### Shadows

| Token | Light | Dark |
| --- | --- | --- |
| `--shadow-sm` | `0 1px 2px #1018200d` | `0 1px 2px #0006` |
| `--shadow` | `0 1px 1px #1018200a, 0 16px 34px -24px #10182061` | `0 1px 2px #0006, 0 16px 34px -22px #000c` |
| `--shadow-lg` | `0 2px 6px #10182014, 0 30px 64px -26px #10182061` | `0 2px 6px #00000080, 0 34px 80px -26px #000000e6` |

Cards sit on a soft, low shadow. Menus and dialogs use the large shadow. Dark shadows are black and heavier.

### Leave calendar legend

Solid or dashed bars, not a second palette:

- Annual leave
- Sick
- Parental
- Time off in lieu
- Unpaid
- Compassionate
- Waiting (dashed)

Short-crewed roster cells go pink. Open watches are dashed outlines. Sick days on the roster are hatched.

---

## Type and chrome

### Type

One family: **Urbanist**, variable weight 400–700, from Google Fonts (`family=Urbanist:wght@400..700`). Fallback stack: `system-ui, -apple-system, "Segoe UI", sans-serif`. Body is 14px. There is no serif and no monospace except the keyboard hint (`.kbd`).

The greeting is set larger than the display token.

| Token | Size | Typical use |
| --- | --- | --- |
| Rendered `h1` | 38px / weight 600 / tracking −0.95px / line-height ~1.04 | “Good morning, Isla”, page titles |
| `--fs-display` | 34px | Display scale |
| `--fs-4xl` | 26px | Large figures |
| `--fs-3xl` | 22px | Section figures |
| `--fs-2xl` | 20px | Card titles |
| `--fs-xl` | 17px | Emphasized numbers |
| `--fs-lg` | 15px | Lead-in |
| `--fs-base` | 14px | Body, names |
| `--fs-md` | 13.5px | Table cells |
| `--fs-sm` | 12.5px | Secondary |
| `--fs-xs` | 12px | Meta |
| `--fs-2xs` | 11px | Badges, axis labels |

Greeting copy follows the time of day: “Good morning”, “Good afternoon”, “Good evening”.

### Shape and layout tokens

| Token | Value |
| --- | --- |
| `--r-sm` | 10px |
| `--r-md` | 14px |
| `--r-lg` | 20px |
| `--r-xl` | 26px |
| `--gap` | 12px |
| `--pad` | 14px |
| `--inset` | 12px |
| `--max` | 1440px |
| `--font` | `"Urbanist", system-ui, -apple-system, "Segoe UI", sans-serif` |

Cards sit near 20px radius. The search field and the day chip are fully round. Avatars are circles with a two-letter mark on a pastel wash (`--h1` … `--h6`) and a small green presence dot.

### Buttons and controls

- **Primary** (`.btn--primary`): solid accent, label in `--accent-ink`. Create, Add a watch, Add a person, Book leave, Approve and lock.
- **Secondary**: card surface with a hairline. Export, Book time off.
- **Ink** (`.btn--ink`): near-black in light mode. Sign off.
- **Small icon buttons** (`.ibtn`, `.ibtn--sm`): approve (check) and decline (cross) in the inbox.
- Primary actions with `.magnetic` get the cursor lean.
- Segmented controls (Hours / Cover, By month / By department, role chips) use a thumb or a pressed black pill for the active item. Inactive chips are pale grey.
- Status pills: green “In” / “Active” / “Running”, blue “On a break” / “Probation”, amber “Review” / “Waiting”.

### Icons

A single 24px stroke set, `currentColor`, round caps, no filled pictograms. Examples: sun-over-waves brand, anchor (deck), wrench, chef, cup, ticket, building, plus, search, bell, download, check.

### Tables

Quiet header, hairline rows, colored department tag (icon + short name), base shown as a colored dot plus name, status as a pill. Sortable directory columns: Name, Department, Base, Contract, Started, Status.

### Density

Settings → Appearance → Layout:

- **Comfortable** (default)
- **Compact** — “Compact fits more rows into tables and the roster.”

Switching density toasts “Compact rows” or “Comfortable rows”.

---

## Routes

| Hash | Title |
| --- | --- |
| `#/overview` | Overview — Tidra |
| `#/crew/directory` | Directory · Crew — Tidra |
| `#/crew/org` | Chain of command · Crew — Tidra |
| `#/crew/teams` | Departments · Crew — Tidra |
| `#/crew/directory/:id` | A person, e.g. `#/crew/directory/E1014` |
| `#/attendance/duty` | On duty · Attendance — Tidra |
| `#/attendance/roster` | Roster · Attendance — Tidra |
| `#/attendance/timesheets` | Timesheets · Attendance — Tidra |
| `#/leave/requests` | Requests · Time off — Tidra |
| `#/leave/calendar` | Calendar · Time off — Tidra |
| `#/leave/balances` | Balances · Time off — Tidra |
| `#/payroll/run` | Pay run · Payroll — Tidra |
| `#/payroll/payslips` | Payslips · Payroll — Tidra |
| `#/payroll/history` | History · Payroll — Tidra |
| `#/performance/reviews` | Reviews · Performance — Tidra |
| `#/performance/goals` | Goals · Performance — Tidra |
| `#/performance/kudos` | Commendations · Performance — Tidra |
| `#/hiring/pipeline` | Pipeline · Hiring — Tidra |
| `#/hiring/openings` | Open berths · Hiring — Tidra |
| `#/onboarding/starters` | Joiners · Onboarding — Tidra |
| `#/onboarding/templates` | Checklists · Onboarding — Tidra |
| `#/onboarding/starters/:id` | A joiner, e.g. `#/onboarding/starters/ST-40` |
| `#/insights` | Insights — Tidra |
| `#/settings/company` | Company · Settings — Tidra |
| `#/settings/access` | Roles & access · Settings — Tidra |
| `#/settings/appearance` | Appearance · Settings — Tidra |
| `#/settings/alerts` | Notifications · Settings — Tidra |
| `#/settings/data` | Data · Settings — Tidra |
| `#/support` | Support — Tidra |

Unknown first segments fall back to Overview. A section with sub-pages and no valid sub-id opens its first tab.

---

## Pages

### Overview — `#/overview`

**Good morning, Isla.**

> 62 of 64 crew due so far are on duty and 2 didn’t show. 2 sailings are short of minimum crew — the next at 15:45. 6 time-off requests are waiting.

Actions: **Book time off**, **Add a watch**.

**Today on the water.** 14 sailings across two ships, 10 still to go. Axis 06:00–22:00. Legend: Sailed, At sea, Boarding, Short-crewed. A red now-line sits on 10:40.

MV Corran, Skerrow ⇄ Inchmor: 06:40 Inchmor (sailed), 08:20 Skerrow (sailed), 10:20 Inchmor (at sea), 12:10 Skerrow, 14:10 Inchmor, 16:00 Skerrow, 17:50 Inchmor, 19:40 Skerrow.

MV Brae Lass, Skerrow ⇄ Rennay: 07:15 Rennay (sailed), 09:00 Skerrow (sailed), 11:30 Rennay, 13:30 Skerrow, **15:45 Rennay short 1**, **18:00 Skerrow short 1**.

Under the plot, the next crossings:

- 10:20 under way, Skerrow → Inchmor, MV Corran, 11/11
- 11:30 in 50m, Skerrow → Rennay, MV Brae Lass, 5/5
- 12:10 in 1h 30m, Inchmor → Skerrow, MV Corran, 11/11

**My watch.** Shore office, 08:00–16:30. Pill: Running. A dial reads **02:35:54** of 8.5h today, signed on 08:04. Actions: Take a break, Sign off. Seven day bars (Wed–Tue) and “Average day 6.9h”.

**KPI row** (each is a link):

| Tile | Value | Foot | Goes to |
| --- | --- | --- | --- |
| On duty now | 62 / 83 | 97% of those due are aboard | `#/attendance/duty` |
| Crewed to minimum | 8 / 10 to go | 2 short · next 15:45 | `#/attendance/roster` |
| Off today | 7 | 2 sick · 5 planned | `#/leave/calendar` |
| Open berths | 8 | across 5 roles | `#/hiring/openings` |

**Crew hours this week.** 4,410 hours rostered, by department and day. Toggle **Hours** / **Cover**. A heatmap, Deck through Office by Mon–Sun. Legend: fewer → more hours. Tuesday is marked today.

**Waiting on you.** 10 decisions, oldest Sat 6:02. Segments: Time off 6, Swaps 2, Overtime 2. Each row has a person, a type, a note, and decline / approve. “All” goes to `#/leave/requests`.

**Most commended.** Reviews and shout-outs this month. “All” goes to `#/performance/kudos`.

| Rank | Person | Role | Score |
| --- | --- | --- | --- |
| 1 | Femi Popescu | Ordinary seaman · Corran | 4.4 |
| 2 | Olumide Bakare | Chief cook · Corran | 4.3 |
| 3 | Idris Chen | Café steward · Corran | 4.3 |
| 4 | Molly Kowalski | Cook · Corran | 4.3 |

Each row has a small sparkline.

**Joiners.** One person at a time, with a progress meter and today’s tasks (some already checked). “The whole checklist →” opens that joiner. People on the switcher include Reuben Asante (Ticket agent, day 2), Yara Nasser, Sofia Lindgren, Marta Kowalczyk, Kieran Doherty. Sample tasks: ship familiarisation tour, muster station and lifejacket drill, Tidra account and app invite, meet your buddy, bank details and next of kin.

**Overtime by month.** Paid hours across the line, 363h in November, with a delta down versus the previous period. A column chart.

**Coming up.** The next ten days. Birthdays and years-at-sea, with “I’m going”. Examples: Rosa Bennett, birthday, Terminal, today. Freya Achterberg, birthday, Deck, Corran, tomorrow. Isla Popescu, 6 years, café steward, tomorrow. Rahul Fischer, birthday, engine room, Thu 5.

A bottom tab bar repeats Overview, Crew, Duty, Time off for small screens.

### Crew — `#/crew`

**Crew.** 112 people across two ships, the terminal and six departments.

Actions on every tab: **Export**, **Add a person**.

Tabs: Directory, Chain of command, Departments.

**Directory** (`#/crew/directory`)

Search: “Search by name, job or email”. Count, e.g. 112 of 112. Sort: Name, Department, Longest serving.

Chips:

- All departments, Deck 26, Engine room 16, Galley 12, Onboard service 20, Terminal 22, Shore office 16
- Corran, Brae Lass, Terminal
- Full-time, Part-time, Seasonal, Probation, Notice

Table columns: Name (avatar, name, role), Department (colored tag), Base (colored dot), Contract, Started (date and tenure, e.g. “28 Oct 2022 / 4.0 yrs”), Status (Active, Probation, Off today, and similar).

A row links to `#/crew/directory/{id}`.

**Chain of command** (`#/crew/org`)

Filters: Everyone, Deck, Engine room, Galley, Onboard service, Terminal, Shore office. **Fold all**.

An org tree. Root: **Rory Lindsay**, Operations director, Office, Terminal, 111 people. Reports include:

- Isla Macrae, Head of Crewing, 1 report
- Nadia Farouk, Finance manager
- Euan Moffat, Master, MV Corran, 15 reports
- Kenji Arai, Chief engineer, 15 reports (expanded into ratings, motormen, second engineers, ETO)
- Olumide Bakare, Chief cook, 11 reports
- Carmen Ibáñez, Onboard service manager, 19 reports
- Tessa Brodie, Terminal manager, 21 reports
- Fergus Mair, Master, MV Brae Lass, 5 reports
- Plus shore roles: fleet fitters, crewing assistants, finance assistants, bookings advisor, marine superintendent

Each node is a card: initials, name, role, department tag, base, and a “N reports” disclosure.

**Departments** (`#/crew/teams`)

The six teams, each with its head, headcount, and the one-line description in the world table above.

### Attendance — `#/attendance`

**On duty** (`#/attendance/duty`)

**Attendance.** “Tue 3 Nov · live across both ships and the terminal.” Action: **Add a watch today**.

Tabs: On duty, Roster, Timesheets (badge 26).

Tiles:

| Tile | Value | Foot |
| --- | --- | --- |
| On duty | 62 | 97% of those due so far |
| Late today | 8 | Worst: 30 min |
| No-shows | 2 | Chase them or fill the gap |
| Off today | 7 | 19 more watches start later today |

Filters: Department, Base, Everyone, Late & no-shows 10.

Rows grouped by department (“Deck, 16 in of 18 on today”) with a thin progress bar. Each person: avatar, name, role and base, watch (e.g. 06:00–14:00) and signed-on time (e.g. 5:57), status **In** or **On a break** with a **Back** action, and a more menu.

Side column:

- **Open watches today.** “Nobody has picked these up yet.” Dashed rows with **Fill**. Examples: 14:00–22:00 Deck, MV Brae Lass, 8h. 06:00–14:00 Deck, MV Brae Lass, 8h. 14:00–22:00 Onboard service, MV Corran, 8h.
- **Off today.** Approved leave and sickness. Siobhan Kowalski, annual leave, back 7 Nov. Femi Malik, annual leave, back 7 Nov. Saoirse Laurent, sick, back 4 Nov. Luca Hughes, parental, back 16 Dec. Mateus Novak, annual leave, back 4 Nov. Kwame Walsh, time off in lieu, back 4 Nov. Ama Owusu, sick, back 4 Nov.

Status vocabulary used in this section: in, late, break, remote, absent, due, leave, done.

**Roster** (`#/attendance/roster`)

“Week of 2 Nov – 8 Nov. Drag a watch to move it.” Action: **Add a watch**.

**Cover, rostered / needed.** A grid of department × day. A cell at or above need is a green underline. A short cell is a pink wash. Sample (Mon 2 → Sun 8):

| Dept | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deck | 15/17 | 18/17 | 16/17 | 12/17 | 16/18 | 18/18 | 17/18 |
| Engine room | 10/11 | 11/11 | 11/11 | 9/11 | 13/12 | 10/12 | 12/12 |
| Galley | 9/8 | 7/8 | 7/8 | 8/8 | 10/9 | 3/9 | 10/9 |
| Onboard service | 13/13 | 16/13 | 12/13 | 14/15 | 14/15 | 15/15 | 11/15 |
| Terminal | 12/14 | 15/14 | 16/14 | 12/14 | 16/14 | 15/14 | 16/14 |
| Shore office | 15/13 | 16/13 | 16/13 | 15/13 | 15/13 | 2/2 | 1/2 |

Thursday Deck and Engine, Saturday Engine and Galley, and Sunday Service and Office are the short (pink) cells in that week.

Under the cover grid: **Week / Day**, All bases, All departments, **Open all**.

Person rows grouped by department (“Deck, 26 people, 104h”) with the same cover fraction in the group header. Watches are chips (06:00–14:00, 8h, 12h rest). Open watches are dashed (“8h · open”). Sick days are hatched and labelled SICK. Drag a watch to move it.

**Timesheets** (`#/attendance/timesheets`)

“Week of 26 Oct – 1 Nov. Approved hours go into November’s pay.” Badge 26 on the tab.

### Time off — `#/leave`

**Requests** (`#/leave/requests`)

**Time off requests.** “6 waiting on a decision.” Empty state: “Nothing waiting. New requests land here first.” Action: **Book leave**.

Tabs: Requests (badge 6), Calendar, Balances.

KPIs include Waiting on you, Starting this week, Off today, Booked in November (“N days”). Rows can be approved or declined. Statuses: pending, approved, declined, cancelled.

**Calendar** (`#/leave/calendar`)

**Time off calendar.** “Every absence across the line. Dashed bars are still waiting for a decision.” Action: **Book leave**.

November 2026, 15 absences this month. Prev / Today / Next. Filters: Everyone, Deck, Engine, Galley, Service, Terminal, Office.

A month grid. Multi-day bars carry a first name. Overflow days show “+1”, “+5”. Dashed bars are still waiting for a decision. Legend as listed under Color.

Side column: **Off today** (7 people, same list as duty) and **This week** (2–8 November) with the leave type.

**Balances** (`#/leave/balances`)

Remaining days per person.

### Payroll — `#/payroll`

**Pay run** (`#/payroll/run`)

**November pay run.** “Pays on Friday 27 November — 24 days. Review it by Monday 23rd.” Actions: **Export**, **Approve and lock**.

Tabs: Pay run, Payslips, History.

Header card **PR-2026-11**. November 2026, 112 people, pay day 27 Nov 2026. Pill: **Review**. Stepper: Draft (done) → Review (current) → Approve → Paid.

| Tile | Value | Foot |
| --- | --- | --- |
| Gross pay | £293,335 | ↑ 10% on October |
| Net to pay | £231,507 | Into 112 bank accounts |
| Tax and NI | £50,074 | To HMRC by 22 December |
| Pension | £11,755 | 5% from staff, 3% from us |
| Cost to the line | £339,130 | Gross + £45,795 employer NI and pension |

**Gross by department.** Basic, overtime and sea allowance.

| Dept | People | Gross |
| --- | --- | --- |
| Deck | 26 | £72k |
| Engine room | 16 | £48k |
| Galley | 12 | £27k |
| Onboard service | 20 | £47k |
| Terminal | 22 | £52k |
| Shore office | 16 | £48k |

**Before it goes.** 5 of 5 checks open.

| Check | Detail | Action |
| --- | --- | --- |
| 2 overtime claims not decided | Dmitri 2.5h, Mei 1.5h | Approve all |
| 2 people without bank details | Elif Hartley and Rosa Okonkwo — pay is held until they add them | Send reminders |
| 2 leavers to pay off | Rosa Moreno, Zainab Iqbal — final pay includes holiday they haven’t taken | Confirm final pay |
| No joiners this month | Nobody to pro-rate in November | Looks right |
| Sea allowance: 1,042 sailings to pay | Every rating aboard, at £4.10 a sailing from the deck logs | Confirm sailings |

Confirming a check toasts, for example “Asked for bank details”, “Final pay confirmed, P45s go out with the run”, “Pro-rated pay confirmed”, “Sea allowance confirmed from the deck logs”.

**Approve November’s run?** It locks 112 payslips at the gross figure. Changes after that go into December. Confirm label: **Approve and lock**. Toast: “Run approved and locked”.

**Where £293,335 goes.** A stacked bar. Take-home £231,507 (79%). Income tax £36,331 (12%). The rest is the remaining deductions (NI, pension, and so on), colored in the department sequence.

**Payslips** (`#/payroll/payslips`) and **History** (`#/payroll/history`) are the other two tabs. History is prior runs. Payslips are the individual slips for the 112 people.

### Performance — `#/performance`

**Reviews** (`#/performance/reviews`)

**Autumn reviews.** “Every review signed off by [a date 24 days out].” Action: **Remind every manager**.

Rating scale, drawn as stars that pop in:

1. Below expectations
2. Partly meets
3. Meets expectations
4. Exceptional

Unrated copy: “Not rated”. A nudge toasts “Nudged {reviewer}” / “Reminded {reviewer} about {employee}’s review”. A person opens at `#/performance/reviews/{id}`.

**Goals** (`#/performance/goals`) is the second tab.

**Commendations** (`#/performance/kudos`) is the third. Same people as Most commended on Overview, with monthly sparklines. “All” on Overview links here.

### Hiring — `#/hiring`

**Pipeline** (`#/hiring/pipeline`)

**Hiring pipeline.** “5 roles with open berths · 29 candidates in play.” Action: **Add candidate**.

Tabs: Pipeline 29, Open berths 5.

Role chips: All roles, Able seaman 4, Second engineer 7, Linkspan operator 6, Café steward 5, Cook 4, Bookings advisor 3, Second mate 0.

Base chips: All bases, Corran, Brae Lass, Terminal.

Columns: **Applied** (6), **Phone screen** (8), **Interview** (10), **Offer**, **Hired**. Hint: “Drag a card to another column to move them on. Click to open.”

A card shows initials, name, role and base, and a 5-dot rating. Dragging scales the card to 1.04 and rotates it −1.5°. Dropping in Hired turns them into a joiner: “{first name} becomes a joiner as {title} at {base}, with the onboarding checklist ready to go.” Toast pattern: “{first name} is hired — onboarding starts {date 14 days out}”.

**Open berths** (`#/hiring/openings`) lists the roles themselves. Action on that tab: **Open a role**.

### Onboarding — `#/onboarding`

**Joiners** (`#/onboarding/starters`)

People settling in. “Every checklist ends with a day-30 review.” Action: **Add a joiner**.

Filters include Settling in and Everyone. Each joiner is a card with a ring (percent complete) and the open tasks. A joiner opens at `#/onboarding/starters/{id}` (sample `ST-40`).

Empty states: “Nothing waiting / Every open phase is ticked off.” and “Nobody is onboarding”.

Completing a phase toasts “{phase} done for {first name}”. Finishing the list toasts “{first name} is fully onboarded”.

The checklist uses a step list. Finished steps show a check. The current step (`.is-now`) breathes. The connector between steps fills with `scaleX`.

**Checklists** (`#/onboarding/templates`)

“The lists every new joiner works through, by department.”

### Insights — `#/insights`

**Crew insights.** “Twelve months of the Skerrow Line in numbers. Pick a metric, read it by month or by team.” Action: **Export CSV**.

Metric switcher:

| Metric | Value |
| --- | --- |
| Headcount | 112 |
| Turnover | 27.0% |
| Absence rate | 4.0% |
| Overtime | 363h |
| Labour cost | £298k |
| Time to hire | 19d |

The selected metric shows the November figure, a delta versus October (“higher is better” where that applies), the 12-month average, and the highest department (Deck, 26, for headcount).

**{Metric} by month.** “This year against last, Dec – Nov.” Toggle **By month** / **By department**. A line chart, Dec 2025 through Nov 2026, this year against last year. Months named in the chart: Dec, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov.

**Who works where.** 112 people by base and department.

**When people call in sick.** Unplanned absence, last 12 weeks. Darker is more. Copy calls out a high cell, for example Mondays in the engine room.

**Saved views.** Chips such as “Summer overtime” and “Absence by team”, each removable. A name field (placeholder “Headcount by month”) and **Save view**. Saving toasts “Saved “{name}””. Removing toasts “View removed”. Export filename pattern: `tidra-{metric}-by-month`.

### Settings — `#/settings`

Section tabs: Company, Roles & access, Appearance, Notifications, Data.

**Company** (`#/settings/company`)

“Skerrow Line Ferries Ltd · these details print on payslips and contracts.”

**The company.** “As registered at Companies House.”

| Field | Notes |
| --- | --- |
| Trading name | Required, at least 2 characters. Error: “Add a trading name.” |
| Legal name | Required. Error: “The legal name can’t be empty.” |
| Company number | Eight digits. Error: “Eight digits, e.g. 09412287.” |
| Currency | Disabled. Value `GBP · £`. |
| Registered address | Required, at least 6 characters. Error: “A full address, please.” |

**Pay calendar**

| Field | Options / rule |
| --- | --- |
| Payday (day of the month) | 1–28. Error: “Pick a day from 1 to 28.” |
| Roster week starts | Monday, Sunday, Saturday |
| Holiday year starts | January, April, September |

**Undo changes** and **Save**. Save is disabled until something differs. A bad field shakes and is marked `.is-bad`. Toast: “Company details saved”. Activity line: “updated the company details”.

**The fleet.** “Each ship runs its own roster and shares one payroll.” One row per place, marked In service or Open.

**Roles & access** (`#/settings/access`)

“Who can see pay, approve time off and change the roster.”

**Appearance** (`#/settings/appearance`)

“How Tidra looks on this device.”

**Theme.** “Saved on this device.” Light, Dark, Match the device, as in the Color section. Choosing one runs the circular reveal.

**Layout.** “Only on wide screens; tablets always use the rail.”

- Icon rail. “Fold the sidebar to icons. Shortcut: `[`.” On a narrow window the toast is “The sidebar is already a rail at this width.”
- Density. Comfortable or Compact. “Compact fits more rows into tables and the roster.”

**Notifications** (`#/settings/alerts`)

“What rings the bell for you, in the app and by email.”

**What rings the bell.** “For you, on every device.”

| Key | Label | Detail |
| --- | --- | --- |
| noShow | No-shows | When someone is 15 minutes past the start of a watch and hasn’t signed on |
| leaveEmail | Leave requests | A new request from your team, and one still waiting after two days |
| rotaPush | Roster changes | Swaps, open watches picked up and a published roster |
| payroll | Pay run steps | (pay-run progress) |

**Data** (`#/settings/data`)

“Export what’s here, or put the demo back as it was.”

**Export everyone** downloads a CSV of crew access: ID, Name, Role, Department, Base, Contract, Start, Email, Access. Filename stem `skerrow-crew-access`.

### Support — `#/support`

**Help & support.** “Answers to what people ask the people team most, and a way to ask us anything else.” Action: **Ask the people team**.

Search: “What do you need a hand with?” Placeholder: Search, e.g. “allowance”, “swap”, “sick”.

Topic cards:

| Topic | Count | Blurb |
| --- | --- | --- |
| Roster & watches | 3 | Swaps, open watches, signing on |
| Time off | 4 | Holiday, sickness, time off in lieu |
| Pay | 4 | Payslips, sea allowance, tax codes, overtime |
| Hiring | 1 | Roles, candidates, offers |
| Onboarding | 1 | Checklists, buddies, day 30 |
| Your account | 1 | Signing in, the app, your details |

**Common questions.** 14 of 14 answers. Opening one unclips the answer.

- How do I swap a watch with someone? Open the watch on Attendance → Roster and choose Swap, then pick who takes it. They accept in the app, and your manager approves it from their Overview. Until it’s approved, the watch is still yours.
- What is an open watch?
- I forgot to sign on. What now?
- How much holiday do I have left?
- When do I need to book Christmas leave by?
- I’m ill and can’t come in. Who do I tell?
- What is time off in lieu?
- When are we paid?
- How is sea allowance paid?
- My tax code looks wrong.
- When is overtime paid?
- Can I refer a friend for a job?
- What does a buddy do?
- How do I change my bank details?

**The people team.** Shore office, Port Skerrow. Pill: In now. Isla Macrae and Dev Sharma, with hours, email and phone as listed under Shell. Urgent, out of hours: duty officer at the terminal.

**Your questions.** “1 waiting on the people team.”

| Ticket | Status |
| --- | --- |
| Payslip shows the wrong tax code. HT-88, Pay, Sat 10:40 | Answered |
| Does my ENG1 renewal count as paid time? HT-91, Leave, 6 h ago | Waiting |

---

## Build notes from the demo

Styles and scripts are content-hashed under `/tidra/assets/`. One CSS file per section (overview, crew, attendance, leave, payroll, performance, hiring, onboarding, insights, settings, support) plus `index-*.css`. GSAP and the app’s animation helpers live in `kit-*.js`. React renders the shell. Pages are lazy chunks.

The animation helpers are not on `window`. They are module-private, with GSAP registered as the local `K` and the Flip plugin registered beside it. `window.gsap` is not exposed.

Class hooks worth knowing if you rebuild this:

- `.magnetic` — cursor lean
- `[data-lift]` — 4px hover rise after intro
- `.is-flash` — accent color flash
- `.live` — breathing presence dot
- `.steps li.is-now` — breathing ring on the current step
- `.snav__pill` — the sliding nav indicator
- `.ch` / `.word` — split headline characters
- `.meter` — scaleX progress
- `.stair` — chart that eases `--stair-c`

# Queen's Banquet Events — System Redesign Draft
**Palette: White / Off-White / Gold / Black**

Status: **Draft for review** — no code changes yet. This covers the client dashboard, admin dashboard, and shared auth pages. (The public guest-facing invitation pages already have their own theming system per-event and are treated separately, see §7.)

---

## 1. Design Vision

A refined, "boutique hotel concierge" aesthetic — quiet luxury rather than loud gold. Black and off-white carry the weight; gold is used sparingly as an accent (active states, key CTAs, dividers, icons) rather than painted everywhere it is today. Lots of whitespace, soft shadows instead of hard borders, and one consistent gold — not two.

**Principles**
- **Gold = signal, not decoration.** Reserve it for primary actions, active nav state, key numbers/stats, and focus states. Everything else stays black/white/gray so gold still feels premium when it appears.
- **One token system.** Unify the dashboard gold (`#D4AF37`) and invitation gold (`#b47b36`) into a single scale used everywhere except guest-facing invitation themes (which stay per-event customizable).
- **Calm surfaces.** Replace the current flat `--gray-light` (#F0EEEA) dashboard background with a true off-white and let cards float with soft shadow instead of heavy borders.
- **Consistent type rhythm.** Playfair Display stays for headings/brand (it's doing real work already); Poppins stays for UI text. Drop the unused Great Vibes font-load to cut a network request.

---

## 2. Unified Design Tokens

Proposed replacement for `frontend/src/styles/variables.css`:

```css
:root {
  /* Brand gold — single scale, replaces both --gold and --inv-primary */
  --gold-950: #4A3A0F;
  --gold-800: #8A6A17;
  --gold-700: #B8960C;   /* was --gold-dark */
  --gold-600: #C9A227;
  --gold-500: #D4AF37;   /* primary gold — unchanged, most recognizable */
  --gold-400: #E0C158;
  --gold-300: #E8C84A;   /* was --gold-light */
  --gold-100: #F5EEC8;   /* was --gold-pale */
  --gold-50:  #FBF7E8;

  /* Neutrals */
  --black:        #17140F;   /* slightly warmer than pure #1A1A1A, pairs better with gold */
  --charcoal:     #2A241C;
  --white:        #FFFFFF;
  --off-white:    #FAF7F1;   /* app background, replaces --gray-light */
  --ivory:        #F3EEE3;   /* secondary surface / hover */
  --border:       rgba(23, 20, 15, 0.10);
  --border-gold:  rgba(212, 175, 55, 0.35);
  --text:         #17140F;
  --text-muted:   #6B6259;
  --text-inverse: #FAF7F1;

  /* Semantic (kept, slightly desaturated so gold still reads as the accent) */
  --success:      #2F6E44;
  --success-bg:   #E8F3EA;
  --danger:       #A13B3B;
  --danger-bg:    #F5E7E7;
  --info:         #395A80;
  --info-bg:      #E8EEF5;

  /* Elevation */
  --shadow-sm: 0 2px 8px rgba(23, 20, 15, 0.05);
  --shadow:    0 8px 30px rgba(23, 20, 15, 0.07);
  --shadow-lg: 0 20px 60px rgba(23, 20, 15, 0.14);

  /* Shape & rhythm */
  --radius-sm: 8px;
  --radius:    14px;
  --radius-lg: 22px;
  --nav-h:     72px;
  --sidebar-w: 260px;
}
```

**Migration note:** old variable names (`--gold`, `--gold-dark`, `--gray-light`, etc.) can be kept as aliases pointing at the new tokens during rollout so we don't have to touch every CSS file on day one.

---

## 3. Typography

| Use | Font | Weight |
|---|---|---|
| Brand wordmark / page H1 | Playfair Display | 600–700 |
| Section headings (H2/H3) | Playfair Display | 500–600 |
| Body, forms, tables, nav | Poppins | 400–500 |
| Stat numbers / emphasis | Poppins | 600, tabular-nums |

Drop **Great Vibes** from `index.html` (loaded but never used — free perf win).

---

## 4. Core Component Restyle

### Buttons
| Variant | Look |
|---|---|
| Primary (`.btn-gold`) | Solid `--gold-500` fill, `--black` text, hover → `--gold-700` |
| Secondary (`.btn-dark`) | Solid `--black` fill, `--off-white` text — for the *second* most important action per screen |
| Outline (`.btn-outline`) | Transparent, 1.5px `--black` border, black text; hover fills `--black` |
| Ghost/link | No border/fill, gold text, underline on hover |
| Destructive | Keep `--danger` outline/solid for delete actions only |

### Cards / Stat Cards
- White surface on off-white page background (currently the reverse contrast is weaker)
- Remove heavy borders, use `--shadow-sm` at rest, `--shadow` on hover for interactive cards
- Add a thin 3px gold top-accent bar on `StatCard` for visual rhythm instead of colored icon chips

### Tables (`DataTable`)
- Header row: off-white/ivory background, small-caps or letter-spaced label, no vertical borders
- Row hover: `--ivory` background
- Row dividers: 1px `--border` (hairline), not boxed
- Status badges restyled as pill shapes with tinted background + matching text color (gold/success/danger/info), removing the current bright flat badge colors

### Forms
- Inputs: white fill, 1px `--border`, focus ring uses `--border-gold` + subtle gold glow instead of default blue
- Labels: Poppins 500, `--text-muted`, uppercase small letter-spacing for a more "boutique" feel

### Modals
- White surface, `--radius-lg`, `--shadow-lg`
- Header gets a hairline gold underline instead of full gold bar

---

## 5. Navigation Redesign

### Sidebar (`Sidebar.jsx`)
Current: light background, gold-tinted highlight for active link, black avatar for admins.

Proposed: **switch the sidebar itself to solid black (`--black`)** as the anchor of the "black" part of the palette (currently black barely appears anywhere in the dashboard chrome). This immediately makes the palette feel intentional (white content area, black sidebar, gold accents) rather than "off-white everything."

- Sidebar background: `--black`
- Sidebar text: `--text-inverse` (off-white), muted icons at 70% opacity
- Active nav item: gold text + 3px gold left-border + `rgba(212,175,55,0.12)` background tint (no full gold fill — keeps it classy)
- Profile block at top: avatar in gold circle with black initials (flips current admin/client logic so gold is consistently the "you are here" identity color)
- Section labels (if any) in gold, small-caps, letter-spaced
- Logout footer item: subtle, muted white, red only on hover

This is the single highest-impact visual change — it turns "gold sprinkled on cream" into a clear white/black/gold hierarchy.

### Top Navbar (`PanelNavbar.jsx`)
- White background (unchanged), sits above the black sidebar — creates clean contrast at the top-left corner
- Wordmark "Queen's Banquet" in Playfair Display + a small gold monogram mark to the left (see §8, Assets) — currently text-only
- Notification bell: black icon, gold dot badge for unread count

### Mobile
- Keep existing slide-out pattern (≤900px), sidebar becomes an off-canvas black panel over a dimmed backdrop — no structural change needed, just re-skin.

---

## 6. Page-by-Page Notes

### Auth (Login / Forgot Password)
Already closest to the target look (dark panel + white form). Refine:
- Replace dark gradient (`#2C1810`) with solid `--black` or a very subtle black→charcoal gradient for consistency with sidebar
- Add gold monogram/logo mark to the dark panel
- Form side: off-white background instead of pure white, white input fields for contrast

### Client Dashboard
- Stat cards: Total Invitations, Published, RSVP responses, Upcoming Events — apply gold top-accent card style
- "Invitation Workspace" CTA card: make this the one spot per page allowed to use a bold gold-filled hero card (it's the primary action)
- Table + timeline restyled per §4

### Invitation Builder / Manage
- Largest, most complex page — keep functional layout, restyle: step indicator (numbered circles: black outline → gold fill on active/complete), motif picker cards get hairline borders instead of colored blocks, preview modal shell restyled per §4

### RSVP Monitoring (client & admin)
- Attendance breakdown chart: recolor segments to gold / black / muted gray / soft red (Attending / Maybe / Declined / No response) instead of default chart colors
- Stat cards + table per §4

### Admin Dashboard
- Same stat card treatment; recent invitations table + category bar chart recolored to the neutral+gold system
- "Generated reports" list restyled as a simple hairline list, not boxed rows

### Client Management (admin)
- Table restyle; add/edit modals per §4; role/status badges as pills

### Calendar (admin)
- Fix missing `--cream` variable bug while restyling
- Today = gold outline; selected day = solid black; event dots = gold

### Gallery (admin)
- Masonry grid stays; add a subtle hover overlay (black at 40% opacity + white "view" icon) instead of current treatment

### Settings (client & admin)
- Standard form styling per §4; group into card sections with Playfair sub-headings

### Notifications (feature-flagged, client)
- Panel: white surface sliding over dimmed black backdrop; unread items get a 3px gold left-border instead of full-row tint

---

## 7. Public Invitation Pages — Scope Decision

The guest-facing invitation renderer (`InvitationRenderer` + ~30 section components) has its **own per-event theme system** (8 motif presets, custom colors) that clients configure for their guests — that's a feature, not a bug, and shouldn't be hard-locked to white/off-white/gold/black.

Recommendation: leave the invitation *rendering engine* as-is (still fully customizable per event), but:
- Update the **"Classic Gold" default motif** to match the new unified gold scale, so a brand-new invitation with default settings matches the dashboard brand
- Restyle the **builder chrome around it** (motif picker, preview modal, dashboard-side controls) per §4/§6, since that *is* part of the admin/client dashboard experience

---

## 8. Assets / Branding Gap

There is currently **no logo file** anywhere in the app — the brand is text-only ("Queen's Banquet") in the navbar and auth screen. For a redesign centered on a specific palette, a simple gold monogram mark (e.g. a stylized "Q" or crown glyph in gold on black/white) would meaningfully elevate the sidebar, navbar, auth screen, and browser favicon. Flagging this as an open item — can be a quick SVG mark, doesn't need to be a full logo suite.

---

## 9. Cleanup While We're In There

- Remove ~40% of `globals.css` that is dead marketing/landing CSS inherited from the static prototype (`.hero`, `.packages-grid`, `.testimonials-wrap`, `.footer-grid`, etc.) — not used by any React page
- Fix undefined `var(--cream)` reference in `Calendar.jsx`
- Drop unused Great Vibes font import
- Decide fate of hidden-but-routed pages: `/admin/invitation-templates` and `/client/settings` are built but not in their sidebars — surface them or intentionally remove the routes

---

## 10. Phased Rollout Plan

| Phase | Scope | Risk |
|---|---|---|
| **1. Tokens** | Replace `variables.css` with unified scale (aliased for backward-compat) | Low — visual only, no logic touched |
| **2. Shell** | Re-skin `Sidebar`, `PanelNavbar`, `DashboardShell` (the black sidebar change) | Low-Medium — affects every authenticated page at once, so needs a visual QA pass across both roles |
| **3. Core components** | `Button`, `StatCard`, `DataTable`, `Modal`, badges, form inputs | Low — isolated components, changes propagate everywhere automatically |
| **4. Auth pages** | Login / Forgot Password re-skin | Low |
| **5. Page-by-page polish** | Dashboard → RSVP Monitoring → Client Management → Calendar → Gallery → Settings → Invitation Builder/Manage (roughly easiest → most complex) | Low, incremental, one PR per page |
| **6. Invitation builder chrome + default motif** | Update "Classic Gold" motif tokens, restyle motif picker/preview | Low |
| **7. Cleanup** | Remove dead CSS, fix `--cream` bug, resolve hidden nav items, optional logo mark | Low |

This order lets us ship the highest-visual-impact change (Phase 1+2: tokens + black sidebar) first for early sign-off, then grind through pages without re-litigating the palette each time.

---

## 11. Open Questions

1. Sidebar → solid black is the biggest structural change proposed here. Comfortable with that direction, or prefer to keep the sidebar light/off-white and lean on gold + black only for accents/text?
2. Do we want a logo/monogram mark designed, or stay text-only for the brand?
3. Should hidden pages (`Invitation Templates`, client `Settings`) be added to their sidebars as part of this redesign, or left out of scope?
4. Any pages/flows *not* to touch right now (e.g. if Invitation Builder is mid-development elsewhere)?
5. Priority order preference — should we start from the dashboard shell (affects everything at once) or pilot the new look on one lower-traffic page first (e.g. Settings) before rolling out everywhere?

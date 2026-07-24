# Design System — Color Palette & Gradients
## LMS for Schools & Colleges

**Version:** 1.0
**Base palette provided:** 5 core greens (Evergreen → Lime Cream)
**Scope:** Full color system — base palette, extended tints/shades, neutrals, gradients, and exact usage mapping for every UI surface.

---

## 1. Base Palette (as provided)

These are the 5 anchor colors. Everything else in this document is derived from them.

| Name | Hex | Role in system |
|---|---|---|
| Evergreen | `#132a13` | Darkest — primary text, headers, deepest surfaces |
| Hunter Green | `#31572c` | Dark — primary brand color, main CTAs |
| Fern | `#4f772d` | Mid — secondary brand color, hover/active states |
| Palm Leaf | `#90a955` | Light-mid — accents, highlights, tags |
| Lime Cream | `#ecf39e` | Lightest — backgrounds, subtle highlights |

These five sit naturally on one light→dark ramp already (Lime Cream is the lightest, Evergreen the darkest), which is what makes them a strong base for a full extended scale rather than five disconnected colors.

---

## 2. Extended Palette — Full Tint/Shade Scales

Each base color is extended into a **10-step scale (50–900)**, following the standard design-token convention (50 = near-white tint, 900 = near-black shade, 500 = the original base color). This gives you enough range for backgrounds, borders, hover states, disabled states, and dark mode — without ever needing a color outside this family.

### 2.1 Evergreen scale
| Token | Hex | Typical use |
|---|---|---|
| `evergreen-50` | `#f1f2f1` | Rare — barely-tinted neutral background |
| `evergreen-100` | `#dee1de` | Subtle section background |
| `evergreen-200` | `#b8bfb8` | Disabled text on dark, dividers on dark surfaces |
| `evergreen-300` | `#899589` | Muted text on dark backgrounds |
| `evergreen-400` | `#4e5f4e` | Secondary dark surface |
| `evergreen-500` | `#132a13` | **Base** — primary heading text, darkest surface, footer background |
| `evergreen-600` | `#102410` | Hover state on evergreen-500 surfaces |
| `evergreen-700` | `#0d1d0d` | Pressed/active state |
| `evergreen-800` | `#0a170a` | Deep shadows, near-black surface |
| `evergreen-900` | `#071007` | Max-contrast surface (rare, e.g. modals-on-dark) |

### 2.2 Hunter Green scale (primary brand)
| Token | Hex | Typical use |
|---|---|---|
| `hunter-50` | `#f3f5f2` | Primary-tinted page background |
| `hunter-100` | `#e2e7e1` | Light card background for primary-themed sections |
| `hunter-200` | `#c1cdc0` | Borders on light primary sections |
| `hunter-300` | `#98ab96` | Disabled button background |
| `hunter-400` | `#658161` | Icon on light background |
| `hunter-500` | `#31572c` | **Base — Primary brand color.** Main buttons, nav bar, links, active tab |
| `hunter-600` | `#2a4a25` | Primary button **hover** |
| `hunter-700` | `#223d1f` | Primary button **active/pressed** |
| `hunter-800` | `#1b3018` | Primary button text on light, deep accents |
| `hunter-900` | `#132111` | Rarely used — max contrast primary |

### 2.3 Fern scale (secondary brand)
| Token | Hex | Typical use |
|---|---|---|
| `fern-50` | `#f4f7f2` | Secondary-tinted background |
| `fern-100` | `#e6ece2` | Info/secondary card background |
| `fern-200` | `#cad6c0` | Secondary borders |
| `fern-300` | `#a7bb96` | Secondary disabled state |
| `fern-400` | `#7b9962` | Secondary icon color |
| `fern-500` | `#4f772d` | **Base — Secondary brand color.** Secondary buttons, links-on-hover, teacher-role accent |
| `fern-600` | `#436526` | Secondary button hover |
| `fern-700` | `#375320` | Secondary button active |
| `fern-800` | `#2b4119` | Secondary text emphasis |
| `fern-900` | `#1e2d11` | Rarely used |

### 2.4 Palm Leaf scale (accent)
| Token | Hex | Typical use |
|---|---|---|
| `palm-50` | `#f8faf5` | Accent-tinted background |
| `palm-100` | `#eff3e7` | Tag/badge background |
| `palm-200` | `#dee5cc` | Chip background |
| `palm-300` | `#c8d4aa` | Chart gridlines, subtle accents |
| `palm-400` | `#acbf80` | Accent border |
| `palm-500` | `#90a955` | **Base — Accent color.** Highlights, badges, "active/enrolled" status, student-role accent |
| `palm-600` | `#7a9048` | Accent hover |
| `palm-700` | `#65763c` | Accent active/pressed |
| `palm-800` | `#4f5d2f` | Accent text on light backgrounds (AA-safe) |
| `palm-900` | `#374020` | Rarely used |

### 2.5 Lime Cream scale (lightest / highlight)
| Token | Hex | Typical use |
|---|---|---|
| `lime-50` | `#fefef9` | Page background (lightest option) |
| `lime-100` | `#fcfdf1` | Card background, sidebar background |
| `lime-200` | `#f9fbe2` | Table row (alt/zebra stripe) |
| `lime-300` | `#f6f9cf` | Highlighted row / selected item background |
| `lime-400` | `#f1f6b6` | Hover background on light surfaces |
| `lime-500` | `#ecf39e` | **Base.** Highlight backgrounds, "new" badges, notification dot background |
| `lime-600` | `#c9cf86` | Border on lime surfaces |
| `lime-700` | `#a5aa6f` | Muted text on lime background |
| `lime-800` | `#828657` | Deep accent — rarely used |
| `lime-900` | `#5a5c3c` | Rarely used |

---

## 3. Neutral / Gray Scale (derived from Evergreen)

Every real product needs true neutrals for body text and structural UI — pulling grays from the same hue family (rather than generic gray) keeps everything visually unified.

| Token | Hex | Typical use |
|---|---|---|
| `neutral-0` | `#ffffff` | Pure white — base page/card background |
| `neutral-50` | `#f4f4f4` | Page background (neutral alternative to lime-50) |
| `neutral-100` | `#e4e4e4` | Input background, disabled field background |
| `neutral-200` | `#c6c6c6` | Borders, dividers |
| `neutral-300` | `#a4a4a4` | Disabled text, placeholder text |
| `neutral-400` | `#818181` | Icon default (inactive) |
| `neutral-500` | `#5f5f5f` | Secondary body text |
| `neutral-600` | `#444444` | Primary body text (on light backgrounds) |
| `neutral-700` | `#323232` | Headings on light backgrounds (alternative to evergreen-500) |
| `neutral-800` | `#262626` | Near-black text |
| `neutral-900` | `#1b1b1b` | Dark mode page background |
| `neutral-950` | `#171717` | Dark mode deepest surface |

---

## 4. Semantic / Status Colors (supplementary)

The 5 provided colors are all greens, but a functional LMS needs distinct signal colors for warnings, errors, and info states — these should **not** be confused with the brand greens (e.g., a red error must never be replaced by dark green, or it becomes inaccessible for colorblind users and unclear in meaning). These four are **supplementary, not part of the original brand palette**, chosen to sit quietly alongside it in saturation and warmth:

| Purpose | Token | Hex | Notes |
|---|---|---|---|
| Success | `success-500` | `#4f772d` (**= fern-500**) | Reuses Fern directly — success = brand green, no new hue needed |
| Success (bg) | `success-100` | `#e6ece2` (**= fern-100**) | Success alert background |
| Warning | `warning-500` | `#d9a441` | Amber — used only for "fees due", "attendance low" alerts |
| Warning (bg) | `warning-100` | `#faf1de` | Warning alert background |
| Error / Destructive | `error-500` | `#b3423a` | Muted brick-red — drop/withdraw confirmation, validation errors, failed payment |
| Error (bg) | `error-100` | `#f5e2e0` | Error alert background |
| Info | `info-500` | `#3d6b8c` | Muted blue — informational banners only (kept rare, secondary to green identity) |
| Info (bg) | `info-100` | `#e2ebf0` | Info alert background |

> Rule of thumb: **Success always reuses Fern** (already in the brand palette). Warning/Error/Info are the only non-green hues in the entire system, and are reserved *exclusively* for their semantic meaning — never used decoratively.

---

## 5. Gradients

All gradients are built only from the base 5 colors (plus neutrals for overlays), so they always read as "on-brand."

### 5.1 Primary Hero Gradient
Used on: landing/marketing hero section, login page background.
```css
background: linear-gradient(135deg, #132a13 0%, #31572c 45%, #4f772d 100%);
/* evergreen-500 → hunter-500 → fern-500 */
```

### 5.2 Fresh / Light Gradient
Used on: dashboard headers, empty-state illustrations background.
```css
background: linear-gradient(135deg, #4f772d 0%, #90a955 60%, #ecf39e 100%);
/* fern-500 → palm-500 → lime-500 */
```

### 5.3 Primary Button Gradient
Used on: main CTA buttons ("Enroll Now", "Submit", "Pay Fees").
```css
background: linear-gradient(180deg, #3a6633 0%, #31572c 100%);
/* slightly lighter hunter → hunter-500, gives subtle top-light button feel */
```
Hover state:
```css
background: linear-gradient(180deg, #31572c 0%, #2a4a25 100%);
/* hunter-500 → hunter-600 */
```

### 5.4 Card / Panel Accent Gradient
Used on: feature cards, stat cards on dashboards (subtle, top-edge only).
```css
background: linear-gradient(90deg, #90a955 0%, #ecf39e 100%);
/* palm-500 → lime-500, used as a 4px top border-gradient on cards, not full fill */
```

### 5.5 Sidebar / Navigation Gradient
Used on: admin sidebar background (dark mode).
```css
background: linear-gradient(180deg, #132a13 0%, #0d1d0d 100%);
/* evergreen-500 → evergreen-700 */
```

### 5.6 Role-Badge Gradients
Used to visually distinguish role tags/avatars across Admin / Teacher / Student without adding new hues.

| Role | Gradient | CSS |
|---|---|---|
| Admin | Evergreen → Hunter | `linear-gradient(135deg, #132a13, #31572c)` |
| Teacher | Hunter → Fern | `linear-gradient(135deg, #31572c, #4f772d)` |
| Student | Fern → Palm Leaf | `linear-gradient(135deg, #4f772d, #90a955)` |

### 5.7 Progress Bar / Chart Gradient
Used on: attendance progress bars, grade performance bars.
```css
background: linear-gradient(90deg, #90a955 0%, #4f772d 100%);
/* palm-500 → fern-500, low-to-high progress reads left (lighter) to right (stronger) */
```

### 5.8 Overlay Gradient (for images/video thumbnails)
Used on: course thumbnail overlays, so white text stays readable over any uploaded image.
```css
background: linear-gradient(180deg, rgba(19,42,19,0) 0%, rgba(19,42,19,0.85) 100%);
/* transparent evergreen → 85% opaque evergreen, bottom-anchored */
```

---

## 6. Full UI Usage Mapping

This is the definitive "what color goes where" reference.

### 6.1 Global / Structural
| Element | Color token | Hex |
|---|---|---|
| Page background (light mode) | `lime-50` or `neutral-50` | `#fefef9` / `#f4f4f4` |
| Page background (dark mode) | `neutral-900` | `#1b1b1b` |
| Primary navigation bar | `hunter-500` | `#31572c` |
| Nav bar text/icons | `neutral-0` (white) | `#ffffff` |
| Sidebar background (admin) | Sidebar gradient (5.5) | `#132a13 → #0d1d0d` |
| Sidebar active item | `palm-500` on `hunter-700` bg | `#90a955` on `#223d1f` |
| Footer background | `evergreen-500` | `#132a13` |
| Footer text | `neutral-100` | `#e4e4e4` |
| Card background | `neutral-0` | `#ffffff` |
| Card border | `neutral-200` | `#c6c6c6` |
| Divider lines | `neutral-200` | `#c6c6c6` |

### 6.2 Typography
| Element | Color token | Hex |
|---|---|---|
| Primary heading (H1–H3) | `evergreen-500` | `#132a13` |
| Body text | `neutral-600` | `#444444` |
| Muted/secondary text | `neutral-500` | `#5f5f5f` |
| Placeholder text | `neutral-300` | `#a4a4a4` |
| Link (default) | `hunter-500` | `#31572c` |
| Link (hover) | `fern-600` | `#436526` |
| Link (visited, optional) | `hunter-700` | `#223d1f` |
| Text on dark backgrounds | `neutral-0` | `#ffffff` |
| Text on lime backgrounds | `evergreen-500` | `#132a13` |

### 6.3 Buttons
| State | Background | Text |
|---|---|---|
| Primary — default | `hunter-500` (`#31572c`) or Button Gradient (5.3) | `#ffffff` |
| Primary — hover | `hunter-600` (`#2a4a25`) | `#ffffff` |
| Primary — active/pressed | `hunter-700` (`#223d1f`) | `#ffffff` |
| Primary — disabled | `hunter-300` (`#98ab96`) | `neutral-100` |
| Secondary — default | `fern-500` (`#4f772d`) | `#ffffff` |
| Secondary — hover | `fern-600` (`#436526`) | `#ffffff` |
| Outline/ghost button | transparent, border `hunter-500` | `hunter-500` |
| Outline — hover | `hunter-50` background | `hunter-600` |
| Destructive (drop/delete) | `error-500` (`#b3423a`) | `#ffffff` |
| Destructive — hover | darken 10% → `#98362f` | `#ffffff` |

### 6.4 Forms & Inputs
| Element | Color token | Hex |
|---|---|---|
| Input border (default) | `neutral-200` | `#c6c6c6` |
| Input border (focus) | `hunter-500` | `#31572c` |
| Input background | `neutral-0` | `#ffffff` |
| Input background (disabled) | `neutral-100` | `#e4e4e4` |
| Validation success border | `success-500` (fern-500) | `#4f772d` |
| Validation error border | `error-500` | `#b3423a` |
| Checkbox/radio checked | `hunter-500` | `#31572c` |

### 6.5 Status Badges (Enrollment / Marks / Attendance)
| Status | Background | Text |
|---|---|---|
| Enrolled / Active | `palm-100` | `palm-800` (`#4f5d2f`) |
| Pending | `warning-100` | `warning-500`-darkened text |
| Dropped / Inactive | `neutral-100` | `neutral-500` |
| Rejected | `error-100` | `error-500` |
| Grade A / High performance | `fern-100` | `fern-700` |
| Grade C–D / Needs attention | `warning-100` | `#a17423` |
| Grade F / At-risk | `error-100` | `error-500` |

### 6.6 Role-Specific Accents (Dashboards)
| Role | Accent color | Usage |
|---|---|---|
| Admin | `evergreen-500` / Admin gradient | Dashboard header, admin-only labels |
| Teacher | `fern-500` / Teacher gradient | Teacher dashboard header, "assigned course" tags |
| Student | `palm-500` / Student gradient | Student dashboard header, "my course" tags |

### 6.7 Chat
| Element | Color token | Hex |
|---|---|---|
| Own message bubble | `hunter-500` | `#31572c` (white text) |
| Other's message bubble | `neutral-100` | `#e4e4e4` (neutral-700 text) |
| Chat background | `lime-50` | `#fefef9` |
| Unread indicator dot | `lime-500` on `error-500` ring (attention) or plain `palm-500` | `#90a955` |
| Timestamp text | `neutral-400` | `#818181` |

### 6.8 Tables (Gradebook, Attendance, Fee records)
| Element | Color token | Hex |
|---|---|---|
| Table header background | `hunter-500` | `#31572c` |
| Table header text | `#ffffff` | — |
| Row (default) | `neutral-0` | `#ffffff` |
| Row (alt/zebra) | `lime-100` | `#fcfdf1` |
| Row (hover) | `palm-100` | `#eff3e7` |
| Row (selected) | `lime-300` | `#f6f9cf` |

### 6.9 Charts / Analytics (Reporting Dashboards)
| Data series | Color |
|---|---|
| Series 1 (e.g. attendance %) | `hunter-500` `#31572c` |
| Series 2 (e.g. average grade) | `fern-500` `#4f772d` |
| Series 3 (e.g. fee collection) | `palm-500` `#90a955` |
| Series 4 (comparison/benchmark line) | `evergreen-400` `#4e5f4e` |
| Chart gridlines | `neutral-200` `#c6c6c6` |
| Chart background | `neutral-0` `#ffffff` |
| At-risk highlight zone | `error-100` `#f5e2e0` (low-opacity fill) |

### 6.10 Alerts / Toasts / Banners
| Type | Background | Border | Text |
|---|---|---|---|
| Success | `success-100` (fern-100) | `fern-500` | `fern-800` |
| Warning | `warning-100` | `warning-500` | `#8a6521` |
| Error | `error-100` | `error-500` | `error-500` |
| Info | `info-100` | `info-500` | `#2a4d63` |

### 6.11 Shadows
| Use | Value |
|---|---|
| Card shadow (light mode) | `0 1px 3px rgba(19, 42, 19, 0.08)` (evergreen at 8% opacity) |
| Card shadow (hover/elevated) | `0 4px 12px rgba(19, 42, 19, 0.14)` |
| Modal shadow | `0 8px 30px rgba(19, 42, 19, 0.22)` |

---

## 7. Dark Mode Mapping (Optional / Future)

| Element | Light mode | Dark mode |
|---|---|---|
| Page background | `lime-50` `#fefef9` | `neutral-900` `#1b1b1b` |
| Card background | `neutral-0` `#ffffff` | `neutral-800` `#262626` |
| Primary text | `evergreen-500` `#132a13` | `neutral-50` `#f4f4f4` |
| Body text | `neutral-600` `#444444` | `neutral-300` `#a4a4a4` |
| Primary button | `hunter-500` `#31572c` | `fern-500` `#4f772d` (brighter, for contrast on dark) |
| Borders/dividers | `neutral-200` `#c6c6c6` | `neutral-700` `#323232` |

---

## 8. CSS Custom Properties (ready to use)

```css
:root {
  /* Base brand colors */
  --evergreen: #132a13;
  --hunter-green: #31572c;
  --fern: #4f772d;
  --palm-leaf: #90a955;
  --lime-cream: #ecf39e;

  /* Evergreen scale */
  --evergreen-50: #f1f2f1;
  --evergreen-100: #dee1de;
  --evergreen-200: #b8bfb8;
  --evergreen-300: #899589;
  --evergreen-400: #4e5f4e;
  --evergreen-500: #132a13;
  --evergreen-600: #102410;
  --evergreen-700: #0d1d0d;
  --evergreen-800: #0a170a;
  --evergreen-900: #071007;

  /* Hunter Green scale */
  --hunter-50: #f3f5f2;
  --hunter-100: #e2e7e1;
  --hunter-200: #c1cdc0;
  --hunter-300: #98ab96;
  --hunter-400: #658161;
  --hunter-500: #31572c;
  --hunter-600: #2a4a25;
  --hunter-700: #223d1f;
  --hunter-800: #1b3018;
  --hunter-900: #132111;

  /* Fern scale */
  --fern-50: #f4f7f2;
  --fern-100: #e6ece2;
  --fern-200: #cad6c0;
  --fern-300: #a7bb96;
  --fern-400: #7b9962;
  --fern-500: #4f772d;
  --fern-600: #436526;
  --fern-700: #375320;
  --fern-800: #2b4119;
  --fern-900: #1e2d11;

  /* Palm Leaf scale */
  --palm-50: #f8faf5;
  --palm-100: #eff3e7;
  --palm-200: #dee5cc;
  --palm-300: #c8d4aa;
  --palm-400: #acbf80;
  --palm-500: #90a955;
  --palm-600: #7a9048;
  --palm-700: #65763c;
  --palm-800: #4f5d2f;
  --palm-900: #374020;

  /* Lime Cream scale */
  --lime-50: #fefef9;
  --lime-100: #fcfdf1;
  --lime-200: #f9fbe2;
  --lime-300: #f6f9cf;
  --lime-400: #f1f6b6;
  --lime-500: #ecf39e;
  --lime-600: #c9cf86;
  --lime-700: #a5aa6f;
  --lime-800: #828657;
  --lime-900: #5a5c3c;

  /* Neutrals */
  --neutral-0: #ffffff;
  --neutral-50: #f4f4f4;
  --neutral-100: #e4e4e4;
  --neutral-200: #c6c6c6;
  --neutral-300: #a4a4a4;
  --neutral-400: #818181;
  --neutral-500: #5f5f5f;
  --neutral-600: #444444;
  --neutral-700: #323232;
  --neutral-800: #262626;
  --neutral-900: #1b1b1b;
  --neutral-950: #171717;

  /* Semantic (supplementary, non-green) */
  --success-100: #e6ece2;
  --success-500: #4f772d;
  --warning-100: #faf1de;
  --warning-500: #d9a441;
  --error-100: #f5e2e0;
  --error-500: #b3423a;
  --info-100: #e2ebf0;
  --info-500: #3d6b8c;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #132a13 0%, #31572c 45%, #4f772d 100%);
  --gradient-fresh: linear-gradient(135deg, #4f772d 0%, #90a955 60%, #ecf39e 100%);
  --gradient-button: linear-gradient(180deg, #3a6633 0%, #31572c 100%);
  --gradient-button-hover: linear-gradient(180deg, #31572c 0%, #2a4a25 100%);
  --gradient-card-accent: linear-gradient(90deg, #90a955 0%, #ecf39e 100%);
  --gradient-sidebar: linear-gradient(180deg, #132a13 0%, #0d1d0d 100%);
  --gradient-progress: linear-gradient(90deg, #90a955 0%, #4f772d 100%);
  --gradient-overlay: linear-gradient(180deg, rgba(19,42,19,0) 0%, rgba(19,42,19,0.85) 100%);
}
```

---

## 9. Accessibility Notes

- **Evergreen-500 (`#132a13`) on white** passes WCAG AAA for body text — safe for all heading/body use.
- **Hunter-500 (`#31572c`) on white** passes AA for normal text and AAA for large text — safe for buttons/links.
- **Palm Leaf-500 (`#90a955`) on white** does **not** pass AA for small text — only use for large text (≥18px bold or ≥24px), icons, badges, or backgrounds with dark text on top, never as small body text color itself.
- **Lime Cream-500 (`#ecf39e`)** should never carry text directly on white/light backgrounds — use only as a background with `evergreen-500` or `neutral-700` text on top.
- Semantic colors (success/warning/error/info) were chosen at a saturation/lightness level that stays distinguishable for the most common forms of color blindness (deuteranopia/protanopia) — never rely on color alone for status; always pair with an icon or label.

---

*End of document.*

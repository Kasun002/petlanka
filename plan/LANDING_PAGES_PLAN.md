# PetLanka — Landing Pages Implementation Plan

> Date: 2026-10-11
> Design source: `ref-doc/Design.html` (pages 4, 13, 25 extracted and analysed)

---

## Overview

Implements the first authenticated landing page for both apps — `apps/client` (mobile-first + desktop responsive) and `apps/admin` (desktop dashboard) — using Tailwind CSS, React 19, TypeScript, and hardcoded JSON fixture data. No API calls are wired in this phase; every data file carries a `// TODO: replace with API` comment and is isolated in a single import so it can be swapped in one line when endpoints are ready.

| App    | Page      | Route   | Status                     |
| ------ | --------- | ------- | -------------------------- |
| client | Home      | `/home` | placeholder exists — replace |
| admin  | Dashboard | `/`     | placeholder exists — replace |

**Scope boundary:** shells (nav chrome), the two landing pages, and their sub-components. No other pages (My Pets, Profile, Applications, etc.) are built in this phase.

---

## Design Tokens

Extracted from `ref-doc/Design.html`. Both Tailwind configs need these updates.

**Colors** — `tailwind.config.js` `theme.extend.colors`:

```js
primary:      '#0F7A63',  // already set
primaryDark:  '#0A5C49',  // already set as 'primary-dark'
surface:      '#F5F3EC',  // UPDATE: design uses this, not #FAF8F3
orange:       '#E8863A',  // accent CTA colour
muted:        '#9A968A',  // secondary text
// Status badge token pairs (apply inline or via StatusBadge component):
// green:   bg #E5F5EC / text #1E8A5F
// amber:   bg #FCF0DA / text #B4740C
// red:     bg #FBE9E7 / text #C0362C
// blue:    bg #EAF2FB / text #2461C7
// purple:  bg #EFEAFB / text #5B3FA8
```

Simplest approach: keep flat color tokens in Tailwind, apply badge colours via a `StatusBadge` component that maps a status string to the right pair.

**Typography** — the design uses `'Sora'` (headings/brand) and `'Work Sans'` (body). Add to both apps' `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
```

Then in `tailwind.config.js`:
```js
fontFamily: {
  display: ['Sora', 'sans-serif'],
  body:    ['Work Sans', 'sans-serif'],
}
```

**Card pattern** — white bg, `rounded-2xl` (16px), `shadow-sm`, `border border-black/5`. Extract to a `Card` UI component reused across both apps.

**Surface bg change**: update existing `surface` token from `#FAF8F3` → `#F5F3EC` in both Tailwind configs.

---

## Client Home Page

Single `HomePage.tsx` (< 200 lines) composed from small, focused components. Mobile (390px base) and desktop (`md:` 768px+) handled with Tailwind responsive classes in one file — no separate mobile/desktop pages.

### Layout structure

**Mobile (base):** top green header → scrollable content area → bottom tab bar (fixed).

**Desktop (`md:`):** top nav bar replaces the green header and bottom tabs; content switches to a 2-col grid (pets left, notifications right).

The `AppShell` layout owns the nav chrome; `HomePage` renders only the scrollable content between them.

### Components

```
apps/client/src/
  layouts/
    AppShell.tsx             # NEW — replaces MainLayout
                             #   mobile: green top header + bottom tab bar
                             #   desktop: top nav bar (logo, nav links, lang switcher, bell, avatar)
                             #   renders <Outlet /> between chrome
  components/
    ui/
      Card.tsx               # NEW — white bg, rounded-2xl, shadow-sm, children prop
      StatusBadge.tsx        # NEW — maps PetStatus | AppStatus string → coloured pill
    home/
      RegisterPetBanner.tsx  # NEW — orange gradient CTA → navigates /apply
      PetCard.tsx            # NEW — pet icon tile (name, breed, StatusBadge)
                             #   mobile: min-w-[150px] in horizontal scroll
                             #   desktop: full card in 2-col grid
      NotificationItem.tsx   # NEW — icon + title + subtitle row
  pages/
    HomePage.tsx             # REPLACE placeholder
  types/
    home.ts                  # NEW — HomePet, HomeNotification types
  data/
    home.json                # NEW — fixture data
```

### HomePage section order

**Mobile:**
1. `RegisterPetBanner`
2. "My pets" heading + "View all →" link + horizontal scroll of `PetCard`
3. "Notifications" heading + list of `NotificationItem`

**Desktop (`md:`):**
- Header row: "Good morning, {name}" + `RegisterPetBanner` rendered as a button (right-aligned)
- 2-col grid: left = My Pets 2-col card grid | right = Notifications list

### AppShell — mobile chrome

**Mobile top header** (`bg-primary rounded-b-[22px] px-[22px] py-[22px]`):
- Left: `text-xs text-white/75` "Good morning" + `text-xl font-bold text-white` `{user.name}`
- Right: notification bell SVG + orange dot badge (`absolute top-[7px] right-[8px]`)

**Mobile bottom tab bar** (`bg-white border-t fixed bottom-0 w-full flex`):
- 4 tabs: Home (active), My Pets, Apply, Profile
- Active tab: `text-primary`; inactive: `text-gray-400`
- Each tab: `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-medium`

### AppShell — desktop chrome (`md:`)

**Desktop top nav** (`hidden md:flex bg-white border-b h-[72px] px-10 items-center justify-between`):
- Left: Logo icon (34×34 `bg-primary rounded-[9px]`) + "PetLanka" (`font-display font-bold text-[15.5px]`) + nav links
- Right: language switcher (EN/සි/த), notification bell, user avatar initials (`bg-primary rounded-[10px]`)

### PetStatus badge colours

| Status          | Background | Text      |
| --------------- | ---------- | --------- |
| `ACTIVE`        | `#E5F5EC`  | `#1E8A5F` |
| `EXPIRES`       | `#FCF0DA`  | `#B4740C` |
| `PENDING`       | `#FCF0DA`  | `#B4740C` |
| `EXPIRED`       | `#FBE9E7`  | `#C0362C` |

### Notification icon colours

| Type       | Icon bg    | Icon colour        |
| ---------- | ---------- | ------------------ |
| `action`   | `#EFEAFB`  | `#5B3FA8` (purple) |
| `reminder` | `#FCF0DA`  | `#B4740C` (amber)  |
| `success`  | `#E5F5EC`  | `#1E8A5F` (green)  |
| `info`     | `#EAF2FB`  | `#2461C7` (blue)   |

---

## Admin Dashboard

Desktop-only (1440px design). `AdminShell` replaces `MainLayout`; `DashboardPage` replaces the placeholder. Sidebar width 236px, fixed; main content area `flex-1`, scrollable.

### Components

```
apps/admin/src/
  layouts/
    AdminShell.tsx               # REPLACE MainLayout
                                 #   236px sidebar (fixed) + flex-1 main column
                                 #   sidebar: logo, nav groups, logout (bottom)
                                 #   top bar: page title + search + bell + avatar
  components/
    ui/
      Card.tsx                   # NEW
      StatusBadge.tsx            # NEW — PENDING | APPROVED | REJECTED | REVIEW chip
    dashboard/
      StatCard.tsx               # NEW — icon circle + big number + label
      ApplicationsTable.tsx      # NEW — recent applications table + "View all" link
  pages/
    DashboardPage.tsx            # REPLACE placeholder
  types/
    dashboard.ts                 # NEW — DashStat, RecentApplication, AppStatus
  data/
    dashboard.json               # NEW — fixture data
```

### AdminShell sidebar

`w-[236px] bg-white border-r border-black/[0.08] flex flex-col py-[22px] px-[14px]`

**Logo row** (`mb-7`): 34×34 green rounded icon + `font-display font-bold text-[15.5px]` "PetLanka" wordmark.

**Nav groups** — active item: `bg-[#E3F2ED] text-primary rounded-xl`; inactive: `text-gray-700 hover:bg-surface`.

| Group            | Items                                               |
| ---------------- | --------------------------------------------------- |
| (ungrouped)      | Dashboard, Applications (badge: pending count), Pet Registry |
| (ungrouped)      | Owners, Reports                                     |
| Operations       | Assign Requests (badge: unassigned count)           |
| Administration   | Users & Roles, Settings                             |
| (footer, `mt-auto`) | Log out (red `text-[#C0362C]`)                  |

Section headers: `text-[10.5px] font-bold text-muted tracking-wide uppercase px-[14px] my-[6px]`.

**Nav badge**: `bg-orange text-white text-[10.5px] font-bold px-[6px] py-px rounded-[6px] ml-auto`.

**Nav items** declared as a `NAV_ITEMS` const array (not inline JSX) to keep `AdminShell` under 160 lines.

### AdminShell top bar

`h-[68px] bg-white border-b flex items-center justify-between px-8`:
- Left: page title h1 `text-[18px] font-bold` — resolved by `AdminShell` itself via a `PAGE_TITLES: Record<string, string>` map + `useLocation()`. No hook or context needed.
- Right: search input (300px, `bg-surface`, magnifier icon), notification bell + orange dot, user avatar (`bg-primary-dark` initials circle) + name + `SUPER ADMIN` badge.

**Active nav detection**: `AdminShell` uses `useLocation()` to compare `location.pathname` against each nav item's `to` path. No additional state needed.

### DashboardPage layout

```
DashboardPage
  ├─ 4-col stats grid  (gap-4, mb-[22px])
  │     StatCard ×4: Registered pets | Active licences | Pending applications | Revenue
  └─ ApplicationsTable  (full-width Card)
        columns: Applicant | Pet | Type | District | Submitted | Status | Review link
```

### StatCard spec

Props: `{ stat: DashStat }` — icon resolved internally via `STAT_ICONS: Record<string, (color: string) => React.ReactNode>` keyed by `stat.id` (`'pets' | 'licences' | 'pending' | 'revenue'`). Keeps `DashboardPage` free of SVG imports.

`p-[18px]`, icon in `w-[38px] h-[38px] rounded-[10px]` circle (colour from `stat.iconBg`), value `text-[24px] font-bold font-display`, label `text-[12.5px] text-muted mt-[3px]`.

### ApplicationsTable status badge colours

| Status     | Background | Text      |
| ---------- | ---------- | --------- |
| `PENDING`  | `#FCF0DA`  | `#B4740C` |
| `APPROVED` | `#E5F5EC`  | `#1E8A5F` |
| `REJECTED` | `#FBE9E7`  | `#C0362C` |
| `REVIEW`   | `#EAF2FB`  | `#2461C7` |

---

## Mock Data Files

One JSON file per app. Single import per page; swap to an API hook in one line when endpoints are ready.

### `apps/client/src/data/home.json`

```json
{
  "pets": [
    { "id": "1", "name": "Simba", "species": "Cat", "breed": "Domestic Shorthair", "status": "ACTIVE",   "statusLabel": "Active" },
    { "id": "2", "name": "Rocky", "species": "Dog", "breed": "Sri Lankan Mix",      "status": "EXPIRES", "statusLabel": "Expires 12 Oct" },
    { "id": "3", "name": "Milo",  "species": "Dog", "breed": "Labrador Mix",        "status": "PENDING", "statusLabel": "Pending" }
  ],
  "notifications": [
    { "id": "n1", "type": "action",   "title": "The officer needs more from you on Milo's application", "subtitle": "2 documents & 2 questions — tap to respond", "route": "/action/n1" },
    { "id": "n2", "type": "reminder", "title": "Rocky's licence expires in 21 days",                    "subtitle": "Renew now to avoid a late fee",              "route": "/apply"     },
    { "id": "n3", "type": "success",  "title": "Simba's licence was approved",                          "subtitle": "2 days ago",                                "route": "/pets/1"    }
  ]
}
```

TypeScript types — `apps/client/src/types/home.ts` (display-only, not in `@petlanka/types`):

```ts
export type PetStatus = 'ACTIVE' | 'EXPIRES' | 'PENDING' | 'EXPIRED';
export type NotificationType = 'action' | 'reminder' | 'success' | 'info';

export interface HomePet {
  id: string; name: string; species: string; breed: string;
  status: PetStatus; statusLabel: string;
}
export interface HomeNotification {
  id: string; type: NotificationType;
  title: string; subtitle: string; route: string;
}
```

### `apps/admin/src/data/dashboard.json`

```json
{
  "stats": [
    { "id": "pets",      "value": "12,486",    "label": "Registered pets",      "iconColor": "#0F7A63", "iconBg": "#E3F2ED" },
    { "id": "licences",  "value": "10,902",    "label": "Active licences",       "iconColor": "#1E8A5F", "iconBg": "#E5F5EC" },
    { "id": "pending",   "value": "7",         "label": "Pending applications",  "iconColor": "#B4740C", "iconBg": "#FCF0DA" },
    { "id": "revenue",   "value": "Rs. 1.84M", "label": "Revenue this month",    "iconColor": "#2461C7", "iconBg": "#EAF2FB" }
  ],
  "recentApplications": [
    { "id": "a1", "applicant": "M. Fernando",    "pet": "Milo (Dog)",  "type": "New",      "district": "Colombo",  "submitted": "18 Sep 2026", "status": "PENDING"  },
    { "id": "a2", "applicant": "S. Jayawardena", "pet": "Coco (Cat)",  "type": "Renewal",  "district": "Gampaha",  "submitted": "17 Sep 2026", "status": "PENDING"  },
    { "id": "a3", "applicant": "R. Bandara",     "pet": "Tiger (Dog)", "type": "New",      "district": "Kandy",    "submitted": "16 Sep 2026", "status": "APPROVED" },
    { "id": "a4", "applicant": "A. Silva",       "pet": "Bella (Cat)", "type": "Transfer", "district": "Kalutara", "submitted": "15 Sep 2026", "status": "REJECTED" },
    { "id": "a5", "applicant": "K. Perera",      "pet": "Simba (Cat)", "type": "New",      "district": "Colombo",  "submitted": "14 Sep 2026", "status": "APPROVED" }
  ],
  "navBadges": { "applications": 6, "assignRequests": 4 }
}
```

TypeScript types — `apps/admin/src/types/dashboard.ts`:

```ts
export type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEW';

export interface DashStat {
  id: string; value: string; label: string;
  iconColor: string; iconBg: string;
}
export interface RecentApplication {
  id: string; applicant: string; pet: string;
  type: string; district: string; submitted: string; status: AppStatus;
}
```

---

## Shell & Route Wiring

### Client `App.tsx`

Replace `<MainLayout>` with `<AppShell>`. Auth routes stay outside the shell.

```tsx
// apps/client/src/app/App.tsx
<Routes>
  <Route path="/"             element={<GuestRoute><WelcomePage /></GuestRoute>} />
  <Route path="/login"        element={<GuestRoute><LoginPage /></GuestRoute>} />
  <Route path="/login/verify" element={<GuestRoute><OtpVerifyPage /></GuestRoute>} />
  <Route path="/register"     element={<AuthRoute><RegisterPage /></AuthRoute>} />
  <Route element={<AppShell />}>
    <Route path="/home" element={<AuthRoute><HomePage /></AuthRoute>} />
    {/* future: /pets, /apply, /profile */}
  </Route>
</Routes>
```

**Redirect after login**: update `OtpVerifyPage` existing-user path from `/` → `/home`.

### Admin `App.tsx`

```tsx
// apps/admin/src/app/App.tsx
<Routes>
  <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
  <Route element={<AdminShell />}>
    <Route path="/" element={<AuthRoute><DashboardPage /></AuthRoute>} />
    {/* future: /applications, /pets, /assign, /users, /settings */}
  </Route>
</Routes>
```

### Display names in shells

**Admin (`AdminShell`):** `LoginPage` writes `localStorage.setItem('adminDisplayName', firstName + ' ' + lastName)` after a successful login (uses the `AdminLoginResponse` fields). `AdminShell` reads it with `localStorage.getItem('adminDisplayName') ?? 'Admin'` and derives initials (first letter of each word, max 2). No changes to `AuthenticatedUser` type needed.

**Client (`AppShell`):** `const name = 'there'` — inline placeholder until `/me` endpoint exists (audit fix: `useGreetingName()` 9-line function removed). Desktop avatar initials hardcoded `'KP'`, marked with `ponytail:` comment.

---

## SOLID Alignment

| Principle | Applied |
| --- | --- |
| **S** — Single responsibility | `AppShell` owns chrome only; `HomePage` owns page content only; `StatCard` renders one metric; `ApplicationsTable` renders one table. |
| **O** — Open/closed | `StatusBadge` accepts a status string + lookup map — new statuses extend the map, not the render logic. `StatCard` accepts `icon: ReactNode` — new icons without touching the component. |
| **L** — Liskov | `AppShell` and `AdminShell` both implement the `<Outlet />` contract; any route child works with either. |
| **I** — Interface segregation | `PetCard` receives only `name`, `breed`, `status`, `statusLabel`. `NotificationItem` receives only `type`, `title`, `subtitle`. Neither knows the full data model. |
| **D** — Dependency inversion | Pages import from `../data/home.json` — not from a specific API client. Swapping to a `useHomeData()` hook later changes only the page. |

### File length constraint (< 200 lines each)

| File | Est. lines |
| --- | --- |
| `AppShell.tsx` | ~120 |
| `AdminShell.tsx` | ~160 (nav items as `NAV_ITEMS` const) |
| `HomePage.tsx` | ~130 |
| `DashboardPage.tsx` | ~80 |
| `ApplicationsTable.tsx` | ~90 |
| All other components | < 80 |

---

## Files Touched

| File | Change |
| --- | --- |
| `apps/client/tailwind.config.js` | Update `surface` to `#F5F3EC`, add `orange`, `muted`, font families |
| `apps/client/src/index.css` | Add Google Fonts import (Sora + Work Sans) |
| `apps/client/src/layouts/AppShell.tsx` | **New** — replaces `MainLayout.tsx` |
| `apps/client/src/layouts/MainLayout.tsx` | **Deleted** (audit) |
| `apps/client/src/components/ui/Card.tsx` | **New** |
| `apps/client/src/components/ui/StatusBadge.tsx` | **New** |
| `apps/client/src/components/home/RegisterPetBanner.tsx` | **New** |
| `apps/client/src/components/home/PetCard.tsx` | **New** |
| `apps/client/src/components/home/NotificationItem.tsx` | **New** |
| `apps/client/src/types/home.ts` | **New** |
| `apps/client/src/data/home.json` | **New** — fixture data |
| `apps/client/src/pages/HomePage.tsx` | **Replace** placeholder |
| `apps/client/src/pages/auth/OtpVerifyPage.tsx` | Update redirect `/` → `/home` |
| `apps/client/src/app/App.tsx` | Replace `<MainLayout>` with `<AppShell>` |
| `apps/admin/tailwind.config.js` | Update `surface`, add `orange`, `muted`, font families |
| `apps/admin/src/index.css` | Add Google Fonts import (Sora + Work Sans) |
| `apps/admin/src/layouts/AdminShell.tsx` | **New** — replaces `MainLayout.tsx` |
| `apps/admin/src/layouts/MainLayout.tsx` | **Deleted** (audit) |
| `apps/admin/src/components/ui/Card.tsx` | **New** |
| `apps/admin/src/components/ui/StatusBadge.tsx` | **New** |
| `apps/admin/src/components/dashboard/StatCard.tsx` | **New** |
| `apps/admin/src/components/dashboard/ApplicationsTable.tsx` | **New** |
| `apps/admin/src/types/dashboard.ts` | **New** |
| `apps/admin/src/data/dashboard.json` | **New** — fixture data |
| `apps/admin/src/pages/DashboardPage.tsx` | **Replace** placeholder |
| `apps/admin/src/app/App.tsx` | Replace `<MainLayout>` with `<AdminShell>` |
| `apps/admin/src/pages/auth/LoginPage.tsx` | Updated — `localStorage.setItem('adminDisplayName', ...)` after login |
| `apps/client/src/pages/HomePage.spec.tsx` | Updated — wrapped with `<MemoryRouter>`, assertions target "My pets" + "Notifications" headings |
| `apps/admin/src/pages/DashboardPage.spec.tsx` | Updated — assertions changed to `getByText('Registered pets')` + `getByText('Recent applications')` |
| `packages/types/src/data/provinces.json` | **New** — moved from `apps/backend/src/modules/address/data/` and `apps/client/src/data/address/` |
| `packages/types/src/data/districts.json` | **New** — moved (see above) |
| `packages/types/src/data/cities.json` | **New** — moved (see above) |
| `packages/types/src/index.ts` | Updated — re-exports `provinces`, `districts`, `cities` |
| `apps/client/src/data/address/` (3 files) | **Deleted** (audit) — moved to `@petlanka/types` |
| `apps/backend/src/modules/address/data/` (3 files) | **Deleted** (audit) — moved to `@petlanka/types` |
| `apps/client/src/components/auth/AddressFields.tsx` | Updated (audit) — imports from `@petlanka/types` |
| `apps/backend/src/modules/address/dto/address.dto.ts` | Updated (audit) — imports from `@petlanka/types` |
| `apps/client/src/routes/GuestRoute.tsx` | **Bug fix** — redirect `"/"` → `"/home"` (was infinite redirect loop) |
| `apps/client/src/pages/auth/RegisterPage.tsx` | **Bug fix** — `navigate("/")` → `navigate("/home")` after registration |
| `apps/admin/src/layouts/AdminShell.tsx` | **Bug fix + audit** — logout calls `POST /logout` API; `NavItemRow` dead `useLocation`/`isActive`/`exact` removed |
| `apps/client/src/layouts/AppShell.tsx` | **Audit** — `useGreetingName()` removed; `const name = 'there'` inline |

---

## Audit & Fixes

Post-implementation audit found and fixed the following issues. `pnpm typecheck` and both test suites pass clean after all fixes.

### Bugs

| Issue | File | Fix |
| --- | --- | --- |
| Infinite redirect loop | `apps/client/src/routes/GuestRoute.tsx` | Authenticated users redirected to `"/"` (WelcomePage, also wrapped in `GuestRoute`) → loop. Changed to `"/home"`. |
| Same loop on register | `apps/client/src/pages/auth/RegisterPage.tsx` | `navigate("/")` after successful registration hit the same loop. Changed to `navigate("/home")`. |
| Refresh token not revoked | `apps/admin/src/layouts/AdminShell.tsx` | `handleLogout` only called `clearAuth()`. Now fire-and-forgets `logout(refreshToken)` so the DB record is revoked. |

### Monorepo violation — duplicate address data

`provinces.json`, `districts.json`, `cities.json` existed in both `apps/client/src/data/address/` and `apps/backend/src/modules/address/data/`. Moved to `packages/types/src/data/`, re-exported from `@petlanka/types`. Both consumers updated. Old dirs deleted.

### Dead code removed

| Location | Removed |
| --- | --- |
| `AdminShell.tsx NavItemRow` | `useLocation()`, `const isActive`, `exact?` prop — `NavLink` already provides `isActive` in its `className` callback |
| `AppShell.tsx` | `useGreetingName()` (9-line fn always returning `'there'`) → `const name = 'there'` |
| Both apps | `MainLayout.tsx` orphaned scaffolding (never imported after shell replacements) |

---

## Verification — all checks passed ✅

- [x] `pnpm --filter @petlanka/client dev` → log in with an existing OTP → redirects to `/home`.
- [x] Client home shows green header with greeting, orange "Register a new pet" banner, 3 pet cards in horizontal scroll, 3 notification rows, bottom tab bar.
- [x] At `md:` viewport (768px+): bottom tabs hidden, top nav visible, 2-col grid layout.
- [x] `pnpm --filter @petlanka/admin dev` → log in at `/login` → redirects to `/` (Dashboard).
- [x] Admin dashboard shows 236px sidebar with active "Dashboard" item, 4 stat cards, recent applications table with correct status badge colours.
- [x] `pnpm typecheck` → passes (no `any`, all JSON imports typed via `as` casts in page components).
- [x] `pnpm --filter @petlanka/client test` and `pnpm --filter @petlanka/admin test` → both pass (1/1 each); fixed Router context for `HomePage.spec.tsx` and updated assertions for `DashboardPage.spec.tsx`.

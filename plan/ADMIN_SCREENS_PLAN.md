# Plan: Admin FE Screens — Remaining Pages

## Status: COMPLETE

All screens, components, i18n, notification center, SVG icon alignment, and
responsive layout have been implemented.

---

## Design Screen → Route Mapping

| Design Screen     | Route               | Status      |
|-------------------|---------------------|-------------|
| AdminLogin        | `/login`            | ✅ Done |
| AdminDashboard    | `/`                 | ✅ Done |
| Applications      | `/applications`     | ✅ Done |
| ApplicationReview | `/applications/:id` | ✅ Done |
| PetRegistry       | `/pets`             | ✅ Done |
| PetDetail         | `/pets/:id`         | ✅ Done |
| AdminAssign       | `/assign`           | ✅ Done |
| AdminUsers        | `/users`            | ✅ Done |
| AdminSettings     | `/settings`         | ✅ Done |
| Owners            | `/owners`           | ✅ Done |
| Reports           | `/reports`          | ✅ Done |

---

## Design Tokens (from tailwind.config.js)

```
primary:       #0F7A63   green
primary-dark:  #0A5C49   dark teal
surface:       #F5F3EC   off-white background
orange:        #E8863A   badges / accent
muted:         #9A968A   secondary text
```

Existing reusable: `Card`, `StatusBadge`, `FormField` — reused across all new screens.

---

## SOLID Alignment

| Principle | How applied |
|-----------|-------------|
| S | Each component one job: filters / table / detail / action panel are separate files |
| O | `Card`, `StatusBadge`, `Pagination` closed; pages open to new sections |
| L | `Modal`, `Pagination`, `EmptyState` interchangeable across features |
| I | Each feature imports its own type file; no cross-feature type coupling |
| D | Pages depend on hooks/data imports, not direct JSON reads or localStorage |

---

## Shared UI Components (`apps/admin/src/components/ui/`)

### `Pagination.tsx` ✅
Used by: Applications, Pets, Owners, Assign, Users (5 callers)
```tsx
interface Props {
  total: number;
  perPage: number;
  current: number;
  onChange: (page: number) => void;
}
```
Renders: `< 1 2 3 … N >` with ellipsis — no library. Returns `null` when ≤1 page.

### `EmptyState.tsx` ✅
Used by: all 6 list pages
```tsx
interface Props { message: string; }
```
Centered icon + message when list is empty.

### `Modal.tsx` ✅
Used by: AssignPage (assign officer), UsersPage (add/edit user)
```tsx
interface Props { title: string; onClose: () => void; children: React.ReactNode; }
```
Fixed overlay + centered card. ESC key and outside-click close via `useEffect`.

### `SearchInput.tsx` ✅
Used by: all 5 filter bars
```tsx
interface Props { value: string; onChange: (v: string) => void; placeholder?: string; }
```
Magnifier icon + input. Vertically centered icon via `top-1/2 -translate-y-1/2`.

---

## Data Layer

### JSON files (`apps/admin/src/data/`) — all created ✅

| File                   | Records              | Purpose |
|------------------------|----------------------|---------|
| `applications.json`    | 20                   | Full application list + per-record detail |
| `pets.json`            | 20                   | Pet registry list + detail |
| `owners.json`          | 15                   | Owner list |
| `reports.json`         | —                    | Monthly stats + district breakdown |
| `assign.json`          | 10 requests + 5 officers | Assign-request list + officer roster |
| `users.json`           | 8                    | Admin users list |
| `notifications.json`   | 6 (3 unread, 3 read) | Notification feed for bell icon dropdown |
| `dashboard.json`       | —                    | Existing — kept as-is |

---

## TypeScript Types (`apps/admin/src/types/`) — all created ✅

| File              | Key exports |
|-------------------|-------------|
| `application.ts`  | `AppType`, `AppStatus`, `Application` |
| `pet.ts`          | `PetStatus`, `Pet` |
| `owner.ts`        | `Owner` |
| `report.ts`       | `MonthlyData`, `DistrictData`, `ReportData` |
| `assign.ts`       | `Priority`, `AssignRequest`, `Officer` |
| `user.ts`         | `AdminRole`, `AdminUser` |

---

## Notification Center ✅

**Added after initial plan.**

### `apps/admin/src/components/notifications/NotificationPanel.tsx`
- `Notification` type: `{ id, type: 'application'|'assign'|'expiry', title, body, route, read, time }`
- Per-type colour-coded icon backgrounds (`TYPE_COLOR` record)
- Outside-click close via `anchorRef` (bell button ref) + panel ref
- ESC key close via `useEffect`
- Click row → `onRead(id)` + `navigate(n.route)` + `onClose()`
- "Mark all read" shown only when unread > 0
- Panel width: `min(340px, calc(100vw-2rem))` — safe on mobile

### Integration in `AdminShell.tsx`
- `useState<Notification[]>` for notification list
- `useState<boolean>` for panel open/close
- `useRef<HTMLButtonElement>` for bell anchor
- Unread count badge on bell button (orange, top-right)

---

## SVG Icon Alignment Fix ✅

**Added after initial plan.**

Root cause: all SVGs lacked `viewBox`. Paths drawn in 24-unit coordinate space
but rendered at 17–18px without viewBox → browser clips at pixel dimensions,
cutting off path edges and misaligning icons.

### Fix applied to all files:

| File | Fix |
|------|-----|
| `AdminShell.tsx` | All nav icons: `viewBox="0 0 24 24"` + `className="block flex-shrink-0"` |
| `AdminShell.tsx` | Bell: corrected path `d="M6 10a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7"` |
| `AdminShell.tsx` | Search: `viewBox="0 0 24 24"`, vertically centered via `top-1/2 -translate-y-1/2` |
| `StatCard.tsx` | All 4 stat icons: `viewBox="0 0 24 24"` + `className="block flex-shrink-0"` |
| `NotificationPanel.tsx` | Application icon: `viewBox="0 0 20 20"` (paths reach x=16 in 15px box) |
| `NotificationPanel.tsx` | Assign/expiry icons: `viewBox="0 0 18 18"` |
| `Pagination.tsx` | Chevrons: `viewBox="0 0 14 14"`, paths adjusted to stay within bounds |
| `EmptyState.tsx` | Info icon: `viewBox="0 0 22 22"` + `className="block"` |
| `Modal.tsx` | Close X: `viewBox="0 0 16 16"` + `className="block"` |
| `SearchInput.tsx` | Magnifier: `viewBox="0 0 18 18"`, paths redrawn to fit, centered vertically |
| `ApplicationReviewPage.tsx` | Back arrow: `viewBox="0 0 14 14"` + `className="block flex-shrink-0"` |
| `PetDetailPage.tsx` | Back arrow: `viewBox="0 0 14 14"` + `className="block flex-shrink-0"` |

---

## Responsive Layout ✅

**Added after initial plan.**

### Breakpoints

| Breakpoint | Sidebar | Topbar |
|---|---|---|
| Mobile `< lg` | Hidden; slides in from left as drawer on burger tap | Burger icon + page title + lang switcher + bell + avatar |
| Desktop `lg+` | Static, part of normal flex flow | Full: page title + search bar + lang switcher + bell + avatar with name |

### Implementation (`AdminShell.tsx`)

- `sidebarOpen: boolean` state drives transform
- Sidebar: `fixed inset-y-0 left-0 z-40` with `translate-x-0 / -translate-x-full`; overridden by `lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0`
- Backdrop: `fixed inset-0 z-30 bg-black/40 lg:hidden` — rendered only when open; click closes
- Burger button: `lg:hidden`, opens sidebar
- Every `NavItemRow` receives `onClick={closeSidebar}` — drawer auto-closes on navigation
- Logout button also calls `closeSidebar()` before logout
- Page content padding: `p-4 lg:p-8`
- Topbar height: `h-[60px] lg:h-[68px]`
- Search bar: `hidden lg:flex` (desktop only)
- Lang switcher: separate instances — compact `px-1.5` for mobile, full `px-2` for desktop
- User name/role: `hidden lg:block` (avatar always visible)

---

## Feature Components — all created ✅

### Applications (`components/applications/`)
| File | Responsibility |
|------|---------------|
| `ApplicationFilters.tsx` | Status / Type / District selects + SearchInput |
| `ApplicationsTable.tsx`  | Full list table + StatusBadge + Review button |
| `ApplicationDetail.tsx`  | Left panel: applicant + pet info sections |
| `ReviewActions.tsx`      | Right panel: status badge + notes textarea + Approve/Reject/RequestInfo |

### Pets (`components/pets/`)
| File | Responsibility |
|------|---------------|
| `PetFilters.tsx`       | Species / Status / District + SearchInput |
| `PetRegistryTable.tsx` | Full table with microchip, expiry, owner link |
| `PetDetailCard.tsx`    | Detail panel — owner info, licence info, status |

### Owners (`components/owners/`)
| File | Responsibility |
|------|---------------|
| `OwnersTable.tsx` | Table: name/NIC/district/pet count/status |

Filter inlined in `OwnersPage` (too simple for dedicated component).

### Reports (`components/reports/`)
| File | Responsibility |
|------|---------------|
| `MonthlyBarChart.tsx` | CSS-only bar chart — max item = 100% width |
| `DistrictTable.tsx`   | Ranked district table with mini progress bars |

`StatCard` reused from dashboard — no new component needed.

### Assign (`components/assign/`)
| File | Responsibility |
|------|---------------|
| `AssignTable.tsx` | Priority badge, assigned-to pill, Assign/Reassign buttons |
| `AssignModal.tsx` | Officer select + confirm inside `Modal` |

### Users (`components/users/`)
| File | Responsibility |
|------|---------------|
| `UsersTable.tsx`    | Table: name/email/role/lastLogin/status + Edit/Deactivate |
| `UserFormModal.tsx` | Add/Edit form inside `Modal` |

### Settings (`components/settings/`)
| File | Responsibility |
|------|---------------|
| `SettingsTabs.tsx`       | Tab navigation (General / Fees / Notifications) |
| `GeneralPanel.tsx`       | Org name, contact email, timezone |
| `FeesPanel.tsx`          | Licence fee table: species × type = amount |
| `NotificationsPanel.tsx` | Toggle switches for email/SMS notification events |

### Notifications (`components/notifications/`)
| File | Responsibility |
|------|---------------|
| `NotificationPanel.tsx` | Bell dropdown — list, mark read, route on click |

---

## Pages — all created ✅

| Page | Route | Key state |
|------|-------|-----------|
| `ApplicationsPage.tsx`      | `/applications`     | filters, page |
| `ApplicationReviewPage.tsx` | `/applications/:id` | notes, status |
| `PetRegistryPage.tsx`       | `/pets`             | filters, page |
| `PetDetailPage.tsx`         | `/pets/:id`         | — |
| `OwnersPage.tsx`            | `/owners`           | filters, page |
| `ReportsPage.tsx`           | `/reports`          | — |
| `AssignPage.tsx`            | `/assign`           | modal target |
| `UsersPage.tsx`             | `/users`            | modal target |
| `SettingsPage.tsx`          | `/settings`         | activeTab |

---

## i18n — all namespaces registered ✅

7 new namespaces × 3 locales (EN/SI/TA) = 21 locale files.
All imported and registered in `apps/admin/src/i18n/index.ts`.

| Namespace      | File           |
|----------------|----------------|
| `applications` | `apps.json`    |
| `pets`         | `pets.json`    |
| `owners`       | `owners.json`  |
| `reports`      | `reports.json` |
| `assign`       | `assign.json`  |
| `users`        | `users.json`   |
| `settings`     | `settings.json`|

---

## Modified Files

| File | Change |
|------|--------|
| `apps/admin/src/app/App.tsx` | Added 9 new routes |
| `apps/admin/src/i18n/index.ts` | Registered 7 new namespaces for EN/SI/TA |
| `apps/admin/src/layouts/AdminShell.tsx` | Notification center, SVG fix, responsive drawer |

---

## Ponytail Notes

- No chart library — bar chart uses CSS widths (max-item = 100%)
- No state management library — `useState` + `useMemo` per page
- No generic `DataTable` — column variance makes config more complex than repeating JSX
- `Modal.tsx` justified by 2 callers; props kept minimal
- Client-side filter + pagination only — no API until backend endpoints exist
- `ponytail:` reports page uses CSS bars; upgrade to recharts when real data + designer review needed
- `ponytail:` localStorage display name — replace with `/me` API endpoint when auth context is complete

---

## Verification Checklist

- [x] `pnpm --filter @petlanka/admin dev` shows no TypeScript errors
- [x] All 9 nav links route to correct pages without 404
- [x] Each list page: filters narrow results, pagination works, empty state shows
- [x] Applications → Review: "Review" on any row navigates to `/applications/:id` with correct data
- [x] Assign page: "Assign" opens modal, officer list populates, confirm updates row
- [x] Users page: "Add User" opens modal, form submits, new row appears
- [x] Settings: tab navigation switches panels without data loss
- [x] Language switcher (EN/SI/TA) translates all page strings
- [x] Notification bell shows unread badge count
- [x] Clicking a notification navigates to its route and marks it read
- [x] "Mark all read" clears unread badge
- [x] All SVG icons render without clipping on all screen sizes
- [x] Mobile: sidebar hidden by default, burger button opens drawer
- [x] Mobile: clicking a nav link closes the drawer
- [x] Mobile: clicking the backdrop closes the drawer
- [x] Mobile: ESC key closes open dropdowns and modals
- [x] Desktop `lg+`: sidebar always visible, burger hidden, full topbar shown
- [x] Notification panel does not overflow on narrow viewports

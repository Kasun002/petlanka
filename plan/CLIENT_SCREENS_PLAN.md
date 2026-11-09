# Plan: Client FE Screens

## Status: COMPLETE

---

## Context

Mobile-first pet licensing app for Sri Lankan citizens. Auth + Home are complete.
Four bottom-nav tabs drive the remaining screens: **Home** ✅ | **My Pets** | **Apply** | **Profile**.

Design reference: `ref-doc/Design.html` (bundled HTML design board, ~13 pages).

---

## Design Screen → Route Mapping

| Design Screen        | Route                  | Tab      | Status     |
|----------------------|------------------------|----------|------------|
| Welcome              | `/`                    | —        | ✅ Done    |
| Login                | `/login`               | —        | ✅ Done    |
| OTP Verify           | `/login/verify`        | —        | ✅ Done    |
| Register             | `/register`            | —        | ✅ Done    |
| Home                 | `/home`                | Home     | ✅ Done    |
| My Pets              | `/pets`                | Pets     | ✅ Done    |
| Pet Detail           | `/pets/:id`            | Pets     | ✅ Done    |
| Apply (multi-step)   | `/apply`               | Apply    | ✅ Done    |
| Application Detail   | `/applications/:id`    | —        | ✅ Done    |
| Profile              | `/profile`             | Profile  | ✅ Done    |

> `/applications/:id` is not a tab — reached from notifications (`route: "/applications/n1"`) and Pet Detail.

---

## Design Tokens (from tailwind.config.js)

```
primary:       #0F7A63   green
primary-dark:  #0A5C49   dark teal
surface:       #F5F3EC   off-white background
orange:        #E8863A   badges / accent
muted:         #9A968A   secondary text
```

---

## SOLID Alignment

| Principle | How applied |
|-----------|-------------|
| S | Each component one job: list item / detail header / licence card / step form are separate files |
| O | `StatusBadge`, `SelectInput`, `FormField` closed to modification; pages compose them |
| L | Step components in Apply wizard are interchangeable — same `{ data, onChange }` props shape |
| I | Each feature imports only its own type file; no cross-feature type coupling |
| D | Pages depend on data imports and type interfaces, not direct JSON reads in component bodies |

---

## Data Layer

All dummy data lives in `apps/client/src/data/`. Real API calls will replace `import data from '../data/x.json'` lines later — shape matches expected API response.

### JSON files to create

| File                   | Contents                                     |
|------------------------|----------------------------------------------|
| `pets.json`            | 4 pets (ACTIVE / EXPIRES / PENDING / EXPIRED) |
| `applications.json`    | 5 applications (PENDING / APPROVED / REJECTED / INFO_REQUIRED) |
| `profile.json`         | User profile: fullName, nic, phone, address  |

> `home.json` already has 3 pets and 3 notifications — `pets.json` will be a superset (same IDs kept consistent).

---

## TypeScript Types

New files in `apps/client/src/types/`:

### `pet.ts`
```ts
export type PetStatus = 'ACTIVE' | 'EXPIRES' | 'PENDING' | 'EXPIRED'; // already in home.ts — re-export
export type PetSpecies = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  dob: string;          // 'YYYY-MM-DD'
  microchip?: string;
  status: PetStatus;
  statusLabel: string;
  licenceNumber?: string;
  licenceExpiresAt?: string;
  applicationId?: string;
}
```

### `application.ts`
```ts
export type AppStatus = 'PENDING' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface OfficerNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Application {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  status: AppStatus;
  submittedAt: string;
  updatedAt: string;
  officerNotes: OfficerNote[];
}
```

### `profile.ts`
```ts
export interface UserProfile {
  fullName: string;
  nic: string;
  phone: string;
  email?: string;
  address: {
    province: string;
    district: string;
    city: string;
    streetAddress: string;
  };
}
```

---

## Shared UI Components

Reused from existing (`apps/client/src/components/ui/`):
- `StatusBadge` — pet/application status pills
- `FormField` — form field wrapper with error display
- `SelectInput` — styled select (just created)
- `Card` — white card wrapper

No new generic UI components needed.

---

## Feature Components

### Pets (`components/pets/`)

| File               | Responsibility                                                   |
|--------------------|------------------------------------------------------------------|
| `PetListItem.tsx`  | Card row: species icon + name + breed + StatusBadge + chevron   |
| `LicenceCard.tsx`  | White card: licence number, issued/expires dates, renewal CTA   |

### Apply (`components/apply/`)

| File                  | Responsibility                                              |
|-----------------------|-------------------------------------------------------------|
| `StepIndicator.tsx`   | Horizontal step dots/labels: `1 Pet Info → 2 Documents → 3 Review` |
| `PetInfoStep.tsx`     | Step 1 form: name, species, breed, DOB, microchip (optional) |
| `DocumentsStep.tsx`   | Step 2: checklist of required docs (dummy — no real upload) |
| `ReviewStep.tsx`      | Step 3: summary of all data with Submit button              |

> No file-upload implementation — `DocumentsStep` renders a checklist UI with "Upload" buttons that are non-functional (placeholder for API integration).

### Profile (`components/profile/`)

| File                  | Responsibility                                              |
|-----------------------|-------------------------------------------------------------|
| `ProfileInfoCard.tsx` | Read-only section: label/value rows (name, NIC, phone, address) |
| `ProfileEditForm.tsx` | Editable form reusing `FormField` + `AddressFields`         |

---

## Pages

### `pages/PetsPage.tsx`
```
Route: /pets
State: none (renders list from pets.json)
Layout: same px-5 pt-[18px] AppShell padding as HomePage
Mobile: vertical list of PetListItem cards
Desktop: 2-col grid
CTA: FAB-style "+" button → navigate('/apply')
Empty: illustration + "No pets registered yet" + Apply button
```

### `pages/PetDetailPage.tsx`
```
Route: /pets/:id
State: pet loaded by id from pets.json
Layout: back arrow header + pet hero section + licence card + application history list
Species icon: same ICON_STYLES pattern as PetCard (Cat/Dog → primary/orange)
LicenceCard: shown only when licenceNumber exists
Application history: maps applicationId to applications.json entry
Renewal CTA: visible only when status === 'EXPIRES' or 'EXPIRED'
```

### `pages/ApplyPage.tsx`
```
Route: /apply
State:
  step: 0 | 1 | 2          (useState)
  form: Partial<NewPetForm>  (useState, updated per step)

type NewPetForm = {
  name: string;
  species: PetSpecies;
  breed: string;
  dob: string;
  microchip?: string;
}

Flow: StepIndicator → PetInfoStep → DocumentsStep → ReviewStep → success screen
Back: step > 0 → step - 1
Submit: logs to console (ponytail: replace with POST /applications when endpoint exists)
Success: inline confirmation with "Back to Home" button (no separate route)
```

### `pages/ApplicationDetailPage.tsx`
```
Route: /applications/:id
State: application loaded by id from applications.json
Layout: back arrow + status header + timeline of officerNotes + respond section
Respond section: shown only when status === 'INFO_REQUIRED'
  → textarea for reply + "Submit Response" button (dummy)
Reached from: notification click (route: "/applications/n1"), PetDetailPage
```

### `pages/ProfilePage.tsx`
```
Route: /profile
State: editing: boolean (useState)
Layout: avatar initials block + ProfileInfoCard (read mode) or ProfileEditForm (edit mode)
Language section: same LanguageSwitcher from AppShell (extract to shared component)
Logout: calls clearAuth() + navigate('/') — same pattern as AdminShell
```

---

## Routes Added to `App.tsx`

```tsx
<Route element={<AppShell />}>
  <Route path="/home"              element={<AuthRoute><HomePage /></AuthRoute>} />
  <Route path="/pets"              element={<AuthRoute><PetsPage /></AuthRoute>} />
  <Route path="/pets/:id"          element={<AuthRoute><PetDetailPage /></AuthRoute>} />
  <Route path="/apply"             element={<AuthRoute><ApplyPage /></AuthRoute>} />
  <Route path="/applications/:id"  element={<AuthRoute><ApplicationDetailPage /></AuthRoute>} />
  <Route path="/profile"           element={<AuthRoute><ProfilePage /></AuthRoute>} />
</Route>
```

---

## i18n Namespaces

New namespaces × 3 locales (EN / SI / TA) = 9 locale files.

| Namespace | File         | Key groups                               |
|-----------|--------------|------------------------------------------|
| `pets`    | `pets.json`  | listTitle, noPets, viewDetail, renew...  |
| `apply`   | `apply.json` | steps, petInfo, documents, review, submit... |
| `profile` | `profile.json` | title, edit, save, logout, language...  |

> `common` namespace already has `status.*` for StatusBadge — reused as-is.

---

## State Management Approach

No new Context or external state library. Local `useState` per page is sufficient:

| Page                   | State                                      |
|------------------------|---------------------------------------------|
| `PetsPage`             | None (static render from data)             |
| `PetDetailPage`        | None (derived from route param + data import) |
| `ApplyPage`            | `step`, `form` — co-located in page        |
| `ApplicationDetailPage`| `replyText: string`                        |
| `ProfilePage`          | `editing: boolean`, `form: UserProfile`    |

Notification tap → navigate to route: handled in `AppShell` notification button (future — panel not built for client yet, bell is decorative currently).

---

## Notification Center ✅

**Added after initial plan.**

### `apps/client/src/data/notifications.json`
5 notifications (3 unread, 2 read) with correct routes pointing to `/applications/:id` and `/pets/:id`.

### `apps/client/src/types/notification.ts`
`ClientNotificationType = 'action' | 'reminder' | 'success' | 'info'`
`ClientNotification` — id, type, title, body, route, read, time

### `apps/client/src/components/notifications/NotificationPanel.tsx`
- Per-type colour-coded icon: action (purple), reminder (amber), success (green), info (blue) — matches existing `NotificationItem` palette
- Outside-click + ESC key close via `useEffect`
- Click row → `onRead(id)` + `navigate(n.route)` + `onClose()`
- "Mark all read" shown only when unread > 0
- Panel width: `min(340px, calc(100vw-2rem))` — safe on mobile
- `max-h-[380px] overflow-y-auto` on list — no overflow on small screens

### Integration in `AppShell.tsx`
- `useState<ClientNotification[]>` for notification list
- `useState<boolean>` for `notifOpen`
- Single `useRef<HTMLButtonElement>` shared across both mobile + desktop renders via a `bellButton()` helper function — prevents duplicate state/logic
- Dynamic unread badge count (replaces static orange dot)
- Both mobile and desktop bells fully functional

### Shell i18n additions
`notifications.title`, `notifications.markAllRead`, `notifications.empty` added to EN / SI / TA `shell.json`.

---

## Ponytail Notes

- No form library for Apply wizard — 3 small step components, `useState` is enough
- No route-per-step in Apply — single `/apply` route with internal `step` state; URL doesn't reflect step (acceptable for now)
- No document upload — `DocumentsStep` is UI-only placeholder
- CSS-only species icons (SVG inline) — no image assets needed
- `LanguageSwitcher` will be extracted from `AppShell` to `components/ui/LanguageSwitcher.tsx` when `ProfilePage` needs it (single source of truth)
- `ponytail:` apply form uses local state; upgrade to `useReducer` or react-hook-form multi-step if form grows beyond 3 fields per step

---

## Modified Files

| File | Change |
|------|--------|
| `apps/client/src/app/App.tsx` | Add 5 new routes |
| `apps/client/src/i18n/index.ts` | Register `pets`, `apply`, `profile` namespaces |
| `apps/client/src/layouts/AppShell.tsx` | Extract `LanguageSwitcher` to `components/ui/` |

---

## Verification Checklist

- [ ] `/pets` renders list; empty state shown when no pets
- [ ] `/pets/:id` loads correct pet by route param; licence card shown/hidden by status
- [ ] Renewal CTA on PetDetailPage navigates to `/apply`
- [ ] `/apply` wizard: Back/Next step nav works; data persists across steps within session
- [ ] `/apply` Review step shows all entered data; Submit shows success screen
- [ ] `/applications/:id` loads correct application; respond section shown only for INFO_REQUIRED
- [ ] `/profile` toggles between read/edit mode; language switcher works
- [ ] Logout on ProfilePage clears auth and redirects to `/`
- [ ] Bottom nav active state updates correctly for all 4 tabs
- [ ] All SVG icons have `viewBox="0 0 24 24"` + `className="block"`
- [ ] Desktop layout: 2-col where applicable, same `md:` breakpoints as HomePage
- [ ] Language switcher (EN/SI/TA) translates all new strings
- [ ] No TypeScript errors: `pnpm --filter @petlanka/client build`

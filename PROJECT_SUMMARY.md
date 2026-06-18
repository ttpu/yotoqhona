# TalabaJoy — Project Summary

Student housing marketplace built on Next.js 14 (App Router) + TypeScript.
Repo: `github.com/ttpu/yotoqhona`, branch `last_fesign`.

## Stack & architecture notes

- **Styling**: plain CSS Modules (`*.module.css`). Tailwind and `lucide-react`
  are installed but unused — don't add new code assuming they're wired up.
- **Persistence**: no real database. Prisma is installed/scaffolded
  (`prisma/schema.prisma`) but nothing in the app imports `@prisma/client`.
  Real persistence is flat JSON files under `data/` (`users.json`,
  `listings.json`, `reviews.json`, `favorites.json`), read/written via
  `fs.promises` in `src/lib/auth-store.ts` and `src/lib/listings-store.ts`.
- **Auth**: `talabajoy_session` httpOnly cookie holding JSON
  `{id, email, displayName, role, status, verified, university?, faculty?,
  course?, organizationName?}`, parsed via `src/lib/session.ts`. Roles:
  `STUDENT`, `UNIVERSITY_PROVIDER`, `PRIVATE_PROVIDER`.
- **Maps**: Leaflet + OpenStreetMap tiles (`react-leaflet`), no API key
  required. Dynamically imported with `ssr:false` since Leaflet touches
  `window`.
- **Images**: uploaded via multipart form to API routes, written to
  `public/uploads/listings/<id>/`. Local filesystem — won't survive a
  serverless/production redeploy without swapping in real object storage.

## What was built this session

### 1. Design system / redesign
Copied the TalabaJoy visual language from a reference HTML file: dark green
`#1a3c34`, yellow accent `#f5c518`, background `#e8ebe8`. Two-panel layout
(`SiteShell`: white rounded `topPanel` for the header, white rounded
`contentPanel` for page content, both on the gray page background).
Redesigned the homepage (hero with background photo + gradient overlay,
about/mission/why/map/stats/CTA sections, icon-slot system for custom PNG
icons) and the site header (search bar, nav, guest vs logged-in states).

### 2. Auth pages
Rebuilt `/auth/login` and `/auth/register` to match the design system.
Register has a 3-step flow (role choice → role-specific form → success) for
Student / University Administration / Private Provider, each with their own
field set, password strength meter, and validation.

### 3. Profile dropdown, notifications, logout
- Fixed a bug where the avatar never appeared after login/register: root
  layout was calling non-existent `auth-store` functions. Replaced with
  `src/lib/session.ts`'s direct cookie parsing.
- Role-specific dropdown menu (different items for student vs university
  admin vs private provider) with a header showing name + role/university/
  course.
- Dynamic notification bell badge (was hardcoded).
- Fixed logout: the button posted to a route that only had a `GET` handler.
  Added a POST handler plus a confirmation modal ("Profildan
  chiqmoqchimisiz?").

### 4. Housing listings marketplace (the big feature)
Full CRUD marketplace for housing listings:
- **Create/edit** (`/dashboard/listings/new`, `/dashboard/listings/[id]/edit`):
  title, description, type (apartment/room/dormitory/house), address, a
  Leaflet click-to-pick-location map, price + currency, rooms/capacity,
  amenities + custom amenity, multi-photo upload, contact info (phone/
  Telegram/email), tenant requirements. Role-gated server-side.
- **Catalog** (`/catalog`): search, filters (type/city/price/rooms/
  amenities), sort, pagination, uniform-height cards.
- **Detail page** (`/housing/[id]`): photo gallery, read-only map, full
  specs, contact buttons, status badge, star ratings + reviews, favorite
  toggle, cookie-deduped view counter.
- **My Listings** (`/dashboard/listings`): owners manage their own
  listings (edit/delete/status); `UNIVERSITY_PROVIDER` accounts see and can
  moderate *all* listings.
- **Favorites** (`/favorites`) + reviews (1-5 stars) + view counts.
- Deferred to a future pass: report-listing flow and a notification
  tie-in for new matching listings.

### 5. Demo data
`npm run seed:demo` creates one demo account per role and 6 sample listings
with real photos, amenities, and a few reviews (idempotent — safe to
re-run). **Demo logins** (password `Demo12345` for all):
- `demo.student@talabajoy.uz` — STUDENT
- `demo.university@talabajoy.uz` — UNIVERSITY_PROVIDER
- `demo.owner@talabajoy.uz` — PRIVATE_PROVIDER

A "Mashhur e'lonlar" (featured listings) row was added to the homepage
between the "About" and "Mission" sections, showing the 4 newest listings.

### 6. Bug fixes found along the way
- `src/app/auth/layout.tsx` and `src/app/dashboard/layout.tsx` both had
  their own `<html><body>` wrappers — invalid nested HTML breaking every
  route under those segments. Replaced with plain passthrough layouts.
- `Intl.NumberFormat("uz-UZ")` formats numbers differently between Node
  (server) and browser ICU data, causing a hydration mismatch on listing
  prices. Replaced with a manual, deterministic thousands-separator
  formatter.
- Listing card images used `aspect-ratio` on a wrapper with a child
  `<img width:100% height:100%>` in normal flow — a perfectly square source
  photo could override the wrapper's computed height in some browsers,
  blowing out that card (and, via CSS grid's row-stretch, every other card
  in the same row). Fixed by taking the `<img>` out of flow
  (`position:absolute; inset:0`) so the wrapper's `aspect-ratio` is the only
  thing governing its size.
- Removed "Bosh sahifa" / "Yordam" from the navbar; fixed the "Turar joy
  joylashtirish" homepage CTA so a logged-in provider goes straight to
  `/dashboard/listings/new` instead of being sent to register again.

## How things were verified

No browser is available by default in this sandbox. Each UI change was
verified by temporarily installing Playwright (`npm install --no-save
playwright` + `npx playwright install chromium` + `sudo npx playwright
install-deps chromium`), driving headless Chromium against the local dev
server, checking for console/hydration errors, and screenshotting — then
uninstalling Playwright and deleting any test users/listings created during
the check.

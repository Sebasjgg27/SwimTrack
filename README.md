# SwimTrack

**Swimming club management platform** — track times, meets, training zones, and leaderboards.

Built with Next.js 14 (App Router), Supabase, Tailwind CSS, and TypeScript.

## Features

- **Time & Meet Management** — Log swimmer results by event, meet, and pool type
- **Training Pace Zones** — CSS-based pace calculator from 400m + 200m time trials
- **Geographic Leaderboard** — Filter by International, Country, Region, or Club
- **Excel Import** — Import times from Spanish-format Excel templates (Competencia/Entreno)
- **Swimmer Profiles** — Personal bests, progression chart, pace cards
- **Multi-role Auth** — Club Admin, Coach, Swimmer roles
- **Dark / Poolside Light Mode** — Theme toggle on public pages
- **HydroPulse Design** — Dark glassmorphism with Electric Cyan accents

## Quick Start

```bash
npm install
cp .env.example .env.local   # add your Supabase credentials
npm run dev                   # → http://localhost:3000/register
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin operations) |

## Project State

Partially built MVP. The core flow works: sign up → create swimmer profile → add meets/results → view leaderboard → import Excel → calculate CSS zones.

## What's Broken / Failing

| Issue | Details |
|-------|---------|
| Dashboard color theming | Dashboard pages use hardcoded Tailwind `slate` colors instead of CSS variables — no poolside theme support in dashbaord |
| Settings club save | API ignores `country_id` and `default_pool_type` fields from the settings form |
| Onboarding bypasses API | Uses browser client `createSwimmer()` directly instead of `/api/swimmers` — bypasses RLS |
| No password reset | Forgot-password route removed, no reset flow exists |
| Time-trials silent fail | If the user has no swimmer profile, the load silently fails with "No swimmer profile found" |
| Theme toggle limited | Only public pages have the Poolside/Dark toggle; dashboard has no theme toggle |
| CSS `@layer` conflict | Tailwind's `font-mono` utility class now uses CSS variable but may conflict in edge cases |

## What's Missing (vs SPEC.md)

### API Routes Not Implemented
- `GET /api/swimmers/[id]/pace-card`
- `GET /api/swimmers/[id]/progression`
- `GET /api/leaderboard/embed`
- Auth API routes (all auth handled client-side via `src/lib/auth.ts`)

### File Import Formats Not Implemented
- CSV (comma/tab-delimited)
- Lenex XML (.lxf / .lef)
- SDIF Hy-Tek (.sd3)
- Manual time entry form

### Features Not Built
- QR swimmer cards (for poolside check-in)
- Club analytics dashboard (charts, stats)
- Embed widget (public leaderboard embed)
- Notification system (email alerts for PBs, meets)
- World Aquatics points UI display (utility exists but unused in pages)
- Profile visibility enforcement (no code checks `profile_visibility` or `is_minor`/`parent_consent`)
- Parent and Spectator roles (schema exists, no UI)
- Country / region management (schema exists, no API)
- Pool type conversion UI (utility `convertTime()` exists but unused)

### Quality & Testing
- No test suite (unit, integration, or E2E)
- No accessibility audit (WCAG 2.1 AA)
- No error tracking (Sentry, etc.)
- No CI pipeline for linting/testing
- No Storybook or component documentation

### UX Polish
- No empty states for most pages (just "No data" text)
- No toast notifications for success/error feedback
- Mobile hamburger menu works but sidebar lacks animation polish
- No SEO meta tags on dashboard pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Icons | Lucide React |
| Charts | Recharts |
| Spreadsheet | SheetJS (xlsx) |
| Hosting | Vercel |

## CSS Formula

```
CSS = (T400 - T200) / 2000       # sec/100m
A1   = CSS + 20–30s              # Recovery
A2   = CSS + 10–20s              # Endurance
A3   = CSS ± 5s                  # Threshold
VO2  = CSS – 5–10s               # VO2 Max
TOL  = CSS – 10–15s              # Lactate Tolerance
ALLOUT = CSS – 15s               # Sprint
```

## License

MIT

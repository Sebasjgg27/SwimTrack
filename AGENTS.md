# AGENTS.md - Development Agent Guidelines

## Project Overview

**SwimTrack** is a swimming club management platform built with:
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel

## Environment Setup

### Prerequisites
- Node.js 18+
- Supabase CLI (`brew install supabase/tap/supabase`)

### Local Development
```bash
npm install
npm run dev
```

### Environment Variables
Located in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Database Migrations (Supabase)

The project uses Supabase CLI for managing database schema. Currently using a single Supabase project (`swimtrack`).

### Migration Files Location
All migrations are in `supabase/migrations/` with timestamp prefixes.

### Workflow for Database Changes

1. **Create a new migration**:
   ```bash
   supabase migration new <migration_name>
   ```

2. **Write the SQL** in the new migration file in `supabase/migrations/`

3. **Push to DEV** (test first):
   ```bash
   supabase link --project-ref <dev-project-ref>
   supabase db push
   ```

4. **Verify in DEV** - Check the database via Supabase dashboard

5. **Push to PROD** (when ready):
   ```bash
   supabase link --project-ref <prod-project-ref>
   supabase db push
   ```

---

## Code Conventions

### TypeScript
- Strict typing enabled in `tsconfig.json`
- Use interfaces/types from `src/types/index.ts`
- All API routes return typed responses via `jsonSuccess()` / `jsonError()`

### Components
- UI components live in `src/components/ui/` (Button, Card, Input, Select, Table, Badge)
- Layout components in `src/components/layout/`
- Domain components in `src/components/{domain}/` (swimmer/, meet/, leaderboard/)

### Styling
- Tailwind CSS only, follow existing class patterns
- Custom colors defined in `tailwind.config.ts`: `primary`, `secondary`, `accent`, `success`, `warning`, `error`
- Fonts: Space Grotesk (sans/heading), JetBrains Mono (mono) via `next/font/google` with `variable` CSS custom properties

### Supabase
- **Browser client**: `createClient()` from `src/lib/supabase.ts`
- **Server client**: `createSupabaseServerClient()` from `src/lib/supabase.ts`
- **Service role**: `createServiceRoleClient()` from `src/lib/supabase.ts` (admin operations only)
- **Auth helpers**: `src/lib/auth.ts` (signIn, signUp, signOut, getCurrentUser)
- **Server auth**: `src/lib/server-auth.ts` (requireAuth, getUserProfile, getUserClubRole)

### Authentication Flow
- Middleware (`src/middleware.ts`) protects routes: `/dashboard`, `/onboarding`
- Auth context (`src/contexts/auth-context.tsx`) provides user/profile/club to all dashboard pages
- Profile auto-created by DB trigger on signup (do NOT call createProfile in code)

### Route Groups
- `(dashboard)/` - Authenticated dashboard pages, wrapped in `AuthProvider` + `DashboardLayout`
- `(public)/` - Public pages with shared dark header layout

---

## API Routes

All API routes are in `src/app/api/` and use Next.js App Router conventions.

### Utility Helpers (`src/lib/api-utils.ts`)
- `authenticatedSupabase()` - Returns `{ supabase, user, error }` with auth check
- `jsonError(message, status)` - Standardized error response
- `jsonSuccess(data, status)` - Standardized success response
- `getClubId(supabase, userId)` - Gets user's primary club ID

### Available Endpoints
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/swimmers` | GET, POST | club member | List/create swimmers |
| `/api/swimmers/[id]` | GET, PUT, DELETE | club member | Swimmer CRUD |
| `/api/swimmers/[id]/pbs` | GET | club member | Personal bests |
| `/api/meets` | GET, POST | club member | List/create meets |
| `/api/meets/[id]` | GET, PUT, DELETE | club member | Meet CRUD |
| `/api/results` | GET, POST | club member | List/create results |
| `/api/time-trials` | GET, POST | own/coach | Time trials |
| `/api/time-trials/calculate-css` | POST | own/coach | Calculate CSS + zones |
| `/api/leaderboard` | GET | public | Public leaderboard |
| `/api/import` | POST | coach/admin | Import Excel template |
| `/api/profile` | GET, PUT | authenticated | User profile |

---

## Excel Import Format

The app supports importing from a specific Excel template format:

### Sheet: "Todos los Tiempos"
| Column | Description |
|--------|-------------|
| Fecha | Date (MM/DD/YYYY or Excel serial) |
| Tipo | "Competencia" or "Entreno" |
| Nombre | Competition/training name |
| Libre 25m-1500m | Freestyle times |
| Espalda 25m-200m | Backstroke times |
| Pecho 25m-200m | Breaststroke times |
| Mariposa 25m-200m | Butterfly times |
| Comb 100m-400m | IM times |

- Times in `MM:SS.mmm` format
- Pool type auto-detected from name: "(LC)" = LCM, "(SC)" = SCY, default SCM
- Competition rows → creates meets + results
- Training rows → creates time trials

---

## Key Files

### Core
- `src/lib/supabase.ts` - Browser-only Supabase client
- `src/lib/supabase-server.ts` - Server Supabase client + service role client
- `src/lib/auth.ts` - Authentication helpers
- `src/lib/server-auth.ts` - Server-side auth helpers
- `src/lib/api-utils.ts` - API route utilities
- `src/lib/utils.ts` - Shared utilities (cn, formatTime, parseTime, calculateCSS, calculateZones)
- `src/types/index.ts` - TypeScript type definitions

### Layout
- `src/app/(dashboard)/layout.tsx` - Dashboard layout (AuthProvider + DashboardLayout)
- `src/app/(public)/layout.tsx` - Public layout (shared header)
- `src/components/layout/dashboard-layout.tsx` - Sidebar + main content shell
- `src/contexts/auth-context.tsx` - Client-side auth state

### Database
- `supabase/migrations/` - Database migrations
- `supabase/schema.sql` - Original schema (deprecated, use migrations)

---

## Common Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/        # Authenticated route group
│   │   ├── layout.tsx      # AuthProvider + DashboardLayout wrapper
│   │   └── dashboard/
│   │       ├── page.tsx    # Dashboard home
│   │       ├── swimmers/   # Swimmers list + profile
│   │       ├── meets/      # Meets management
│   │       ├── leaderboard/
│   │       ├── time-trials/
│   │       ├── import/     # Excel import wizard
│   │       └── settings/
│   ├── (public)/           # Public route group
│   │   ├── layout.tsx      # Shared dark header
│   │   ├── leaderboard/
│   │   └── demo/profile/
│   ├── api/                # API routes
│   │   ├── swimmers/
│   │   ├── meets/
│   │   ├── results/
│   │   ├── time-trials/
│   │   ├── leaderboard/
│   │   ├── import/
│   │   └── profile/
│   ├── login/
│   ├── register/
│   └── onboarding/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   ├── swimmer/
│   ├── meet/
│   └── leaderboard/
├── contexts/
│   └── auth-context.tsx
├── lib/                    # Utilities and helpers
├── types/
│   └── index.ts
└── middleware.ts
```

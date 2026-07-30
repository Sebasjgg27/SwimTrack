# Contributing to SwimTrack

## Getting Started

1. Clone and install dependencies:
   ```bash
   git clone <repo>
   cd swimtrack
   npm install
   ```

2. Set up environment variables (see `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Authenticated pages
│   ├── (public)/        # Public pages
│   ├── api/             # API routes
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── onboarding/      # Onboarding wizard
├── components/
│   ├── ui/              # Design primitives (Card, Button, Input, etc.)
│   ├── layout/          # Layout components (sidebar, headers)
│   ├── swimmer/         # Swimmer profile components
│   └── leaderboard/     # Leaderboard components
├── contexts/            # React contexts (auth)
├── lib/                 # Utilities and helpers
│   ├── supabase.ts      # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client + service role
│   ├── auth.ts          # Client-side auth helpers
│   ├── server-auth.ts   # Server-side auth helpers
│   ├── api-utils.ts     # API route helpers
│   └── utils.ts         # Time formatting, CSS calculation, etc.
└── types/               # TypeScript type definitions
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production server |

## Code Conventions

### TypeScript
- Strict mode enabled in `tsconfig.json`
- All types/interfaces in `src/types/index.ts`
- API routes return `jsonSuccess()` / `jsonError()` from `src/lib/api-utils.ts`

### Components
- UI primitives in `src/components/ui/` (themed with CSS variables)
- Layout components in `src/components/layout/`
- Domain components grouped by feature (`swimmer/`, `meet/`, `leaderboard/`)

### Styling
- Tailwind CSS + CSS custom properties for theming
- Two themes: `data-theme="dark"` (default) and `data-theme="poolside"` (light)
- Use CSS variable classes (`glass-card`, `btn-primary`, `input`, `label`, `card`) for theme consistency
- Avoid hardcoded Tailwind color classes — prefer CSS variables

### Fonts
- Space Grotesk (sans/heading) and JetBrains Mono (mono) via `next/font/google`
- Fonts are loaded in `src/app/layout.tsx` with `variable` CSS custom properties

## Database Migrations

All migrations live in `supabase/migrations/` with timestamp prefixes.

```bash
supabase migration new <name>
# Write SQL in the generated file
supabase link --project-ref <ref>
supabase db push
```

## API Routes

All API routes use `authenticatedSupabase()` for auth checks:

```typescript
import { authenticatedSupabase, jsonError, jsonSuccess } from "@/lib/api-utils";

export async function GET() {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;
  // ...
  return jsonSuccess(data);
}
```

## Pull Request Checklist

- [ ] `npm run lint` passes with no warnings
- [ ] `npm run build` completes successfully
- [ ] New API routes use `authenticatedSupabase()` / `jsonSuccess()` / `jsonError()`
- [ ] New pages include `loading.tsx` and `error.tsx` at the route segment level
- [ ] UI components use CSS variable classes (not hardcoded Tailwind colors)
- [ ] Changes are backwards-compatible with existing schema
- [ ] Database migrations are additive only (no destructive changes to production data)

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

The project uses Supabase CLI for managing database schema. There are two Supabase projects:
- **DEV**: `swimtrack-dev` - Development/testing environment
- **PROD**: `swimtrack-prod` - Production environment

### Migration Files Location
All migrations are in `supabase/migrations/` with timestamp prefixes (e.g., `20260511014823_create_initial_schema.sql`).

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
   Get the project ref from Supabase dashboard URL: `https://supabase.com/dashboard/project/abc123` → ref is `abc123`

4. **Verify in DEV** - Check the database via Supabase dashboard or Studio

5. **Push to PROD** (when ready):
   ```bash
   supabase link --project-ref <prod-project-ref>
   supabase db push
   ```

### Viewing Local Database
```bash
supabase studio
```
Opens Supabase Studio at `http://127.0.0.1:54323` (requires Docker or local Supabase).

---

## Code Conventions

- **TypeScript**: Strict typing, use interfaces/types from `src/types/index.ts`
- **Components**: Use existing UI components from `src/components/ui/`
- **Styling**: Tailwind CSS, follow existing class patterns
- **Supabase Client**: Use `src/lib/supabase.ts` - `createClient()` for browser, `createSupabaseServerClient()` for server components

---

## Common Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

---

## Key Files

- `src/lib/supabase.ts` - Supabase client configuration
- `src/types/index.ts` - TypeScript type definitions
- `supabase/migrations/` - Database migrations
- `supabase/schema.sql` - Original schema (deprecated, use migrations)
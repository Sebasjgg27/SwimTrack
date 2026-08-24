# SwimTrack

SwimTrack is an early beta for swimming clubs. The current release has secure account onboarding, club creation, swimmer rosters, and a tested Critical Swim Speed (CSS) training-zone calculator. Meets, leaderboards, result imports, and detailed performance profiles are clearly labeled previews and do not save competition data yet.

## What works in this beta

- Email/password accounts backed by Supabase Auth
- Atomic club creation with the creator assigned as club administrator
- Real club and swimmer roster persistence with row-level security
- Minor/parental-consent handling when administrators add swimmers
- CSS pace and training-zone calculation from 400 m and 200 m trials
- Responsive public and authenticated interfaces
- CSV, TXT, and Markdown file inspection in the browser (preview only)

The demo profile and leaderboard use fictional sample data. Meets, imports, detailed swimmer history, notifications, exports, and club editing are planned work, not production features.

## Stack

- Next.js 16, React 18, TypeScript, and Tailwind CSS
- Supabase PostgreSQL, Auth, and row-level security
- Vercel-ready web deployment
- Vitest and ESLint validation

## Local setup

Prerequisites:

- Node.js 20–24 (Node 22 is recommended; see `.nvmrc`)
- npm
- Docker Desktop and the Supabase CLI for the full local backend

Install the application:

```bash
npm ci
cp .env.example .env.local
```

Start Supabase and copy the API URL and publishable/anonymous key printed by the CLI into `.env.local`:

```bash
supabase start
supabase status
```

Only these browser-safe variables are required:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_publishable_or_anon_key
```

Migrations in `supabase/migrations/` are applied automatically by `supabase start`. Do not use the deprecated `supabase/schema.sql` file.

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and complete onboarding.

## Validation

Run the same application checks used by CI:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

To validate migrations locally:

```bash
supabase db reset
supabase db lint --level warning
```

## Publishing

### 1. Create the production Supabase project

Create a Supabase project, then link and apply the committed migrations:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

In Supabase Auth URL configuration, set the site URL to the final Vercel domain and allow these redirects:

- `https://YOUR_DOMAIN/login`
- `https://YOUR_DOMAIN/onboarding`
- `https://YOUR_DOMAIN/dashboard`

Keep the service-role key out of Vercel: this application does not need it.

### 2. Deploy the web application

Import the GitHub repository into Vercel. Use Node.js 22 and add these production environment variables from the Supabase project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (a publishable key is also accepted)

Vercel will use `npm run build`. After the first deployment, update the Supabase Auth URLs with the assigned domain and test registration, login/logout, club creation, and swimmer creation.

### 3. GitHub migration deployment

The included migration workflow runs when migrations reach `main`. Configure these GitHub Actions secrets:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

Test migrations in a development Supabase project before pointing the workflow at production.

## Database safety

Every public table has row-level security. Public leaderboard access is exposed through a restricted view that omits date of birth. Club onboarding uses the `create_club_with_admin` database function so a club cannot be created without its initial administrator role.

## CSS formula

For trial times expressed in seconds, pace per 100 m is:

```text
CSS seconds/100 m = (T400 - T200) / 2
```

The calculator rejects impossible inputs where the 400 m time is not slower than twice the 200 m time. Its parsing, CSS, zone, and formatting logic is covered by unit tests.

## License

MIT

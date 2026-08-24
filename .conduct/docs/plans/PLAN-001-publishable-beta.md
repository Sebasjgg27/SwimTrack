# PLAN-001: Publishable SwimTrack Beta

**Status:** Approved
**Source:** inline requirement

## Goal

Publish an honest, usable SwimTrack beta with a supported runtime, a reproducible and secure Supabase backend, a working core account flow, a correct pace calculator, and clear boundaries around preview-only features.

## Slices

| ID | Slice | Wave | Depends on |
| --- | --- | ---: | --- |
| S1 | Supported runtime and production build | 1 | — |
| S2 | Correct pace calculator and quality tooling | 2 | S1 |
| S3 | Secure, reproducible Supabase schema | 2 | S1 |
| S4 | Persistent registration, onboarding, logout, clubs, and swimmers | 3 | S3 |
| S5 | Honest beta UX and working navigation | 3 | S1 |
| S6 | CI, documentation, browser smoke test, and deployment handoff | 4 | S2–S5 |

## S1: Supported runtime and production build

- **Outcome:** The application installs on a supported Next.js release and completes lint, type-check, and production-build checks.
- **Proof:** `npm run lint && npm run typecheck && npm run build` exits successfully.
- **Layers:** runtime, application plumbing, quality gate.
- **Mode:** functional.
- **Scope:** dependencies and scripts, ESLint configuration, browser/server Supabase client separation, Next.js 15 request API compatibility, and existing TypeScript failures.

## S2: Correct pace calculator and quality tooling

- **Outcome:** Time-trial inputs calculate correct CSS pace zones and invalid inputs produce a clear error.
- **Proof:** focused Vitest tests pass and the calculator works in the browser.
- **Layers:** domain logic, UI, tests.
- **Mode:** functional.
- **Scope:** pace parsing/calculation helpers, the time-trials screen, Vitest configuration, and domain tests.

## S3: Secure, reproducible Supabase schema

- **Outcome:** A clean Supabase database can apply every migration in order and enforce least-privilege access for profiles, clubs, roles, and swimmers.
- **Proof:** an isolated local Supabase reset applies all migrations and database lint completes without release-blocking findings.
- **Layers:** schema, authorization, database verification.
- **Mode:** functional.
- **Scope:** migration ordering, profile trigger safety, club-admin bootstrap RPC, row-level security policies, seed configuration, and database indexes/functions needed by the core flow.

## S4: Persistent core account flow

- **Outcome:** A user can register, complete onboarding, sign out, sign back in, and create/list core club and swimmer data without mock or silent local fallbacks.
- **Proof:** the complete flow succeeds against local Supabase in a browser.
- **Layers:** auth, data access, UI, browser integration.
- **Mode:** functional.
- **Scope:** auth helpers, registration/onboarding, dashboard session actions, and club/swimmer list and create screens.

## S5: Honest beta UX and navigation

- **Outcome:** Every prominent link resolves, unavailable features are marked as previews or coming soon, and no screen falsely reports server persistence.
- **Proof:** route/link scan passes and public/dashboard browser smoke checks show no dead-end primary actions.
- **Layers:** UI, content, navigation.
- **Mode:** functional.
- **Scope:** landing page claims, dashboard shortcuts, preview-only screens, error/empty states, and responsive dashboard navigation.

## S6: Release gate and deployment handoff

- **Outcome:** Pull requests run repeatable quality checks, setup/deployment documentation matches reality, and the verified beta is ready to connect to Vercel and the existing Supabase project.
- **Proof:** a clean install passes tests, lint, type-check, build, local database reset, and browser smoke checks.
- **Layers:** CI, operations, documentation, release verification.
- **Mode:** functional.
- **Scope:** GitHub Actions quality workflow, environment template, setup and deployment documentation, final audit, and deployment connection steps.

## Assumptions

- This release is a beta, not completion of every feature described in `SPEC.md`.
- Real behavior is preferred over silent mock or browser-only fallbacks.
- Preview data may remain only where it is prominently identified as preview data.
- The existing hosted Supabase project is preserved and changed only through reviewed migrations.
- Vercel account connection may require an interactive login by the repository owner or collaborator.

## Open Questions

None blocking implementation. Product feedback after the first deployed beta will determine which preview features become the next real vertical slice.

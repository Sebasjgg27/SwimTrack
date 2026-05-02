# SwimTrack - Swimming Club Management Platform

A free-tier web application for swimming clubs to manage times, meets, training zones, and leaderboards.

## Features

- **Time & Meet Management** - Log swimmer times by event, meet, and pool type
- **Training Pace Auto-Calculator** - Generate pace cards from time trials (CSS-based zones)
- **Geographic Leaderboard** - 4-level filtering (International → Country → State → Club)
- **File Import** - Support for XLSX, CSV, TXT, MD, Lenex (.lxf), SDIF (.sd3), and manual entry
- **Swimmer Profiles** - Personal bests, time progression charts, zone cards
- **Multi-role Accounts** - Club Admin, Coach, Swimmer, Parent, Spectator
- **World Aquatics Points** - Automatic points calculation

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel (free tier)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swimtrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Set up the database:
   - Go to [Supabase](https://supabase.com) and create a new project
   - Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (dashboard)/    # Authenticated dashboard pages
│   ├── (public)/      # Public pages
│   └── api/           # API routes
├── components/        # React components
│   ├── ui/           # UI primitives (Button, Card, etc.)
│   ├── layout/       # Layout components
│   ├── swimmer/      # Swimmer-specific components
│   └── ...
├── lib/              # Utility functions
│   ├── supabase.ts   # Supabase client
│   └── utils.ts      # General utilities (time formatting, CSS calculation)
└── types/            # TypeScript type definitions
```

## Training Zone Calculation

The app calculates training pace zones from time trials using the Critical Swim Speed (CSS) formula:

```
CSS = 200 / (T400 - T200)  // meters per second
```

Zone paces (relative to CSS):
- **A1**: CSS + 20-30 sec (Recovery)
- **A2**: CSS + 10-20 sec (Endurance)
- **A3**: CSS ± 5 sec (Threshold)
- **VO2**: CSS - 5-10 sec (VO2 Max)
- **Tolerance**: CSS - 10-15 sec (Lactate Tolerance)
- **All Out**: CSS - 15 sec (Sprint)

## Pool Types

The app supports three pool types with automatic conversion:
- **SCM**: Short Course Meters (25m)
- **LCM**: Long Course Meters (50m)
- **SCY**: Short Course Yards (25y)

## File Import Formats

- **XLSX/CSV**: Excel and CSV files with column mapping
- **Lenex**: World Aquatics XML format (.lxf, .lef)
- **SDIF**: Hy-Tek format (.sd3)
- **TXT/MD**: Delimited text or markdown tables

## Monthly Development Timeline

### Month 1
- Authentication & roles system
- Club/Swimmer/Meet data model
- Manual time entry
- Basic club-level leaderboard
- Pace card calculator

### Month 2
- File import wizard (XLSX, CSV, Lenex, SDIF)
- Geographic leaderboard (all 4 levels + filters)
- Swimmer profiles with PB detection

### Month 3
- Time progression charts
- World Aquatics points
- QR swimmer cards
- Club analytics dashboard
- Embed widget
- Notification system
- Public launch

## License

MIT

## Support

For issues and feature requests, please open an issue on the project repository.
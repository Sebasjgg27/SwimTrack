# SwimTrack - Technical Specification Document

## 1. Project Overview

**Project Name:** SwimTrack
**Project Type:** Full-stack Web Application
**Core Functionality:** A multi-club swimming club management platform for tracking swimmer times, meets, training pace zones, and competitive leaderboards.
**Target Users:** Swimming club administrators, coaches, swimmers, parents, and spectators.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Next.js API Routes
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth

### Infrastructure (Free Tier)
- **Hosting:** Vercel
- **Database:** Supabase (500MB free)
- **Storage:** Supabase Storage (1GB free)

---

## 3. Database Schema

### Tables

```sql
-- Countries and Regions
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  country_id UUID REFERENCES countries(id),
  region_id UUID REFERENCES regions(id),
  city VARCHAR(100),
  address TEXT,
  logo_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  country_id UUID REFERENCES countries(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles (many-to-many)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('club_admin', 'coach', 'swimmer', 'parent', 'spectator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_id, role)
);

-- Swimmers
CREATE TABLE swimmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  club_id UUID REFERENCES clubs(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  date_of_birth DATE,
  profile_visibility VARCHAR(20) DEFAULT 'club_private' CHECK (profile_visibility IN ('club_private', 'club_public', 'country', 'international')),
  is_minor BOOLEAN DEFAULT false,
  parent_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meets
CREATE TABLE meets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  club_id UUID REFERENCES clubs(id),
  country_id UUID REFERENCES countries(id),
  region_id UUID REFERENCES regions(id),
  city VARCHAR(100),
  venue VARCHAR(200),
  meet_date DATE NOT NULL,
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  level VARCHAR(20) CHECK (level IN ('club', 'local', 'regional', 'national', 'international')),
  federation VARCHAR(100),
  results_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (stroke + distance + pool type)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distance INTEGER NOT NULL,
  stroke VARCHAR(30) NOT NULL CHECK (stroke IN ('freestyle', 'backstroke', 'breaststroke', 'butterfly', 'individual_medley', 'relay')),
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'mixed')),
  age_group_min INTEGER,
  age_group_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(distance, stroke, pool_type, gender)
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  meet_id UUID REFERENCES meets(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  entry_time_ms INTEGER,
  official_time_ms INTEGER,
  is_pb BOOLEAN DEFAULT false,
  is_dq BOOLEAN DEFAULT false,
  dq_reason TEXT,
  is_relay BOOLEAN DEFAULT false,
  relay_position INTEGER,
  split_times JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Trial Entries (for CSS calculation)
CREATE TABLE time_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  trial_date DATE NOT NULL,
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zone Pace Cards (calculated from CSS)
CREATE TABLE pace_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  css_sec_per_100 DECIMAL(6,2),
  a1_sec_per_100 DECIMAL(6,2),
  a2_sec_per_100 DECIMAL(6,2),
  a3_sec_per_100 DECIMAL(6,2),
  vo2_sec_per_100 DECIMAL(6,2),
  tolerance_sec_per_100 DECIMAL(6,2),
  all_out_sec_per_100 DECIMAL(6,2),
  pool_type VARCHAR(10),
  calculated_from_trial_id UUID REFERENCES time_trials(id),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swimmer_id, pool_type)
);

-- Import Templates (saved column mappings)
CREATE TABLE import_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  format VARCHAR(20) NOT NULL,
  column_mapping JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. CSS and Zone Calculation

### CSS Formula
```javascript
// Critical Swim Speed calculation
CSS = 200 / (T400 - T200)  // in meters per second
// Convert to sec/100m
CSS_sec_per_100 = 100 / CSS
```

### Zone Paces (relative to CSS)
| Zone | Physiological Role | Pace vs CSS/100m |
|------|-------------------|-------------------|
| A1 | Aerobic Base / Recovery | CSS + 20 to +30 sec |
| A2 | Aerobic Development | CSS + 10 to +20 sec |
| A3 | Aerobic Tempo / Threshold | CSS − 5 to +5 sec |
| VO2 | VO2 Max / Aerobic Power | CSS − 5 to −10 sec |
| Tolerance | Lactate Tolerance | Faster than VO2 |
| All Out | Anaerobic / Race Sprint | CSS − 15 sec or faster |

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Swimmers
- `GET /api/swimmers` - List swimmers (filtered by club)
- `POST /api/swimmers` - Create swimmer
- `GET /api/swimmers/[id]` - Get swimmer profile
- `PUT /api/swimmers/[id]` - Update swimmer
- `DELETE /api/swimmers/[id]` - Delete swimmer
- `GET /api/swimmers/[id]/pbs` - Get personal bests
- `GET /api/swimmers/[id]/pace-card` - Get pace card
- `GET /api/swimmers/[id]/progression` - Get time progression

### Meets
- `GET /api/meets` - List meets
- `POST /api/meets` - Create meet
- `GET /api/meets/[id]` - Get meet details
- `PUT /api/meets/[id]` - Update meet
- `DELETE /api/meets/[id]` - Delete meet

### Results
- `GET /api/results` - List results (filtered)
- `POST /api/results` - Create result
- `POST /api/results/import` - Import from file
- `GET /api/results/pb-check` - Check for new PBs

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard (filtered by geography, event, age group)
- `GET /api/leaderboard/embed` - Get embeddable leaderboard

### Time Trials
- `POST /api/time-trials` - Log time trial
- `GET /api/time-trials/[swimmerId]` - Get swimmer's trials
- `POST /api/time-trials/calculate-css` - Calculate CSS and zones

### Import
- `POST /api/import/xlsx` - Parse XLSX file
- `POST /api/import/csv` - Parse CSV file
- `POST /api/import/lenex` - Parse Lenex XML
- `POST /api/import/sdif` - Parse SDIF format

---

## 6. UI/UX Design

### Color Palette
```css
--primary: #0EA5E9        /* Ocean Blue */
--primary-dark: #0284C7   /* Deep Ocean */
--secondary: #06B6D4      /* Cyan */
--accent: #F59E0B         /* Gold/Medal */
--success: #10B981        /* PB Green */
--warning: #F97316        /* Warning Orange */
--error: #EF4444          /* Error Red */
--background: #F8FAFC    /* Light Gray */
--surface: #FFFFFF        /* White */
--surface-dark: #1E293B   /* Dark Slate */
--text: #0F172A           /* Dark Text */
--text-muted: #64748B     /* Muted Text */
```

### Typography
- **Headings:** Inter (Google Fonts) - Bold
- **Body:** Inter - Regular
- **Monospace:** JetBrains Mono (for times)

### Layout
- Mobile-first responsive design
- Sidebar navigation (desktop) / Bottom nav (mobile)
- Card-based content sections
- Data tables with sorting and filtering

### Key Pages
1. **Landing Page** - Public leaderboard preview, login
2. **Dashboard** - Club overview, recent results, quick actions
3. **Swimmers** - Swimmer list, search, filters
4. **Swimmer Profile** - PBs, pace card, progression charts
5. **Meets** - Meet list, create, manage results
6. **Leaderboard** - Geographic filtering, event selection
7. **Import** - File upload, column mapping, preview
8. **Settings** - Club settings, user management

---

## 7. File Import Specifications

### XLSX/CSV
- Use SheetJS (xlsx) library
- Auto-detect headers
- Column mapping UI with saved templates
- Preview table before import
- Flag invalid rows

### Lenex (.lxf)
- XML format (World Aquatics standard)
- Parse meets, events, swimmers, results
- Handle compression (.lxf = zipped .lef)

### SDIF (.sd3)
- Hy-Tek format (USA Swimming)
- Fixed-width field parser
- Map to internal event types

### Manual Entry
- Form with swimmer selection, event, time input
- Time format: MM:SS.xx or manual millisecond entry

---

## 8. Leaderboard System

### Geographic Levels
1. **International** - All countries
2. **Country** - Filter by country
3. **State/Department** - Filter by region within country
4. **Club** - Filter by specific club

### Filters
- Event (stroke + distance)
- Pool type (SCM/SCY/LCM - separate by default)
- Age group (10-11, 12-13, 14-15, 16-17, 18+, Open, Masters)
- Gender (Male/Female)
- Time scope (All-time, Season, Last 30 days, Last 6 months)
- Verified only toggle

### Privacy Rules
- Default: club-private
- Public visibility requires opt-in
- Minors require explicit admin confirmation
- Public shows: Name + Club only

---

## 9. Monthly Deliverables

### Month 1
- [ ] Authentication & roles system
- [ ] Club/Swimmer/Meet data model
- [ ] Manual time entry
- [ ] Basic club-level leaderboard
- [ ] Pace card calculator

### Month 2
- [ ] File import wizard (XLSX, CSV, Lenex, SDIF)
- [ ] Geographic leaderboard (all 4 levels + filters)
- [ ] Swimmer profiles with PB detection
- [ ] Meet management

### Month 3
- [ ] Time progression charts
- [ ] World Aquatics points
- [ ] QR swimmer cards
- [ ] Club analytics dashboard
- [ ] Embed widget
- [ ] Notification system
- [ ] Public launch

---

## 10. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 11. Acceptance Criteria

1. Users can register and login with email
2. Club admins can manage swimmers and clubs
3. Coaches can add times and manage meets
4. Swimmers have pace cards calculated from time trials
5. Leaderboard displays rankings with geographic filtering
6. File import supports XLSX, CSV, Lenex, SDIF formats
7. Swimmer profiles show PBs, progression, and pace cards
8. Mobile-responsive design for poolside use
9. All pages meet WCAG 2.1 AA accessibility
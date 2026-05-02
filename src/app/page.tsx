import Link from "next/link";
import { Trophy, Users, Calendar, Clock, ChevronRight, Pool } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pool className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">SwimTrack</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-slate-300 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Swimming Club Management
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Track times, manage meets, calculate training zones, and compete on leaderboards. 
              Built for coaches, swimmers, and clubs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-primary" />}
              title="Leaderboards"
              description="Geographic rankings at club, state, national, and international levels"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-secondary" />}
              title="Swimmer Profiles"
              description="Personal bests, progression charts, and training pace cards"
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-accent" />}
              title="Meet Management"
              description="Track competitions, results, and verify times"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-success" />}
              title="Pace Calculator"
              description="Auto-calculate training zones from time trials"
            />
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Free for Swimming Clubs
                </h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    No credit card required
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    500MB database included
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Import from XLSX, CSV, Lenex, SDIF
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Auto-calculated training zones
                  </li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Link href="/login" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link href="/leaderboard" className="btn-secondary text-lg px-8 py-3">
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Supported File Formats
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <FormatBadge name="XLSX" />
            <FormatBadge name="CSV" />
            <FormatBadge name="TXT" />
            <FormatBadge name="MD" />
            <FormatBadge name="Lenex" color="bg-green-600" />
            <FormatBadge name="SDIF" color="bg-orange-600" />
            <FormatBadge name="Manual Entry" color="bg-purple-600" />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>Built for swimming clubs everywhere</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function FormatBadge({ name, color = "bg-slate-600" }: { name: string; color?: string }) {
  return (
    <span className={`${color} text-white px-4 py-2 rounded-full text-sm font-medium`}>
      {name}
    </span>
  );
}
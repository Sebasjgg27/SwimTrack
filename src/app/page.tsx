import Link from "next/link";
import { Trophy, Users, Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="section-label mb-6">Precision Swim Telemetry</div>
        <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 max-w-4xl" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          ENGINEERED FOR <span style={{ color: "var(--accent-color)" }}>FLUID SPEED</span> AND UNYIELDING FLOW.
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          A technical aquatic platform integrating telemetry, hydrodynamic analytics, and high-performance stroke conditioning for swimming clubs.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/register" className="btn-primary">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/demo/profile" className="btn-secondary">
            View Demo Profile
          </Link>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Club Performance Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="metric-label">Active Swimmers</div>
            <div className="metric-value" style={{ color: "var(--text-primary)" }}>48 <span className="metric-unit">athletes</span></div>
            <div className="metric-sub">Across 3 age groups</div>
          </div>
          <div className="glass-card p-6">
            <div className="metric-label">Meets This Season</div>
            <div className="metric-value" style={{ color: "var(--text-primary)" }}>12 <span className="metric-unit">events</span></div>
            <div className="metric-sub">Next: Regional Championship</div>
          </div>
          <div className="glass-card p-6">
            <div className="metric-label">Personal Bests</div>
            <div className="metric-value" style={{ color: "var(--text-primary)" }}>186 <span className="metric-unit">PBs</span></div>
            <div className="metric-sub">+23 this month</div>
          </div>
          <div className="glass-card p-6">
            <div className="metric-label">Avg Improvement</div>
            <div className="metric-value" style={{ color: "var(--text-primary)" }}>2.4<span className="metric-unit">%</span></div>
            <div className="metric-sub">Season over season</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Core Modules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            number="[ 01 ]"
            title="Leaderboards"
            description="Geographic rankings at club, regional, national, and international levels. Real-time competition standings."
            href="/leaderboard"
          />
          <FeatureCard
            number="[ 02 ]"
            title="Swimmer Profiles"
            description="Personal bests, progression charts, and auto-calculated training pace cards from time trial data."
            href="/demo/profile"
          />
          <FeatureCard
            number="[ 03 ]"
            title="Meet Management"
            description="Track competitions, results, and verify times across SCM, LCM, and SCY pool types."
            href="/register"
          />
          <FeatureCard
            number="[ 04 ]"
            title="Pace Calculator"
            description="Auto-calculate CSS and training zones (A1-ALL) from 200m and 400m time trial performances."
            href="/register"
          />
          <FeatureCard
            number="[ 05 ]"
            title="Excel Import"
            description="Import times directly from your Excel template. Competition and training data auto-categorized."
            href="/register"
          />
          <FeatureCard
            number="[ 06 ]"
            title="Time Trials"
            description="Log and track time trial sessions with automatic CSS recalculation and zone updates."
            href="/register"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="glass-card p-10 text-center">
          <div className="section-label mb-4">Ready to Dive In?</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Free for Swimming Clubs
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            No credit card required. Import your existing data, auto-calculate training zones, and start tracking performance today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="btn-primary">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/demo/profile" className="btn-secondary">
              Explore Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              "500MB database included",
              "XLSX import supported",
              "Auto-calculated zones",
              "Public leaderboards",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                <ChevronRight className="w-3 h-3" style={{ color: "var(--accent-color)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ number, title, description, href }: { number: string; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="glass-card p-8 flex flex-col justify-between group">
      <div>
        <div className="font-mono text-sm mb-4" style={{ color: "var(--accent-color)" }}>{number}</div>
        <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{description}</p>
      </div>
      <div className="mt-6 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all group-hover:gap-3" style={{ color: "var(--accent-color)" }}>
        Explore Module <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

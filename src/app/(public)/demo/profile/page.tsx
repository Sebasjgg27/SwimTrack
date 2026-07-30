"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, TrendingUp, ArrowRight, UserPlus } from "lucide-react";
import { formatTime } from "@/lib/utils";

const demoSwimmer = {
  name: "Juan Perez",
  age: 16,
  club: "Club Alpha",
  city: "Bogota",
  country: "Colombia",
  gender: "male",
  poolType: "SCM",
};

const demoPBs = [
  { event: "50m Freestyle", pool: "SCM", time: 23450, date: "2026-03-20", points: 845 },
  { event: "100m Freestyle", pool: "SCM", time: 52340, date: "2026-04-15", points: 856 },
  { event: "200m Freestyle", pool: "SCM", time: 114230, date: "2026-04-10", points: 823 },
  { event: "400m Freestyle", pool: "SCM", time: 242150, date: "2026-03-25", points: 798 },
  { event: "100m Backstroke", pool: "SCM", time: 62450, date: "2026-04-05", points: 712 },
  { event: "200m IM", pool: "SCM", time: 135670, date: "2026-04-12", points: 789 },
];

const demoProgression = [
  { date: "Jan", time: "55.12" },
  { date: "Mar", time: "54.34" },
  { date: "Jun", time: "53.45" },
  { date: "Sep", time: "53.12" },
  { date: "Jan", time: "52.89" },
  { date: "Apr", time: "52.34" },
];

const demoPaceCard = {
  css: 73.5,
  a1: { min: 93.5, max: 103.5 },
  a2: { min: 83.5, max: 93.5 },
  a3: { min: 68.5, max: 78.5 },
  vo2: { min: 63.5, max: 68.5 },
  tolerance: { min: 58.5, max: 63.5 },
  allOut: 58.5,
};

const formatPace = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const centis = Math.floor((sec % 1) * 100);
  if (minutes > 0) return `${minutes}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
  return `${seconds}.${centis.toString().padStart(2, "0")}`;
};

export default function DemoProfilePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Demo Banner */}
      <div className="rounded-lg p-4 mb-10 text-center" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-color)" }}>
        <p className="font-medium" style={{ color: "var(--accent-color)" }}>You&apos;re viewing a demo profile</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Create your account to see your own data</p>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: "var(--accent-glow)", color: "var(--accent-color)" }}>
            JP
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{demoSwimmer.name}</h1>
            <p style={{ color: "var(--text-secondary)" }}>{demoSwimmer.age} years old &bull; {demoSwimmer.gender === "male" ? "Male" : "Female"}</p>
            <div className="flex items-center gap-5 mt-2" style={{ color: "var(--text-secondary)" }}>
              <span className="flex items-center gap-1.5 text-sm">
                <Trophy className="w-4 h-4" />
                {demoSwimmer.club}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" />
                {demoSwimmer.city}, {demoSwimmer.country}
              </span>
            </div>
          </div>
        </div>
        <Link href="/register" className="btn-primary">
          <UserPlus className="w-5 h-5" />
          Create Your Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Personal Bests */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Trophy className="w-5 h-5" style={{ color: "var(--accent-color)" }} />
              Personal Bests
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Event</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Pool</th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Time</th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Pts</th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {demoPBs.map((pb, i) => (
                    <tr key={i} className="transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{pb.event}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{pb.pool}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: "var(--text-primary)" }}>{formatTime(pb.time)}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: "var(--accent-color)" }}>{pb.points}</td>
                      <td className="px-4 py-3 text-right text-sm" style={{ color: "var(--text-secondary)" }}>{pb.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pace Card */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Training Pace Card</h3>
            <p className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>SCM &bull; Based on 400m &amp; 200m TT</p>

            <div className="text-center mb-5 p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>CSS</p>
              <p className="text-3xl font-bold font-mono" style={{ color: "var(--accent-color)" }}>{formatPace(demoPaceCard.css)}</p>
              <p className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>sec/100m</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "A1", label: "Recovery", range: `${formatPace(demoPaceCard.a1.max)} - ${formatPace(demoPaceCard.a1.min)}`, cls: "zone-a1" },
                { name: "A2", label: "Endurance", range: `${formatPace(demoPaceCard.a2.max)} - ${formatPace(demoPaceCard.a2.min)}`, cls: "zone-a2" },
                { name: "A3", label: "Threshold", range: `${formatPace(demoPaceCard.a3.min)} - ${formatPace(demoPaceCard.a3.max)}`, cls: "zone-a3" },
                { name: "VO2", label: "VO2 Max", range: `${formatPace(demoPaceCard.vo2.min)} - ${formatPace(demoPaceCard.vo2.max)}`, cls: "zone-vo2" },
                { name: "TOL", label: "Tolerance", range: `${formatPace(demoPaceCard.tolerance.min)} - ${formatPace(demoPaceCard.tolerance.max)}`, cls: "zone-tolerance" },
                { name: "ALL", label: "Sprint", range: formatPace(demoPaceCard.allOut), cls: "zone-allout" },
              ].map((zone) => (
                <div key={zone.name} className={`rounded-lg p-2.5 text-center ${zone.cls}`}>
                  <p className="text-xs font-medium opacity-80">{zone.label}</p>
                  <p className="text-sm font-bold font-mono">{zone.name}</p>
                  <p className="text-xs font-mono opacity-75">{zone.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progression Chart */}
      <div className="card mb-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--success)" }} />
              100m Freestyle Progression
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider mt-1" style={{ color: "var(--text-secondary)" }}>SCM &bull; Last 12 months</p>
          </div>
          <Badge variant="success">-2.78 sec improvement</Badge>
        </div>
        <div className="h-48 flex items-end justify-between gap-4 px-4">
          {demoProgression.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all"
                style={{ height: `${40 + (i * 12)}%`, background: "var(--accent-color)" }}
              />
              <div className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>{point.date}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>{point.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-10 text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Start Tracking Your Progress</h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Create your free account and get your own personalized pace card,
          track your personal bests, and compete on leaderboards.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="btn-primary">
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-secondary">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

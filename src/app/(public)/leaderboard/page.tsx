"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTime } from "@/lib/utils";
import { Globe, Filter } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, name: "Juan Perez", age: 16, club: "Club Alpha", country: "Colombia", time: 52340, event: "100m Freestyle", pool: "SCM", date: "2026-04-15", points: 856 },
  { rank: 2, name: "Carlos Rodriguez", age: 17, club: "Club Beta", country: "Colombia", time: 52890, event: "100m Freestyle", pool: "SCM", date: "2026-04-10", points: 812 },
  { rank: 3, name: "Maria Garcia", age: 15, club: "Club Alpha", country: "Colombia", time: 53120, event: "100m Freestyle", pool: "SCM", date: "2026-04-12", points: 798 },
  { rank: 4, name: "Pedro Martinez", age: 18, club: "Club Gamma", country: "Colombia", time: 53450, event: "100m Freestyle", pool: "SCM", date: "2026-04-08", points: 780 },
  { rank: 5, name: "Ana Lopez", age: 14, club: "Club Delta", country: "Colombia", time: 53800, event: "100m Freestyle", pool: "SCM", date: "2026-04-05", points: 755 },
  { rank: 6, name: "Luis Hernandez", age: 16, club: "Club Epsilon", country: "Colombia", time: 54120, event: "100m Freestyle", pool: "SCM", date: "2026-04-03", points: 732 },
  { rank: 7, name: "Sofia Ramirez", age: 17, club: "Club Alpha", country: "Colombia", time: 54340, event: "100m Freestyle", pool: "SCM", date: "2026-04-01", points: 718 },
  { rank: 8, name: "Diego Torres", age: 15, club: "Club Zeta", country: "Colombia", time: 54670, event: "100m Freestyle", pool: "SCM", date: "2026-03-28", points: 698 },
  { rank: 9, name: "Valentina Silva", age: 14, club: "Club Eta", country: "Colombia", time: 54900, event: "100m Freestyle", pool: "SCM", date: "2026-03-25", points: 680 },
  { rank: 10, name: "Sebastian Cruz", age: 16, club: "Club Theta", country: "Colombia", time: 55230, event: "100m Freestyle", pool: "SCM", date: "2026-03-22", points: 658 },
];

export default function PublicLeaderboardPage() {
  const [country, setCountry] = useState("CO");
  const [event, setEvent] = useState("100-free");
  const [poolType, setPoolType] = useState("SCM");
  const [gender, setGender] = useState("all");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="section-label mb-4">Global Rankings</div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Public Leaderboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Rankings across Colombia</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Globe className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input w-auto"
        >
          <option value="CO">Colombia</option>
          <option value="US">United States</option>
          <option value="ES">Spain</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <select value={event} onChange={(e) => setEvent(e.target.value)} className="input">
          <option value="50-free">50m Freestyle</option>
          <option value="100-free">100m Freestyle</option>
          <option value="200-free">200m Freestyle</option>
          <option value="400-free">400m Freestyle</option>
          <option value="800-free">800m Freestyle</option>
          <option value="1500-free">1500m Freestyle</option>
        </select>
        <select value={poolType} onChange={(e) => setPoolType(e.target.value)} className="input">
          <option value="SCM">SCM (25m)</option>
          <option value="LCM">LCM (50m)</option>
          <option value="SCY">SCY (25y)</option>
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button className="btn-secondary flex items-center justify-center gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 font-mono text-xs uppercase tracking-wider" style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
          <div className="col-span-1">Rank</div>
          <div className="col-span-3">Swimmer</div>
          <div className="col-span-1">Age</div>
          <div className="col-span-2">Club</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-1">Pts</div>
          <div className="col-span-2">Date</div>
        </div>

        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors items-center"
            style={{ borderBottom: "1px solid var(--border-color)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="col-span-1">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                entry.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                entry.rank === 3 ? "bg-orange-400/20 text-orange-400" :
                ""
              }`} style={entry.rank > 3 ? { background: "var(--bg-card)", color: "var(--text-secondary)" } : {}}>
                {entry.rank}
              </span>
            </div>
            <div className="col-span-3">
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{entry.name}</span>
            </div>
            <div className="col-span-1" style={{ color: "var(--text-secondary)" }}>{entry.age}</div>
            <div className="col-span-2" style={{ color: "var(--text-secondary)" }}>{entry.club}</div>
            <div className="col-span-2">
              <span className="font-mono text-lg font-bold" style={{ color: "var(--text-primary)" }}>{formatTime(entry.time)}</span>
            </div>
            <div className="col-span-1">
              <span className="font-medium" style={{ color: "var(--accent-color)" }}>{entry.points}</span>
            </div>
            <div className="col-span-2 font-mono text-sm" style={{ color: "var(--text-secondary)" }}>{entry.date}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
          Showing top 10 of 156 swimmers &bull;{" "}
          <button className="hover:underline" style={{ color: "var(--accent-color)" }}>Load more</button>
        </p>
      </div>
    </div>
  );
}

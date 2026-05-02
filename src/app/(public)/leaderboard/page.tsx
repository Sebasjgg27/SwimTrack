"use client";

import { useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import { Pool, ChevronDown, Filter, Globe } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Pool className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">SwimTrack</span>
          </Link>
          <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Public Leaderboard</h1>
          <p className="text-slate-400"> Rankings across Colombia</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="w-5 h-5 text-slate-400" />
          <select 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="CO">Colombia</option>
            <option value="US">United States</option>
            <option value="ES">Spain</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <select 
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="50-free">50m Freestyle</option>
            <option value="100-free">100m Freestyle</option>
            <option value="200-free">200m Freestyle</option>
            <option value="400-free">400m Freestyle</option>
            <option value="800-free">800m Freestyle</option>
            <option value="1500-free">1500m Freestyle</option>
          </select>
          <select 
            value={poolType}
            onChange={(e) => setPoolType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="SCM">SCM (25m)</option>
            <option value="LCM">LCM (50m)</option>
            <option value="SCY">SCY (25y)</option>
          </select>
          <select 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button className="flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-800 border-b border-slate-700 text-sm font-medium text-slate-400">
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
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors items-center"
            >
              <div className="col-span-1">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  entry.rank === 1 ? "bg-yellow-500 text-slate-900" :
                  entry.rank === 2 ? "bg-slate-400 text-slate-900" :
                  entry.rank === 3 ? "bg-orange-400 text-slate-900" :
                  "bg-slate-700 text-slate-300"
                }`}>
                  {entry.rank}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-white font-medium">{entry.name}</span>
              </div>
              <div className="col-span-1 text-slate-400">{entry.age}</div>
              <div className="col-span-2 text-slate-400">{entry.club}</div>
              <div className="col-span-2">
                <span className="font-mono text-lg font-bold text-white">{formatTime(entry.time)}</span>
              </div>
              <div className="col-span-1">
                <span className="text-primary font-medium">{entry.points}</span>
              </div>
              <div className="col-span-2 text-slate-400 text-sm">{entry.date}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Showing top 10 of 156 swimmers • 
            <button className="text-primary hover:underline ml-1">Load more</button>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-700/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Powered by SwimTrack • Leaderboard updated daily</p>
        </div>
      </footer>
    </div>
  );
}
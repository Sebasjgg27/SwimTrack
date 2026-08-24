"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { formatTime, cn } from "@/lib/utils";
import { Globe, MapPin, Building2, Award } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, name: "Juan Perez", age: 16, club: "Club Alpha", city: "Bogotá", country: "Colombia", time: 52340, event: "100m Freestyle", pool: "SCM", date: "2026-04-15" },
  { rank: 2, name: "Carlos Rodriguez", age: 17, club: "Club Beta", city: "Medellín", country: "Colombia", time: 52890, event: "100m Freestyle", pool: "SCM", date: "2026-04-10" },
  { rank: 3, name: "Maria Garcia", age: 15, club: "Club Alpha", city: "Bogotá", country: "Colombia", time: 53120, event: "100m Freestyle", pool: "SCM", date: "2026-04-12" },
  { rank: 4, name: "Pedro Martinez", age: 18, club: "Club Gamma", city: "Cali", country: "Colombia", time: 53450, event: "100m Freestyle", pool: "SCM", date: "2026-04-08" },
  { rank: 5, name: "Ana Lopez", age: 14, club: "Club Delta", city: "Barranquilla", country: "Colombia", time: 53800, event: "100m Freestyle", pool: "SCM", date: "2026-04-05" },
];

export default function LeaderboardPage() {
  const [level, setLevel] = useState("international");
  const [event, setEvent] = useState("100-free");
  const [poolType, setPoolType] = useState("SCM");
  const [gender, setGender] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-600 mt-1">Sample design for planned rankings</p>
      </div>

      <Card className="mb-6 border-amber-200 bg-amber-50/60">
        <CardContent><p className="text-sm text-slate-700"><strong>Sample data:</strong> these names and times demonstrate the planned leaderboard design. They are not live competition results.</p></CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Geographic Level"
              options={[
                { value: "international", label: "🌍 International" },
                { value: "country", label: "📍 Country" },
                { value: "region", label: "🏛️ State/Region" },
                { value: "club", label: "🏊 Club" },
              ]}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
            <Select
              label="Event"
              options={[
                { value: "50-free", label: "50m Freestyle" },
                { value: "100-free", label: "100m Freestyle" },
                { value: "200-free", label: "200m Freestyle" },
                { value: "400-free", label: "400m Freestyle" },
                { value: "800-free", label: "800m Freestyle" },
                { value: "1500-free", label: "1500m Freestyle" },
                { value: "100-back", label: "100m Backstroke" },
                { value: "200-back", label: "200m Backstroke" },
                { value: "100-breast", label: "100m Breaststroke" },
                { value: "200-breast", label: "200m Breaststroke" },
                { value: "100-fly", label: "100m Butterfly" },
                { value: "200-fly", label: "200m Butterfly" },
                { value: "200-im", label: "200m Individual Medley" },
                { value: "400-im", label: "400m Individual Medley" },
              ]}
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
            <Select
              label="Pool Type"
              options={[
                { value: "SCM", label: "SCM (25m)" },
                { value: "LCM", label: "LCM (50m)" },
                { value: "SCY", label: "SCY (25y)" },
              ]}
              value={poolType}
              onChange={(e) => setPoolType(e.target.value)}
            />
            <Select
              label="Gender"
              options={[
                { value: "all", label: "All" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <Select
              label="Age Group"
              options={[
                { value: "all", label: "All Ages" },
                { value: "10-11", label: "10-11" },
                { value: "12-13", label: "12-13" },
                { value: "14-15", label: "14-15" },
                { value: "16-17", label: "16-17" },
                { value: "18+", label: "18 & Over" },
              ]}
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FilterChip active={level === "international"} onClick={() => setLevel("international")}>
          <Globe className="w-4 h-4" />
          International
        </FilterChip>
        <FilterChip active={level === "country"} onClick={() => setLevel("country")}>
          <MapPin className="w-4 h-4" />
          Colombia
        </FilterChip>
        <FilterChip active={level === "region"} onClick={() => setLevel("region")}>
          <Building2 className="w-4 h-4" />
          Cundinamarca
        </FilterChip>
        <FilterChip active={level === "club"} onClick={() => setLevel("club")}>
          <Award className="w-4 h-4" />
          Club Alpha
        </FilterChip>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>100m Freestyle • SCM • Male • 16-17</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Swimmer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Age</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Club</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Location</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Time</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry) => (
                <tr key={entry.rank} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold",
                      entry.rank === 1 && "bg-yellow-100 text-yellow-700",
                      entry.rank === 2 && "bg-slate-200 text-slate-600",
                      entry.rank === 3 && "bg-orange-100 text-orange-700",
                      entry.rank > 3 && "bg-slate-100 text-slate-600"
                    )}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{entry.name}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.age}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.club}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.city}, {entry.country}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {formatTime(entry.time)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 text-sm">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
        active 
          ? "bg-primary text-white border-primary" 
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

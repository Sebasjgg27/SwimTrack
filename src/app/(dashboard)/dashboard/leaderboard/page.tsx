"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { formatTime, cn } from "@/lib/utils";
import { Globe, MapPin, Building2, Award, Loader2 } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  age: number | null;
  club: string;
  city: string | null;
  country: string | null;
  time_ms: number;
  event: string;
  pool_type: string;
  date: string;
}

const eventMap: Record<string, string> = {
  "50-free": "50m Freestyle",
  "100-free": "100m Freestyle",
  "200-free": "200m Freestyle",
  "400-free": "400m Freestyle",
  "800-free": "800m Freestyle",
  "1500-free": "1500m Freestyle",
  "100-back": "100m Backstroke",
  "200-back": "200m Backstroke",
  "100-breast": "100m Breaststroke",
  "200-breast": "200m Breaststroke",
  "100-fly": "100m Butterfly",
  "200-fly": "200m Butterfly",
  "200-im": "200m Individual Medley",
  "400-im": "400m Individual Medley",
};

export default function LeaderboardPage() {
  const [level, setLevel] = useState("international");
  const [event, setEvent] = useState("100-free");
  const [poolType, setPoolType] = useState("SCM");
  const [gender, setGender] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("event", eventMap[event] ?? event);
      params.set("pool_type", poolType);
      if (gender !== "all") params.set("gender", gender);
      if (ageGroup !== "all") {
        const match = ageGroup.match(/(\d+)/);
        if (match) params.set("distance", match[1]);
      }

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to fetch leaderboard");

      const rows = json.data.data ?? [];
      const ranked = rows.map((r: any, i: number) => ({
        rank: i + 1,
        name: r.name ?? "Unknown",
        age: r.age ?? null,
        club: r.club ?? "",
        city: r.city ?? null,
        country: r.country ?? null,
        time_ms: r.time_ms,
        event: r.event,
        pool_type: r.pool_type,
        date: r.date ?? "",
      }));

      setEntries(ranked);
    } catch (err: any) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [event, poolType, gender, ageGroup]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const activeLabel =
    (eventMap[event] ?? event) +
    " \u2022 " +
    poolType +
    (gender !== "all" ? " \u2022 " + gender.charAt(0).toUpperCase() + gender.slice(1) : "") +
    (ageGroup !== "all" ? " \u2022 " + ageGroup : "");

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-600 mt-1">Rankings by event, location, and age group</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Geographic Level"
              options={[
                { value: "international", label: "\ud83c\udf0d International" },
                { value: "country", label: "\ud83d\udccd Country" },
                { value: "region", label: "\ud83c\udfdb\ufe0f State/Region" },
                { value: "club", label: "\ud83c\udfca Club" },
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{activeLabel}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No results found for the selected filters.
            </div>
          ) : (
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
                {entries.map((entry) => (
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
                    <td className="px-4 py-3 text-slate-600">{entry.age ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{entry.club}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {[entry.city, entry.country].filter(Boolean).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {formatTime(entry.time_ms)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-sm">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
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

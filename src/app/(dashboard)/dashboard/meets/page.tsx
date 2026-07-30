"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface Meet {
  id: string;
  name: string;
  meet_date: string;
  city: string | null;
  pool_type: string;
  level: string | null;
  results_verified: boolean;
}

const levelColors: Record<string, string> = {
  club: "bg-slate-100 text-slate-700",
  local: "bg-blue-100 text-blue-700",
  regional: "bg-purple-100 text-purple-700",
  national: "bg-orange-100 text-orange-700",
  international: "bg-green-100 text-green-700",
};

export default function MeetsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [meets, setMeets] = useState<Meet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeets = useCallback(async (f: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f === "upcoming") params.set("filter", "upcoming");
      else if (f === "past") params.set("filter", "past");

      const res = await fetch(`/api/meets?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to fetch meets");

      let filtered = json.data as Meet[];
      if (f === "results") {
        filtered = filtered.filter((m) => m.results_verified);
      }

      setMeets(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to load meets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeets(filter);
  }, [filter, fetchMeets]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meets</h1>
          <p className="text-slate-600 mt-1">Manage competitions and results</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => router.push("/dashboard/meets/new")}>
          <Plus className="w-4 h-4" />
          Create Meet
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "upcoming", "past", "results"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {meets.length === 0 ? (
            <Card className="p-12 text-center text-slate-500">
              No meets found.
            </Card>
          ) : (
            meets.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))
          )}
        </div>
      )}
    </>
  );
}

function MeetCard({ meet }: { meet: Meet }) {
  const isUpcoming = new Date(meet.meet_date) > new Date();
  const hasResults = meet.results_verified;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">{meet.name}</h3>
            {meet.level && (
              <Badge className={levelColors[meet.level]}>{meet.level}</Badge>
            )}
            {hasResults && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(meet.meet_date).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            {meet.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {meet.city}
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="font-medium">{meet.pool_type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasResults ? (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Results in</span>
            </div>
          ) : isUpcoming ? (
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">No results</span>
            </div>
          )}

          <Button variant="outline" size="sm">
            {hasResults ? "View Results" : "Manage"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

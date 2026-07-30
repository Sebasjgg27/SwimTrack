"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaceCard } from "@/components/swimmer/pace-card";
import {
  formatTime,
  parseTime,
  calculateCSS,
  calculateZones,
  calculateAge,
} from "@/lib/utils";
import type { Swimmer, PersonalBest, TimeTrial, PoolType } from "@/types";
import { User, Calendar, MapPin, Clock, Trophy, TrendingUp, Edit, Download } from "lucide-react";

export default function SwimmerProfilePage({ params }: { params: { id: string } }) {
  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [pbs, setPbs] = useState<PersonalBest[]>([]);
  const [timeTrials, setTimeTrials] = useState<TimeTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [t400, setT400] = useState("");
  const [t200, setT200] = useState("");
  const [zones, setZones] = useState<ReturnType<typeof calculateZones> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [swimmerRes, pbsRes, trialsRes] = await Promise.all([
          fetch(`/api/swimmers/${params.id}`),
          fetch(`/api/swimmers/${params.id}/pbs`),
          fetch(`/api/time-trials?swimmer_id=${params.id}`),
        ]);

        if (!swimmerRes.ok) {
          throw new Error("Swimmer not found");
        }

        const swimmerData = await swimmerRes.json();
        setSwimmer(swimmerData);

        const pbsData = pbsRes.ok ? await pbsRes.json() : [];
        setPbs(Array.isArray(pbsData) ? pbsData : []);

        const trialsData = trialsRes.ok ? await trialsRes.json() : [];
        const trials: TimeTrial[] = Array.isArray(trialsData) ? trialsData : [];
        setTimeTrials(trials);

        const trial400 = trials.find((t) => t.distance === 400);
        const trial200 = trials.find((t) => t.distance === 200);
        if (trial400) setT400(formatTime(trial400.time_ms));
        if (trial200) setT200(formatTime(trial200.time_ms));
      } catch (err) {
        console.error("Error loading swimmer data:", err);
        setError("Failed to load swimmer profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const handleCalculateZones = () => {
    const t400ms = parseTime(t400);
    const t200ms = parseTime(t200);
    const css = calculateCSS(t400ms, t200ms);
    if (css > 0) {
      setZones(calculateZones(css));
    }
  };

  const handleSaveTimeTrial = async (distance: 400 | 200) => {
    const timeStr = distance === 400 ? t400 : t200;
    const timeMs = parseTime(timeStr);
    if (timeMs <= 0) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/time-trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swimmer_id: params.id,
          distance,
          time_ms: timeMs,
          trial_date: new Date().toISOString().slice(0, 10),
          pool_type: "SCM" as PoolType,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setTimeTrials((prev) => [saved, ...prev.filter((t) => t.distance !== distance)]);
      }
    } catch (err) {
      console.error("Failed to save time trial:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-slate-100 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !swimmer) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">{error ?? "Swimmer not found"}</p>
      </div>
    );
  }

  const fullName = `${swimmer.first_name} ${swimmer.last_name}`;
  const initials = `${swimmer.first_name[0]}${swimmer.last_name[0]}`;
  const age = swimmer.date_of_birth ? calculateAge(swimmer.date_of_birth) : "—";

  const pbsForChart = pbs
    .filter((pb) => pb.stroke === "freestyle" && pb.distance === 100)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const times = pbsForChart.map((p) => p.time_ms);
  const maxTime = times.length > 0 ? Math.max(...times) : 0;
  const minTime = times.length > 0 ? Math.min(...times) : 0;
  const range = maxTime - minTime || 1;

  const improvement = times.length >= 2 ? times[times.length - 1] - times[0] : 0;

  return (
      <div>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
              <p className="text-slate-600">
                {age} years old • {swimmer.gender === "male" ? "Male" : "Female"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                {swimmer.club?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {swimmer.club.city}
                  </span>
                )}
                {swimmer.club?.name && (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {swimmer.club.name}
                  </span>
                )}
              </div>
            </div>
          </div>
</div>
        <div className="flex gap-2">
          <Link href={`/dashboard/swimmers/${params.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
</Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Card
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Bests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Event</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Pool</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Time</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Pts</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPBs.map((pb, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{pb.event}</td>
                      <td className="px-4 py-3 text-slate-600">{pb.pool}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatTime(pb.time)}</td>
                      <td className="px-4 py-3 text-right text-primary font-medium">{pb.points}</td>
                      <td className="px-4 py-3 text-right text-slate-500 text-sm">{pb.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Trial Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="400m Time (mm:ss.xx)"
                  value={t400}
                  onChange={(e) => setT400(e.target.value)}
                  placeholder="4:32.15"
                />
                <Input
                  label="200m Time (mm:ss.xx)"
                  value={t200}
                  onChange={(e) => setT200(e.target.value)}
                  placeholder="2:08.45"
                />
              </div>
              <Button className="w-full" onClick={handleCalculateZones}>Calculate Zones</Button>
            </CardContent>
          </Card>

          <PaceCard t400={zones ? parseTime(t400) : 272150} t200={zones ? parseTime(t200) : 128450} poolType="SCM" />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>100m Freestyle Progression</CardTitle>
            <p className="text-sm text-slate-500 mt-1">SCM • Last 12 months</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Bests</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {pbs.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">No personal bests recorded yet</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Event</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Pool</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Time</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pbs.map((pb, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {pb.distance}m {pb.stroke.replace("_", " ")}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{pb.pool_type}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            {formatTime(pb.time_ms)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 text-sm">{pb.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Trial Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="400m Time (mm:ss.xx)"
                    value={t400}
                    onChange={(e) => setT400(e.target.value)}
                    placeholder="4:32.15"
                  />
                  <Input
                    label="200m Time (mm:ss.xx)"
                    value={t200}
                    onChange={(e) => setT200(e.target.value)}
                    placeholder="2:08.45"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full"
                    onClick={handleCalculateZones}
                  >
                    Calculate Zones
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isSaving || parseTime(t400) <= 0}
                    onClick={() => handleSaveTimeTrial(400)}
                  >
                    {isSaving ? "Saving..." : "Save 400m"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div />
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isSaving || parseTime(t200) <= 0}
                    onClick={() => handleSaveTimeTrial(200)}
                  >
                    {isSaving ? "Saving..." : "Save 200m"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <PaceCard t400={zones ? parseTime(t400) : 272150} t200={zones ? parseTime(t200) : 128450} poolType="SCM" />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>100m Freestyle Progression</CardTitle>
              <p className="text-sm text-slate-500 mt-1">SCM • Last 12 months</p>
            </div>
            {improvement !== 0 && (
              <Badge variant={improvement < 0 ? "success" : "info"}>
                {improvement < 0 ? `${formatTime(Math.abs(improvement))} improvement` : "No improvement yet"}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {pbsForChart.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No progression data available</p>
            ) : (
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {pbsForChart.map((point, i) => {
                  const height = 20 + ((maxTime - point.time_ms) / range) * 70;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <div className="mt-2 text-xs text-slate-500">{point.date}</div>
                      <div className="text-xs font-mono text-slate-700">{formatTime(point.time_ms)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PaceCard } from "@/components/swimmer/pace-card";
import { formatTime, parseTime, calculateCSS, calculateZones } from "@/lib/utils";
import { User, Calendar, MapPin, Clock, Trophy, TrendingUp, Edit, Download } from "lucide-react";

const mockSwimmer = {
  id: "1",
  name: "Juan Perez",
  firstName: "Juan",
  lastName: "Perez",
  age: 16,
  dateOfBirth: "2010-03-15",
  gender: "male",
  club: "Club Alpha",
  city: "Bogotá",
  country: "Colombia",
  profileVisibility: "country",
};

const mockPBs = [
  { event: "50m Freestyle", pool: "SCM", time: 23450, date: "2026-03-20", points: 845 },
  { event: "100m Freestyle", pool: "SCM", time: 52340, date: "2026-04-15", points: 856 },
  { event: "200m Freestyle", pool: "SCM", time: 114230, date: "2026-04-10", points: 823 },
  { event: "400m Freestyle", pool: "SCM", time: 242150, date: "2026-03-25", points: 798 },
  { event: "100m Backstroke", pool: "SCM", time: 62450, date: "2026-04-05", points: 712 },
  { event: "200m IM", pool: "SCM", time: 135670, date: "2026-04-12", points: 789 },
];

const mockProgression = [
  { date: "2025-01", time: 55120 },
  { date: "2025-03", time: 54340 },
  { date: "2025-06", time: 53450 },
  { date: "2025-09", time: 53120 },
  { date: "2026-01", time: 52890 },
  { date: "2026-04", time: 52340 },
];

export default function SwimmerProfilePage({ params }: { params: { id: string } }) {
  const [t400, setT400] = useState("4:32.15");
  const [t200, setT200] = useState("2:08.45");
  const [zones, setZones] = useState<ReturnType<typeof calculateZones> | null>(null);

  const handleCalculateZones = () => {
    const t400ms = parseTime(t400);
    const t200ms = parseTime(t200);
    const css = calculateCSS(t400ms, t200ms);
    if (css > 0) {
      setZones(calculateZones(css));
    }
  };

  const times = mockProgression.map(p => p.time);
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  const range = maxTime - minTime || 1;

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
            JP
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{mockSwimmer.name}</h1>
            <p className="text-slate-600">{mockSwimmer.age} years old • {mockSwimmer.gender === "male" ? "Male" : "Female"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {mockSwimmer.city}, {mockSwimmer.country}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {mockSwimmer.club}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
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
          <Badge variant="success">-2.78 sec improvement</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {mockProgression.map((point, i) => {
              const height = 20 + ((maxTime - point.time) / range) * 70;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <div className="mt-2 text-xs text-slate-500">{point.date}</div>
                  <div className="text-xs font-mono text-slate-700">{formatTime(point.time)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
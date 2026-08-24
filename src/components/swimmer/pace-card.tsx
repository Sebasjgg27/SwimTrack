"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPace, calculateZones, calculateCSS } from "@/lib/utils";
import { Waves } from "lucide-react";

interface PaceCardProps {
  t400?: number;
  t200?: number;
  poolType: "SCM" | "SCY" | "LCM";
}

export function PaceCard({ t400, t200, poolType }: PaceCardProps) {
  const hasData = t400 && t200 && t400 > t200;
  
  const css = hasData ? calculateCSS(t400!, t200!) : 0;
  const zones = hasData ? calculateZones(css) : null;

  const zoneData = [
    { name: "A1", label: "Recovery", range: zones ? `${formatPace(zones.a1.max)} - ${formatPace(zones.a1.min)}` : "--", color: "bg-blue-100 text-blue-800", role: "Warm-up, cooldown, active recovery" },
    { name: "A2", label: "Endurance", range: zones ? `${formatPace(zones.a2.max)} - ${formatPace(zones.a2.min)}` : "--", color: "bg-cyan-100 text-cyan-800", role: "Core endurance training" },
    { name: "A3", label: "Threshold", range: zones ? `${formatPace(zones.a3.min)} - ${formatPace(zones.a3.max)}` : "--", color: "bg-teal-100 text-teal-800", role: "At anaerobic threshold" },
    { name: "VO2", label: "VO2 Max", range: zones ? `${formatPace(zones.vo2.min)} - ${formatPace(zones.vo2.max)}` : "--", color: "bg-orange-100 text-orange-800", role: "Max oxygen uptake" },
    { name: "TOL", label: "Tolerance", range: zones ? `${formatPace(zones.tolerance.min)} - ${formatPace(zones.tolerance.max)}` : "--", color: "bg-red-100 text-red-800", role: "Lactate tolerance" },
    { name: "ALL OUT", label: "Sprint", range: zones ? formatPace(zones.allOut) : "--", color: "bg-purple-100 text-purple-800", role: "Maximum effort" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Training Pace Card</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            {poolType} • Based on {t400 && t200 ? "400m & 200m TT" : "No time trials"}
          </p>
        </div>
        {zones && (
          <div className="text-right">
            <p className="text-sm text-slate-500">CSS</p>
            <p className="text-xl font-bold font-mono text-primary">{formatPace(css)}</p>
            <p className="text-xs text-slate-500">sec/100m</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-8 text-slate-500">
            <Waves className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Enter time trial results to calculate your training zones</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {zoneData.map((zone) => (
              <div
                key={zone.name}
                className={`rounded-lg p-3 text-center ${zone.color}`}
              >
                <p className="text-xs font-medium opacity-70">{zone.label}</p>
                <p className="text-lg font-bold font-mono mt-1">{zone.name}</p>
                <p className="text-xs font-mono mt-1">{zone.range}</p>
                <p className="text-xs opacity-60 mt-2">{zone.role}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ZoneDisplayProps {
  zone: string;
  pace: number;
}

export function ZoneDisplay({ zone, pace }: ZoneDisplayProps) {
  const zoneInfo: Record<string, { label: string; color: string; role: string }> = {
    A1: { label: "Recovery", color: "zone-a1", role: "Warm-up, cooldown" },
    A2: { label: "Endurance", color: "zone-a2", role: "Aerobic base building" },
    A3: { label: "Threshold", color: "zone-a3", role: "Lactate threshold" },
    VO2: { label: "VO2 Max", color: "zone-vo2", role: "Aerobic power" },
    TOL: { label: "Tolerance", color: "zone-tolerance", role: "Lactate tolerance" },
    ALL: { label: "All Out", color: "zone-allout", role: "Maximum sprint" },
  };

  const info = zoneInfo[zone] || { label: zone, color: "zone-a1", role: "" };

  return (
    <div className={`pace-card-zone ${info.color}`}>
      <p className="text-xs font-medium">{info.label}</p>
      <p className="text-lg font-bold font-mono">{formatPace(pace)}</p>
      <p className="text-xs opacity-70">{info.role}</p>
    </div>
  );
}

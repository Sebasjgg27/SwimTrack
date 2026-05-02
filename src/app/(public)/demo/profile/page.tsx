"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, MapPin, Trophy, TrendingUp, ArrowRight, UserPlus } from "lucide-react";
import { formatTime } from "@/lib/utils";

const demoSwimmer = {
  name: "Juan Perez",
  age: 16,
  club: "Club Alpha",
  city: "Bogotá",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Waves className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">SwimTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="bg-primary/20 border border-primary/50 rounded-xl p-4 mb-8 text-center">
          <p className="text-primary font-medium">👀 You're viewing a demo profile</p>
          <p className="text-slate-400 text-sm">Create your account to see your own data</p>
        </div>

        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
              JP
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{demoSwimmer.name}</h1>
              <p className="text-slate-400">{demoSwimmer.age} years old • {demoSwimmer.gender === "male" ? "Male" : "Female"}</p>
              <div className="flex items-center gap-4 mt-2 text-slate-400">
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {demoSwimmer.club}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {demoSwimmer.city}, {demoSwimmer.country}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/register"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Your Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Bests */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Personal Bests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Event</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Pool</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Time</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Pts</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoPBs.map((pb, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-3 font-medium text-white">{pb.event}</td>
                        <td className="px-4 py-3 text-slate-400">{pb.pool}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-white">{formatTime(pb.time)}</td>
                        <td className="px-4 py-3 text-right text-primary font-medium">{pb.points}</td>
                        <td className="px-4 py-3 text-right text-slate-500 text-sm">{pb.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Pace Card */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Training Pace Card</CardTitle>
                <p className="text-sm text-slate-400">SCM • Based on 400m & 200m TT</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-400">CSS</p>
                  <p className="text-3xl font-bold font-mono text-primary">{formatPace(demoPaceCard.css)}</p>
                  <p className="text-xs text-slate-500">sec/100m</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "A1", label: "Recovery", range: `${formatPace(demoPaceCard.a1.max)} - ${formatPace(demoPaceCard.a1.min)}`, color: "bg-blue-900/50 text-blue-400" },
                    { name: "A2", label: "Endurance", range: `${formatPace(demoPaceCard.a2.max)} - ${formatPace(demoPaceCard.a2.min)}`, color: "bg-cyan-900/50 text-cyan-400" },
                    { name: "A3", label: "Threshold", range: `${formatPace(demoPaceCard.a3.min)} - ${formatPace(demoPaceCard.a3.max)}`, color: "bg-teal-900/50 text-teal-400" },
                    { name: "VO2", label: "VO2 Max", range: `${formatPace(demoPaceCard.vo2.min)} - ${formatPace(demoPaceCard.vo2.max)}`, color: "bg-orange-900/50 text-orange-400" },
                    { name: "TOL", label: "Tolerance", range: `${formatPace(demoPaceCard.tolerance.min)} - ${formatPace(demoPaceCard.tolerance.max)}`, color: "bg-red-900/50 text-red-400" },
                    { name: "ALL", label: "Sprint", range: formatPace(demoPaceCard.allOut), color: "bg-purple-900/50 text-purple-400" },
                  ].map((zone) => (
                    <div key={zone.name} className={`rounded-lg p-2 text-center ${zone.color}`}>
                      <p className="text-xs font-medium">{zone.label}</p>
                      <p className="text-sm font-bold font-mono">{zone.name}</p>
                      <p className="text-xs font-mono">{zone.range}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progression Chart */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                100m Freestyle Progression
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">SCM • Last 12 months</p>
            </div>
            <Badge variant="success">-2.78 sec improvement</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-4 px-4">
              {demoProgression.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary-dark"
                    style={{ height: `${40 + (i * 12)}%` }}
                  />
                  <div className="mt-2 text-xs text-slate-400">{point.date}</div>
                  <div className="text-xs font-mono text-slate-300">{point.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Start Tracking Your Progress</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Create your free account and get your own personalized pace card, 
            track your personal bests, and compete on leaderboards.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="border border-slate-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Powered by SwimTrack</p>
        </div>
      </footer>
    </div>
  );
}
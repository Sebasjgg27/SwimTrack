"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, Trophy, TrendingUp, Clock, Plus } from "lucide-react";
import { formatTime } from "@/lib/utils";
import type { Swimmer, Meet, Result } from "@/types";

interface DashboardStats {
  totalSwimmers: number;
  upcomingMeets: number;
  recentResults: Result[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSwimmers: 0,
    upcomingMeets: 0,
    recentResults: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [swimmersRes, meetsRes, resultsRes] = await Promise.all([
          fetch("/api/swimmers"),
          fetch("/api/meets?filter=upcoming"),
          fetch("/api/results"),
        ]);

        const swimmersData = swimmersRes.ok ? await swimmersRes.json() : [];
        const meetsData = meetsRes.ok ? await meetsRes.json() : [];
        const resultsData = resultsRes.ok ? await resultsRes.json() : [];

        setStats({
          totalSwimmers: Array.isArray(swimmersData) ? swimmersData.length : 0,
          upcomingMeets: Array.isArray(meetsData) ? meetsData.length : 0,
          recentResults: Array.isArray(resultsData) ? resultsData.slice(0, 5) : [],
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to SwimTrack</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Swimmers"
          value={isLoading ? "—" : String(stats.totalSwimmers)}
          change={`${stats.totalSwimmers} registered`}
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Upcoming Meets"
          value={isLoading ? "—" : String(stats.upcomingMeets)}
          change={stats.upcomingMeets > 0 ? `Next: ${stats.upcomingMeets} scheduled` : "No upcoming meets"}
        />
        <StatCard
          icon={<Trophy className="w-6 h-6" />}
          label="Recent Results"
          value={isLoading ? "—" : String(stats.recentResults.length)}
          change="Latest entries"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Personal Bests"
          value={isLoading ? "—" : String(stats.recentResults.filter((r) => r.is_pb).length)}
          change="In recent results"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction
                icon={<Plus className="w-5 h-5" />}
                label="Add Swimmer"
                href="/dashboard/swimmers/new"
              />
              <QuickAction
                icon={<Calendar className="w-5 h-5" />}
                label="Create Meet"
                href="/dashboard/meets/new"
              />
              <QuickAction
                icon={<Trophy className="w-5 h-5" />}
                label="View Leaderboard"
                href="/dashboard/leaderboard"
              />
              <QuickAction
                icon={<Users className="w-5 h-5" />}
                label="Import Times"
                href="/dashboard/import"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : stats.recentResults.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No results yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentResults.map((result) => (
                  <RecentResult
                    key={result.id}
                    name={result.swimmer ? `${result.swimmer.first_name} ${result.swimmer.last_name}` : "Unknown"}
                    event={
                      result.event
                        ? `${result.event.distance}m ${result.event.stroke.replace("_", " ")}`
                        : "Unknown event"
                    }
                    time={result.official_time_ms ? formatTime(result.official_time_ms) : "DQ"}
                    meet={result.meet?.name ?? "Unknown meet"}
                    isPB={result.is_pb}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Next Time Trial Deadline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">End of Season Testing</p>
              <p className="text-sm text-slate-500">All swimmers must complete 400m & 200m time trials</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">14 days</p>
              <p className="text-sm text-slate-500">Due: May 15, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{change}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <div className="text-primary mb-2">{icon}</div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </Link>
  );
}

function RecentResult({ 
  name, 
  event, 
  time, 
  meet, 
  isPB 
}: { 
  name: string; 
  event: string; 
  time: string; 
  meet: string; 
  isPB?: boolean 
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{event}</p>
      </div>
      <div className="text-right">
        <p className="font-mono font-medium text-slate-900">{time}</p>
        <div className="flex items-center gap-2 justify-end">
          {isPB && <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">PB</span>}
          <span className="text-xs text-slate-500">{meet}</span>
        </div>
      </div>
    </div>
  );
}

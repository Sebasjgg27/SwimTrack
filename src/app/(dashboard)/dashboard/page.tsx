"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Users, Calendar, Trophy, TrendingUp, Clock, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to SwimTrack</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Swimmers"
          value="24"
          change="+3 this month"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Upcoming Meets"
          value="2"
          change="Next: Regional Champ"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6" />}
          label="Personal Bests"
          value="18"
          change="+5 this season"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Avg. Improvement"
          value="2.3%"
          change="vs last season"
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
            <div className="space-y-4">
              <RecentResult
                name="Juan Perez"
                event="100m Freestyle"
                time="52.34"
                meet="Regional Championship"
                isPB
              />
              <RecentResult
                name="Maria Garcia"
                event="200m Backstroke"
                time="2:18.45"
                meet="Club Invitational"
              />
              <RecentResult
                name="Carlos Lopez"
                event="50m Butterfly"
                time="26.12"
                meet="Regional Championship"
                isPB
              />
            </div>
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
    </DashboardLayout>
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
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <div className="text-primary mb-2">{icon}</div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </a>
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
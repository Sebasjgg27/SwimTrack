"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Calculator, Plus, Trophy, Upload, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function DashboardPage() {
  const [swimmerCount, setSwimmerCount] = useState<number | null>(null);
  const [clubCount, setClubCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      const supabase = createClient();
      const [swimmers, clubs] = await Promise.all([
        supabase.from("swimmers").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("club_id"),
      ]);

      if (swimmers.error || clubs.error) {
        setError(swimmers.error?.message ?? clubs.error?.message ?? "Could not load dashboard data.");
        return;
      }

      setSwimmerCount(swimmers.count ?? 0);
      setClubCount(new Set((clubs.data ?? []).map((role) => role.club_id)).size);
    }

    void loadSummary();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Your live SwimTrack beta workspace</p>
      </div>

      {error && <p role="alert" className="mb-6 rounded-lg bg-error/5 p-3 text-sm text-error">{error}</p>}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SummaryCard icon={<Users className="h-6 w-6" />} label="Visible swimmers" value={swimmerCount} />
        <SummaryCard icon={<Building2 className="h-6 w-6" />} label="Your clubs" value={clubCount} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Working now</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction icon={<Plus className="h-5 w-5" />} label="Add swimmer" href="/dashboard/swimmers/add" />
            <QuickAction icon={<Building2 className="h-5 w-5" />} label="Create club" href="/dashboard/clubs/add" />
            <QuickAction icon={<Calculator className="h-5 w-5" />} label="Calculate training zones" href="/dashboard/time-trials" />
            <QuickAction icon={<Users className="h-5 w-5" />} label="View roster" href="/dashboard/swimmers" />
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60">
          <CardHeader><CardTitle>Preview features</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-700">Meets, leaderboards, and result imports are visible design previews. They do not save competition data yet.</p>
            <div className="flex flex-wrap gap-3">
              <PreviewLink icon={<Trophy className="h-4 w-4" />} label="Leaderboard preview" href="/dashboard/leaderboard" />
              <PreviewLink icon={<Upload className="h-4 w-4" />} label="Import preview" href="/dashboard/import" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | null }) {
  return <Card><div className="flex items-center gap-4"><div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div><div><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold text-slate-900">{value ?? "—"}</p></div></div></Card>;
}

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return <Link href={href} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"><span className="text-primary">{icon}</span>{label}</Link>;
}

function PreviewLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-700">{icon}{label}</Link>;
}

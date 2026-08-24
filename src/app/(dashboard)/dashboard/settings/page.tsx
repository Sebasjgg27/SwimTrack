"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Settings2, UserRound } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [identity, setIdentity] = useState("Loading account...");

  useEffect(() => {
    async function loadIdentity() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIdentity(data.user?.email ?? "Signed-in account");
    }
    void loadIdentity();
  }, []);

  return <DashboardLayout><h1 className="text-3xl font-bold text-slate-900">Settings</h1><p className="mt-1 text-slate-600">Beta account and workspace information</p><div className="mt-8 grid gap-6 lg:grid-cols-2"><Card><CardHeader className="flex flex-row items-center gap-3"><UserRound className="h-5 w-5 text-primary" /><CardTitle>Account</CardTitle></CardHeader><CardContent><p className="text-slate-700">{identity}</p><p className="mt-2 text-sm text-slate-500">Profile editing and password recovery will be added after the beta.</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><CardTitle>Club workspace</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-slate-600">Create clubs and manage the real swimmer roster from the club pages.</p><Link href="/dashboard/clubs" className="text-sm font-medium text-primary hover:underline">Open clubs</Link></CardContent></Card><Card className="border-amber-200 bg-amber-50/60 lg:col-span-2"><CardHeader className="flex flex-row items-center gap-3"><Settings2 className="h-5 w-5 text-amber-700" /><CardTitle>Not in this beta</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-700">Invitations, notifications, club editing, exports, and website-content controls are not connected yet. They have been removed from this screen so nothing appears to save when it does not.</p></CardContent></Card></div></DashboardLayout>;
}

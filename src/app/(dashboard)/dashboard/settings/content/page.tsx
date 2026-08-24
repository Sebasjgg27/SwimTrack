import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";

export default function ContentSettingsPage() {
  return <DashboardLayout><Card className="mx-auto max-w-xl text-center"><h1 className="text-2xl font-bold text-slate-900">Website content settings are not available in the beta</h1><p className="mt-3 text-slate-600">This page is reserved for a future release and does not save changes.</p><Link href="/dashboard/settings" className="mt-5 inline-block text-primary hover:underline">Back to settings</Link></Card></DashboardLayout>;
}

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";

export default function SwimmerDetailPage() {
  return <DashboardLayout><Card className="mx-auto max-w-xl text-center"><h1 className="text-2xl font-bold text-slate-900">Detailed swimmer profiles are coming next</h1><p className="mt-3 text-slate-600">The beta stores roster entries, but performance history and profile editing are not connected yet.</p><Link href="/dashboard/swimmers" className="mt-5 inline-block text-primary hover:underline">Back to swimmers</Link></Card></DashboardLayout>;
}

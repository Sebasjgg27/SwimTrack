import { CalendarClock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";

export default function MeetsPage() {
  return <DashboardLayout><h1 className="text-3xl font-bold text-slate-900">Meets</h1><p className="mt-1 text-slate-600">Competition management preview</p><Card className="mt-8 border-amber-200 bg-amber-50/60 py-14 text-center"><CalendarClock className="mx-auto mb-4 h-12 w-12 text-amber-600" /><h2 className="text-xl font-semibold text-slate-900">Coming after the beta</h2><p className="mx-auto mt-2 max-w-xl text-slate-600">Meet creation, result verification, and competition history are not connected yet. No meet data shown here is fabricated or saved.</p></Card></DashboardLayout>;
}

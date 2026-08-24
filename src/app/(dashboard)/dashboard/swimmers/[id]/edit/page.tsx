import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";

export default function EditSwimmerPage() {
  return <DashboardLayout><Card className="mx-auto max-w-xl text-center"><h1 className="text-2xl font-bold text-slate-900">Swimmer editing is not available in the beta</h1><p className="mt-3 text-slate-600">This page does not make or pretend to save changes yet.</p><Link href="/dashboard/swimmers" className="mt-5 inline-block text-primary hover:underline">Back to swimmers</Link></Card></DashboardLayout>;
}

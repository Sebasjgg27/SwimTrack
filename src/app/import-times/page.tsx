import Link from "next/link";
import { Waves } from "lucide-react";

export default function ImportTimesPage() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4"><div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center"><Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white"><Waves className="h-8 w-8 text-primary" />SwimTrack</Link><h1 className="mt-8 text-2xl font-bold text-white">Imports are preview-only in this beta</h1><p className="mt-3 text-slate-400">Finish creating your profile first. Signed-in users can inspect CSV, TXT, and Markdown files from the dashboard, but results are not saved yet.</p><Link href="/onboarding" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white">Continue profile setup</Link></div></main>;
}

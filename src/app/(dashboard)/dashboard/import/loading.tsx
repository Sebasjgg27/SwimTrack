import { Card } from "@/components/ui/card";

export default function ImportLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-64 mt-1 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <Card>
        <div className="p-6 space-y-6">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-12 w-40 bg-slate-100 rounded animate-pulse" />
        </div>
      </Card>
    </div>
  );
}

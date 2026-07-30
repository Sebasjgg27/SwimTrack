import { Card } from "@/components/ui/card";

export default function MeetsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-64 mt-1 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {["all", "upcoming", "past", "results"].map((f) => (
          <div key={f} className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="h-6 w-48 bg-slate-100 rounded animate-pulse mb-3" />
              <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

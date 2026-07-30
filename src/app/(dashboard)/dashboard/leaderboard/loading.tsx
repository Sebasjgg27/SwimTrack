import { Card } from "@/components/ui/card";

export default function LeaderboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-72 mt-1 bg-slate-100 rounded animate-pulse" />
      </div>
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="h-6 w-64 bg-slate-100 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

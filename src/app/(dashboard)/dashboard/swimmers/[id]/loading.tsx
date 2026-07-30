import { Card } from "@/components/ui/card";

export default function SwimmerProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 animate-pulse" />
        <div>
          <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-36 mt-1 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div className="p-6 space-y-4">
              <div className="h-6 w-36 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 bg-slate-100 rounded animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

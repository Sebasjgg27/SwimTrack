import { Card } from "@/components/ui/card";

export default function TimeTrialsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-80 mt-1 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 space-y-5">
            <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-100 rounded animate-pulse" />
              <div className="h-20 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
          </div>
        </Card>
        <Card>
          <div className="p-6 space-y-5">
            <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
            <div className="h-32 bg-slate-100 rounded animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

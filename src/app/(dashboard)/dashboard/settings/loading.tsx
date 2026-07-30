import { Card } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-64 mt-1 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-100 rounded animate-pulse" />
                <div>
                  <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-48 mt-1 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-12 bg-slate-100 rounded animate-pulse" />
                <div className="h-12 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DemoProfileLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-slate-100 animate-pulse" />
          <div>
            <div className="h-10 w-48 bg-slate-100 rounded animate-pulse mb-2" />
            <div className="h-5 w-36 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-8 w-32 bg-slate-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-96 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

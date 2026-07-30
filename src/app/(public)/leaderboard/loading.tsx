export default function PublicLeaderboardLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-10 w-48 bg-slate-100 rounded animate-pulse mb-4" />
        <div className="h-5 w-72 bg-slate-100 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

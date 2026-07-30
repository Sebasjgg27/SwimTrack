export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="grid-background" />
      <div className="w-full max-w-md relative z-10 space-y-4">
        <div className="text-center mb-8">
          <div className="h-8 w-48 bg-slate-100 rounded animate-pulse mx-auto mb-3" />
          <div className="h-5 w-36 bg-slate-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="p-8" style={{ background: "var(--bg-card)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-lg)" }}>
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

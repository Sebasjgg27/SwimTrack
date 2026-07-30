"use client";

import { useEffect } from "react";

export default function DemoProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Failed to load profile</h2>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{error.message || "An unexpected error occurred"}</p>
        <button onClick={reset} className="btn-primary">Try again</button>
      </div>
    </div>
  );
}

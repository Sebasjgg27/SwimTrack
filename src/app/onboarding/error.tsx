"use client";

import { useEffect } from "react";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="grid-background" />
      <div className="text-center relative z-10">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Onboarding error</h2>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{error.message || "An unexpected error occurred"}</p>
        <button onClick={reset} className="btn-primary">Try again</button>
      </div>
    </div>
  );
}

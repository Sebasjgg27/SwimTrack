"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SwimmerProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to load swimmer</h2>
        <p className="text-slate-600 mb-4">{error.message || "An unexpected error occurred"}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}

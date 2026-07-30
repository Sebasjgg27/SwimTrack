"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Waves } from "lucide-react";

export default function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "poolside">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "poolside" : "dark");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-primary)" }}>
      <div className="grid-background" />
      <header style={{ borderBottom: "1px solid var(--border-color)" }} className="backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-glow-pulse" style={{ backgroundColor: "var(--accent-color)", boxShadow: "0 0 10px var(--accent-color)" }} />
            <span className="font-mono font-bold text-lg tracking-wide" style={{ color: "var(--text-primary)" }}>
              SWIMTRACK<span style={{ color: "var(--accent-color)" }}>{" //"}</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/leaderboard" className="font-mono text-sm uppercase tracking-wider transition-colors hover:opacity-100" style={{ color: "var(--text-secondary)" }}>
              Leaderboard
            </Link>
            <Link href="/demo/profile" className="font-mono text-sm uppercase tracking-wider transition-colors hover:opacity-100" style={{ color: "var(--text-secondary)" }}>
              Demo
            </Link>
            <Link href="/login" className="font-mono text-sm uppercase tracking-wider transition-colors hover:opacity-100" style={{ color: "var(--text-secondary)" }}>
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Sign Up
            </Link>
            <button
              onClick={toggleTheme}
              className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm transition-all hover:opacity-100"
              style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)", background: "transparent" }}
            >
              {theme === "dark" ? "Poolside" : "Dark"}
            </button>
          </div>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 py-8 mt-12" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            SWIMTRACK ATHLETICS &copy; 2026
          </span>
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Precision Swim Telemetry
          </span>
        </div>
      </footer>
    </div>
  );
}

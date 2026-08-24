"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy, 
  Upload, 
  Settings,
  Waves,
  LogOut,
  ChevronLeft,
  Clock,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/time-trials", label: "Time Trials", icon: Clock },
  { href: "/dashboard/swimmers", label: "Swimmers", icon: Users },
  { href: "/dashboard/meets", label: "Meets", icon: Calendar },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/import", label: "Import", icon: Upload },
  { href: "/dashboard/clubs", label: "Clubs", icon: Building2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError("");
    const { error } = await signOut();

    if (error) {
      setSignOutError(error.message);
      setIsSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <Waves className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">SwimTrack</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white transition-colors w-full mt-2 disabled:opacity-60"
          >
            <LogOut className="w-5 h-5" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
          {signOutError && (
            <p role="alert" className="mt-2 px-3 text-xs text-red-300">
              {signOutError}
            </p>
          )}
        </div>
      </aside>

      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

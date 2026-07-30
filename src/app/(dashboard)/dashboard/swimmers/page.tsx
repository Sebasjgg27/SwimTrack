"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { calculateAge } from "@/lib/utils";
import type { Swimmer } from "@/types";
import { Plus, Search, Filter, MoreVertical, Clock } from "lucide-react";

export default function SwimmersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSwimmers() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (genderFilter !== "all") params.set("gender", genderFilter);

        const res = await fetch(`/api/swimmers?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch swimmers");
        }

        const data = await res.json();
        setSwimmers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Error fetching swimmers:", err);
        setError("Failed to load swimmers. Please try again.");
        setSwimmers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSwimmers();
    return () => controller.abort();
  }, [searchQuery, genderFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Swimmers</h1>
            <p className="text-slate-600 mt-1">Manage your club&apos;s swimmers</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/swimmers/new")}
          >
            <Plus className="w-4 h-4" />
            Add Swimmer
          </Button>
        </div>
        <Link href="/dashboard/swimmers/add">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Swimmer
          </Button>
        </Link>
      </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search swimmers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Select
            options={[
              { value: "all", label: "All Genders" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-40"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-24 bg-slate-100 rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {swimmers.map((swimmer) => (
              <Link key={swimmer.id} href={`/dashboard/swimmers/${swimmer.id}`}>
                <SwimmerCard swimmer={swimmer} />
              </Link>
            ))}
          </div>
        )}

        {swimmers.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <p className="text-slate-500">No swimmers found matching your criteria</p>
          </Card>
        )}
      </div>
  );
}

function SwimmerCard({ swimmer }: { swimmer: Swimmer }) {
  const fullName = `${swimmer.first_name} ${swimmer.last_name}`;
  const initials = `${swimmer.first_name[0]}${swimmer.last_name[0]}`;
  const age = swimmer.date_of_birth ? calculateAge(swimmer.date_of_birth) : "—";

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{fullName}</h3>
            <p className="text-sm text-slate-500">
              Age: {age} • {swimmer.gender === "male" ? "M" : "F"}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{swimmer.is_minor ? "Minor" : "Adult"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">
              {swimmer.profile_visibility.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

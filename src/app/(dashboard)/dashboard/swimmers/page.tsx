"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, UserRound, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { calculateAge } from "@/lib/utils";

interface SwimmerRow {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | null;
  club: { name: string } | Array<{ name: string }> | null;
}

interface SwimmerSummary {
  id: string;
  name: string;
  age: number | null;
  gender: "male" | "female" | null;
  clubName: string;
}

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function SwimmersPage() {
  const [swimmers, setSwimmers] = useState<SwimmerSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gender, setGender] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSwimmers() {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("swimmers")
        .select("id,first_name,last_name,date_of_birth,gender,club:clubs(name)")
        .order("first_name");

      if (queryError) {
        setError(queryError.message);
        setIsLoading(false);
        return;
      }

      setSwimmers(
        ((data ?? []) as unknown as SwimmerRow[]).map((swimmer) => ({
          id: swimmer.id,
          name: `${swimmer.first_name} ${swimmer.last_name}`,
          age: swimmer.date_of_birth ? calculateAge(swimmer.date_of_birth) : null,
          gender: swimmer.gender,
          clubName: firstRelation(swimmer.club)?.name ?? "Independent swimmer",
        }))
      );
      setIsLoading(false);
    }

    void fetchSwimmers();
  }, []);

  const filteredSwimmers = useMemo(
    () =>
      swimmers.filter(
        (swimmer) =>
          (gender === "all" || swimmer.gender === gender) &&
          `${swimmer.name} ${swimmer.clubName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    [gender, searchQuery, swimmers]
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Swimmers</h1>
          <p className="mt-1 text-slate-600">The roster for clubs you manage or belong to</p>
        </div>
        <Link href="/dashboard/swimmers/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Swimmer
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Search swimmers"
            placeholder="Search by swimmer or club..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          aria-label="Filter by gender"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          options={[
            { value: "all", label: "All swimmers" },
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]}
        />
      </div>

      {error && (
        <Card className="mb-6 border-error/40 bg-error/5">
          <CardContent>
            <p role="alert" className="text-sm text-error">
              Could not load swimmers: {error}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-slate-500">Loading swimmers...</p>
      ) : filteredSwimmers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSwimmers.map((swimmer) => (
            <Card key={swimmer.id}>
              <CardContent className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-900">{swimmer.name}</h2>
                  <p className="mt-1 truncate text-sm text-slate-600">{swimmer.clubName}</p>
                  <p className="mt-2 text-xs capitalize text-slate-500">
                    {[swimmer.gender, swimmer.age === null ? null : `age ${swimmer.age}`]
                      .filter(Boolean)
                      .join(" · ") || "Profile details not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-600">
            {searchQuery || gender !== "all"
              ? "No swimmers match these filters."
              : "There are no swimmers in your roster yet."}
          </p>
          {!searchQuery && gender === "all" && (
            <Link href="/dashboard/swimmers/add">
              <Button variant="outline" className="mt-4">
                Add your first swimmer
              </Button>
            </Link>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

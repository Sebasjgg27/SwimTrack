"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Plus, Search, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

interface ClubSummary {
  id: string;
  name: string;
  city: string | null;
  country: string;
  memberCount: number;
}

interface ClubRoleRow {
  club:
    | {
        id: string;
        name: string;
        city: string | null;
        country: { name: string } | Array<{ name: string }> | null;
        swimmers: Array<{ count: number }>;
      }
    | Array<{
        id: string;
        name: string;
        city: string | null;
        country: { name: string } | Array<{ name: string }> | null;
        swimmers: Array<{ count: number }>;
      }>
    | null;
}

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClubs() {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("user_roles")
        .select(
          "club:clubs!user_roles_club_id_fkey(id,name,city,country:countries(name),swimmers(count))"
        );

      if (queryError) {
        setError(queryError.message);
        setIsLoading(false);
        return;
      }

      const uniqueClubs = new Map<string, ClubSummary>();
      for (const row of (data ?? []) as unknown as ClubRoleRow[]) {
        const club = firstRelation(row.club);
        if (!club) continue;
        const country = firstRelation(club.country);
        uniqueClubs.set(club.id, {
          id: club.id,
          name: club.name,
          city: club.city,
          country: country?.name ?? "Unknown country",
          memberCount: club.swimmers[0]?.count ?? 0,
        });
      }

      setClubs([...uniqueClubs.values()].sort((a, b) => a.name.localeCompare(b.name)));
      setIsLoading(false);
    }

    void fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((club) =>
    `${club.name} ${club.city ?? ""} ${club.country}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Clubs</h1>
          <p className="mt-1 text-slate-600">Clubs where you have an assigned role</p>
        </div>
        <Link href="/dashboard/clubs/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Club
          </Button>
        </Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search your clubs..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <Card className="mb-6 border-error/40 bg-error/5">
          <CardContent>
            <p role="alert" className="text-sm text-error">
              Could not load your clubs: {error}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-slate-500">Loading clubs...</p>
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Card key={club.id}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{club.name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {[club.city, club.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  {club.memberCount} {club.memberCount === 1 ? "swimmer" : "swimmers"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-600">
            {searchQuery ? "No clubs match your search." : "You do not have a club yet."}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/clubs/add">
              <Button variant="outline" className="mt-4">
                Create your first club
              </Button>
            </Link>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { Plus, Search, Building2, MapPin, Users, Edit, MoreVertical } from "lucide-react";

const mockClubs = [
  { id: "1", name: "Club Alpha Swimming", city: "Bogotá", country: "Colombia", members: 45, pools: ["SCM"], verified: true },
  { id: "2", name: "Club Beta Aquatics", city: "Medellín", country: "Colombia", members: 32, pools: ["SCM", "LCM"], verified: true },
  { id: "3", name: "Club Gamma", city: "Cali", country: "Colombia", members: 28, pools: ["SCM"], verified: false },
];

interface Club {
  id: string;
  name: string;
  city: string;
  country: string;
  members: number;
  pools: string[];
  verified: boolean;
}

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("clubs")
          .select("*")
          .order("name");

        if (error) {
          console.warn("Supabase not configured, using mock data:", error.message);
          setClubs(mockClubs);
        } else if (data) {
          setClubs(data.map((c: { id: string; name: string; city: string; country: string }) => ({
            id: c.id,
            name: c.name,
            city: c.city,
            country: c.country,
            members: 0,
            pools: ["SCM"],
            verified: false,
          })));
        }
      } catch (err) {
        console.warn("Error connecting to Supabase, using mock data");
        setClubs(mockClubs);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clubs</h1>
          <p className="text-slate-600 mt-1">Manage swimming clubs</p>
        </div>
        <Link href="/dashboard/clubs/add">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Club
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-slate-100 rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}

      {filteredClubs.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No clubs found</p>
          <Link href="/dashboard/clubs/add">
            <Button variant="outline" className="mt-4">Add First Club</Button>
          </Link>
        </Card>
      )}
    </DashboardLayout>
  );
}

function ClubCard({ club }: { club: Club }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{club.name}</h3>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="w-3 h-3" />
                {club.city}, {club.country}
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{club.members} members</span>
            </div>
            <div className="flex gap-1">
              {club.pools.map(pool => (
                <Badge key={pool}>{pool}</Badge>
              ))}
            </div>
          </div>
          {club.verified && (
            <Badge variant="success">Verified</Badge>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Link href={`/dashboard/clubs/${club.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/clubs/${club.id}/swimmers`} className="flex-1">
            <Button variant="ghost" className="w-full flex items-center gap-2">
              <Users className="w-4 h-4" />
              View Swimmers
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
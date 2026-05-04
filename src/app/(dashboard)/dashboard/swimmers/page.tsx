"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { Plus, Search, Filter, MoreVertical, Clock } from "lucide-react";

const mockSwimmers = [
  { id: "1", name: "Juan Perez", age: 16, gender: "male", events: 5, pbCount: 3, lastTraining: "2 days ago" },
  { id: "2", name: "Maria Garcia", age: 14, gender: "female", events: 4, pbCount: 2, lastTraining: "1 day ago" },
  { id: "3", name: "Carlos Lopez", age: 18, gender: "male", events: 6, pbCount: 4, lastTraining: "Today" },
  { id: "4", name: "Ana Martinez", age: 15, gender: "female", events: 3, pbCount: 1, lastTraining: "3 days ago" },
  { id: "5", name: "Pedro Rodriguez", age: 17, gender: "male", events: 5, pbCount: 2, lastTraining: "Yesterday" },
  { id: "6", name: "Sofia Hernandez", age: 13, gender: "female", events: 4, pbCount: 1, lastTraining: "4 days ago" },
];

interface Swimmer {
  id: string;
  name: string;
  age: number;
  gender: string;
  events: number;
  pbCount: number;
  lastTraining: string;
}

export default function SwimmersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [swimmers, setSwimmers] = useState<Swimmer[]>(mockSwimmers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSwimmers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("swimmers")
          .select("*")
          .order("name");
        
        if (error) {
          console.warn("Supabase not configured, using mock data:", error.message);
          setSwimmers(mockSwimmers);
        } else if (data) {
          setSwimmers(data.map((s: { id: string; first_name: string; last_name: string; date_of_birth: string; gender: string }) => ({
            id: s.id,
            name: `${s.first_name} ${s.last_name}`,
            age: new Date().getFullYear() - new Date(s.date_of_birth).getFullYear(),
            gender: s.gender,
            events: 0,
            pbCount: 0,
            lastTraining: "N/A",
          })));
        }
      } catch (err) {
        console.warn("Error connecting to Supabase, using mock data");
        setSwimmers(mockSwimmers);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSwimmers();
  }, []);

  const filteredSwimmers = swimmers.filter((swimmer) => {
    const matchesSearch = swimmer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || swimmer.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Swimmers</h1>
          <p className="text-slate-600 mt-1">Manage your club&apos;s swimmers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Swimmer
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search swimmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredSwimmers.map((swimmer) => (
            <SwimmerCard key={swimmer.id} swimmer={swimmer} />
          ))}
        </div>
      )}

      {filteredSwimmers.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <p className="text-slate-500">No swimmers found matching your criteria</p>
        </Card>
      )}
    </DashboardLayout>
  );
}

function SwimmerCard({ swimmer }: { swimmer: Swimmer }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
            {swimmer.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{swimmer.name}</h3>
            <p className="text-sm text-slate-500">Age: {swimmer.age} • {swimmer.gender === "male" ? "M" : "F"}</p>
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
            <span>{swimmer.lastTraining}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{swimmer.events} events</Badge>
            {swimmer.pbCount > 0 && (
              <Badge variant="success">+{swimmer.pbCount} PB</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
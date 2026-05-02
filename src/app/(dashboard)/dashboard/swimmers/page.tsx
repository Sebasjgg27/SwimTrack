"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Plus, Search, Filter, MoreVertical, Clock } from "lucide-react";

const mockSwimmers = [
  { id: "1", name: "Juan Perez", age: 16, gender: "male", events: 5, pbCount: 3, lastTraining: "2 days ago" },
  { id: "2", name: "Maria Garcia", age: 14, gender: "female", events: 4, pbCount: 2, lastTraining: "1 day ago" },
  { id: "3", name: "Carlos Lopez", age: 18, gender: "male", events: 6, pbCount: 4, lastTraining: "Today" },
  { id: "4", name: "Ana Martinez", age: 15, gender: "female", events: 3, pbCount: 1, lastTraining: "3 days ago" },
  { id: "5", name: "Pedro Rodriguez", age: 17, gender: "male", events: 5, pbCount: 2, lastTraining: "Yesterday" },
  { id: "6", name: "Sofia Hernandez", age: 13, gender: "female", events: 4, pbCount: 1, lastTraining: "4 days ago" },
];

export default function SwimmersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredSwimmers = mockSwimmers.filter((swimmer) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSwimmers.map((swimmer) => (
          <SwimmerCard key={swimmer.id} swimmer={swimmer} />
        ))}
      </div>

      {filteredSwimmers.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-slate-500">No swimmers found matching your criteria</p>
        </Card>
      )}
    </DashboardLayout>
  );
}

function SwimmerCard({ swimmer }: { swimmer: typeof mockSwimmers[0] }) {
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
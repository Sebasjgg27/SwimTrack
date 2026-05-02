"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Plus, Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const mockMeets = [
  { id: "1", name: "Regional Championship 2026", date: "2026-04-20", city: "Bogotá", pool: "SCM", level: "regional", results: 156, verified: true },
  { id: "2", name: "Club Invitational", date: "2026-04-15", city: "Medellín", pool: "LCM", level: "local", results: 89, verified: true },
  { id: "3", name: "National Qualifier", date: "2026-05-10", city: "Cali", pool: "LCM", level: "national", results: 0, verified: false },
  { id: "4", name: "Youth Championship", date: "2026-05-25", city: "Barranquilla", pool: "SCM", level: "regional", results: 0, verified: false },
  { id: "5", name: "Club Time Trials", date: "2026-03-30", city: "Bogotá", pool: "SCM", level: "club", results: 45, verified: true },
];

const levelColors: Record<string, string> = {
  club: "bg-slate-100 text-slate-700",
  local: "bg-blue-100 text-blue-700",
  regional: "bg-purple-100 text-purple-700",
  national: "bg-orange-100 text-orange-700",
  international: "bg-green-100 text-green-700",
};

export default function MeetsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meets</h1>
          <p className="text-slate-600 mt-1">Manage competitions and results</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Meet
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "upcoming", "past", "results"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f 
                ? "bg-primary text-white" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mockMeets.map((meet) => (
          <MeetCard key={meet.id} meet={meet} />
        ))}
      </div>
    </DashboardLayout>
  );
}

function MeetCard({ meet }: { meet: typeof mockMeets[0] }) {
  const isUpcoming = new Date(meet.date) > new Date();
  const hasResults = meet.results > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">{meet.name}</h3>
            <Badge className={levelColors[meet.level]}>{meet.level}</Badge>
            {meet.verified && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(meet.date).toLocaleDateString("es-CO", { 
                day: "numeric", 
                month: "long", 
                year: "numeric" 
              })}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {meet.city}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{meet.pool}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasResults ? (
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{meet.results}</p>
              <p className="text-sm text-slate-500">results</p>
            </div>
          ) : isUpcoming ? (
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">No results</span>
            </div>
          )}

          <Button variant="outline" size="sm">
            {hasResults ? "View Results" : "Manage"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
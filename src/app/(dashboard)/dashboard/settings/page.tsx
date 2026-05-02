"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Building2, Users, Shield, Bell, Database, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your club and account settings</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Club Information</CardTitle>
              <p className="text-sm text-slate-500">Basic club details</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Club Name" defaultValue="Club Alpha Swimming" />
              <Input label="City" defaultValue="Bogotá" />
              <Select
                label="Country"
                options={[
                  { value: "CO", label: "Colombia" },
                  { value: "US", label: "United States" },
                  { value: "ES", label: "Spain" },
                ]}
                defaultValue="CO"
              />
              <Select
                label="Default Pool Type"
                options={[
                  { value: "SCM", label: "Short Course Meters (25m)" },
                  { value: "LCM", label: "Long Course Meters (50m)" },
                  { value: "SCY", label: "Short Course Yards (25y)" },
                ]}
                defaultValue="SCM"
              />
            </div>
            <div className="flex justify-end">
              <Button className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Users className="w-5 h-5 text-secondary" />
            <div>
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-slate-500">Manage coaches and admins</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Juan Manager", email: "juan@clubalpha.com", role: "club_admin" },
                { name: "Maria Coach", email: "maria@clubalpha.com", role: "coach" },
                { name: "Carlos Coach", email: "carlos@clubalpha.com", role: "coach" },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                  <Badge>{member.role === "club_admin" ? "Admin" : "Coach"}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4">Invite Member</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <div>
              <CardTitle>Privacy & Visibility</CardTitle>
              <p className="text-sm text-slate-500">Configure public profile settings</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Default Profile Visibility</p>
                <p className="text-sm text-slate-500">New swimmers will have this setting</p>
              </div>
              <Select
                options={[
                  { value: "club_private", label: "Club Private" },
                  { value: "club_public", label: "Club Public" },
                  { value: "country", label: "Country" },
                  { value: "international", label: "International" },
                ]}
                defaultValue="club_private"
                className="w-40"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Require Admin Approval</p>
                <p className="text-sm text-slate-500">Minors need approval for public visibility</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Show Times on Public Leaderboard</p>
                <p className="text-sm text-slate-500">Allow swimmer times to appear in public rankings</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Bell className="w-5 h-5 text-warning" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <p className="text-sm text-slate-500">Email notification preferences</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "New Personal Best", description: "When a swimmer sets a new PB" },
              { label: "Leaderboard Updates", description: "When rank changes significantly" },
              { label: "Meet Results", description: "When new results are imported" },
              { label: "Time Trial Reminders", description: "Reminders for pending time trials" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Database className="w-5 h-5 text-success" />
            <div>
              <CardTitle>Data Management</CardTitle>
              <p className="text-sm text-slate-500">Export and backup your data</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline">Export Swimmers (CSV)</Button>
              <Button variant="outline">Export Results (CSV)</Button>
              <Button variant="outline">Export All Data</Button>
            </div>
            <p className="text-sm text-slate-500">
              Database usage: 45MB / 500MB (9%)
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
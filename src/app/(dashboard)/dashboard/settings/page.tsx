"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { Building2, Users, Shield, Bell, Database, Save, CheckCircle, Globe } from "lucide-react";

interface ClubSettings {
  name: string;
  city: string;
  country: string;
  defaultPool: string;
}

interface NotificationPrefs {
  newPB: boolean;
  leaderboardUpdates: boolean;
  meetResults: boolean;
  timeTrialReminders: boolean;
}

const defaultClub: ClubSettings = {
  name: "Club Alpha Swimming",
  city: "Bogotá",
  country: "CO",
  defaultPool: "SCM",
};

const defaultNotifications: NotificationPrefs = {
  newPB: true,
  leaderboardUpdates: true,
  meetResults: true,
  timeTrialReminders: false,
};

export default function SettingsPage() {
  const [club, setClub] = useState<ClubSettings>(defaultClub);
  const [notifications, setNotifications] = useState<NotificationPrefs>(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const savedClub = localStorage.getItem("club_settings");
    if (savedClub) {
      setClub(JSON.parse(savedClub));
    }
    const savedNotifs = localStorage.getItem("notification_prefs");
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  const handleClubChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClub(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifChange = (key: keyof NotificationPrefs) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveClub = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("clubs")
        .upsert({ name: club.name, city: club.city, country: club.country, default_pool: club.defaultPool });

      if (error) {
        console.warn("Supabase not available, saving locally:", error.message);
      }
      localStorage.setItem("club_settings", JSON.stringify(club));
    } catch (err) {
      console.error("Error saving club:", err);
      localStorage.setItem("club_settings", JSON.stringify(club));
    } finally {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("notification_prefs", JSON.stringify(notifications));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleExportSwimmers = () => {
    const swimmers = JSON.parse(localStorage.getItem("swimmers") || "[]");
    const csv = [
      ["Name", "Gender", "Club", "City", "Country"].join(","),
      ...swimmers.map((s: { firstName: string; lastName: string; gender: string; club: string; city: string; country: string }) =>
        [`${s.firstName} ${s.lastName}`, s.gender, s.club, s.city, s.country].join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swimmers.csv";
    a.click();
  };

  const handleExportResults = () => {
    const results = localStorage.getItem("results") || "[]";
    const blob = new Blob([results], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.json";
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your club and account settings</p>
        </div>
        {showSaved && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Saved!</span>
          </div>
        )}
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
              <Input
                label="Club Name"
                name="name"
                value={club.name}
                onChange={handleClubChange}
              />
              <Input
                label="City"
                name="city"
                value={club.city}
                onChange={handleClubChange}
              />
              <Select
                label="Country"
                name="country"
                value={club.country}
                onChange={handleClubChange}
                options={[
                  { value: "CO", label: "Colombia" },
                  { value: "US", label: "United States" },
                  { value: "ES", label: "Spain" },
                ]}
              />
              <Select
                label="Default Pool Type"
                name="defaultPool"
                value={club.defaultPool}
                onChange={handleClubChange}
                options={[
                  { value: "SCM", label: "Short Course Meters (25m)" },
                  { value: "LCM", label: "Long Course Meters (50m)" },
                  { value: "SCY", label: "Short Course Yards (25y)" },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <Button className="flex items-center gap-2" onClick={handleSaveClub} disabled={isSaving}>
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
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
            {Object.entries({
              newPB: { label: "New Personal Best", description: "When a swimmer sets a new PB" },
              leaderboardUpdates: { label: "Leaderboard Updates", description: "When rank changes significantly" },
              meetResults: { label: "Meet Results", description: "When new results are imported" },
              timeTrialReminders: { label: "Time Trial Reminders", description: "Reminders for pending time trials" },
            }).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof NotificationPrefs]}
                  onChange={() => handleNotifChange(key as keyof NotificationPrefs)}
                  className="w-5 h-5 rounded"
                />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleSaveNotifications}>Save Preferences</Button>
            </div>
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
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" onClick={handleExportSwimmers}>Export Swimmers (CSV)</Button>
              <Button variant="outline" onClick={handleExportResults}>Export Results (JSON)</Button>
              <Button variant="outline">Export All Data</Button>
            </div>
            <p className="text-sm text-slate-500">
              Database usage: 45MB / 500MB (9%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Web Content</CardTitle>
              <p className="text-sm text-slate-500">Manage your website content</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Edit website content, sections, and messaging.</p>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/settings/content"}>
              Manage Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
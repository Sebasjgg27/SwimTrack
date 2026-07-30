"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, Bell, Database, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, profile, clubRole, loading: authLoading } = useAuth();

  const [clubName, setClubName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("CO");
  const [poolType, setPoolType] = useState("SCM");

  const [savingClub, setSavingClub] = useState(false);
  const [clubSaved, setClubSaved] = useState(false);
  const [clubError, setClubError] = useState<string | null>(null);

  const club = clubRole?.clubs;

  const handleSaveClub = async () => {
    setSavingClub(true);
    setClubError(null);
    setClubSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_name: clubName || club?.name,
          city: city || club?.city,
          country_id: country,
          default_pool_type: poolType,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setClubSaved(true);
      setTimeout(() => setClubSaved(false), 2000);
    } catch (err: any) {
      setClubError(err.message || "Failed to save changes");
    } finally {
      setSavingClub(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
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
              <Input
                label="Club Name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder={club?.name ?? "Club name"}
              />
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={club?.city ?? "City"}
              />
              <Select
                label="Country"
                options={[
                  { value: "CO", label: "Colombia" },
                  { value: "US", label: "United States" },
                  { value: "ES", label: "Spain" },
                ]}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <Select
                label="Default Pool Type"
                options={[
                  { value: "SCM", label: "Short Course Meters (25m)" },
                  { value: "LCM", label: "Long Course Meters (50m)" },
                  { value: "SCY", label: "Short Course Yards (25y)" },
                ]}
                value={poolType}
                onChange={(e) => setPoolType(e.target.value)}
              />
            </div>

            {clubError && (
              <p className="text-sm text-red-600">{clubError}</p>
            )}
            {clubSaved && (
              <p className="text-sm text-success">Changes saved successfully.</p>
            )}

            <div className="flex justify-end">
              <Button
                className="flex items-center gap-2"
                onClick={handleSaveClub}
                disabled={savingClub}
              >
                {savingClub ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
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
              {profile && (
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm text-slate-500">{user?.email ?? "You"}</p>
                  </div>
                  <Badge>{clubRole?.role === "club_admin" ? "Admin" : clubRole?.role ?? "Member"}</Badge>
                </div>
              )}
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, Bell, Database, Save, Loader2, CheckCircle, Globe } from "lucide-react";

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
  const { user, profile, clubRole, loading: authLoading } = useAuth();

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

  useEffect(() => {
    if (clubRole?.clubs) {
      setClub({
        name: clubRole.clubs.name || defaultClub.name,
        city: clubRole.clubs.city || defaultClub.city,
        country: clubRole.clubs.country_id || defaultClub.country,
        defaultPool: clubRole.clubs.default_pool || defaultClub.defaultPool,
      });
    }
  }, [clubRole]);

  const handleClubChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as any;
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

      // Also persist basic club info via server API (keeps DB-auth/profile flow intact)
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_name: club.name,
          city: club.city,
          country_id: club.country,
          default_pool_type: club.defaultPool,
        }),
      });

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
                placeholder={club.name ?? "Club name"}
              />
              <Input
                label="City"
                name="city"
                value={club.city}
                onChange={handleClubChange}
                placeholder={club.city ?? "City"}
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
                value={club.country}
                onChange={handleClubChange}
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
                value={club.defaultPool}
                onChange={handleClubChange}
              />
            </div>

            {clubError && (
              <p className="text-sm text-red-600">{clubError}</p>
            )}
            {clubSaved && (
              <p className="text-sm text-success">Changes saved successfully.</p>
            )}

            <div className="flex justify-end">
              <Button className="flex items-center gap-2" onClick={handleSaveClub} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
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
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Save, UserPlus } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { calculateAge } from "@/lib/utils";

interface ManagedClub {
  club_id: string;
  club: { name: string } | Array<{ name: string }> | null;
}

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function AddSwimmerPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    clubId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "female",
    visibility: "club_private",
    parentConsent: false,
  });

  useEffect(() => {
    async function fetchManagedClubs() {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("user_roles")
        .select("club_id,club:clubs!user_roles_club_id_fkey(name)")
        .in("role", ["club_admin", "coach"]);

      if (queryError) {
        setError(`Could not load your clubs: ${queryError.message}`);
        setIsLoadingClubs(false);
        return;
      }

      const managedClubs = ((data ?? []) as unknown as ManagedClub[]).map((row) => ({
        id: row.club_id,
        name: firstRelation(row.club)?.name ?? "Unnamed club",
      }));
      setClubs(managedClubs);
      setFormData((current) => ({
        ...current,
        clubId: current.clubId || managedClubs[0]?.id || "",
      }));
      setIsLoadingClubs(false);
    }

    void fetchManagedClubs();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = event.target;
    const nextValue =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!formData.clubId) {
      setError("Create a club first, or ask a club administrator to give you a coach role.");
      return;
    }

    const isMinor = Boolean(formData.dateOfBirth) && calculateAge(formData.dateOfBirth) < 18;
    if (isMinor && !formData.parentConsent) {
      setError("Parental consent is required before adding a swimmer under 18.");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("swimmers").insert({
      club_id: formData.clubId,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      date_of_birth: formData.dateOfBirth || null,
      gender: formData.gender,
      profile_visibility: formData.visibility,
      is_minor: isMinor,
      parent_consent: isMinor ? formData.parentConsent : true,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSaving(false);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => router.push("/dashboard/swimmers"), 900);
  };

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle className="mb-6 h-20 w-20 text-success" />
          <h1 className="text-3xl font-bold text-slate-900">Swimmer added</h1>
          <p className="mt-2 text-slate-600">The swimmer is now part of your club roster.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/swimmers")}
          className="mb-4 -ml-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Swimmers
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add a Swimmer</h1>
          <p className="mt-1 text-slate-600">Add a real roster entry to a club you manage.</p>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-error/40 bg-error/5 p-3 text-sm text-error">
            {error}
          </p>
        )}

        {!isLoadingClubs && clubs.length === 0 ? (
          <Card className="text-center">
            <UserPlus className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-600">You need an administrator or coach role to add swimmers.</p>
            <Button type="button" className="mt-4" onClick={() => router.push("/dashboard/clubs/add")}>
              Create a Club
            </Button>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Roster details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Club"
                  name="clubId"
                  value={formData.clubId}
                  onChange={handleChange}
                  disabled={isLoadingClubs}
                  options={clubs.map((club) => ({ value: club.id, label: club.name }))}
                  placeholder={isLoadingClubs ? "Loading clubs..." : "Choose a club"}
                  required
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" },
                    ]}
                  />
                </div>
                <Select
                  label="Profile Visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  options={[
                    { value: "club_private", label: "Club staff only" },
                    { value: "club_public", label: "Public within club" },
                    { value: "country", label: "Country leaderboards" },
                    { value: "international", label: "International leaderboards" },
                  ]}
                />
                <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="parentConsent"
                    checked={formData.parentConsent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />
                  <span>I confirm parental consent has been obtained if this swimmer is under 18.</span>
                </label>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/swimmers")}>Cancel</Button>
              <Button type="submit" disabled={isSaving || isLoadingClubs}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Adding..." : "Add Swimmer"}
              </Button>
            </div>
          </>
        )}
      </form>
    </DashboardLayout>
  );
}

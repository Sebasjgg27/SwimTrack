"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Save, User, MapPin, Shield, CheckCircle } from "lucide-react";

interface SwimmerFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  club: string;
  city: string;
  country: string;
  profileVisibility: string;
  email: string;
  phone: string;
}

export default function AddSwimmerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<SwimmerFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    club: "",
    city: "",
    country: "",
    profileVisibility: "club_private",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const newId = `swimmer_${Date.now()}`;
      
      const { error } = await supabase
        .from("swimmers")
        .insert({
          id: newId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          club: formData.club,
          city: formData.city,
          country: formData.country,
          profile_visibility: formData.profileVisibility,
          email: formData.email,
          phone: formData.phone,
        });

      if (error) {
        console.warn("Supabase not available, saving locally:", error.message);
        const swimmers = JSON.parse(localStorage.getItem("swimmers") || "[]");
        swimmers.push({ id: newId, ...formData });
        localStorage.setItem("swimmers", JSON.stringify(swimmers));
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/swimmers");
      }, 1500);
    } catch (err) {
      console.error("Error adding swimmer:", err);
      const swimmers = JSON.parse(localStorage.getItem("swimmers") || "[]");
      swimmers.push({ id: `swimmer_${Date.now()}`, ...formData });
      localStorage.setItem("swimmers", JSON.stringify(swimmers));
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/swimmers");
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <CheckCircle className="w-20 h-20 text-success mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Swimmer Added!</h1>
          <p className="text-slate-600">Redirecting to swimmers list...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/swimmers")}
            className="mb-4 -ml-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Swimmers
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Add New Swimmer</h1>
          <p className="text-slate-600 mt-1">Register a new swimmer to your club</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <CardTitle>Location & Club</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Club"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  placeholder="Club name"
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 300 123 4567"
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="md:col-span-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="w-5 h-5 text-accent" />
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Profile Visibility"
                name="profileVisibility"
                value={formData.profileVisibility}
                onChange={handleChange}
                options={[
                  { value: "private", label: "Private (Only club members)" },
                  { value: "club_public", label: "Club Public" },
                  { value: "country", label: "Country" },
                  { value: "international", label: "International" },
                ]}
              />
              <p className="text-sm text-slate-500">
                Controls who can see this swimmer&apos;s times and results in public leaderboards.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/swimmers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Adding..." : "Add Swimmer"}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

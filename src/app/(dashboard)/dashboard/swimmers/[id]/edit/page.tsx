"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Save, User, Calendar, MapPin, Shield } from "lucide-react";

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

const mockSwimmer = {
  id: "1",
  firstName: "Juan",
  lastName: "Perez",
  dateOfBirth: "2010-03-15",
  gender: "male",
  club: "Club Alpha",
  city: "Bogotá",
  country: "Colombia",
  profileVisibility: "country",
  email: "juan.perez@example.com",
  phone: "+57 300 123 4567",
};

export default function EditSwimmerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SwimmerFormData>({
    firstName: mockSwimmer.firstName,
    lastName: mockSwimmer.lastName,
    dateOfBirth: mockSwimmer.dateOfBirth,
    gender: mockSwimmer.gender,
    club: mockSwimmer.club,
    city: mockSwimmer.city,
    country: mockSwimmer.country,
    profileVisibility: mockSwimmer.profileVisibility,
    email: mockSwimmer.email,
    phone: mockSwimmer.phone,
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
      const { error } = await supabase
        .from("swimmers")
        .update({
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
        })
        .eq("id", params.id);

      if (error) {
        console.warn("Supabase not available, saving locally:", error.message);
        localStorage.setItem(`swimmer_${params.id}`, JSON.stringify(formData));
      }

      router.push(`/dashboard/swimmers/${params.id}`);
    } catch (err) {
      console.error("Error saving swimmer:", err);
      localStorage.setItem(`swimmer_${params.id}`, JSON.stringify(formData));
      router.push(`/dashboard/swimmers/${params.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/dashboard/swimmers/${params.id}`)}
            className="mb-4 -ml-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Edit Swimmer</h1>
          <p className="text-slate-600 mt-1">Update swimmer information</p>
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
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
              onClick={() => router.push(`/dashboard/swimmers/${params.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

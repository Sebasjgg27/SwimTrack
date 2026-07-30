"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Save, Building2, MapPin, Users, CheckCircle } from "lucide-react";

interface ClubFormData {
  name: string;
  city: string;
  country: string;
  defaultPool: string;
  website: string;
  email: string;
  phone: string;
  description: string;
}

export default function AddClubPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ClubFormData>({
    name: "",
    city: "",
    country: "CO",
    defaultPool: "SCM",
    website: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const newId = `club_${Date.now()}`;
      
      const { error } = await supabase
        .from("clubs")
        .insert({
          id: newId,
          name: formData.name,
          city: formData.city,
          country: formData.country,
          default_pool: formData.defaultPool,
          website: formData.website,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
        });

      if (error) {
        console.warn("Supabase not available, saving locally:", error.message);
        const clubs = JSON.parse(localStorage.getItem("clubs") || "[]");
        clubs.push({ id: newId, ...formData });
        localStorage.setItem("clubs", JSON.stringify(clubs));
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/clubs");
      }, 1500);
    } catch (err) {
      console.error("Error adding club:", err);
      const clubs = JSON.parse(localStorage.getItem("clubs") || "[]");
      clubs.push({ id: `club_${Date.now()}`, ...formData });
      localStorage.setItem("clubs", JSON.stringify(clubs));
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/clubs");
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Club Added!</h1>
          <p className="text-slate-600">Redirecting to clubs list...</p>
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
            onClick={() => router.push("/dashboard/clubs")}
            className="mb-4 -ml-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clubs
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Add New Club</h1>
          <p className="text-slate-600 mt-1">Register a new swimming club</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <CardTitle>Club Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Club Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter club name"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
                <Select
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={[
                    { value: "CO", label: "Colombia" },
                    { value: "US", label: "United States" },
                    { value: "ES", label: "Spain" },
                    { value: "MX", label: "Mexico" },
                    { value: "AR", label: "Argentina" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <CardTitle>Pool & Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Default Pool Type"
                name="defaultPool"
                value={formData.defaultPool}
                onChange={handleChange}
                options={[
                  { value: "SCM", label: "Short Course Meters (25m)" },
                  { value: "LCM", label: "Long Course Meters (50m)" },
                  { value: "SCY", label: "Short Course Yards (25y)" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://clubwebsite.com"
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 300 123 4567"
                />
              </div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@club.com"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Brief description of the club..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/clubs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Adding..." : "Add Club"}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle, Save } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createClubWithAdmin } from "@/lib/auth";

export default function AddClubPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "CO",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { club, error: createError } = await createClubWithAdmin(
      formData.name,
      formData.country,
      formData.city
    );

    if (createError || !club) {
      setError(createError?.message ?? "The club could not be created.");
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => router.push("/dashboard/clubs"), 900);
  };

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle className="mb-6 h-20 w-20 text-success" />
          <h1 className="text-3xl font-bold text-slate-900">Club created</h1>
          <p className="mt-2 text-slate-600">You are its first administrator.</p>
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
          onClick={() => router.push("/dashboard/clubs")}
          className="mb-4 -ml-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clubs
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create a Club</h1>
          <p className="mt-1 text-slate-600">
            You will become the administrator and can add swimmers next.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-error/40 bg-error/5 p-3 text-sm text-error">
            {error}
          </p>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Club details</CardTitle>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
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
                  { value: "BR", label: "Brazil" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clubs")}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Create Club"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

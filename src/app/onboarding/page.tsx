"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Calendar, MapPin, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { createSwimmer, getOrCreateClub, getCurrentUser } from "@/lib/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "",
    city: "",
    country: "CO",
    club: "",
    poolType: "SCM",
  });

  useEffect(() => {
    async function loadUser() {
      const { user: currentUser } = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.user_metadata?.first_name) {
          setFormData((prev) => ({
            ...prev,
            firstName: currentUser.user_metadata.first_name || "",
            lastName: currentUser.user_metadata.last_name || "",
          }));
        }
      }
    }
    loadUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const calculateIsMinor = (dob: string): boolean => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setError("");

      if (!user) {
        setError("You must be logged in to complete onboarding");
        setIsLoading(false);
        return;
      }

      const { club, error: clubError } = await getOrCreateClub(formData.club, formData.country);

      if (clubError) {
        setError("Failed to create/join club. Please try again.");
        setIsLoading(false);
        return;
      }

      const { data: swimmerData, error: swimmerError } = await createSwimmer(
        user.id,
        formData.firstName,
        formData.lastName,
        club?.id || null,
        formData.gender || null,
        formData.dateOfBirth || null,
        calculateIsMinor(formData.dateOfBirth)
      );

      if (swimmerError) {
        setError(`Failed to create swimmer profile: ${swimmerError}`);
        setIsLoading(false);
        return;
      }

      setIsComplete(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.firstName && formData.lastName;
    if (step === 2) return formData.dateOfBirth && formData.gender;
    if (step === 3) return formData.city && formData.country;
    return true;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--bg-main)" }}>
        <div className="grid-background" />
        <div className="text-center relative z-10">
          <CheckCircle className="w-20 h-20 mx-auto mb-6" style={{ color: "var(--success)" }} />
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Profile Created!</h1>
          <p style={{ color: "var(--text-secondary)" }}>Welcome to SwimTrack. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="grid-background" />
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-color)", boxShadow: "0 0 10px var(--accent-color)" }} />
            <span className="font-mono font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>
              SWIMTRACK
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-6" style={{ color: "var(--text-primary)" }}>Create Your Swimmer Profile</h1>
          <p className="mt-2 font-mono text-sm" style={{ color: "var(--text-secondary)" }}>Step {step} of 3</p>

          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="w-3 h-3 rounded-full transition-colors"
                style={s === step ? { backgroundColor: "var(--accent-color)" } : s < step ? { backgroundColor: "var(--success)" } : { background: "var(--border-color)" }}
              />
            ))}
          </div>
        </div>

        <div className="card p-8">
          {error && (
            <div className="rounded-lg p-3 flex items-center gap-2 mb-6" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <User className="w-5 h-5" style={{ color: "var(--accent-color)" }} />
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input" placeholder="Juan" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input" placeholder="Perez" />
                </div>
              </div>

              <div>
                <label className="label">Club Name (optional)</label>
                <input type="text" name="club" value={formData.club} onChange={handleChange} className="input" placeholder="Club Alpha" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Calendar className="w-5 h-5" style={{ color: "var(--accent-color)" }} />
                Personal Details
              </h2>

              <div>
                <label className="label">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" />
              </div>

              <div>
                <label className="label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="label">Default Pool Type</label>
                <select name="poolType" value={formData.poolType} onChange={handleChange} className="input">
                  <option value="SCM">Short Course Meters (25m)</option>
                  <option value="LCM">Long Course Meters (50m)</option>
                  <option value="SCY">Short Course Yards (25y)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <MapPin className="w-5 h-5" style={{ color: "var(--accent-color)" }} />
                Location
              </h2>

              <div>
                <label className="label">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" placeholder="Bogota" />
              </div>

              <div>
                <label className="label">Country</label>
                <select name="country" value={formData.country} onChange={handleChange} className="input">
                  <option value="CO">Colombia</option>
                  <option value="US">United States</option>
                  <option value="ES">Spain</option>
                  <option value="MX">Mexico</option>
                  <option value="AR">Argentina</option>
                  <option value="BR">Brazil</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? "Saving..." : step === 3 ? "Complete Profile" : "Continue"}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="font-mono text-xs uppercase tracking-wider hover:underline" style={{ color: "var(--text-secondary)" }}>
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}

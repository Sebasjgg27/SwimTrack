import { AuthProvider } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}

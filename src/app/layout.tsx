import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwimTrack - Swimming Club Management",
  description: "Manage your swimming club times, meets, training zones, and leaderboards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
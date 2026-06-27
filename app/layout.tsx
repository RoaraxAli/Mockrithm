import type { Metadata } from "next";
import { Mona_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import AuthLayout from "@/components/Authlayout";
import Preloader from "@/components/shared/Preloader";
import FooterWrapper from "@/components/shared/FooterWrapper";
import MagneticCursor from "@/components/landing/MagneticCursor";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Analytics } from "@vercel/analytics/react";

import { RootProvider } from "fumadocs-ui/provider/next";
import "fumadocs-ui/style.css";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mockrithm",
  description: "An AI-powered platform for mock interviews and admin control",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${monaSans.className} ${inter.variable} bg-background text-foreground antialiased pattern`}
        suppressHydrationWarning
      >
        <ClerkProvider
          localization={{
            userButton: {
              action__manageAccount: "Settings",
            }
          }}
          appearance={{
            variables: {
              colorPrimary: "#ffffff",
              colorBackground: "#09090b", // zinc-950
              colorText: "#ffffff",
              colorTextSecondary: "#a1a1aa", // zinc-400
              colorBorder: "#27272a", // zinc-800
              colorInputBackground: "#09090b",
              colorInputText: "#ffffff",
            }
          }}
        >
          <Preloader />
          <Analytics />
          <MagneticCursor />
          <RootProvider>
            <AuthLayout initialUserId={user?.id} initialUserName={user?.name} initialUserRole={user?.role}>
              {children}
            </AuthLayout>
          </RootProvider>
          <Toaster />
          <FooterWrapper />
        </ClerkProvider>
      </body>
    </html>
  );
}

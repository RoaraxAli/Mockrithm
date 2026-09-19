import type { Metadata } from "next";
import Script from "next/script";
import { Mona_Sans, Inter, Instrument_Serif } from "next/font/google";

import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import AuthLayout from "@/components/Authlayout";
import Preloader from "@/components/shared/Preloader";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeManager } from "@/components/theme-manager";
import "fumadocs-ui/style.css";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!window.location.pathname.startsWith('/documentation')) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${monaSans.className} ${inter.variable} ${instrumentSerif.variable} bg-background text-foreground antialiased pattern`}
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
              colorBorder: "#27272a", // zinc-800
            }
          }}
        >
          <Preloader />
          <Analytics />
          <SpeedInsights />
          <ThemeManager />
          <AuthLayout initialUserId={user?.id} initialUserName={user?.name} initialUserRole={user?.role}>
            {children}
          </AuthLayout>
          <Toaster />
        </ClerkProvider>
        <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="lazyOnload" />

      </body>
    </html>
  );
}


import type { Metadata } from "next";
import Script from "next/script";
import { Mona_Sans, Inter, Poppins, Merriweather, Playfair_Display, Lora, Roboto_Slab, Source_Sans_3, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import AuthLayout from "@/components/Authlayout";
import Preloader from "@/components/shared/Preloader";
import MagneticCursor from "@/components/landing/MagneticCursor";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeManager } from "@/components/theme-manager";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = Plus_Jakarta_Sans({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${monaSans.className} ${inter.variable} ${poppins.variable} ${merriweather.variable} ${playfairDisplay.variable} ${lora.variable} ${robotoSlab.variable} ${sourceSans3.variable} ${jetbrainsMono.variable} bg-background text-foreground antialiased pattern`}
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
          <MagneticCursor />
          <ThemeManager />
          <AuthLayout initialUserId={user?.id} initialUserName={user?.name} initialUserRole={user?.role}>
            {children}
          </AuthLayout>
          <Toaster />
        </ClerkProvider>
        <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

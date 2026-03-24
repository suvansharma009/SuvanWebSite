import type { Metadata } from "next";
import { DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  return {
    title: {
      default: `${site.name} — ${site.title}`,
      template: `%s — ${site.name}`,
    },
    description: site.tagline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${greatVibes.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imagined Cosmos — Continuing where Einstein left us",
  description:
    "Dark energy, the cosmological constant, and a proposed solution — grounded in 106 years of observation since Einstein.",
  metadataBase: new URL("https://imagined-cosmos.example.com"),
  openGraph: {
    type: "website",
    siteName: "Imagined Cosmos",
    title: "Imagined Cosmos — Continuing where Einstein left us",
    description:
      "Dark energy, the cosmological constant, and a proposed solution — grounded in 106 years of observation since Einstein.",
    url: "https://imagined-cosmos.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagined Cosmos — Continuing where Einstein left us",
    description:
      "Dark energy, the cosmological constant, and a proposed solution — grounded in 106 years of observation since Einstein.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Shared <body> className for every root layout in the app. */
export const bodyClassName = `${geistSans.variable} ${geistMono.variable} antialiased`;

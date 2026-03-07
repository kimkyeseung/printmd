import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://printmd.app"),
  title: {
    default: "printmd - Markdown to PDF",
    template: "%s | printmd",
  },
  description:
    "Edit, convert, and print Markdown in one place. Free online markdown editor with live preview, themes, and instant PDF export.",
  keywords: [
    "markdown",
    "PDF",
    "converter",
    "editor",
    "markdown to pdf",
    "print markdown",
    "online markdown editor",
    "markdown editing",
    "free markdown editor",
    "web markdown editor",
    "markdown writing tool",
    "md to pdf",
    "markdown converter",
    "free markdown tool",
    "github readme",
  ],
  authors: [{ name: "printmd" }],
  creator: "printmd",
  publisher: "printmd",
  formatDetection: {
    email: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "printmd - Markdown to PDF",
    description:
      "Edit, convert, and print Markdown in one place. Free online markdown editor with live preview, themes, and instant PDF export.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    siteName: "printmd",
    url: "https://printmd.app/en",
  },
  twitter: {
    card: "summary_large_image",
    title: "printmd - Markdown to PDF",
    description:
      "Edit, convert, and print Markdown in one place. Free online markdown editor with live preview, themes, and instant PDF export.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://printmd.app/en",
    languages: {
      "en-US": "https://printmd.app/en",
      "ko-KR": "https://printmd.app/ko",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") || "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google AdSense - must be in head for site verification */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

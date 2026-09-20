import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://printmd.app"),
  title: {
    default: "printmd - Markdown to PDF",
    template: "%s | printmd",
  },
  description:
    "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 15 themes, and no signup required.",
  // Every page under [locale] supplies its own keywords, so this array only
  // ever applies to the root-level not-found / offline pages.
  keywords: [
    "markdown to pdf",
    "md to pdf",
    "markdown converter",
    "markdown editor",
    "print markdown",
    "마크다운 PDF 변환",
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
    title: "printmd - Free Markdown to PDF Converter Online",
    description:
      "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 15 themes, and no signup required.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    siteName: "printmd",
    url: "https://printmd.app/en",
  },
  twitter: {
    card: "summary_large_image",
    title: "printmd - Free Markdown to PDF Converter Online",
    description:
      "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 15 themes, and no signup required.",
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
    other: {
      "naver-site-verification": "navere5bc71a7ce1f9d0baa47669ace0b31ff",
    },
  },
  alternates: {
    canonical: "https://printmd.app",
    languages: {
      "en-US": "https://printmd.app/en",
      "ko-KR": "https://printmd.app/ko",
      "x-default": "https://printmd.app/en",
    },
  },
};

/**
 * Pass-through root layout.
 *
 * The real document shell (<html>/<body>) lives in `app/[locale]/layout.tsx`
 * so that `lang` can come from the route param instead of a request header.
 * Reading a request header here would opt every route out of static
 * generation, since that is a dynamic API.
 *
 * Root-level pages that sit outside `[locale]` (not-found, ~offline) render
 * their own <html>/<body>.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

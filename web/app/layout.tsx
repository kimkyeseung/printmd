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
    "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 5 themes, and no signup required.",
  keywords: [
    "markdown to pdf",
    "markdown converter",
    "md to pdf",
    "convert markdown to pdf",
    "markdown pdf converter",
    "markdown to pdf online",
    "markdown to pdf free",
    "markdown export pdf",
    "markdown save as pdf",
    "markdown file to pdf",
    "markdown document to pdf",
    "md file to pdf",
    "md converter",
    "md to pdf converter",
    "md to pdf online",
    "print markdown",
    "markdown print",
    "markdown printer",
    "markdown editor",
    "online markdown editor",
    "free markdown editor",
    "web markdown editor",
    "markdown editor online free",
    "markdown editing",
    "markdown writing tool",
    "markdown viewer",
    "markdown preview",
    "markdown formatter",
    "markdown styling",
    "markdown to html",
    "readme to pdf",
    "github readme to pdf",
    "github markdown to pdf",
    "text to pdf",
    "document converter",
    "free pdf converter",
    "pdf export",
    "PDF",
    "markdown",
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
      "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 5 themes, and no signup required.",
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
      "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser. Live preview, 5 themes, and no signup required.",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "printmd",
  url: "https://printmd.app",
  sameAs: ["https://github.com/kimkyeseung/printmd"],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "printmd",
  url: "https://printmd.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://printmd.app/en?q={search_term_string}",
    "query-input": "required name=search_term_string",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

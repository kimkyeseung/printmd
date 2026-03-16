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
    // Core conversion keywords
    "markdown to pdf",
    "markdown converter",
    "md to pdf",
    "convert markdown to pdf",
    "markdown pdf converter",
    "markdown to pdf converter",
    "markdown to pdf online",
    "markdown to pdf free",
    "markdown export pdf",
    "markdown save as pdf",
    "markdown file to pdf",
    "markdown document to pdf",
    "markdown text to pdf",
    "markdown into pdf",
    // md file variations
    "md file to pdf",
    "md converter",
    "md to pdf converter",
    "md to pdf online",
    "md to pdf free",
    ".md to pdf",
    ".md file to pdf",
    "md document to pdf",
    // Free/online/best emphasis
    "free markdown to pdf converter",
    "online markdown to pdf converter",
    "best markdown to pdf converter",
    "best free markdown to pdf",
    "markdown to pdf no signup",
    "markdown to pdf no install",
    "markdown to pdf browser",
    "markdown to pdf web app",
    // Print keywords
    "print markdown",
    "markdown print",
    "markdown printer",
    "markdown print to pdf",
    "print md file",
    "print markdown file",
    // Editor keywords
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
    // Tool/generator keywords
    "markdown pdf tool",
    "markdown pdf generator",
    "markdown pdf maker",
    "markdown pdf creator",
    "generate pdf from markdown",
    "create pdf from markdown",
    "make pdf from markdown",
    "turn markdown into pdf",
    // README/GitHub
    "readme to pdf",
    "github readme to pdf",
    "github markdown to pdf",
    "readme md to pdf",
    "convert readme to pdf",
    // Use case keywords
    "markdown report to pdf",
    "markdown notes to pdf",
    "markdown resume to pdf",
    "markdown to printable pdf",
    "markdown to styled pdf",
    "markdown to beautiful pdf",
    // Alternative/comparison
    "pandoc alternative",
    "markdown to pdf without pandoc",
    "markdown to pdf without command line",
    "easy markdown to pdf",
    "simple markdown to pdf",
    // Feature keywords
    "markdown to pdf with themes",
    "markdown to pdf with styling",
    "markdown to pdf with syntax highlighting",
    // Format related
    "markdown to html",
    "text to pdf",
    "document converter",
    "free pdf converter",
    "pdf export",
    "PDF",
    "markdown",
    // Korean SEO (mixed)
    "마크다운 PDF 변환",
    "마크다운 to PDF",
    "마크다운 변환기",
    "md 파일 PDF 변환",
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
    other: {
      "naver-site-verification": "navere5bc71a7ce1f9d0baa47669ace0b31ff",
    },
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
  logo: "https://printmd.app/icon-192.png",
  description:
    "Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser.",
  sameAs: [
    "https://github.com/kimkyeseung/printmd",
    "https://chromewebstore.google.com/detail/printmd-markdown-to-pdf/aogiijhfmcpobikknoclgabgaeiamfjg",
  ],
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
      <head suppressHydrationWarning>
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

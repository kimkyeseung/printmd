import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://printmd.app"),
  title: {
    default: "printmd - Markdown to PDF",
    template: "%s | printmd",
  },
  description:
    "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구. GitHub README, 문서를 예쁘게 인쇄하세요.",
  keywords: [
    "마크다운",
    "markdown",
    "PDF",
    "변환",
    "편집기",
    "markdown editor",
    "markdown to pdf",
    "github readme",
    "print markdown",
    "마크다운 편집기",
    "마크다운 PDF 변환",
    "GitHub 마크다운",
    "무료 마크다운 도구",
  ],
  authors: [{ name: "printmd" }],
  creator: "printmd",
  publisher: "printmd",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "printmd - Markdown to PDF",
    description:
      "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "printmd",
    url: "https://printmd.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "printmd - Markdown to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "printmd - Markdown to PDF",
    description:
      "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
    images: ["/og-image.png"],
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
    canonical: "https://printmd.app",
    languages: {
      "ko-KR": "https://printmd.app",
      "en-US": "https://printmd.app/en",
    },
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "printmd",
  description:
    "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
  url: "https://printmd.app",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Markdown to PDF conversion",
    "Real-time preview",
    "5 theme presets",
    "Custom styling",
    "GitHub integration",
    "Chrome extension",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}

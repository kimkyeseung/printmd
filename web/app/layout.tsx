import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://printmd.app"),
  title: {
    default: "printmd - Markdown to PDF",
    template: "%s | printmd",
  },
  description:
    "마크다운 편집, PDF 변환, 인쇄를 한 곳에서. 설치 없이 브라우저에서 마크다운을 편집하고 스타일을 골라 바로 PDF로 뽑는 무료 웹 도구.",
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
    "md to pdf",
    "markdown converter",
    "free markdown tool",
    "마크다운 프린트",
    "마크다운 인쇄",
    "마크다운 편집",
    "온라인 마크다운",
    "마크다운 웹 편집기",
    "온라인 마크다운 편집",
    "무료 마크다운 편집기",
    "마크다운 작성",
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
      "마크다운 편집, PDF 변환, 인쇄를 한 곳에서. 설치 없이 브라우저에서 마크다운을 편집하고 스타일을 골라 바로 PDF로 뽑는 무료 웹 도구.",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "printmd",
    url: "https://printmd.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "printmd - Markdown to PDF",
    description:
      "마크다운 편집, PDF 변환, 인쇄를 한 곳에서. 설치 없이 브라우저에서 마크다운을 편집하고 스타일을 골라 바로 PDF로 뽑는 무료 웹 도구.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") || "ko";

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

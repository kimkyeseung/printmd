import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
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
    // Custom style/theme/preset keywords
    "markdown custom style",
    "markdown custom theme",
    "markdown pdf custom style",
    "markdown pdf theme preset",
    "markdown style preset",
    "markdown pdf styling preset",
    "custom markdown pdf template",
    "save markdown style",
    "markdown style template",
    "markdown pdf template",
    "markdown pdf design",
    "markdown to pdf with custom styles",
    "markdown to pdf custom theme",
    "markdown to pdf template",
    "markdown pdf layout",
    "markdown pdf custom font",
    "custom font markdown",
    "markdown font style",
    "markdown element styling",
    "markdown heading style",
    "markdown paragraph style",
    "markdown css style",
    "styled markdown",
    "styled markdown to pdf",
    "markdown to styled pdf converter",
    "markdown pdf preset save",
    "markdown pdf preset load",
    "markdown dark theme pdf",
    "markdown blog style pdf",
    "markdown document style pdf",
    "markdown minimal style",
    "personalized markdown pdf",
    "markdown pdf customization",
    "markdown pdf appearance",
    "customize markdown pdf",
    "markdown pdf font size",
    "markdown pdf color",
    "markdown pdf background color",
    "markdown pdf line height",
    "markdown pdf margin",
    "markdown pdf padding",
    // Korean SEO (mixed)
    "마크다운 PDF 변환",
    "마크다운 to PDF",
    "마크다운 변환기",
    "md 파일 PDF 변환",
    // Korean style/theme keywords
    "마크다운 스타일",
    "마크다운 테마",
    "마크다운 커스텀 스타일",
    "마크다운 프리셋",
    "마크다운 PDF 스타일",
    "마크다운 PDF 테마",
    "마크다운 PDF 커스텀",
    "마크다운 PDF 템플릿",
    "마크다운 PDF 디자인",
    "마크다운 폰트 설정",
    "마크다운 글꼴 변경",
    "마크다운 PDF 글꼴",
    "마크다운 스타일 저장",
    "마크다운 테마 저장",
    "마크다운 스타일 프리셋",
    "커스텀 마크다운 PDF",
    "마크다운 PDF 꾸미기",
    "마크다운 PDF 커스터마이징",
    "마크다운 PDF 글자 크기",
    "마크다운 PDF 색상",
    "마크다운 PDF 배경색",
    "마크다운 PDF 줄간격",
    "마크다운 PDF 여백",
    "마크다운 다크모드 PDF",
    "마크다운 블로그 스타일",
    "마크다운 문서 스타일",
    "예쁜 마크다운 PDF",
    "깔끔한 마크다운 PDF",
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
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

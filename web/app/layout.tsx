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
  title: {
    default: "printmd - Markdown to PDF",
    template: "%s | printmd",
  },
  description:
    "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
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
  ],
  authors: [{ name: "printmd" }],
  openGraph: {
    title: "printmd - Markdown to PDF",
    description:
      "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
    type: "website",
    locale: "ko_KR",
    siteName: "printmd",
  },
  twitter: {
    card: "summary_large_image",
    title: "printmd - Markdown to PDF",
    description:
      "마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

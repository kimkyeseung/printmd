import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // 압축 활성화
  compress: true,
  // 빌드 최적화
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["highlight.js", "zustand", "zundo"],
  },
  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);

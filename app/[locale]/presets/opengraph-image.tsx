import { ImageResponse } from "next/og";
import { themePresets } from "@/lib/themes/presets";
import { THEME_NAMES } from "@/types/theme";
import type { ThemePreset } from "@/types/style";

export const runtime = "edge";
export const alt = "printmd Presets - Theme Collection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const displayPresets: ThemePreset[] = [
  "default",
  "dark",
  "sepia",
  "ocean",
  "forest",
  "sunset",
  "terminal",
  "pastel",
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "white",
            }}
          >
            🎨
          </div>
          <h1
            style={{
              fontSize: "44px",
              fontWeight: "bold",
              color: "#1e293b",
              margin: 0,
            }}
          >
            printmd Presets
          </h1>
        </div>
        <p
          style={{
            fontSize: "20px",
            color: "#64748b",
            margin: "0 0 32px 0",
          }}
        >
          Beautiful theme presets for your Markdown documents
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {displayPresets.map((key) => {
            const preset = themePresets[key];
            const name = THEME_NAMES[key];
            const englishName = name.match(/\(([^)]+)\)/)?.[1] || key;

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "240px",
                  height: "160px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "16px 20px",
                    backgroundColor: preset.backgroundColor,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: preset.textColor,
                      marginBottom: "6px",
                    }}
                  >
                    Heading
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: preset.textColor,
                      opacity: 0.8,
                      lineHeight: 1.4,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: preset.linkColor,
                      marginTop: "4px",
                    }}
                  >
                    link-example
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    backgroundColor: "#f1f5f9",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  {englishName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { ...size }
  );
}

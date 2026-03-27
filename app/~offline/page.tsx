/* eslint-disable @next/next/no-html-link-for-pages */
export default function OfflinePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#0a0a0a",
        color: "#e0e0e0",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        Offline
      </h1>
      <p style={{ fontSize: "1rem", color: "#999", maxWidth: "360px", marginBottom: "2rem", lineHeight: 1.6 }}>
        This page is not available offline, but you can still use the editor.
        Your work is saved locally in the browser.
      </p>
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          borderRadius: "8px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Open Editor
      </a>
    </div>
  );
}

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
        backgroundColor: "#fafafa",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Offline
      </h1>
      <p style={{ fontSize: "1.125rem", color: "#666", maxWidth: "400px" }}>
        You are currently offline. Please check your internet connection and try
        again.
      </p>
    </div>
  );
}

import React from "react";

const BridgeStatus = ({ bridgeStatus, downloadUrl, handleReload }) => {
  if (bridgeStatus === "checking") {
    return (
      <div style={{ color: "#666" }}>🔄 Checking for Electron bridge...</div>
    );
  }

  if (bridgeStatus === "disconnected") {
    return (
      <div>
        <div style={{ color: "crimson", marginBottom: 16 }}>
          ❌ Electron Bridge Not Detected
        </div>
        <a
          href={downloadUrl}
          style={{
            display: "inline-block",
            padding: "10px 28px",
            background: "#1976d2",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
            fontSize: 16,
            marginBottom: 12,
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Electron Bridge
        </a>
        <div style={{ fontSize: 14, marginBottom: 16, color: "#333" }}>
          Please install and run the Electron app to enable system audio
          recording.
          <br />
          <button
            onClick={handleReload}
            style={{
              marginTop: 10,
              padding: "6px 18px",
              borderRadius: 8,
              border: "none",
              background: "#eee",
              color: "#444",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Reload
          </button>
        </div>
        <div style={{ fontSize: 13, color: "#777" }}>
          <b>Setup Guide:</b>
          <ol style={{ margin: "8px 0 0 20px", textAlign: "left" }}>
            <li>Install and open the Electron bridge (download above).</li>
            <li>When prompted, grant required permissions.</li>
            <li>Set up Multi-Output Device as per instructions.</li>
            <li>Reload this page after bridge is running.</li>
          </ol>
        </div>
      </div>
    );
  }

  return null;
};

export default BridgeStatus;

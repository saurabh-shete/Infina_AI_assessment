import React from "react";

export default function InstallationInstructions({
  blackholeStatus,
  setBlackholeStatus,
  blackholeGuide,
  installBlackhole,
  blackholeDeviceIndex,
}) {
  const reloadPage = () => window.location.reload();

  if (blackholeStatus === "blackhole_missing") {
    return (
      <div>
        <div style={{ color: "orange", marginBottom: 12 }}>
          ⚠️ BlackHole not detected.
        </div>
        <a
          href={blackholeGuide}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginBottom: 12,
            color: "#1976d2",
          }}
        >
          BlackHole Download & Setup Guide
        </a>
        <br />
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 16,
            border: "none",
            margin: "10px 0",
            cursor: "pointer",
          }}
          onClick={() => setBlackholeStatus("installing_blackhole_only")}
        >
          Install BlackHole Only
        </button>
        <div style={{ fontSize: 13, color: "#777", marginTop: 8 }}>
          <b>Note:</b> You may need to enter your password and reboot after
          installation.
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={reloadPage}
            style={{
              padding: "6px 18px",
              borderRadius: 8,
              border: "none",
              background: "#eee",
              color: "#444",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blackholeStatus === "both_missing") {
    return (
      <div>
        <div style={{ color: "crimson", marginBottom: 12 }}>
          ⚠️ Both BlackHole and ffmpeg not detected.
        </div>
        <a
          href={blackholeGuide}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginBottom: 12,
            color: "#1976d2",
          }}
        >
          BlackHole Download & Setup Guide
        </a>
        <br />
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 16,
            border: "none",
            margin: "10px 0",
            cursor: "pointer",
          }}
          onClick={installBlackhole}
        >
          Install Both BlackHole & ffmpeg
        </button>
        <div style={{ fontSize: 13, color: "#777", marginTop: 8 }}>
          <b>Note:</b> You may need to enter your password and reboot after
          installation.
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={reloadPage}
            style={{
              padding: "6px 18px",
              borderRadius: 8,
              border: "none",
              background: "#eee",
              color: "#444",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blackholeStatus === "not_installed") {
    return (
      <div>
        <div style={{ color: "crimson", marginBottom: 12 }}>
          ⚠️ BlackHole not detected.
        </div>
        <a
          href={blackholeGuide}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginBottom: 12,
            color: "#1976d2",
          }}
        >
          BlackHole Download & Setup Guide
        </a>
        <br />
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 16,
            border: "none",
            margin: "10px 0",
            cursor: "pointer",
          }}
          onClick={installBlackhole}
        >
          Install BlackHole Automatically
        </button>
        <div style={{ fontSize: 13, color: "#777", marginTop: 8 }}>
          <b>Note:</b> You may need to enter your password and reboot after
          installation.
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={reloadPage}
            style={{
              padding: "6px 18px",
              borderRadius: 8,
              border: "none",
              background: "#eee",
              color: "#444",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blackholeStatus === "installing_blackhole_only") {
    return (
      <div>
        <div
          style={{
            color: "#1976d2",
            marginBottom: 12,
            fontWeight: "bold",
          }}
        >
          📋 BlackHole Installation Only
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "left",
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Run these commands in Terminal:
          </div>
          <div style={{ marginBottom: 8, color: "#0066cc" }}>
            1. brew install blackhole-2ch
          </div>
          <div style={{ marginBottom: 8, color: "#0066cc" }}>
            2. sudo killall coreaudiod
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
            3. Open "Audio MIDI Setup" from Applications → Utilities
            <br />
            4. If BlackHole is not visible, reboot your system
            <br />
            5. After installation, click "Retry" below
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => setBlackholeStatus("blackhole_missing")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              marginRight: 8,
            }}
          >
            ← Back
          </button>
          <button
            onClick={reloadPage}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blackholeStatus === "installing") {
    return (
      <div>
        <div
          style={{
            color: "#1976d2",
            marginBottom: 12,
            fontWeight: "bold",
          }}
        >
          📋 Installation Instructions
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "left",
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Run these commands in Terminal:
          </div>
          <div style={{ marginBottom: 8, color: "#0066cc" }}>
            1. brew install blackhole-2ch
          </div>
          <div style={{ marginBottom: 8, color: "#0066cc" }}>
            2. brew install ffmpeg
          </div>
          <div style={{ marginBottom: 8, color: "#0066cc" }}>
            3. sudo killall coreaudiod
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
            4. Verify ffmpeg installation:
            <div style={{ color: "#0066cc", marginTop: 4 }}>
              ffmpeg -version
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            5. Find BlackHole device index:
            <div style={{ color: "#0066cc", marginTop: 4 }}>
              ffmpeg -f avfoundation -list_devices true -i ""
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              Look for "BlackHole 2ch" in the output (usually index [1])
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
            6. Open "Audio MIDI Setup" from Applications → Utilities
            <br />
            7. If BlackHole is not visible, reboot your system
            <br />
            8. After installation, click "Retry" below
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => setBlackholeStatus("not_installed")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              marginRight: 8,
            }}
          >
            ← Back
          </button>
          <button
            onClick={reloadPage}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blackholeStatus === "device_index_wrong") {
    return (
      <div>
        <div style={{ color: "orange", marginBottom: 12 }}>
          ⚠️ BlackHole device is at ID {blackholeDeviceIndex}, but it was not
          found properly
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "left",
            background: "#fff3cd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            border: "1px solid #ffeaa7",
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            📋 Verify BlackHole Device Index:
          </div>
          <div style={{ marginBottom: 8, color: "#666" }}>
            Run this command to check device order:
          </div>
          <div
            style={{
              color: "#0066cc",
              marginBottom: 8,
              fontFamily: "monospace",
            }}
          >
            ffmpeg -f avfoundation -list_devices true -i ""
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Expected response should include:
            <br />
            <div
              style={{
                fontFamily: "monospace",
                color: "#333",
                marginTop: 4,
              }}
            >
              BlackHole 2ch device with proper ID
              <br />
              Other audio devices
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#d63031" }}>
            If BlackHole is not detected properly, you may need to restart your
            system or reinstall BlackHole.
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={reloadPage}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Retry Check
          </button>
        </div>
      </div>
    );
  }

  return null;
}

import React from "react";

export default function RecordingControls({
  isRecording,
  startRecording,
  stopRecording,
  log,
  recordedFileUrl,
}) {
  return (
    <>
      {/* Recording controls */}
      <button
        style={{
          background: isRecording ? "#f44336" : "#1976d2",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 8,
          fontSize: 18,
          border: "none",
          cursor: "pointer",
          margin: "8px 0",
          width: "100%",
        }}
        disabled={isRecording}
        onClick={startRecording}
      >
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      <button
        style={{
          background: "#333",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 8,
          fontSize: 18,
          border: "none",
          cursor: "pointer",
          margin: "8px 0",
          width: "100%",
          opacity: isRecording ? 1 : 0.6,
        }}
        disabled={!isRecording}
        onClick={stopRecording}
      >
        Stop Recording
      </button>
      <div style={{ fontSize: 14, margin: "8px 0", color: "#333" }}>{log}</div>
      {recordedFileUrl && (
        <div style={{ marginTop: 18 }}>
          <a
            href={recordedFileUrl}
            download="system-audio.m4a"
            style={{
              color: "#1976d2",
              fontWeight: 500,
              fontSize: 16,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            ⬇️ Download Recorded Audio
          </a>
        </div>
      )}
    </>
  );
}

import React from "react";

export default function DeviceSelection({
  availableDevices,
  selectedRecordingDevice,
  setSelectedRecordingDevice,
}) {
  return (
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Select Recording Device:</strong>
        <p style={{ fontSize: 14, color: "#666", margin: "4px 0 8px 0" }}>
          Multi-output device (BlackHole + Speakers) is automatically created
          and selected for optimal recording.
        </p>
        <select
          value={selectedRecordingDevice}
          onChange={(e) => setSelectedRecordingDevice(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc",
            marginTop: 4,
          }}
        >
          <option value="">Select a device...</option>
          {availableDevices.input.map((device, index) => (
            <option key={index} value={device.name}>
              {device.name} (ID: {device.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

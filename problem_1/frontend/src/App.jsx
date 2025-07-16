import React, { useEffect, useState } from "react";
import axios from "axios";
import BridgeStatus from "./components/BridgeStatus";
import BlackHoleStatus from "./components/BlackHoleStatus";
import DeviceSelection from "./components/DeviceSelection";
import RecordingControls from "./components/RecordingControls";
import BridgeDisconnected from "./components/BridgeDisconnected";

const BRIDGE_URL = "http://localhost:3005"; // Electron bridge server URL

export default function App() {
  const [bridgeStatus, setBridgeStatus] = useState("checking");
  const [blackholeStatus, setBlackholeStatus] = useState("checking");
  const [blackholeDeviceIndex, setBlackholeDeviceIndex] = useState(null);
  const [availableDevices, setAvailableDevices] = useState({
    input: [],
    output: [],
  });
  const [selectedRecordingDevice, setSelectedRecordingDevice] = useState("");
  const [multiOutputName] = useState("My Multi-Output");
  const [isRecording, setIsRecording] = useState(false);
  const [log, setLog] = useState("");
  const [downloadUrl] = useState("https://yourdomain.com/electron-bridge.dmg");
  const [blackholeGuide] = useState(
    "https://github.com/ExistentialAudio/BlackHole" // Official BlackHole link
  );
  const [recordedFileUrl, setRecordedFileUrl] = useState(null);

  // Check if the Electron bridge is running
  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/status`);
        if (res.data && res.data.status === "ok") setBridgeStatus("connected");
        else setBridgeStatus("disconnected");
      } catch {
        setBridgeStatus("disconnected");
      }
    };
    checkBridge();
  }, []);

  // Check if BlackHole is installed and get device information
  useEffect(() => {
    // Auto-create multi-output device with BlackHole and speakers
    const autoCreateMultiOutput = async (devices, blackholeDevice) => {
      try {
        // Find MacBook Air Speakers or similar speaker device
        const speakerDevice = devices.find(
          (device) =>
            device.name.toLowerCase().includes("speaker") ||
            device.name.toLowerCase().includes("macbook") ||
            device.name.toLowerCase().includes("built-in")
        );

        if (!speakerDevice) {
          setLog("⚠️ Could not find speaker device for multi-output creation.");
          setSelectedRecordingDevice("BlackHole 2ch");
          return;
        }

        // Create multi-output with BlackHole and speakers
        const deviceNames = [blackholeDevice.name, speakerDevice.name];
        setLog("Auto-creating multi-output device...");

        const res = await axios.post(`${BRIDGE_URL}/create-multi-output`, {
          deviceNames: deviceNames,
          multiOutputName: multiOutputName,
        });

        if (res.data.ok) {
          if (res.data.message && res.data.message.includes("already exists")) {
            setLog(
              `ℹ️ Multi-output device "${multiOutputName}" already exists.`
            );
          } else {
            setLog(
              `✅ Multi-output device "${multiOutputName}" created automatically.`
            );
          }

          // Refresh devices to get the newly created multi-output device
          await refreshDevicesAndSetRecording();
        } else {
          setLog(
            `❌ Failed to auto-create multi-output device: ${res.data.message}`
          );
          setSelectedRecordingDevice("BlackHole 2ch");
        }
      } catch (error) {
        setLog(
          "❌ Failed to auto-create multi-output device: " + error.message
        );
        setSelectedRecordingDevice("BlackHole 2ch");
      }
    };

    // Refresh devices and set the multi-output as recording device
    const refreshDevicesAndSetRecording = async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/check-blackhole`);
        if (res.data && res.data.devices) {
          setAvailableDevices({
            input: res.data.devices,
            output: res.data.devices,
          });

          // Find the newly created multi-output device
          const multiOutputDevice = res.data.devices.find(
            (device) => device.name === multiOutputName
          );

          if (multiOutputDevice) {
            setSelectedRecordingDevice(multiOutputDevice.name);
            setLog(`🎯 Recording device set to "${multiOutputDevice.name}"`);
          } else {
            setSelectedRecordingDevice("BlackHole 2ch");
          }
        }
      } catch (error) {
        setLog("Failed to refresh devices: " + error.message);
        setSelectedRecordingDevice("BlackHole 2ch");
      }
    };

    const checkBlackhole = async () => {
      if (bridgeStatus !== "connected") return;
      setBlackholeStatus("checking");
      try {
        const res = await axios.get(`${BRIDGE_URL}/check-blackhole`);
        if (res.data) {
          const { blackholeInstalled, devices } = res.data;

          // Store available devices
          if (devices) {
            setAvailableDevices({
              input: devices, // Use devices for input recording
              output: devices, // Use devices for output selection
            });
          }

          if (blackholeInstalled) {
            // Find BlackHole device
            const blackholeDevice = devices?.find(
              (device) => device.name === "BlackHole 2ch"
            );

            if (blackholeDevice) {
              setBlackholeDeviceIndex(blackholeDevice.id);
              setBlackholeStatus("installed");

              // Auto-create multi-output device with BlackHole and speakers
              await autoCreateMultiOutput(devices, blackholeDevice);
            } else {
              setBlackholeStatus("device_index_wrong");
            }
          } else {
            setBlackholeStatus("blackhole_missing");
          }
        } else {
          setBlackholeStatus("not_installed");
        }
      } catch {
        setBlackholeStatus("not_installed");
      }
    };
    checkBlackhole();
  }, [bridgeStatus, multiOutputName]);

  // Start recording
  const startRecording = async () => {
    if (!selectedRecordingDevice) {
      setLog("⚠️ Please select a recording device.");
      return;
    }

    setIsRecording(true);
    setLog("Starting recording...");
    setRecordedFileUrl(null);
    try {
      await axios.post(`${BRIDGE_URL}/start-recording`, {
        deviceName: selectedRecordingDevice,
        multiOutputName: multiOutputName,
      });
      setLog("Recording started. Play any system audio!");
    } catch (e) {
      setLog("Failed to start recording: " + e.message);
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    setLog("Stopping recording...");
    try {
      const res = await axios.post(`${BRIDGE_URL}/stop-recording`);
      setLog("Recording stopped.");
      if (res.data && res.data.fileUrl) {
        setRecordedFileUrl(`${res.data.fileUrl}`);
      }
    } catch (e) {
      setLog("Failed to stop recording: " + e.message);
    }
    setIsRecording(false);
  };

  // Handle page reload
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "Inter, sans-serif",
        background: "#f7f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 0 16px 0",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "50%",
          padding: 32,
          textAlign: "center",
          color: "#333", // Add default text color
        }}
      >
        <h1 style={{ color: "#333", margin: "0 0 20px 0" }}>
          macOS System Audio Recorder
        </h1>

        <BridgeStatus bridgeStatus={bridgeStatus} />

        {bridgeStatus === "connected" && (
          <>
            <BlackHoleStatus
              blackholeStatus={blackholeStatus}
              blackholeGuide={blackholeGuide}
              setBlackholeStatus={setBlackholeStatus}
              blackholeDeviceIndex={blackholeDeviceIndex}
            />

            {blackholeStatus === "installed" && (
              <>
                <div style={{ color: "green", marginBottom: 12 }}>
                  ✅ BlackHole Detected!
                </div>

                <DeviceSelection
                  availableDevices={availableDevices}
                  selectedRecordingDevice={selectedRecordingDevice}
                  setSelectedRecordingDevice={setSelectedRecordingDevice}
                />

                <RecordingControls
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  log={log}
                  recordedFileUrl={recordedFileUrl}
                />
              </>
            )}
          </>
        )}

        {bridgeStatus === "disconnected" && (
          <BridgeDisconnected
            downloadUrl={downloadUrl}
            handleReload={handleReload}
          />
        )}
      </div>
      <footer
        style={{
          marginTop: 60,
          color: "#bbb",
          fontSize: 15,
          letterSpacing: "0.2px",
        }}
      >
        &copy; {new Date().getFullYear()} System Audio Recorder
      </footer>
    </div>
  );
}

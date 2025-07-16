const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { CLI_PATH } = require("./utils");

const AUDIO_DIR = path.join(__dirname, "files");
const HTTP_PORT = 3005;

const api = express();
api.use(cors());
api.use(express.json());
api.use("/files", express.static(AUDIO_DIR));

api.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

api.get("/check-blackhole", (req, res) => {
  exec("brew list | grep blackhole", (err1, stdout1) => {
    const blackholeInstalled = !!stdout1 && stdout1.includes("blackhole");
    exec(`${CLI_PATH} list-devices --json`, (err2, stdout2, stderr2) => {
      if (err2) {
        return res
          .status(500)
          .json({ ok: false, error: stderr2 || err2.message });
      }
      let devices = [];
      try {
        devices = JSON.parse(stdout2);
      } catch (e) {
        return res.status(500).json({
          ok: false,
          error: "Failed to parse device JSON",
          rawOutput: stdout2,
        });
      }
      res.json({
        blackholeInstalled,
        devices,
        rawOutput: stdout2,
      });
    });
  });
});

let selectedAudioDeviceIndex = null;

api.post("/set-audio-device", (req, res) => {
  const { deviceIndex } = req.body;
  if (typeof deviceIndex === "undefined" || deviceIndex === null) {
    return res
      .status(400)
      .json({ ok: false, error: "deviceIndex is required" });
  }
  selectedAudioDeviceIndex = deviceIndex;
  res.json({ ok: true, selectedAudioDeviceIndex });
});

let isRecording = false;
let currentRecordingFile = null;
let ffmpegProcess = null;
let recordPid = null;

api.post("/start-recording", (req, res) => {
  if (isRecording) return res.status(400).json({ error: "Already recording" });
  const deviceName = req.body.deviceName || "BlackHole 2ch";
  const filename = `recording-${Date.now()}.m4a`;
  const filepath = path.join(AUDIO_DIR, filename);
  const cliCmd = `${CLI_PATH} record "${deviceName}" "${filepath}"`;
  process = exec(cliCmd, (err, stdout, stderr) => {
    console.log(stdout);

    if (err) {
      isRecording = false;
      currentRecordingFile = null;
      process = null;
      recordPid = null;
      return;
    }
    // Optionally handle process completion
  });
  recordPid = process.pid;
  isRecording = true;
  currentRecordingFile = filepath;
  res.json({ ok: true, filepath, cliCmd, pid: recordPid });
});

api.post("/stop-recording", (req, res) => {
  if (!isRecording) return res.status(400).json({ error: "Not recording" });
  exec(`${CLI_PATH} stop ${recordPid || ""}`, (err, stdout, stderr) => {
    // Optionally handle errors, but always return fileUrl
    console.log(stdout);

    isRecording = false;
    recordPid = null;
    const fileName = currentRecordingFile
      ? path.basename(currentRecordingFile)
      : null;
    const fileUrl = fileName
      ? `http://localhost:${HTTP_PORT}/files/${fileName}`
      : null;
    res.json({ ok: true, fileUrl });
  });
});

api.post("/create-multi-output", (req, res) => {
  const { deviceNames, multiOutputName } = req.body;
  if (!Array.isArray(deviceNames) || !multiOutputName) {
    return res.status(400).json({
      ok: false,
      error: "deviceNames (array) and multiOutputName are required",
    });
  }
  exec(`${CLI_PATH} list-devices --json`, (err, stdout, stderr) => {
    if (err)
      return res.status(500).json({ ok: false, error: stderr || err.message });
    let devices = [];
    try {
      devices = JSON.parse(stdout);
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: "Failed to parse device JSON",
        rawOutput: stdout,
      });
    }

    const exists = devices.some((d) => d.name === multiOutputName);

    if (exists) {
      return res.json({
        ok: true,
        message: "Multi-output device already exists",
        multiOutputName,
      });
    }
    const cliCmd = `${CLI_PATH} create-multi-output ${deviceNames
      .map((n) => `"${n}"`)
      .join(" ")} "${multiOutputName}"`;
    exec(cliCmd, (err2, stdout2, stderr2) => {
      if (err2)
        return res
          .status(500)
          .json({ ok: false, error: stderr2 || err2.message });
      res.json({
        ok: true,
        message: "Multi-output device created",
        multiOutputName,
      });
    });
  });
});

module.exports = api;

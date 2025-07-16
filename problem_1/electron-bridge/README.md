# Electron Bridge

This project is an Electron-based bridge that exposes a local HTTP API for audio device management and recording on macOS. It leverages a custom Swift CLI (`MacAudioCLI`) for interacting with macOS audio devices, and provides endpoints for use by frontend or automation tools.

## Features

- **Express HTTP API**: Endpoints for device listing, BlackHole check, audio device selection, recording, and multi-output device creation.
- **Electron**: Runs as a background process, optionally with a minimal UI.
- **macOS Audio Management**: Uses the Swift CLI `MacAudioCLI` to interact with system audio devices.
- **Recording**: Records audio from selected devices and serves files via HTTP. PID of the recording process is tracked and used for stopping.
- **Multi-input/Output Device Creation**: Automates creation of multi-input/output devices for advanced routing.

## Tech Stack

- **Electron**: Desktop runtime for Node.js apps.
- **Express**: HTTP server for API endpoints.
- **Node.js**: Backend logic and process management.
- **Swift CLI (`MacAudioCLI`)**: External tool for macOS audio device control and recording.
- **BlackHole**: macOS virtual audio driver (checked via Homebrew).

## API Endpoints

- `GET /status`: Health check.
- `GET /check-blackhole`: Checks if BlackHole is installed and lists audio devices (JSON).
- `POST /set-audio-device`: Sets the selected audio device index.
- `POST /start-recording`: Starts recording from the selected device. Returns file path, CLI command, and PID.
- `POST /stop-recording`: Stops recording using the CLI stop command and provides file URL.
- `POST /create-multi-output`: Creates a multi-output device if it doesn't exist.
- `POST /create-multi-input`: Creates a multi-input device using device UIDs if it doesn't exist.
- `GET /files/*`: Serves recorded audio files.

## Setup

1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Run Electron Bridge**:
   ```sh
   npm start
   ```

## Requirements

- macOS
- Node.js & npm
- Swift (for building MacAudioCLI)
- BlackHole (install via Homebrew: `brew install blackhole`)

## File Structure

- `src/index.js`: Main Electron/Express entry point
- `src/routes.js`: API route handlers
- `src/utils.js`: Shared helpers (e.g., CLI path)
- `src/files/`: Directory for recorded audio files
- `MacAudioCLI/`: Swift CLI for audio device management and recording

## Notes

- The Electron window is hidden by default; only the API runs.
- All audio device operations and recording are performed via the Swift CLI.
- The PID of the recording process is tracked and used for stopping.
- Make sure `MacAudioCLI` is built and available at the expected path.

## License

MIT

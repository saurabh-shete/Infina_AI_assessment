# macOS System Audio Recorder

A modern React-based frontend application for recording system audio on macOS. This application provides an intuitive interface for capturing high-quality audio from your Mac's system output using BlackHole virtual audio driver.

![macOS System Audio Recorder](https://img.shields.io/badge/Platform-macOS-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple.svg)

## Features

✨ **Automated Setup**: Automatically creates and configures multi-output audio devices  
🎯 **Smart Device Detection**: Intelligently detects BlackHole and speaker devices  
🔄 **Real-time Status**: Live status updates for bridge connection and audio devices  
🎵 **High-Quality Recording**: Capture system audio with optimal quality settings  
🖥️ **Modern UI**: Clean, responsive interface with real-time feedback  
⚡ **Fast Setup**: Minimal configuration required - just install dependencies and run

## Prerequisites

Before running this application, ensure you have the following installed:

### Required Software

1. **Node.js** (v16.0.0 or higher)

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **BlackHole Audio Driver**

   - Download from [GitHub - ExistentialAudio/BlackHole](https://github.com/ExistentialAudio/BlackHole)
   - Install the 2-channel version (BlackHole 2ch)
   - This creates a virtual audio device for system audio capture

3. **Electron Bridge Server**
   - A separate backend service that handles macOS audio device management
   - Must be running on `http://localhost:3005`
   - Download from: `https://yourdomain.com/electron-bridge.dmg` (update URL as needed)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

## Usage

### Initial Setup

1. **Bridge Connection**: The app automatically checks for the Electron bridge server connection
2. **BlackHole Detection**: Verifies BlackHole installation and device availability
3. **Auto-Configuration**: Automatically creates a multi-output device combining BlackHole and your speakers

### Recording Audio

1. **Device Selection**: The app automatically selects the optimal recording device (usually the auto-created multi-output device)
2. **Start Recording**: Click "Start Recording" to begin capturing system audio
3. **Play Audio**: Play any audio on your Mac - music, videos, notifications, etc.
4. **Stop Recording**: Click "Stop Recording" when finished
5. **Download**: Access your recorded file via the provided download link

### Multi-Output Device

The application automatically creates a multi-output device called "My Multi-Output" that combines:

- **BlackHole 2ch**: Captures the audio for recording
- **Built-in Speakers/MacBook Speakers**: Allows you to hear the audio normally

This setup enables simultaneous audio playback and recording without any manual configuration.

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles
├── App.css                # Component-specific styles
└── components/
    ├── BridgeStatus.jsx       # Bridge connection status
    ├── BlackHoleStatus.jsx    # BlackHole installation status
    ├── DeviceSelection.jsx    # Audio device selection interface
    ├── RecordingControls.jsx  # Recording start/stop controls
    ├── BridgeDisconnected.jsx # Disconnection handling
    └── InstallationInstructions.jsx # Setup guidance
```

## Component Overview

### Core Components

- **`App.jsx`**: Main application logic, state management, and API communication
- **`BridgeStatus`**: Displays connection status with the Electron bridge server
- **`BlackHoleStatus`**: Shows BlackHole installation status and provides installation guidance
- **`DeviceSelection`**: Simplified interface showing the selected recording device
- **`RecordingControls`**: Start/stop recording functionality with real-time feedback
- **`BridgeDisconnected`**: Error handling and reconnection guidance

### Key Features

- **Automated Device Management**: No manual device configuration required
- **Real-time Status Updates**: Live feedback on connection and device status
- **Error Handling**: Comprehensive error messages and recovery suggestions
- **Responsive Design**: Works seamlessly across different screen sizes

## API Integration

The frontend communicates with an Electron bridge server running on `localhost:3005`. Key endpoints:

- `GET /status` - Check bridge server status
- `GET /check-blackhole` - Verify BlackHole installation and get device list
- `POST /create-multi-output` - Create multi-output audio device
- `POST /start-recording` - Begin audio recording
- `POST /stop-recording` - Stop recording and get file URL

## Configuration

### Environment Variables

You can customize the bridge server URL by modifying the `BRIDGE_URL` constant in `src/App.jsx`:

```javascript
const BRIDGE_URL = "http://localhost:3005"; // Change if needed
```

### Multi-Output Device Name

The default multi-output device name can be changed in `src/App.jsx`:

```javascript
const [multiOutputName] = useState("My Multi-Output"); // Customize as needed
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Troubleshooting

### Common Issues

**Bridge Connection Failed**

- Ensure the Electron bridge server is running on port 3005
- Check firewall settings that might block local connections
- Verify the bridge server URL in the application settings

**BlackHole Not Detected**

- Download and install BlackHole from the official repository
- Restart your Mac after installation
- Check System Preferences > Sound to verify BlackHole appears in device list

**No Speaker Device Found**

- The app automatically detects built-in speakers or external audio devices
- If detection fails, check that your audio output device is properly connected
- Try reconnecting external speakers or headphones

**Recording Issues**

- Ensure the selected recording device is the multi-output device
- Check that system audio is actually playing during recording
- Verify that the bridge server has proper permissions for audio access

### Debug Mode

Enable verbose logging by opening browser developer tools (F12) to see detailed API communication and error messages.

## Dependencies

### Production Dependencies

- **React 19.1.0**: Modern React with latest features
- **React DOM 19.1.0**: React rendering for web
- **Axios 1.10.0**: HTTP client for API communication

### Development Dependencies

- **Vite 7.0.4**: Fast build tool and development server
- **ESLint 9.30.1**: Code linting and quality assurance
- **TypeScript Types**: Type definitions for React components

## Browser Compatibility

- **Chrome**: 88+ (recommended)
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Create a pull request with a clear description

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the [BlackHole documentation](https://github.com/ExistentialAudio/BlackHole)
3. Create an issue in the repository with detailed information about your problem

## Acknowledgments

- [ExistentialAudio](https://github.com/ExistentialAudio) for the excellent BlackHole virtual audio driver
- React team for the robust frontend framework
- Vite team for the lightning-fast development experience

---

**Note**: This application is designed specifically for macOS and requires macOS-specific audio drivers and permissions. It will not work on Windows or Linux systems.

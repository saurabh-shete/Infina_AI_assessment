# MacAudioCLI

A Swift command-line tool for macOS to manage audio devices and record system audio using CoreAudio and AVFoundation.

## Build

To build the CLI, run:

```
swift build -c release
```

The compiled binary will be located at:

```
.build/release/MacAudioCLI
```

## Features

- List input and output audio devices (with JSON output option)
- Create aggregate (multi-output and multi-input) devices
- Record system audio (not microphone) by routing through virtual devices like BlackHole
- Stop recording via SIGINT (Ctrl+C or programmatically via PID)
- Set default output device (e.g., "Speaker") after recording

## Requirements

- macOS
- Swift (tested with Swift 5)
- Xcode command line tools
- [BlackHole](https://existential.audio/blackhole/) or similar virtual audio device for system audio capture

## Usage

### List Devices

```
./MacAudioCLI list-devices [--json]
```

Lists all output devices. Use `--json` for machine-readable output.

### Get Device Name by Index

```
./MacAudioCLI get-device-name <index>
```

Returns the name of the device at the given index.

### Create Multi-Output Device

```
./MacAudioCLI create-multi-output <device1> <device2> ... <output-device-name>
```

Creates an aggregate output device from the listed devices.

### Create Multi-Input Device

```
./MacAudioCLI create-multi-input <device1> <device2> ... <input-device-name>
```

Creates an aggregate input device from the listed devices.

### Record System Audio

```
./MacAudioCLI record <deviceName> <outputFile>
```

Records audio from the specified output device (e.g., BlackHole) to the given file. Prints the process PID in JSON for programmatic control.

### Stop Recording and Reset Output Device

```
./MacAudioCLI stop <pid>
```

Sends SIGINT to the recording process with the given PID and sets the default output device to "Speaker" (usually Internal Speakers).

## Example Workflow

1. List devices and find your virtual device (e.g., BlackHole):
   ```
   ./MacAudioCLI list-devices --json
   ```
2. Start recording system audio:
   ```
   ./MacAudioCLI record "BlackHole" output.m4a
   ```
   Note the PID from the JSON response.
3. Stop recording and reset output device:
   ```
   ./MacAudioCLI stop <pid>
   ```

## Notes

- Aggregate devices do not need to be stopped after creation.
- Recording stops gracefully on SIGINT (Ctrl+C or programmatically).
- Always set your desired output device after recording to restore normal audio routing.

## License

MIT

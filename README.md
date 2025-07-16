## **Design Decisions & Explanation**

### **Why use BlackHole (or any virtual audio driver)?**

- macOS **does not expose system output audio** as a recordable stream for privacy and security.
- **Virtual audio devices** like BlackHole act as a bridge: audio output is duplicated and can be recorded by other apps.
- BlackHole is **open source, free, and reliable**.

### **Why Electron for UI/Bridge?**

- Electron enables a cross-platform, web-like UI and easy API bridging to native code (Swift/ffmpeg).

### **Why Swift CLI for recording?**

- **Swift CLI**: Deeper native integration, allows for device management, custom UIs, and easier App Store distribution in the future.

## **Trade-offs and Limitations**

- **User setup friction:**

  - Users must install BlackHole and either manually or semi-automatically configure a Multi-Output Device in Audio MIDI Setup.
  - Apple **does not allow** any tool to programmatically set the system audio output device; user must still select it.

- **No “one-click” install:**

  - Full automation is impossible without native code and user permissions (and still, some steps require user action for security reasons).

- **Virtual device required:**

  - There is **no way to record system audio on macOS without a virtual audio driver** (not even with Swift, C, or App Store entitlements).

- **App Store**:

  - Apple generally allows apps that use BlackHole or Soundflower, but not apps that stealthily capture system audio. Clear user consent is required.

## **Future Steps & “Build Your Own” Possibilities**

- **Build a custom CoreAudio HAL plugin:**

  - Technically possible (see [BlackHole’s source](https://github.com/ExistentialAudio/BlackHole)), but very complex.
  - Requires low-level audio engineering, signing, entitlements, and maintenance.

- **Native device manager UI:**

  - Expand your Swift CLI into a full GUI app that creates and manages Multi-Output Devices, auto-selects output, and provides troubleshooting.

- **App Store polish:**

  - Integrate device creation, user guidance, and permissions in a seamless onboarding flow for users.

- **Use ScreenCaptureKit (partial solution):**

  - For specific app audio capture (not system-wide), Swift’s ScreenCaptureKit lets you grab audio output from a specific app window (not total system audio).

- **Package BlackHole installer inside your app:**

  - Automate more of the installation flow, but always provide clear guidance and reboot prompts.

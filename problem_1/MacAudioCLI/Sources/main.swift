import Foundation
import AVFoundation
import CoreAudio
import AudioToolbox

// Add Dispatch to use DispatchSourceSignal
import Dispatch

enum Command: String {
    case createMultiOutput = "create-multi-output"
    case record = "record"
    case listDevices = "list-devices"
    case help = "help"
    case getDeviceName = "get-device-name"
    case stop = "stop" // Added stop command
}

// MARK: - Multi-Output Device Creation

func createMultiOutputDevice(deviceNames: [String], newDeviceName: String) {
    // 1. Find all output audio device UIDs by name
    let allDevices = getAllOutputDevices()
    var subDevices: [CFString] = []
    var masterUID: CFString? = nil

    for name in deviceNames {
        if let d = allDevices.first(where: { $0.name.contains(name) }) {
            subDevices.append(d.uid as CFString)
            if masterUID == nil { masterUID = d.uid as CFString }
        }
    }
    guard subDevices.count == deviceNames.count, let master = masterUID else {
        print("Could not find all devices: \(deviceNames)")
        exit(1)
    }
    // 2. Prepare properties dictionary
    let newUID = UUID().uuidString as CFString
    let subDeviceDicts: [[CFString: Any]] = subDevices.map { [kAudioSubDeviceUIDKey as CFString: $0] }
    
    let props: [CFString: Any] = [
        kAudioAggregateDeviceNameKey as CFString: newDeviceName as CFString,
        kAudioAggregateDeviceUIDKey as CFString: newUID,
        kAudioAggregateDeviceSubDeviceListKey as CFString: subDeviceDicts,
        kAudioAggregateDeviceMasterSubDeviceKey as CFString: master,
        kAudioAggregateDeviceIsStackedKey as CFString: NSNumber(value: 1)
    ]


    var newDeviceID = AudioDeviceID()
    let status = AudioHardwareCreateAggregateDevice(props as CFDictionary, &newDeviceID)
    if status == 0 {
        print("✅ Multi-Output Device \"\(newDeviceName)\" created successfully.")
    } else {
        print("❌ Error: Could not create device (status \(status))")
        exit(2)
    }
}

struct AudioDevice {
    let id: AudioDeviceID
    let uid: String
    let name: String
}

// Get all output devices with name and UID
func getAllOutputDevices() -> [AudioDevice] {
    var devices: [AudioDevice] = []
    var dataSize: UInt32 = 0
    var propertyAddress = AudioObjectPropertyAddress(
        mSelector: kAudioHardwarePropertyDevices,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMain
    )
    guard AudioObjectGetPropertyDataSize(
        AudioObjectID(kAudioObjectSystemObject),
        &propertyAddress,
        0,
        nil,
        &dataSize
    ) == 0 else { return devices }
    let deviceCount = Int(dataSize) / MemoryLayout<AudioDeviceID>.size
    var deviceIDs = [AudioDeviceID](repeating: 0, count: deviceCount)
    AudioObjectGetPropertyData(
        AudioObjectID(kAudioObjectSystemObject),
        &propertyAddress,
        0,
        nil,
        &dataSize,
        &deviceIDs
    )
    for id in deviceIDs {
        // Check if device has output streams
        var property = AudioObjectPropertyAddress(
            mSelector: kAudioDevicePropertyStreams,
            mScope: kAudioDevicePropertyScopeOutput,
            mElement: kAudioObjectPropertyElementMain
        )
        var streamDataSize: UInt32 = 0
        let status = AudioObjectGetPropertyDataSize(id, &property, 0, nil, &streamDataSize)
        if status != 0 || streamDataSize == 0 { continue }

        // Get device name
        var name: CFString? = nil // Initialize as nil
        var nameSize = UInt32(MemoryLayout<CFString>.size) // Size of a CFString pointer
        var nameAddr = AudioObjectPropertyAddress(
            mSelector: kAudioObjectPropertyName,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMain
        )
        
        // Use withUnsafeMutablePointer to get a pointer to the CFString variable
        let nameStatus = withUnsafeMutablePointer(to: &name) { (ptr: UnsafeMutablePointer<CFString?>) in
            AudioObjectGetPropertyData(id, &nameAddr, 0, nil, &nameSize, ptr)
        }
        
        // Get UID
        var uid: CFString? = nil // Initialize as nil
        var uidSize = UInt32(MemoryLayout<CFString>.size) // Size of a CFString pointer
        var uidAddr = AudioObjectPropertyAddress(
            mSelector: kAudioDevicePropertyDeviceUID,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMain
        )

        // Use withUnsafeMutablePointer to get a pointer to the CFString variable
        let uidStatus = withUnsafeMutablePointer(to: &uid) { (ptr: UnsafeMutablePointer<CFString?>) in
            AudioObjectGetPropertyData(id, &uidAddr, 0, nil, &uidSize, ptr)
        }

        // Ensure name and uid are not nil and the status was successful before appending
        if nameStatus == noErr, uidStatus == noErr, let actualName = name as String?, let actualUID = uid as String? {
            devices.append(AudioDevice(id: id, uid: actualUID, name: actualName))
        } else {
            // It's good practice to release the CFString if it was successfully obtained
            // and you're not passing ownership, but here Swift's Automatic Reference Counting
            // for CF objects (if bridged correctly) generally handles it.
        }
    }
    return devices
}

// MARK: - Set Default Output Device

func setDefaultAudioOutputDevice(deviceID: AudioDeviceID) -> OSStatus {
    var deviceIDToSet = deviceID
    // Change `var` to `let` for dataSize
    let dataSize = UInt32(MemoryLayout<AudioDeviceID>.size)
    var propertyAddress = AudioObjectPropertyAddress(
        mSelector: kAudioHardwarePropertyDefaultOutputDevice,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMain
    )
    
    // Check if the property can be written to
    var canSetProperty = DarwinBoolean(false)
    AudioObjectIsPropertySettable(AudioObjectID(kAudioObjectSystemObject), &propertyAddress, &canSetProperty)
    
    guard canSetProperty.boolValue else {
        print("🔴 Error: Default output device property is not settable.")
        return -1 // Indicate an error
    }

    // Set the default output device
    let status = AudioObjectSetPropertyData(
        AudioObjectID(kAudioObjectSystemObject),
        &propertyAddress,
        0,
        nil,
        dataSize,
        &deviceIDToSet
    )
    
    if status == noErr {
        print("✅ Successfully set default output device to ID: \(deviceID)")
    } else {
        print("❌ Failed to set default output device. Status: \(status)")
    }
    return status
}

// MARK: - Set Default Output Device by Name

func setDefaultOutputDeviceByName(_ name: String) {
    let devices = getAllOutputDevices()
    guard let device = devices.first(where: { $0.name.localizedCaseInsensitiveContains(name) }) else {
        print("❌ Could not find output device containing '", name, "'.")
        exit(1)
    }
    let status = setDefaultAudioOutputDevice(deviceID: device.id)
    if status == noErr {
        print("✅ Default output device set to '", device.name, "'.")
    } else {
        print("❌ Failed to set default output device.")
        exit(2)
    }
}

// MARK: - System Audio Recording

func record(fromDeviceWithName deviceName: String, outputFile: String) {
    // Find device ID by name
    let devices = getAllOutputDevices()
    guard let device = devices.first(where: { $0.name.contains(deviceName) }) else {
        print("❌ Device not found: \(deviceName)")
        exit(3)
    }
    print("🎙️ Using device: \(device.name) [\(device.uid)]")

    // Attempt to set the default output device
    let setDefaultStatus = setDefaultAudioOutputDevice(deviceID: device.id)
    if setDefaultStatus != noErr {
        print("⚠️ Warning: Could not set default output device. Recording might still proceed, but audio output won't be redirected.")
        // You might choose to exit here or continue based on your requirements
    }

    let settings = [
        AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
        AVSampleRateKey: 44100,
        AVNumberOfChannelsKey: 2,
        AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]
    let url = URL(fileURLWithPath: outputFile)
    
    let recorder: AVAudioRecorder
    do {
        recorder = try AVAudioRecorder(url: url, settings: settings)
    } catch {
        print("❌ Error initializing audio recorder: \(error.localizedDescription)")
        exit(4)
    }
    
    recorder.isMeteringEnabled = true
    recorder.record()
    print("🔴 Recording... Press Ctrl+C to stop.")
    
    // --- FIX FOR "a C function pointer cannot be formed from a closure that captures context" ---
    // Use DispatchSourceSignal for graceful interruption handling
    let sigintSource = DispatchSource.makeSignalSource(signal: SIGINT, queue: .main)
    sigintSource.setEventHandler {
        print("\nStopping recording...")
        recorder.stop()
        print("✅ Saved to \(outputFile)")
        exit(0)
    }
    sigintSource.resume()

    // It's important to ignore SIGINT so the DispatchSourceSignal can handle it
    signal(SIGINT, SIG_IGN)
    // --- END FIX ---

    RunLoop.main.run()
    // The code below will only be reached if RunLoop.main.run() exits for some other reason
    // (e.g., if the RunLoop is explicitly stopped or no input sources remain).
    // The SIGINT handler above typically calls exit(0) directly.
    recorder.stop()
    print("✅ Saved to \(outputFile)")
}

// MARK: - List Devices

func listDevices(jsonOutput: Bool = false) {
    let devices = getAllOutputDevices()
    if devices.isEmpty {
        print("No output devices found.")
        return
    }
    if jsonOutput {
        // For JSON output, ensure AudioDeviceID (UInt32) is properly serialized.
        // It's better to convert it to a Swift Int for JSON serialization.
        let jsonArray = devices.map { ["name": $0.name, "uid": $0.uid, "id": Int($0.id)] }
        if let jsonData = try? JSONSerialization.data(withJSONObject: jsonArray, options: .prettyPrinted),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            print(jsonString)
        } else {
            print("Error encoding JSON.")
        }
        return
    }
    print("Available Audio Output Devices:")
    print("================================")
    for (index, device) in devices.enumerated() {
        print("\(index + 1). \(device.name)")
        print("   UID: \(device.uid)")
        print("   ID: \(device.id)")
        print()
    }
}

// MARK: - Get Device Name by Index

func getDeviceNameByIndex(_ index: Int) {
    let devices = getAllOutputDevices()
    guard index >= 0 && index < devices.count else {
        print("Invalid device index. Use 'list-devices' to see available devices.")
        exit(1)
    }
    print(devices[index].name)
}

// MARK: - Multi-Input (Aggregate Input) Device Creation

func createMultiInputDevice(deviceNames: [String], newDeviceName: String) {
    // 1. Find all input audio device UIDs by name
    let allDevices = getAllInputDevices()
    var subDevices: [CFString] = []
    var masterUID: CFString? = nil

    for name in deviceNames {
        if let d = allDevices.first(where: { $0.name.contains(name) }) {
            subDevices.append(d.uid as CFString)
            if masterUID == nil { masterUID = d.uid as CFString }
        }
    }
    guard subDevices.count == deviceNames.count, let master = masterUID else {
        print("Could not find all input devices: \(deviceNames)")
        exit(1)
    }
    // 2. Prepare properties dictionary
    let newUID = UUID().uuidString as CFString
    let subDeviceDicts: [[CFString: Any]] = subDevices.map { [kAudioSubDeviceUIDKey as CFString: $0] }
    let props: [CFString: Any] = [
        kAudioAggregateDeviceNameKey as CFString: newDeviceName as CFString,
        kAudioAggregateDeviceUIDKey as CFString: newUID,
        kAudioAggregateDeviceSubDeviceListKey as CFString: subDeviceDicts,
        kAudioAggregateDeviceMasterSubDeviceKey as CFString: master,
        kAudioAggregateDeviceIsStackedKey as CFString: NSNumber(value: 1)
    ]
    var newDeviceID = AudioDeviceID()
    let status = AudioHardwareCreateAggregateDevice(props as CFDictionary, &newDeviceID)
    if status == 0 {
        print("✅ Multi-Input Device \"\(newDeviceName)\" created successfully.")
    } else {
        print("❌ Error: Could not create input device (status \(status))")
        exit(2)
    }
}

// Get all input devices with name and UID
func getAllInputDevices() -> [AudioDevice] {
    var devices: [AudioDevice] = []
    var dataSize: UInt32 = 0
    var propertyAddress = AudioObjectPropertyAddress(
        mSelector: kAudioHardwarePropertyDevices,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMain
    )
    guard AudioObjectGetPropertyDataSize(
        AudioObjectID(kAudioObjectSystemObject),
        &propertyAddress,
        0,
        nil,
        &dataSize
    ) == 0 else { return devices }
    let deviceCount = Int(dataSize) / MemoryLayout<AudioDeviceID>.size
    var deviceIDs = [AudioDeviceID](repeating: 0, count: deviceCount)
    AudioObjectGetPropertyData(
        AudioObjectID(kAudioObjectSystemObject),
        &propertyAddress,
        0,
        nil,
        &dataSize,
        &deviceIDs
    )
    for id in deviceIDs {
        // Check if device has input streams
        var property = AudioObjectPropertyAddress(
            mSelector: kAudioDevicePropertyStreams,
            mScope: kAudioDevicePropertyScopeInput,
            mElement: kAudioObjectPropertyElementMain
        )
        var streamDataSize: UInt32 = 0
        let status = AudioObjectGetPropertyDataSize(id, &property, 0, nil, &streamDataSize)
        if status != 0 || streamDataSize == 0 { continue }

        // Get device name
        var name: CFString? = nil
        var nameSize = UInt32(MemoryLayout<CFString>.size)
        var nameAddr = AudioObjectPropertyAddress(
            mSelector: kAudioObjectPropertyName,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMain
        )
        let nameStatus = withUnsafeMutablePointer(to: &name) { (ptr: UnsafeMutablePointer<CFString?>) in
            AudioObjectGetPropertyData(id, &nameAddr, 0, nil, &nameSize, ptr)
        }

        // Get UID
        var uid: CFString? = nil
        var uidSize = UInt32(MemoryLayout<CFString>.size)
        var uidAddr = AudioObjectPropertyAddress(
            mSelector: kAudioDevicePropertyDeviceUID,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMain
        )
        let uidStatus = withUnsafeMutablePointer(to: &uid) { (ptr: UnsafeMutablePointer<CFString?>) in
            AudioObjectGetPropertyData(id, &uidAddr, 0, nil, &uidSize, ptr)
        }

        if nameStatus == noErr, uidStatus == noErr, let actualName = name as String?, let actualUID = uid as String? {
            devices.append(AudioDevice(id: id, uid: actualUID, name: actualName))
        }
    }
    return devices
}

// MARK: - Main CLI Logic

let args = CommandLine.arguments
if args.count < 2 {
    print("Usage:")
    print("  \(args[0]) create-multi-output <device1> <device2> ... <output-device-name>")
    print("  \(args[0]) record <deviceName> <outputFile>")
    print("  \(args[0]) list-devices [--json]")
    print("  \(args[0]) get-device-name <index>")
    exit(0)
}

let command = Command(rawValue: args[1]) ?? .help

switch command {
case .stop:
    if args.count == 3, let pid = Int32(args[2]) {
        // Send SIGINT to the given PID
        let result = kill(pid, SIGINT)
        if result == 0 {
            print("✅ Sent SIGINT to process with PID: \(pid)")
        } else {
            print("❌ Failed to send SIGINT to PID \(pid). errno: \(errno)")
        }
    }
    // Set default output device to Internal Speakers (or first matching 'Speaker')
    setDefaultOutputDeviceByName("Speaker")
case .createMultiOutput:
    if args.count < 5 {
        print("Usage: \(args[0]) create-multi-output <device1> <device2> ... <output-device-name>")
        exit(1)
    }
    let deviceNames = Array(args[2..<(args.count-1)])
    let outputName = args.last!
    createMultiOutputDevice(deviceNames: deviceNames, newDeviceName: outputName)
case .record:
    if args.count < 4 {
        print("Usage: \(args[0]) record <deviceName> <outputFile>")
        exit(1)
    }
    record(fromDeviceWithName: args[2], outputFile: args[3])
case .listDevices:
    let jsonFlag = args.contains("--json")
    listDevices(jsonOutput: jsonFlag)
case .getDeviceName:
    if args.count < 3 {
        print("Usage: \(args[0]) get-device-name <index>")
        exit(1)
    }
    if let idx = Int(args[2]) {
        getDeviceNameByIndex(idx)
    } else {
        print("Invalid index argument.")
        exit(1)
    }
default:
    print("Unknown command.")
}
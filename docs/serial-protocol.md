# Serial Communication Protocol

This document describes the serial communication protocol used between the Harvest CCS application.

## Overview

The Harvest CCS application communicates with the control UNB board via a serial protocol. This allows real-time tracking of rovers/harvesters, task completion, and game events.

## Physical Layer

- **Baud Rate**: 115200 bps (default)
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1
- **Flow Control**: None

## Message Format

All messages follow this structure:

| Field        | Size     | Description                           |
| ------------ | -------- | ------------------------------------- |
| Sync Bytes   | 2 bytes  | Fixed pattern: 0xFE, 0x19             |
| Message ID   | 2 bytes  | Identifies the message type           |
| Payload Size | 2 bytes  | Length of the payload in bytes        |
| Payload      | Variable | Message data (format depends on type) |

## Message Types

### 0x1100: Device Status Update

Updates the status of a device (rover or harvester).

**Payload Format:**

| Offset | Size    | Description                           |
| ------ | ------- | ------------------------------------- |
| 0      | 1 byte  | Player ID                             |
| 1      | 1 byte  | Team ID                               |
| 2      | 1 byte  | Device ID (1=Rover, 2=Harvester)      |
| 3      | 1 byte  | Current Health (0-100%)               |
| 4      | 1 byte  | Enabled Status (0=Disabled, 1=Active) |
| 5      | 1 byte  | Disabled Timer (seconds)              |
| 6      | 1 byte  | Shield Code Flag (0=Off, 1=On)        |
| 7      | 1 byte  | Repair Code Flag (0=Off, 1=On)        |
| 8      | 2 bytes | Shield Code                           |
| 10     | 2 bytes | Repair Code                           |

### 0x1101: Task Status Update

Updates the status of a competition task.

**Payload Format:**

| Offset | Size   | Description                                    |
| ------ | ------ | ---------------------------------------------- |
| 0      | 1 byte | Team ID                                        |
| 1      | 1 byte | Player ID                                      |
| 2      | 1 byte | Device ID                                      |
| 3      | 1 byte | Task ID                                        |
| 4      | 1 byte | Status (0=Inactive, 1=Attempting, 2=Completed) |

## Task IDs

| ID  | Task Name                 | Description                               |
| --- | ------------------------- | ----------------------------------------- |
| 1   | RFID Sequence             | RFID tag read and beamed to home base     |
| 2   | Optical Signal Decoding   | Convert colours to tones to unlock ore    |
| 3   | Environmental Remediation | Drain tailings pond to unlock ore gate    |
| 4   | Solar Array               | Charge solar array to unlock ore gate     |
| 5   | Laser Turret              | Activate shields for safe passage         |
| 6   | Magnetic Anomaly          | Detect magnetic fields to unlock ore gate |
| 7   | Autonomous Line           | Autonomous line follow to unlock ore gate |
| 8   | Alien Frequency           | Find the fundamental to unlock ore gate   |
| 9   | Electrical Conductivity   | Detect conductive material to unlock ore  |
| 10  | IR Detection              | Detect IR emission to unlock ore gate     |

## Implementation Details

The application uses a circular buffer to handle incoming serial data:

1. Data is read from the serial port into a 200-byte circular buffer
2. The buffer is scanned for valid sync bytes (0xFE, 0x19)
3. Once a valid header is found, message ID and payload length are parsed
4. Complete messages are added to a processing queue
5. The main application processes messages and updates the UI accordingly

## Error Handling

- If sync bytes are found mid-message, the current message is discarded
- Messages with invalid or incomplete payloads are ignored
- Buffer overflow is prevented by checking available space

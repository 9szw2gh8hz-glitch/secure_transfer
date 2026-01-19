[PROTOCOL.md](https://github.com/user-attachments/files/24715825/PROTOCOL.md)
# SecureTransfer Protocol Specification v1.0

## 1. Overview
SecureTransfer is a binary protocol for secure, peer-to-peer file transfers over local networks. It prioritizes confidentiality, integrity, and lack of central servers.

## 2. Message Format
All messages follow a strict Big-Endian binary format:

| Field   | Size    | Type   | Description |
|:--------|:--------|:-------|:------------|
| Length  | 4 bytes | UInt32 | Total message size (excluding length field) |
| Type    | 1 byte  | UInt8  | Message Type Identifier |
| Version | 1 byte  | UInt8  | Protocol Version (0x01) |
| Payload | N bytes | Bytes  | Variable data based on Type |

## 3. Key Message Types
* **HELLO (0x01):** Initial handshake with device capabilities.
* **AUTH (0x03):** Challenge-response authentication payload.
* **FILE_META (0x10):** JSON payload containing filename, size, and hash.
* **FILE_CHUNK (0x20):** Encrypted binary chunk (Default 64KB).

## 4. State Machine
1.  **Discovery:** mDNS advertisement.
2.  **Handshake:** TCP Connect -> HELLO -> ACK.
3.  **Auth:** ECDH Key Exchange -> Challenge verification.
4.  **Transfer:** Meta -> Chunk Stream -> Completion.

[API.md](https://github.com/user-attachments/files/24715801/API.md)
# SecureTransfer Internal API Reference

This document outlines the internal class interfaces for the iOS (Swift) and Desktop (Python) clients.

## Core Modules

### 1. ConnectionManager
**Responsibility:** Manages raw TCP sockets, lifecycle state, and message framing.

**Methods:**
* `connect(to endpoint: NWEndpoint)`: Initiates a TCP handshake with a peer.
* `startListening()`: Opens port 8765 to accept incoming connections.
* `send(message: ProtocolMessage)`: Serializes and transmits a message.
* `disconnect()`: Cleanly closes the socket and releases resources.

**State Properties:**
* `connectionState`: String (e.g., "Connected", "Waiting", "Failed")

---

### 2. ProtocolHandler
**Responsibility:** Serialization and deserialization of binary messages according to the v1.0 spec.

**Message Structure:**
`[Length: 4B][Type: 1B][Version: 1B][Payload: NB]`

**Supported Types:**
| Type | ID | Purpose |
|------|----|---------|
| HELLO | 0x01 | Handshake & Capabilities |
| AUTH | 0x03 | ECDH Key Exchange Payload |
| FILE_CHUNK | 0x20 | Encrypted file segment |

---

### 3. CryptoHelper
**Responsibility:** Handles Elliptic Curve Diffie-Hellman (ECDH) and AES-GCM encryption.

**Methods:**
* `generateKeyPair()`: Creates a new Curve25519 private/public key pair.
* `deriveSharedSecret(peerPublicKey: Data)`: Computes the shared secret using HKDF-SHA256.
* `encrypt(data: Data) -> Data`: Encrypts data using AES-256-GCM with a random 12-byte nonce.
* `decrypt(data: Data) -> Data`: Validates the auth tag and decrypts the payload.

---

### 4. DiscoveryService (mDNS)
**Responsibility:** Advertises presence on the local network and browses for peers.

**Configuration:**
* **Service Type:** `_securetransfer._tcp`
* **Domain:** `local.`
* **Port:** 8765

**Events:**
* `onDeviceDiscovered`: Triggered when a new peer broadcasts their service.
* `onDeviceLost`: Triggered when a peer disconnects or times out.

## SecureTransfer: Cross-Platform Encrypted File Transfer

A local-first, peer-to-peer file transfer system with end-to-end encryption for iOS and desktop platforms.

    ⚠️ Development Note: This project is currently in the Logic-Verified stage. Due to development being conducted on non-macOS hardware, the iOS components (.xcodeproj and UI Views) are provided as architectural source code rather than a compiled binary. The Desktop Python implementation serves as the primary functional prototype.

# Project Summary

SecureTransfer demonstrates systems-level programming across networking, security, and platform constraints. It implements a custom application protocol for encrypted file transfers over local networks without relying on cloud services, showcasing:

    Custom protocol design with message serialization and state management

    Public-key cryptography (Curve25519) for device pairing and AES-256-GCM for data transfer

    Cross-platform architecture handling iOS sandboxing and desktop socket programming

    Reliability mechanisms including chunked transfers, integrity verification, and error recovery

# Architecture Overview

┌─────────────────────────────────────────────────────────────┐ │ Discovery Layer │ │ (mDNS/Bonjour - Local network service advertisement) │ └────────────────────┬────────────────────────────────────────┘ │ ┌────────────────────▼────────────────────────────────────────┐ │ Connection Layer │ │ (TCP sockets - Reliable, ordered delivery) │ └────────────────────┬────────────────────────────────────────┘ │ ┌────────────────────▼────────────────────────────────────────┐ │ Protocol Layer │ │ (Custom binary protocol - Message framing & routing) │ └────────────────────┬────────────────────────────────────────┘ │ ┌────────────────────▼────────────────────────────────────────┐ │ Security Layer │ │ (ECDH key exchange + AES-256-GCM encryption) │ └────────────────────┬────────────────────────────────────────┘ │ ┌────────────────────▼────────────────────────────────────────┐ │ Transfer Engine │ │ (Chunking, buffering, hashing, progress tracking) │ └────────────────────┬────────────────────────────────────────┘ │ ┌────────────────────▼────────────────────────────────────────┐ │ Storage Layer │ │ (Platform-specific file I/O - iOS sandboxing compliance) │ └──────────────────────────────────────────────────────────────┘

# Implementation Status

    Python Desktop: ✅ Fully Functional (Core logic, Discovery, Crypto, CLI)

    iOS Logic: ✅ Source Code Complete (Protocol, Crypto, Connection Managers)

    iOS UI/Build: 🛠 In-Progress (Requires macOS/Xcode for compilation and .xcodeproj generation)

# Setup Instructions
iOS Application (Source-Only)

Note: This code demonstrates architectural readiness but requires a Mac to compile. Requirements:

    macOS with Xcode 15+

    iOS 16+ device or simulator

# Steps:

    Initialize a new Xcode SwiftUI project named SecureTransfer.

    Move the files from /ios/SecureTransfer/ into the Xcode project navigator.

    Add Network.framework and CryptoKit to Frameworks.

    Configure Info.plist with NSLocalNetworkUsageDescription and NSBonjourServices (_securetransfer._tcp).

# Desktop Application (Python)

# Requirements:

    Python 3.10+

    pip install cryptography zeroconf

# Usage:
Bash

Start a receiver (Server)
python desktop_client.py --server --port 8765
Discover nearby devices
python desktop_client.py --discover
Send a file to a specific peer
python desktop_client.py --connect 192.168.1.100 --send document.pdf

Security Model
Threat Model

# Protected Against:

    ✅ Eavesdropping: (AES-256-GCM encryption)

    ✅ Man-in-the-middle: (Out-of-band QR code key verification)

    ✅ Replay attacks: (Unique session nonces)

    ✅ Data corruption: (SHA-256 integrity checks per chunk)

# Key Exchange Process

    Initial Pairing: Device A displays a QR code containing its Curve25519 Public Key. Device B scans it to establish the Root of Trust.

    Session Derivation: Both devices perform an ECDH exchange to derive a 32-byte shared secret.

    HKDF: A session key is derived using HKDF-SHA256 with a timestamp salt to ensure forward secrecy.

# Design Trade-offs
1. TCP vs UDP

Decision: TCP Rationale: Local Wi-Fi networks have minimal packet loss. TCP’s congestion control and reliable ordering allow the application to focus on security and file I/O rather than re-implementing a reliability layer.
2. 64KB Chunking

Decision: 64KB Chunks Rationale: Balances memory usage for iOS sandboxing (O(1) space complexity) against network overhead (only 0.08% header overhead).
Complexity Analysis

    Space Complexity: O(1) — Constant memory usage regardless of file size due to 64KB buffering.

    Time Complexity: O(n) — Linear time for encryption and transmission where n is file size.

    Network Complexity: O(n/c) — n = total size, c = chunk size; minimizes "chattiness" of the protocol.

# Known Limitations

    macOS Requirement: iOS project files (.xcodeproj) are not included as they require a Mac to generate. The Swift logic is provided as standalone modules.

    Backgrounding: iOS transfers pause when the app is backgrounded due to OS-level socket suspension.

    No Resume Support: Interrupted transfers currently require a full restart (Planned for v1.1).

# Project Structure

securetransfer/
├── ios/
│   ├── SecureTransfer/
│   │   ├── ConnectionManager.swift  # Socket lifecycle
│   │   ├── ProtocolHandler.swift    # Binary framing
│   │   ├── CryptoHelper.swift       # CryptoKit wrappers
│   │   └── Views/                   # SwiftUI components
├── desktop/
│   └── python/
│       ├── desktop_client.py        # Main Entry
│       ├── protocol.py              # Message definitions
│       └── crypto.py                # Cryptography implementation
├── docs/
│   ├── PROTOCOL.md                  # Binary spec
│   └── ARCHITECTURE.md              # System design
├── README.md
└── LICENSE

License

MIT License - see LICENSE file for details.
Contact

Miquel - innkk.010@gmail.com

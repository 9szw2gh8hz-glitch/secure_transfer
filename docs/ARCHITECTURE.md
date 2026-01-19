[ARCHITECTURE.md](https://github.com/user-attachments/files/24715812/ARCHITECTURE.md)
# System Architecture

## Design Philosophy
* **Local-First:** No internet required.
* **Zero-Config:** Discovery handles IP resolution.
* **Platform-Native:** Uses `Network.framework` on iOS and `BSD Sockets` on Desktop.

## Component Diagram
1.  **Discovery Layer:** mDNS/Bonjour.
2.  **Connection Layer:** TCP/IP Sockets.
3.  **Protocol Layer:** Binary message framing.
4.  **Security Layer:** CryptoKit (iOS) / Cryptography (Python).
5.  **IO Layer:** UIDocumentPicker (iOS) / FileSystem (Desktop).

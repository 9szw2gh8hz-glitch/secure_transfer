[SECURITY.md](https://github.com/user-attachments/files/24715833/SECURITY.md)
# Security Architecture

## Threat Model
We assume the local network is untrusted. An attacker may:
* Passively listen to all traffic (Sniffing).
* Inject packets into the stream (Tampering).
* Impersonate a peer (Spoofing).

## Defenses

### 1. Confidentiality
* **Algorithm:** AES-256-GCM.
* **Key Exchange:** ECDH (Curve25519) to derive a shared secret.
* **Session Keys:** Derived via HKDF-SHA256 with a random salt per session.

### 2. Integrity
* **Transport:** GCM mode provides authenticated encryption.
* **Data:** SHA-256 hashes verified for every 64KB chunk.
* **File:** Final SHA-256 hash verified against metadata.

### 3. Authentication
* **Pairing:** Out-of-band verification via QR Code (Public Key Fingerprint).
* **Replay Protection:** Nonces used in encryption are never reused.

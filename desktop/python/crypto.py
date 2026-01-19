import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class CryptoManager:
    def __init__(self):
        self.private_key = ec.generate_private_key(ec.Curve25519())
        self.public_key = self.private_key.public_key()
        self.shared_key = None

    def get_public_bytes(self) -> bytes:
        from cryptography.hazmat.primitives import serialization
        return self.public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )

    def derive_shared_key(self, peer_public_bytes: bytes, salt: bytes = None):
        peer_key = ec.EllipticCurvePublicKey.from_encoded_point(
            ec.Curve25519(), peer_public_bytes
        )
        shared_secret = self.private_key.exchange(ec.ECDH(), peer_key)
        
        if salt is None:
            salt = b'secure-transfer-v1' # Fixed salt for simplicity, ideally random

        self.shared_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            info=b'handshake'
        ).derive(shared_secret)

    def encrypt(self, data: bytes) -> bytes:
        if not self.shared_key:
            raise ValueError("Shared key not established")
        nonce = os.urandom(12)
        aesgcm = AESGCM(self.shared_key)
        ciphertext = aesgcm.encrypt(nonce, data, None)
        return nonce + ciphertext

    def decrypt(self, data: bytes) -> bytes:
        if not self.shared_key:
            raise ValueError("Shared key not established")
        nonce = data[:12]
        ciphertext = data[12:]
        aesgcm = AESGCM(self.shared_key)
        return aesgcm.decrypt(nonce, ciphertext, None)

import unittest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../desktop/python')))
from crypto import CryptoManager

class TestCrypto(unittest.TestCase):
    def test_key_exchange(self):
        alice = CryptoManager()
        bob = CryptoManager()
        
        # Perform ECDH
        alice.derive_shared_key(bob.get_public_bytes())
        bob.derive_shared_key(alice.get_public_bytes())
        
        # Keys should match
        self.assertEqual(alice.shared_key, bob.shared_key)
        
    def test_encryption_cycle(self):
        alice = CryptoManager()
        bob = CryptoManager()
        alice.derive_shared_key(bob.get_public_bytes())
        bob.derive_shared_key(alice.get_public_bytes())
        
        message = b"Secret Data"
        encrypted = alice.encrypt(message)
        decrypted = bob.decrypt(encrypted)
        
        self.assertEqual(message, decrypted)

if __name__ == '__main__':
    unittest.main()

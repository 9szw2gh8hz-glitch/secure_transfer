import unittest
import struct
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../desktop/python')))

from protocol import ProtocolMessage, MessageType

class TestProtocol(unittest.TestCase):
    def test_serialization(self):
        payload = b'TestPayload'
        msg = ProtocolMessage(MessageType.HELLO, payload)
        data = msg.serialize()
        
        # Check Length (4 bytes)
        # Length = 1 (Type) + 1 (Ver) + 11 (Payload) = 13
        expected_len = struct.pack('>I', 13)
        self.assertEqual(data[:4], expected_len)
        
        # Check Type
        self.assertEqual(data[4], 0x01)
        
        # Check Payload
        self.assertEqual(data[6:], payload)

    def test_deserialization(self):
        # Construct a fake message
        payload = b'AuthData'
        length = 1 + 1 + len(payload)
        data = struct.pack('>IBB', length, 0x03, 0x01) + payload
        
        decoded_len, msg_type, ver = ProtocolMessage.deserialize_header(data)
        self.assertEqual(msg_type, MessageType.AUTH)
        self.assertEqual(decoded_len, 10)

if __name__ == '__main__':
    unittest.main()

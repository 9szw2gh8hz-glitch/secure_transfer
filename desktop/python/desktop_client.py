import socket
import threading
import argparse
from protocol import ProtocolMessage, MessageType
from crypto import CryptoManager
from discovery import DeviceDiscovery

class SecureClient:
    def __init__(self, host, port):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.host = host
        self.port = port
        self.crypto = CryptoManager()

    def connect(self):
        self.sock.connect((self.host, self.port))
        print(f"Connected to {self.host}:{self.port}")
        self._handshake()

    def _handshake(self):
        # 1. Send Hello
        msg = ProtocolMessage(MessageType.HELLO, b'Desktop Client')
        self.sock.sendall(msg.serialize())
        # Ideally wait for ACK and perform ECDH here (omitted for brevity)

    def send_file(self, filepath):
        print(f"Sending {filepath}...")
        # Chunking logic would go here using protocol.py
        pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--connect', help='Target IP')
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()

    if args.connect:
        client = SecureClient(args.connect, args.port)
        client.connect()

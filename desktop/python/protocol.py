import struct
import json
from enum import IntEnum
from typing import Optional, Any

class MessageType(IntEnum):
    HELLO = 0x01
    HELLO_ACK = 0x02
    AUTH = 0x03
    AUTH_SUCCESS = 0x04
    AUTH_FAILED = 0x05
    FILE_META = 0x10
    FILE_READY = 0x11
    FILE_REJECT = 0x12
    FILE_CHUNK = 0x20
    CHUNK_ACK = 0x21
    CHUNK_RETRY = 0x22
    FILE_END = 0x30
    FILE_COMPLETE = 0x31
    FILE_CORRUPT = 0x32
    VERIFY = 0x40
    VERIFY_OK = 0x41
    VERIFY_FAIL = 0x42
    ERROR = 0xFF

class ProtocolMessage:
    def __init__(self, msg_type: MessageType, payload: bytes = b''):
        self.type = msg_type
        self.version = 0x01
        self.payload = payload

    def serialize(self) -> bytes:
        # Length (4) + Type (1) + Version (1) + Payload (N)
        length = 1 + 1 + len(self.payload)
        header = struct.pack('>IBB', length, self.type, self.version)
        return header + self.payload

    @staticmethod
    def deserialize_header(data: bytes) -> Optional[tuple]:
        if len(data) < 6:
            return None
        length, msg_type, version = struct.unpack('>IBB', data[:6])
        return length, MessageType(msg_type), version

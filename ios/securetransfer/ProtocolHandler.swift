import Foundation

enum MessageType: UInt8 {
    case hello = 0x01
    case auth = 0x03
    case fileChunk = 0x20
    case error = 0xFF
}

struct ProtocolMessage {
    let type: MessageType
    let payload: Data
    
    func serialize() -> Data {
        var data = Data()
        let length = UInt32(1 + 1 + payload.count)
        data.append(contentsOf: length.bigEndian.bytes)
        data.append(type.rawValue)
        data.append(0x01) // Version
        data.append(payload)
        return data
    }
}

extension UInt32 {
    var bytes: [UInt8] {
        var bigEndian = self.bigEndian
        return withUnsafeBytes(of: &bigEndian) { Array($0) }
    }
}

import Foundation
import Network
import Combine

class ConnectionManager: ObservableObject {
    // Publish changes to the UI
    @Published var connectionState: String = "Disconnected"
    @Published var receivedFiles: [URL] = []
    
    private var connection: NWConnection?
    private var listener: NWListener?
    private let queue = DispatchQueue(label: "com.securetransfer.network")
    
    // Standard port from your protocol spec
    private let defaultPort: NWEndpoint.Port = 8765
    
    // MARK: - Client Mode (Connect to Peer)
    
    func connect(to endpoint: NWEndpoint) {
        connection = NWConnection(to: endpoint, using: .tcp)
        
        connection?.stateUpdateHandler = { [weak self] state in
            DispatchQueue.main.async {
                self?.handleStateUpdate(state)
            }
        }
        
        connection?.start(queue: queue)
        receiveNextMessage()
    }
    
    // MARK: - Server Mode (Listen for Peers)
    
    func startListening() {
        do {
            listener = try NWListener(using: .tcp, on: defaultPort)
            
            listener?.stateUpdateHandler = { newState in
                print("Listener state: \(newState)")
            }
            
            listener?.newConnectionHandler = { [weak self] newConnection in
                print("New connection from: \(newConnection.endpoint)")
                self?.connection = newConnection
                self?.connection?.start(queue: self!.queue)
                self?.receiveNextMessage()
            }
            
            listener?.start(queue: queue)
        } catch {
            print("Failed to start listener: \(error)")
        }
    }
    
    // MARK: - Send Data
    
    func send(message: ProtocolMessage) {
        let data = message.serialize()
        
        connection?.send(content: data, completion: .contentProcessed { error in
            if let error = error {
                print("Send error: \(error)")
                self.disconnect()
            } else {
                print("Message sent: \(message.type)")
            }
        })
    }
    
    // MARK: - Receive Loop (Framing Logic)
    
    private func receiveNextMessage() {
        // 1. Read the Header (4 bytes = Length)
        connection?.receive(minimumIncompleteLength: 4, maximumLength: 4) { [weak self] data, context, isComplete, error in
            if let error = error {
                print("Receive error: \(error)")
                self?.disconnect()
                return
            }
            
            guard let data = data, !data.isEmpty, data.count == 4 else {
                return // Wait for more data
            }
            
            // Convert 4 bytes to UInt32 (Big Endian)
            let length = data.withUnsafeBytes { $0.load(as: UInt32.self).bigEndian }
            
            // 2. Read the Payload (N bytes)
            self?.receivePayload(length: Int(length))
        }
    }
    
    private func receivePayload(length: Int) {
        connection?.receive(minimumIncompleteLength: length, maximumLength: length) { [weak self] data, context, isComplete, error in
            guard let data = data, !data.isEmpty else { return }
            
            // We have the full message body
            self?.handleRawPayload(data)
            
            // Loop back to wait for the next message
            self?.receiveNextMessage()
        }
    }
    
    private func handleRawPayload(_ data: Data) {
        // Here you would deserialize: Type (1B) + Version (1B) + Content
        // For simplicity, we just print received bytes count
        print("Received payload: \(data.count) bytes")
        
        // TODO: Pass to ProtocolHandler to parse MessageType
    }
    
    private func handleStateUpdate(_ state: NWConnection.State) {
        switch state {
        case .ready:
            self.connectionState = "Connected"
        case .failed(let error):
            self.connectionState = "Failed: \(error.localizedDescription)"
            disconnect()
        case .waiting(let error):
            self.connectionState = "Waiting: \(error.localizedDescription)"
        default:
            break
        }
    }
    
    func disconnect() {
        connection?.cancel()
        listener?.cancel()
        connection = nil
        listener = nil
        DispatchQueue.main.async {
            self.connectionState = "Disconnected"
        }
    }
}

import SwiftUI
import Network

struct TransferView: View {
    let endpoint: NWEndpoint
    @State private var progress: Float = 0.0
    @State private var status: String = "Ready"
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "arrow.up.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(.blue)
            
            Text("Sending to \(endpoint.debugDescription)")
            
            ProgressView(value: progress)
                .padding()
            
            Text(status)
                .foregroundColor(.secondary)
            
            Button("Send Test File") {
                // Trigger connection logic here
                status = "Connecting..."
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

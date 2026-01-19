import SwiftUI
import Network

struct DeviceListView: View {
    @StateObject private var discovery = DiscoveryService()
    
    var body: some View {
        List(discovery.discoveredDevices, id: \.hashValue) { endpoint in
            NavigationLink(destination: TransferView(endpoint: endpoint)) {
                HStack {
                    Image(systemName: "laptopcomputer")
                    Text(endpoint.debugDescription)
                }
            }
        }
        .onAppear {
            discovery.startBrowsing()
        }
    }
}

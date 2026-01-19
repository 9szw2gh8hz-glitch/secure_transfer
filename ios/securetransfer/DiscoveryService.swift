import Foundation
import Network

class DiscoveryService: NSObject, ObservableObject {
    @Published var discoveredDevices: [NWEndpoint] = []
    private var browser: NWBrowser?
    
    func startBrowsing() {
        let parameters = NWParameters()
        parameters.includePeerToPeer = true
        
        let browser = NWBrowser(for: .bonjour(type: "_securetransfer._tcp", domain: nil), using: parameters)
        browser.stateUpdateHandler = { newState in
            print("Browser state: \(newState)")
        }
        
        browser.browseResultsChangedHandler = { results, _ in
            DispatchQueue.main.async {
                self.discoveredDevices = results.map { $0.endpoint }
            }
        }
        
        browser.start(queue: .main)
        self.browser = browser
    }
}

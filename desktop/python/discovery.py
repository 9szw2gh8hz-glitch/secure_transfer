import socket
import sys
from zeroconf import ServiceInfo, Zeroconf, ServiceBrowser, ServiceListener

class DiscoveryListener(ServiceListener):
    def __init__(self, callback):
        self.callback = callback

    def update_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        pass

    def remove_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        print(f"Service {name} removed")

    def add_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        info = zc.get_service_info(type_, name)
        if info:
            address = socket.inet_ntoa(info.addresses[0])
            self.callback(name, address, info.port)

class DeviceDiscovery:
    def __init__(self, device_name, port, on_device_found):
        self.zeroconf = Zeroconf()
        self.type = "_securetransfer._tcp.local."
        self.name = f"{device_name}.{self.type}"
        self.port = port
        self.listener = DiscoveryListener(on_device_found)
        self.browser = None

    def start_advertising(self):
        info = ServiceInfo(
            self.type,
            self.name,
            addresses=[socket.inet_aton(self._get_local_ip())],
            port=self.port,
            properties={'version': '1.0'}
        )
        self.zeroconf.register_service(info)

    def start_browsing(self):
        self.browser = ServiceBrowser(self.zeroconf, self.type, self.listener)

    def stop(self):
        self.zeroconf.close()

    def _get_local_ip(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(('10.255.255.255', 1))
            IP = s.getsockname()[0]
        except Exception:
            IP = '127.0.0.1'
        finally:
            s.close()
        return IP

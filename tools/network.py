import socket
import requests
from concurrent.futures import ThreadPoolExecutor

class PortScanner:
    def __init__(self):
        self.common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389]
    
    def check_port(self, host, port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        try:
            result = sock.connect_ex((host, port))
            if result == 0:
                return port
        except:
            pass
        finally:
            sock.close()
        return None
    
    def scan(self, host):
        open_ports = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(self.check_port, host, port) 
                      for port in self.common_ports]
            for future in futures:
                if (port := future.result()):
                    open_ports.append(port)
        
        return {
            'host': host,
            'open_ports': sorted(open_ports),
            'total_scanned': len(self.common_ports)
        }

class IPLookup:
    def __init__(self):
        self.api_url = "https://ipapi.co/{}/json/"
    
    def lookup(self, ip):
        try:
            response = requests.get(self.api_url.format(ip))
            if response.status_code == 200:
                return response.json()
            return {'error': 'Unable to lookup IP information'}
        except Exception as e:
            return {'error': str(e)}

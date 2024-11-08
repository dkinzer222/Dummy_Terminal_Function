from flask import Flask, render_template, jsonify, request
import socket
import requests
import dns.resolver
from tools.network import PortScanner, IPLookup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan')
def scan():
    host = request.args.get('host')
    if not host:
        return jsonify({'error': 'Host parameter required'}), 400
    
    scanner = PortScanner()
    results = scanner.scan(host)
    return jsonify(results)

@app.route('/api/lookup')
def lookup():
    ip = request.args.get('ip')
    if not ip:
        return jsonify({'error': 'IP parameter required'}), 400
    
    lookup = IPLookup()
    results = lookup.lookup(ip)
    return jsonify(results)

@app.route('/api/dns')
def dns_lookup():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({'error': 'Domain parameter required'}), 400
    
    try:
        records = {
            'A': [str(r) for r in dns.resolver.resolve(domain, 'A')],
            'MX': [str(r) for r in dns.resolver.resolve(domain, 'MX')],
            'NS': [str(r) for r in dns.resolver.resolve(domain, 'NS')]
        }
        return jsonify(records)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

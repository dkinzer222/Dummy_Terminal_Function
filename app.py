from flask import Flask, render_template, jsonify, request
import socket
import requests
import dns.resolver
from tools.network import PortScanner, IPLookup
from functools import wraps
import time

app = Flask(__name__)

def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'error': True,
                'message': str(e),
                'status': 'error'
            }), 400
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan', methods=['POST'])
@handle_errors
def scan():
    data = request.get_json()
    host = data.get('host')
    
    if not host:
        return jsonify({
            'error': True,
            'message': 'Host parameter is required',
            'status': 'error'
        }), 400
    
    scanner = PortScanner()
    # Simulate loading state for better UX
    time.sleep(1)
    results = scanner.scan(host)
    
    return jsonify({
        'error': False,
        'data': results,
        'status': 'success'
    })

@app.route('/api/lookup', methods=['POST'])
@handle_errors
def lookup():
    data = request.get_json()
    ip = data.get('ip')
    
    if not ip:
        return jsonify({
            'error': True,
            'message': 'IP parameter is required',
            'status': 'error'
        }), 400
    
    lookup = IPLookup()
    results = lookup.lookup(ip)
    
    return jsonify({
        'error': False,
        'data': results,
        'status': 'success'
    })

@app.route('/api/tools')
def get_tools():
    tools = [
        {
            'id': 'scan',
            'name': 'Port Scanner',
            'description': 'Scan ports on target systems',
            'icon': 'bx-scan'
        },
        {
            'id': 'lookup',
            'name': 'IP Lookup',
            'description': 'Get information about IP addresses',
            'icon': 'bx-search'
        },
        {
            'id': 'dns',
            'name': 'DNS Lookup',
            'description': 'Query DNS records',
            'icon': 'bx-server'
        }
    ]
    return jsonify(tools)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

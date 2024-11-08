from flask import Flask, render_template, jsonify, request
import socket
import requests
import dns.resolver
import subprocess
import shlex
from tools.network import PortScanner, IPLookup
from functools import wraps
import time

app = Flask(__name__)
app.config['TITLE'] = 'Dummy Terminal'

# List of allowed system commands for security
ALLOWED_COMMANDS = {
    'ls': 'List directory contents',
    'pwd': 'Print working directory',
    'whoami': 'Print effective user ID',
    'date': 'Print system date and time',
    'ps': 'Report process status',
    'df': 'Report file system disk space usage',
    'free': 'Display amount of free and used memory in the system',
    'uptime': 'Tell how long the system has been running',
    'uname': 'Print system information'
}

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
    return render_template('index.html', title=app.config['TITLE'])

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

@app.route('/api/system', methods=['POST'])
@handle_errors
def execute_system_command():
    data = request.get_json()
    command = data.get('command')
    
    if not command:
        return jsonify({
            'error': True,
            'message': 'Command parameter is required',
            'status': 'error'
        }), 400

    cmd_parts = shlex.split(command)
    base_cmd = cmd_parts[0]
    
    if base_cmd not in ALLOWED_COMMANDS:
        return jsonify({
            'error': True,
            'message': 'Command not allowed',
            'status': 'error'
        }), 403
    
    try:
        result = subprocess.run(
            cmd_parts,
            capture_output=True,
            text=True,
            timeout=10,
            check=False
        )
        
        return jsonify({
            'error': False,
            'output': result.stdout,
            'error_output': result.stderr,
            'exit_code': result.returncode,
            'status': 'success' if result.returncode == 0 else 'error'
        })
    except subprocess.TimeoutExpired:
        return jsonify({
            'error': True,
            'message': 'Command execution timed out',
            'status': 'error'
        }), 408
    except Exception as e:
        return jsonify({
            'error': True,
            'message': str(e),
            'status': 'error'
        }), 500

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
        },
        {
            'id': 'system',
            'name': 'System Commands',
            'description': 'Execute system commands',
            'icon': 'bx-terminal'
        }
    ]
    return jsonify(tools)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

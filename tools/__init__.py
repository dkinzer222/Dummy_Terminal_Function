"""
Network Security Toolkit Tools Package

This package contains the core network security and analysis tools used by the application.
"""

from .network import PortScanner, IPLookup

# List of available tools and their descriptions
AVAILABLE_TOOLS = {
    'port_scanner': {
        'name': 'Port Scanner',
        'description': 'Scan for open network ports on target systems',
        'class': PortScanner
    },
    'ip_lookup': {
        'name': 'IP Lookup',
        'description': 'Retrieve detailed information about IP addresses',
        'class': IPLookup
    }
}

# Common networking constants
DEFAULT_TIMEOUT = 1.0  # Default socket timeout in seconds
COMMON_PORTS = [
    20, 21,   # FTP
    22,       # SSH
    23,       # Telnet
    25,       # SMTP
    53,       # DNS
    80,       # HTTP
    110,      # POP3
    143,      # IMAP
    443,      # HTTPS
    465,      # SMTPS
    587,      # SMTP/Submission
    993,      # IMAPS
    995,      # POP3S
    3306,     # MySQL
    3389,     # RDP
    5432,     # PostgreSQL
    8080,     # HTTP Alternate
    8443      # HTTPS Alternate
]

# Tool categories for organization
TOOL_CATEGORIES = {
    'network': [
        'port_scanner',
        'ip_lookup'
    ],
    'web': [
        'ssl_checker',
        'dns_lookup'
    ],
    'analysis': [
        'network_analyzer',
        'wifi_analyzer'
    ],
    'utilities': [
        'subnet_calculator',
        'json_formatter'
    ]
}

def get_tool_info(tool_id):
    """
    Get information about a specific tool.
    
    Args:
        tool_id (str): The identifier of the tool
        
    Returns:
        dict: Tool information or None if not found
    """
    return AVAILABLE_TOOLS.get(tool_id)

def get_tools_by_category(category):
    """
    Get all tools in a specific category.
    
    Args:
        category (str): The category name
        
    Returns:
        list: List of tool IDs in the category
    """
    return TOOL_CATEGORIES.get(category, [])

def initialize_tools():
    """
    Initialize all tool instances.
    
    Returns:
        dict: Dictionary of initialized tool instances
    """
    tools = {}
    for tool_id, tool_info in AVAILABLE_TOOLS.items():
        try:
            tools[tool_id] = tool_info['class']()
        except Exception as e:
            print(f"Failed to initialize {tool_id}: {e}")
    return tools

# Version information
__version__ = '1.0.0'
__author__ = 'Network Security Toolkit Team'

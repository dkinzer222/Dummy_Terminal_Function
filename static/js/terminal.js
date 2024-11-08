class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        this.history = [];
        this.historyIndex = -1;
        this.commandHandlers = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'tools': () => this.listTools(),
            'scan': (args) => this.runPortScan(args),
            'lookup': (args) => this.ipLookup(args)
        };
        
        this.init();
    }

    init() {
        this.welcomeMessage();
        this.addEventListeners();
    }

    welcomeMessage() {
        this.write('Network Security Toolkit v1.0');
        this.write('Type "help" for available commands');
        this.write('');
    }

    write(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                }
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });
    }

    executeCommand(command) {
        this.write(`$ ${command}`, 'command');
        const [cmd, ...args] = command.split(' ');
        
        if (this.commandHandlers[cmd]) {
            this.commandHandlers[cmd](args);
        } else {
            this.write(`Command not found: ${cmd}`);
        }
    }

    showHelp() {
        const commands = [
            'help    - Show this help message',
            'clear   - Clear terminal screen',
            'tools   - List available tools',
            'scan    - Run port scan (usage: scan <host>)',
            'lookup  - IP lookup (usage: lookup <ip>)'
        ];
        commands.forEach(cmd => this.write(cmd));
    }

    clear() {
        this.output.innerHTML = '';
    }

    listTools() {
        const tools = [
            'Port Scanner',
            'IP Lookup',
            'DNS Lookup',
            'Network Speed Test',
            'SSL Certificate Checker',
            'Wi-Fi Analyzer',
            'Subnet Calculator'
        ];
        this.write('Available Tools:');
        tools.forEach(tool => this.write(`- ${tool}`));
    }

    async runPortScan(args) {
        if (!args.length) {
            this.write('Usage: scan <host>');
            return;
        }
        
        this.write(`Scanning ${args[0]}...`);
        try {
            const response = await fetch(`/api/scan?host=${args[0]}`);
            const data = await response.json();
            this.write(JSON.stringify(data, null, 2));
        } catch (err) {
            this.write('Error: Unable to complete scan');
        }
    }

    async ipLookup(args) {
        if (!args.length) {
            this.write('Usage: lookup <ip>');
            return;
        }
        
        this.write(`Looking up ${args[0]}...`);
        try {
            const response = await fetch(`/api/lookup?ip=${args[0]}`);
            const data = await response.json();
            this.write(JSON.stringify(data, null, 2));
        } catch (err) {
            this.write('Error: Unable to complete lookup');
        }
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

class Terminal {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupElements();
        if (this.terminal && this.output && this.input) {
            this.setupTerminalHeader();
            this.welcomeMessage();
            this.addEventListeners();
        } else {
            console.warn('Terminal elements not found, retrying setup...');
            setTimeout(() => this.setup(), 500);
        }
    }

    setupElements() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        this.history = [];
        this.historyIndex = -1;
        
        this.allowedSystemCommands = [
            'ls', 'pwd', 'whoami', 'date', 'ps', 
            'df', 'free', 'uptime', 'uname'
        ];

        this.commandHandlers = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'tools': () => this.listTools(),
            'scan': (args) => this.runPortScan(args),
            'lookup': (args) => this.ipLookup(args),
            'dns': (args) => this.dnsLookup(args),
            'speedtest': () => this.speedTest(),
            'ssl': (args) => this.sslCheck(args),
            'system': (args) => this.executeSystemCommand(args)
        };
    }

    setupTerminalHeader() {
        const header = document.createElement('div');
        header.className = 'terminal-header';
        
        header.innerHTML = `
            <span class="terminal-title">Terminal</span>
            <div class="terminal-controls">
                <button class="terminal-control-btn minimize-btn" title="Minimize">
                    <i class='bx bx-minus'></i>
                </button>
                <button class="terminal-control-btn maximize-btn" title="Maximize">
                    <i class='bx bx-expand'></i>
                </button>
            </div>
        `;

        this.terminal.insertBefore(header, this.terminal.firstChild);

        header.querySelector('.minimize-btn').addEventListener('click', () => this.toggleMinimize());
        header.querySelector('.maximize-btn').addEventListener('click', () => this.toggleMaximize());
    }

    toggleMinimize() {
        this.terminal.classList.toggle('minimized');
        const minimizeBtn = this.terminal.querySelector('.minimize-btn i');
        minimizeBtn.classList.toggle('bx-minus');
        minimizeBtn.classList.toggle('bx-plus');
    }

    toggleMaximize() {
        this.terminal.classList.toggle('maximized');
        const maximizeBtn = this.terminal.querySelector('.maximize-btn i');
        maximizeBtn.classList.toggle('bx-expand');
        maximizeBtn.classList.toggle('bx-collapse');
    }

    welcomeMessage() {
        this.write('Network Security Toolkit v1.0');
        this.write('Type "help" for available commands');
        this.write('');
    }

    write(text, type = 'default') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        switch(type) {
            case 'command':
                line.classList.add('command');
                break;
            case 'system-command':
                line.classList.add('system-command');
                break;
            case 'system-output':
                line.classList.add('system-output');
                break;
            case 'error':
                line.classList.add('error');
                break;
        }
        
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addEventListeners() {
        if (!this.input) return;

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                }
                this.input.value = '';
                e.preventDefault();
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

        this.input.addEventListener('focus', () => {
            const keyboard = document.querySelector('.keyboard-container');
            if (keyboard && !keyboard.classList.contains('visible')) {
                window.keyboard?.toggleKeyboard();
            }
        });

        this.terminal.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-input')) {
                this.input.focus();
            }
        });
    }

    async executeCommand(command) {
        this.write(`$ ${command}`, 'command');
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        if (this.commandHandlers[cmd]) {
            await this.commandHandlers[cmd](args);
        } else {
            this.write(`Command not found: ${cmd}`, 'error');
        }
    }

    showHelp() {
        const commands = [
            'help      - Show this help message',
            'clear     - Clear terminal screen',
            'tools     - List available tools',
            'scan      - Run port scan (usage: scan <host>)',
            'lookup    - IP lookup (usage: lookup <ip>)',
            'dns       - DNS lookup (usage: dns <domain>)',
            'speedtest - Run network speed test',
            'ssl       - Check SSL certificate (usage: ssl <domain>)',
            'system    - Execute system command (usage: system <command>)'
        ];
        commands.forEach(cmd => this.write(cmd));
        this.write('\nAllowed system commands:');
        this.write('ls, pwd, whoami, date, ps, df, free, uptime, uname');
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
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ host: args[0] })
            });
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
            const response = await fetch('/api/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ip: args[0] })
            });
            const data = await response.json();
            this.write(JSON.stringify(data, null, 2));
        } catch (err) {
            this.write('Error: Unable to complete lookup');
        }
    }

    async executeSystemCommand(args) {
        if (!args || args.length === 0) {
            this.write('Usage: system <command>', 'error');
            this.write('Allowed commands: ' + this.allowedSystemCommands.join(', '), 'error');
            return;
        }

        const command = args.join(' ');
        const baseCommand = args[0].toLowerCase();

        if (!this.allowedSystemCommands.includes(baseCommand)) {
            this.write(`Error: Command '${baseCommand}' not allowed`, 'error');
            return;
        }

        this.write(`Executing: ${command}`, 'system-command');

        try {
            const response = await fetch('/api/system', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            const data = await response.json();
            
            if (data.error) {
                this.write(`Error: ${data.message}`, 'error');
                return;
            }

            if (data.output) {
                data.output.trim().split('\n').forEach(line => {
                    this.write(line, 'system-output');
                });
            }

            if (data.error_output) {
                data.error_output.trim().split('\n').forEach(line => {
                    this.write(line, 'error');
                });
            }

            if (data.exit_code !== 0) {
                this.write(`Command exited with code ${data.exit_code}`, 'error');
            }
        } catch (err) {
            this.write(`Error executing command: ${err.message}`, 'error');
        }
    }

    dnsLookup(args) {
        this.write('DNS lookup functionality not implemented');
    }

    speedTest() {
        this.write('Speed test functionality not implemented');
    }

    sslCheck(args) {
        this.write('SSL check functionality not implemented');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.terminal = new Terminal();
    });
} else {
    window.terminal = new Terminal();
}
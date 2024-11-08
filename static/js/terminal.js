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

    welcomeMessage() {
        this.write('Network Security Toolkit v1.0');
        this.write('Type "help" for available commands');
        this.write('');
    }

    write(text, isCommand = false, isSystemOutput = false) {
        const line = document.createElement('div');
        line.className = `terminal-line${isCommand ? ' command' : ''}${isSystemOutput ? ' system-output' : ''}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addEventListeners() {
        if (!this.input) return;

        // Physical keyboard input handling
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

        // Input focus handling
        this.input.addEventListener('focus', () => {
            const keyboard = document.querySelector('.keyboard-container');
            if (keyboard && !keyboard.classList.contains('visible')) {
                window.keyboard?.toggleKeyboard();
            }
        });

        // Click handling for keyboard visibility
        this.terminal.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-input')) {
                this.input.focus();
            }
        });
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

    executeCommand(command) {
        this.write(`$ ${command}`, true);
        const [cmd, ...args] = command.split(' ');
        
        if (this.commandHandlers[cmd]) {
            this.commandHandlers[cmd](args);
        } else {
            this.write(`Command not found: ${cmd}`);
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
        if (!args.length) {
            this.write('Usage: system <command>');
            return;
        }

        const command = args.join(' ');
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
                this.write(`Error: ${data.message}`, false, true);
                return;
            }

            if (data.output) {
                this.write(data.output.trim(), false, true);
            }

            if (data.error_output) {
                this.write(data.error_output.trim(), false, true);
            }

            if (data.exit_code !== 0) {
                this.write(`Command exited with code ${data.exit_code}`, false, true);
            }
        } catch (err) {
            this.write(`Error executing command: ${err.message}`, false, true);
        }
    }

    dnsLookup() {
        this.write('DNS lookup functionality not implemented');
    }

    speedTest() {
        this.write('Speed test functionality not implemented');
    }

    sslCheck() {
        this.write('SSL check functionality not implemented');
    }
}

// Initialize terminal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.terminal = new Terminal();
    });
} else {
    window.terminal = new Terminal();
}

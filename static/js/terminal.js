class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        this.history = [];
        this.historyIndex = -1;
        this.username = 'user';
        this.device = 'device';
        this.commandHandlers = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'tools': () => this.listTools(),
            'scan': (args) => this.runPortScan(args),
            'lookup': (args) => this.ipLookup(args)
        };
        
        // Command metadata for autocompletion
        this.commandMeta = {
            'help': { args: [] },
            'clear': { args: [] },
            'tools': { args: [] },
            'scan': { 
                args: ['<host>'],
                description: 'Scan ports on specified host'
            },
            'lookup': { 
                args: ['<ip>'],
                description: 'Lookup information for IP address'
            }
        };
        
        this.suggestions = [];
        this.suggestionIndex = -1;
        this.init();
    }

    init() {
        this.welcomeMessage();
        this.addEventListeners();
        this.updatePrompt();
        this.createSuggestionsBox();
    }

    createSuggestionsBox() {
        this.suggestionsBox = document.createElement('div');
        this.suggestionsBox.className = 'suggestions-box';
        this.suggestionsBox.style.display = 'none';
        this.terminal.appendChild(this.suggestionsBox);
    }

    updateSuggestions(input) {
        const [cmd, ...args] = input.split(' ');
        let suggestions = [];

        if (args.length === 0) {
            // Complete command names
            suggestions = Object.keys(this.commandHandlers)
                .filter(name => name.startsWith(cmd));
        } else if (this.commandMeta[cmd]) {
            // Complete arguments if command exists
            const meta = this.commandMeta[cmd];
            if (meta.args && meta.args.length > args.length - 1) {
                suggestions = [meta.args[args.length - 1]];
            }
        }

        this.suggestions = suggestions;
        this.suggestionIndex = -1;
        this.showSuggestions();
    }

    showSuggestions() {
        if (this.suggestions.length === 0) {
            this.suggestionsBox.style.display = 'none';
            return;
        }

        this.suggestionsBox.innerHTML = this.suggestions
            .map((s, i) => `<div class="suggestion${i === this.suggestionIndex ? ' selected' : ''}">${s}</div>`)
            .join('');
        this.suggestionsBox.style.display = 'block';
    }

    applySuggestion() {
        if (this.suggestionIndex === -1 && this.suggestions.length > 0) {
            this.suggestionIndex = 0;
        }
        if (this.suggestionIndex >= 0) {
            const parts = this.input.value.split(' ');
            if (parts.length === 1) {
                this.input.value = this.suggestions[this.suggestionIndex];
            } else {
                parts[parts.length - 1] = this.suggestions[this.suggestionIndex];
                this.input.value = parts.join(' ');
            }
        }
        this.suggestionsBox.style.display = 'none';
    }

    updatePrompt() {
        const prompt = document.querySelector('.prompt');
        if (prompt) {
            prompt.textContent = `${this.username}-${this.device}:~ ${this.username}$`;
        }
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
            if (e.key === 'Tab') {
                e.preventDefault();
                this.applySuggestion();
            } else if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                }
                this.input.value = '';
                this.suggestionsBox.style.display = 'none';
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

        this.input.addEventListener('input', () => {
            this.updateSuggestions(this.input.value);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.suggestionsBox.contains(e.target)) {
                this.suggestionsBox.style.display = 'none';
            }
        });
    }

    executeCommand(command) {
        this.write(`${this.username}-${this.device}:~ ${this.username}$ ${command}`, 'command');
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

document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

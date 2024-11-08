class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        this.history = [];
        this.historyIndex = -1;
        this.username = 'mobile';
        this.device = 'Jeffs-iPhone';
        this.commandHandlers = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'scan': (args) => this.runPortScan(args),
            'lookup': (args) => this.ipLookup(args),
            'dns': (args) => this.dnsLookup(args)
        };
        
        this.commandMeta = {
            'help': { 
                description: 'Show available commands and usage',
                args: [],
                examples: ['help']
            },
            'clear': { 
                description: 'Clear terminal screen',
                args: [],
                examples: ['clear']
            },
            'scan': { 
                description: 'Scan ports on specified host',
                args: ['<host>'],
                examples: ['scan localhost', 'scan 192.168.1.1']
            },
            'lookup': { 
                description: 'Lookup information for IP address',
                args: ['<ip>'],
                examples: ['lookup 8.8.8.8', 'lookup 1.1.1.1']
            },
            'dns': {
                description: 'Perform DNS lookup for domain',
                args: ['<domain>'],
                examples: ['dns example.com', 'dns google.com']
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
        this.terminal.appendChild(this.suggestionsBox);
    }

    updateSuggestions(input) {
        const parts = input.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        let suggestions = [];

        if (args.length === 0) {
            suggestions = Object.entries(this.commandMeta)
                .filter(([name]) => name.startsWith(cmd))
                .map(([name, meta]) => ({
                    text: name,
                    description: meta.description
                }));
        } else if (this.commandMeta[cmd]) {
            const meta = this.commandMeta[cmd];
            if (meta.args && meta.args.length >= args.length) {
                const currentArgIndex = args.length - 1;
                const currentArg = args[currentArgIndex].toLowerCase();
                
                suggestions = meta.examples
                    .map(example => {
                        const exampleArgs = example.split(' ');
                        return {
                            text: exampleArgs[currentArgIndex + 1] || '',
                            description: `Example: ${example}`
                        };
                    })
                    .filter(s => s.text.toLowerCase().startsWith(currentArg));
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
            .map((suggestion, i) => `
                <div class="suggestion${i === this.suggestionIndex ? ' selected' : ''}">
                    <span class="suggestion-text">${suggestion.text}</span>
                    <span class="suggestion-description">${suggestion.description}</span>
                </div>
            `).join('');
        this.suggestionsBox.style.display = 'block';
    }

    applySuggestion() {
        if (this.suggestionIndex === -1 && this.suggestions.length > 0) {
            this.suggestionIndex = 0;
        }
        if (this.suggestionIndex >= 0) {
            const parts = this.input.value.split(' ');
            const suggestion = this.suggestions[this.suggestionIndex].text;
            
            if (parts.length === 1) {
                this.input.value = suggestion;
            } else {
                parts[parts.length - 1] = suggestion;
                this.input.value = parts.join(' ');
            }
        }
        this.suggestionsBox.style.display = 'none';
    }

    updatePrompt() {
        const prompt = document.querySelector('.prompt');
        if (prompt) {
            prompt.textContent = `${this.device}:~ ${this.username}$`;
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

    clear() {
        this.output.innerHTML = '';
    }

    showHelp() {
        this.write('Available commands:');
        Object.entries(this.commandMeta).forEach(([name, meta]) => {
            this.write(`  ${name} ${meta.args.join(' ')} - ${meta.description}`);
        });
    }

    addEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    e.preventDefault();
                    if (this.suggestions.length > 0) {
                        this.applySuggestion();
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.suggestions.length > 0) {
                        this.suggestionIndex = Math.max(0, this.suggestionIndex - 1);
                        this.showSuggestions();
                    } else if (this.historyIndex > 0) {
                        this.historyIndex--;
                        this.input.value = this.history[this.historyIndex];
                    }
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.suggestions.length > 0) {
                        this.suggestionIndex = Math.min(
                            this.suggestions.length - 1,
                            this.suggestionIndex + 1
                        );
                        this.showSuggestions();
                    } else if (this.historyIndex < this.history.length - 1) {
                        this.historyIndex++;
                        this.input.value = this.history[this.historyIndex];
                    } else {
                        this.historyIndex = this.history.length;
                        this.input.value = '';
                    }
                    break;
                    
                case 'Enter':
                    const command = this.input.value.trim();
                    if (command) {
                        this.executeCommand(command);
                        this.history.push(command);
                        this.historyIndex = this.history.length;
                    }
                    this.input.value = '';
                    this.suggestionsBox.style.display = 'none';
                    break;
                    
                case 'Escape':
                    this.suggestionsBox.style.display = 'none';
                    break;
            }
        });

        this.input.addEventListener('input', () => {
            this.updateSuggestions(this.input.value);
        });

        document.addEventListener('click', (e) => {
            if (!this.suggestionsBox.contains(e.target)) {
                this.suggestionsBox.style.display = 'none';
            }
        });
    }

    executeCommand(command) {
        this.write(`${this.device}:~ ${this.username}$ ${command}`, 'command');
        const [cmd, ...args] = command.split(' ');
        
        if (this.commandHandlers[cmd]) {
            this.commandHandlers[cmd](args);
        } else {
            this.write(`Command not found: ${cmd}`);
            const suggestions = Object.keys(this.commandHandlers)
                .filter(c => c.startsWith(cmd));
            if (suggestions.length > 0) {
                this.write('Did you mean one of these?');
                suggestions.forEach(suggestion => {
                    this.write(`  ${suggestion} - ${this.commandMeta[suggestion].description}`);
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

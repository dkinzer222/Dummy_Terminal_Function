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
            'lookup': (args) => this.ipLookup(args),
            'dns': (args) => this.dnsLookup(args)
        };
        
        // Enhanced command metadata for autocompletion
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
            'tools': { 
                description: 'List available security tools',
                args: [],
                examples: ['tools']
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
        this.suggestionsBox.style.display = 'none';
        this.terminal.appendChild(this.suggestionsBox);
    }

    updateSuggestions(input) {
        const parts = input.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        let suggestions = [];

        if (args.length === 0) {
            // Complete command names
            suggestions = Object.entries(this.commandMeta)
                .filter(([name]) => name.startsWith(cmd))
                .map(([name, meta]) => ({
                    text: name,
                    description: meta.description
                }));
        } else if (this.commandMeta[cmd]) {
            // Complete arguments if command exists
            const meta = this.commandMeta[cmd];
            if (meta.args && meta.args.length >= args.length) {
                const currentArgIndex = args.length - 1;
                const currentArg = args[currentArgIndex];
                
                // Show example values for the current argument
                if (meta.examples && meta.examples.length > 0) {
                    suggestions = meta.examples.map(example => {
                        const exampleArgs = example.split(' ');
                        return {
                            text: exampleArgs[currentArgIndex + 1] || '',
                            description: `Example: ${example}`
                        };
                    });
                }
                
                // Add the argument placeholder as a suggestion
                if (meta.args[currentArgIndex]) {
                    suggestions.push({
                        text: meta.args[currentArgIndex],
                        description: 'Expected argument'
                    });
                }
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
        
        // Position the suggestions box
        const inputRect = this.input.getBoundingClientRect();
        this.suggestionsBox.style.bottom = `${window.innerHeight - inputRect.top + 8}px`;
        this.suggestionsBox.style.left = `${inputRect.left}px`;
        this.suggestionsBox.style.width = `${inputRect.width}px`;
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
            if (Object.keys(this.commandHandlers).some(c => c.startsWith(cmd))) {
                this.write('Did you mean one of these?');
                Object.entries(this.commandMeta)
                    .filter(([name]) => name.startsWith(cmd))
                    .forEach(([name, meta]) => {
                        this.write(`  ${name} - ${meta.description}`);
                    });
            }
        }
    }

    // ... (rest of the methods remain unchanged)
}

document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

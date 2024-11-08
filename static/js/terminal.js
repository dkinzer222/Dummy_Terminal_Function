class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        this.prompt = document.querySelector('.prompt');
        this.history = [];
        this.historyIndex = -1;
        this.username = 'mobile';
        this.device = 'Jeffs-iPhone';
        this.commands = {
            'help': { 
                desc: 'Show available commands',
                fn: () => this.showHelp()
            },
            'clear': {
                desc: 'Clear terminal screen',
                fn: () => this.clear()
            },
            'ls': {
                desc: 'List directory contents',
                fn: () => this.listDirectory()
            },
            'pwd': {
                desc: 'Print working directory',
                fn: () => this.printWorkingDirectory()
            }
        };
        this.setupAutocompletion();
        this.updatePrompt();
        this.welcomeMessage();
    }

    setupAutocompletion() {
        this.suggestions = document.createElement('div');
        this.suggestions.className = 'suggestions-box';
        this.terminal.appendChild(this.suggestions);

        this.input.addEventListener('input', () => this.updateSuggestions());
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('click', () => this.suggestions.style.display = 'none');
    }

    updateSuggestions() {
        const input = this.input.value.toLowerCase();
        if (!input) {
            this.suggestions.style.display = 'none';
            return;
        }

        const matches = Object.entries(this.commands)
            .filter(([cmd]) => cmd.startsWith(input))
            .map(([cmd, details]) => ({
                command: cmd,
                description: details.desc
            }));

        if (matches.length === 0) {
            this.suggestions.style.display = 'none';
            return;
        }

        this.suggestions.innerHTML = matches.map(match => `
            <div class="suggestion">
                <div class="suggestion-text">${match.command}</div>
                <div class="suggestion-description">${match.description}</div>
            </div>
        `).join('');
        this.suggestions.style.display = 'block';
    }

    handleKeydown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.execute(this.input.value);
                break;
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
        }
    }

    autocomplete() {
        const input = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
            this.suggestions.style.display = 'none';
        }
    }

    execute(command) {
        const cmd = command.trim().toLowerCase();
        this.write(`${this.device}:~ ${this.username}$ ${command}`, 'command');
        
        if (cmd) {
            this.history.push(cmd);
            this.historyIndex = this.history.length;
            
            if (this.commands[cmd]) {
                this.commands[cmd].fn();
            } else {
                this.write(`Command not found: ${cmd}`);
            }
        }
        
        this.input.value = '';
        this.suggestions.style.display = 'none';
    }

    navigateHistory(direction) {
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (direction === 1 && this.historyIndex < this.history.length) {
            this.historyIndex++;
        }
        
        this.input.value = this.historyIndex < this.history.length ? 
            this.history[this.historyIndex] : '';
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
        Object.entries(this.commands).forEach(([cmd, details]) => {
            this.write(`  ${cmd}\t${details.desc}`);
        });
    }

    listDirectory() {
        this.write('Desktop  Documents  Downloads');
    }

    printWorkingDirectory() {
        this.write('/home/mobile');
    }

    updatePrompt() {
        if (this.prompt) {
            this.prompt.textContent = `${this.device}:~ ${this.username}$`;
        }
    }

    welcomeMessage() {
        this.write('Network Security Toolkit v1.0');
        this.write('Type "help" for available commands');
        this.write('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
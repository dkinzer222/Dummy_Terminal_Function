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
            this.setupInput();
            this.addEventListeners();
        }
    }

    setupElements() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
    }

    setupInput() {
        if (!this.input) return;
        
        // Prevent iOS keyboard
        this.input.setAttribute('readonly', 'readonly');
        
        this.input.addEventListener('focus', () => {
            if (window.keyboard) {
                window.keyboard.toggleKeyboard(true);
            }
        });

        // Handle keyboard input through custom keyboard only
        if (window.keyboard) {
            window.keyboard.onKeyPress = (key) => {
                switch(key) {
                    case 'Backspace':
                        this.input.value = this.input.value.slice(0, -1);
                        break;
                    case 'Enter':
                        const command = this.input.value.trim();
                        if (command) {
                            this.write(`$ ${command}`, 'command');
                            this.executeCommand(command);
                        }
                        this.input.value = '';
                        break;
                    case 'Space':
                        this.input.value += ' ';
                        break;
                    case 'Tab':
                    case 'Shift':
                    case 'Ctrl':
                    case 'Alt':
                    case 'Caps':
                        // Ignore these keys
                        break;
                    default:
                        if (key.startsWith('F')) {
                            // Handle function keys if needed
                            break;
                        }
                        this.input.value += key;
                }
                this.input.focus();
            };
        }
    }

    setupTerminalHeader() {
        const header = document.createElement('div');
        header.className = 'terminal-header';
        header.innerHTML = `
            <div class="terminal-title">Terminal</div>
            <div class="terminal-controls">
                <button class="minimize-btn"><i class='bx bx-minus'></i></button>
                <button class="maximize-btn"><i class='bx bx-expand'></i></button>
            </div>
        `;
        this.terminal.insertBefore(header, this.terminal.firstChild);
    }

    welcomeMessage() {
        this.write('Network Security Toolkit v1.0');
        this.write('Type "help" for available commands');
        this.write('');
    }

    write(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addEventListeners() {
        if (!this.input) return;

        // Remove keydown event listener since we're using custom keyboard
        this.input.addEventListener('click', () => {
            if (window.keyboard) {
                window.keyboard.toggleKeyboard(true);
            }
        });
    }

    executeCommand(command) {
        // Command execution logic will be implemented here
        this.write(`Command entered: ${command}`);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});

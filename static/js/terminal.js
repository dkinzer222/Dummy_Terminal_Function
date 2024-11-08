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
        
        this.input.setAttribute('readonly', 'readonly');
        
        this.input.addEventListener('focus', () => {
            if (window.keyboard) {
                window.keyboard.toggleKeyboard(true);
                this.input.classList.add('visible');
            }
        });

        this.input.addEventListener('input', () => {
            this.input.focus();
        });
    }

    executeCommand(command) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line command';
        cmdLine.textContent = `$ ${command}`;
        this.output.appendChild(cmdLine);
        
        const output = document.createElement('div');
        output.className = 'terminal-line output';
        output.textContent = `Executing: ${command}`;
        this.output.appendChild(output);
        
        this.output.scrollTop = this.output.scrollHeight;
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

        this.input.addEventListener('click', () => {
            if (window.keyboard) {
                window.keyboard.toggleKeyboard(true);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});
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
            this.setupInput();
            this.addEventListeners();
            this.setupMatrixBackground();
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
            }
        });

        this.input.addEventListener('click', () => {
            if (window.keyboard) {
                window.keyboard.toggleKeyboard(true);
            }
        });
    }

    setupMatrixBackground() {
        const matrixBg = document.createElement('div');
        matrixBg.className = 'matrix-bg';
        this.output.appendChild(matrixBg);

        const chars = '01';
        const columns = Math.floor(this.output.clientWidth / 15);
        
        for (let i = 0; i < columns; i++) {
            const text = document.createElement('div');
            text.className = 'matrix-text';
            text.style.left = (i * 15) + 'px';
            text.style.top = Math.random() * 100 + '%';
            text.textContent = chars[Math.floor(Math.random() * chars.length)];
            matrixBg.appendChild(text);
        }

        setInterval(() => {
            const texts = matrixBg.getElementsByClassName('matrix-text');
            for (let text of texts) {
                if (Math.random() > 0.98) {
                    text.textContent = chars[Math.floor(Math.random() * chars.length)];
                }
            }
        }, 100);
    }

    executeCommand(command) {
        const output = document.createElement('div');
        output.className = 'terminal-line output';
        output.textContent = command;
        this.output.appendChild(output);
        this.output.scrollTop = this.output.scrollHeight;
    }

    welcomeMessage() {
        // Remove welcome message
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

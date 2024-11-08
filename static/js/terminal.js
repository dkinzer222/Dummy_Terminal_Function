class Terminal {
    constructor() {
        this.glowTimeout = null;
        this.commandCount = 0;
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
        
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';
        
        const commandContainer = document.querySelector('.command-container');
        if (commandContainer) {
            commandContainer.appendChild(resizeHandle);
            
            let startY = 0;
            let startHeight = 0;
            
            resizeHandle.addEventListener('mousedown', (e) => {
                startY = e.clientY;
                startHeight = parseInt(getComputedStyle(commandContainer).height);
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            });
            
            const resize = (e) => {
                const diff = startY - e.clientY;
                commandContainer.style.height = `${startHeight + diff}px`;
            };
            
            const stopResize = () => {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            };
        }
    }

    updateGlowEffects(type, intensity) {
        const progressTab = document.querySelector('[data-tab="progress"]');
        const outputTab = document.querySelector('[data-tab="output"]');
        
        switch(type) {
            case 'typing':
                progressTab.className = 'tab-button active glow-level-1';
                break;
            case 'command':
                this.commandCount++;
                const level = Math.min(Math.floor(this.commandCount / 2) + 1, 3);
                progressTab.className = `tab-button active glow-level-${level}`;
                break;
            case 'output':
                outputTab.className = `tab-button glow-level-${intensity}`;
                break;
        }

        // Reset glow after inactivity
        clearTimeout(this.glowTimeout);
        this.glowTimeout = setTimeout(() => {
            progressTab.className = 'tab-button' + (progressTab.classList.contains('active') ? ' active' : '');
            outputTab.className = 'tab-button' + (outputTab.classList.contains('active') ? ' active' : '');
            this.commandCount = 0;
        }, 3000);
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

        this.input.addEventListener('input', () => {
            this.updateGlowEffects('typing', 1);
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
        // Display in output section with animation
        const output = document.createElement('div');
        output.className = 'terminal-line output new-command';
        output.textContent = command;
        this.output.appendChild(output);
        
        // Auto-scroll
        this.output.scrollTop = this.output.scrollHeight;
        
        // Update glow effects
        this.updateGlowEffects('command', 2);
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

class Terminal {
    constructor() {
        this.glowTimeout = null;
        this.commandCount = 0;
        this.mode = 'practice'; // Default mode
        this.commandHistory = [];
        this.historyIndex = -1;
        this.mockFs = {
            '/': {
                'home': {
                    'user': {
                        'documents': {},
                        'downloads': {},
                        'desktop': {}
                    }
                },
                'usr': {
                    'bin': {},
                    'local': {}
                }
            }
        };
        this.currentPath = '/home/user';
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
            this.showWelcomeMessage();
        }
    }

    setupElements() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.command-input');
        
        // Add mode indicator
        this.modeIndicator = document.createElement('div');
        this.modeIndicator.className = 'mode-indicator practice';
        this.modeIndicator.innerHTML = 'Practice Mode';
        this.terminal.insertBefore(this.modeIndicator, this.terminal.firstChild);
        
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

    setMode(mode) {
        this.mode = mode;
        this.modeIndicator.className = `mode-indicator ${mode}`;
        this.modeIndicator.innerHTML = `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`;
        this.showModeMessage();
    }

    showModeMessage() {
        const messages = {
            practice: 'Practice Mode: Safe environment for learning Linux commands. Type "help" for available commands.',
            system: 'System Mode: Execute real system commands. Be cautious!',
            virtual: 'Virtual Linux Mode: Full Linux environment simulation.'
        };
        this.write(messages[this.mode], 'system');
    }

    showWelcomeMessage() {
        this.write('Network Security Toolkit v1.0', 'system');
        this.write('Type "help" for available commands', 'system');
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

        // Add command history navigation
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion();
            }
        });
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        if (direction === 'up') {
            this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        } else {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }

        if (this.historyIndex >= 0) {
            this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
        } else {
            this.input.value = '';
        }
    }

    handleTabCompletion() {
        const input = this.input.value;
        const commands = {
            practice: ['help', 'ls', 'cd', 'pwd', 'echo', 'cat', 'mkdir', 'touch', 'rm', 'clear'],
            system: ['ls', 'pwd', 'whoami', 'date', 'ps', 'df', 'free', 'uptime', 'uname'],
            virtual: ['ls', 'cd', 'pwd', 'vim', 'nano', 'gcc', 'python', 'node', 'npm', 'git']
        };

        const matches = commands[this.mode].filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.write(matches.join('  '), 'system');
        }
    }

    async executeCommand(command) {
        if (!command.trim()) return;

        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = -1;

        // Display command
        const output = document.createElement('div');
        output.className = 'terminal-line output new-command';
        output.textContent = `$ ${command}`;
        this.output.appendChild(output);

        // Process command based on mode
        switch (this.mode) {
            case 'practice':
                this.executePracticeCommand(command);
                break;
            case 'system':
                await this.executeSystemCommand(command);
                break;
            case 'virtual':
                this.executeVirtualCommand(command);
                break;
        }

        // Clear input and scroll
        this.input.value = '';
        this.output.scrollTop = this.output.scrollHeight;
        this.updateGlowEffects('command', 2);
    }

    executePracticeCommand(command) {
        const [cmd, ...args] = command.trim().split(' ');

        switch (cmd) {
            case 'help':
                this.write(`Available commands: help, ls, cd, pwd, echo, cat, mkdir, touch, rm, clear
Use TAB for command completion and arrow keys for command history.`, 'help');
                break;
            case 'ls':
                this.write('Documents  Downloads  Desktop', 'success');
                break;
            case 'pwd':
                this.write(this.currentPath, 'success');
                break;
            case 'cd':
                if (args[0] === '..') {
                    this.currentPath = this.currentPath.split('/').slice(0, -1).join('/') || '/';
                } else if (args[0]) {
                    this.currentPath += '/' + args[0];
                }
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            default:
                this.write(`Command '${cmd}' not found. Type 'help' for available commands.`, 'error');
        }
    }

    async executeSystemCommand(command) {
        try {
            const response = await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });

            const result = await response.json();
            
            if (result.error) {
                this.write(result.message, 'error');
            } else {
                if (result.output) this.write(result.output, 'success');
                if (result.error_output) this.write(result.error_output, 'error');
            }
        } catch (error) {
            this.write('Error executing system command: ' + error.message, 'error');
        }
    }

    executeVirtualCommand(command) {
        // Simulate virtual Linux environment
        this.write(`Simulating: ${command}`, 'system');
        this.write('Virtual Linux environment is under development.', 'system');
    }

    write(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});

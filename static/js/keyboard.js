class Keyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.isVisible = false;
        this.isLocked = true;
        this.isDragging = false;
        this.keyboardLayout = [
            ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
        ];
        this.setupKeyboard();
        this.setupToggleButton();
        this.setupDraggable();
    }

    onKeyPress(key) {
        const input = document.querySelector('.command-input');
        if (!input) return;

        switch(key) {
            case 'Enter':
                const command = input.value.trim();
                if (command && window.terminal) {
                    window.terminal.executeCommand(command);
                    input.value = '';
                }
                break;
            case 'Backspace':
                input.value = input.value.slice(0, -1);
                break;
            default:
                if (key.length === 1 || key === 'Space') {
                    input.value += (key === 'Space' ? ' ' : key);
                }
        }
        
        const progressTab = document.querySelector('#progress-tab .terminal-output');
        if (progressTab) {
            progressTab.textContent = input.value;
        }
    }

    setupKeyboard() {
        if (!this.container) return;
        
        const size = this.isLocked ? { width: '100%' } : { width: '80%', left: '10%' };
        Object.assign(this.container.style, size);

        this.container.innerHTML = this.keyboardLayout.map((row, rowIndex) => `
            <div class="keyboard-row">
                ${row.map(key => {
                    const className = this.getKeyClassName(key);
                    return `<button class="key ${className}" data-key="${key}">${key}</button>`;
                }).join('')}
            </div>
        `).join('');

        this.container.addEventListener('click', (e) => {
            const keyButton = e.target.closest('.key');
            if (keyButton && typeof this.onKeyPress === 'function') {
                const key = keyButton.dataset.key;
                this.onKeyPress(key);
            }
        });
    }

    setupDraggable() {
        const lockBtn = document.createElement('button');
        lockBtn.className = 'keyboard-lock';
        lockBtn.innerHTML = '🔒';
        lockBtn.style.position = 'absolute';
        lockBtn.style.right = '10px';
        lockBtn.style.top = '10px';
        this.container.appendChild(lockBtn);

        lockBtn.addEventListener('click', () => {
            this.isLocked = !this.isLocked;
            lockBtn.innerHTML = this.isLocked ? '🔒' : '🔓';
            this.container.classList.toggle('draggable', !this.isLocked);
            
            const size = this.isLocked ? { width: '100%', left: '0' } : { width: '80%', left: '10%' };
            Object.assign(this.container.style, size);
        });

        const constrainPosition = () => {
            const rect = this.container.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            if (rect.right > windowWidth) {
                this.container.style.left = (windowWidth - rect.width) + 'px';
            }
            if (rect.bottom > windowHeight) {
                this.container.style.top = (windowHeight - rect.height) + 'px';
            }
            if (rect.left < 0) {
                this.container.style.left = '0px';
            }
            if (rect.top < 0) {
                this.container.style.top = '0px';
            }
        };

        this.container.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
            if (e.target === lockBtn) return;
            this.isDragging = true;
            this.dragStart = {
                x: e.clientX - this.container.offsetLeft,
                y: e.clientY - this.container.offsetTop
            };
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.container.style.left = (e.clientX - this.dragStart.x) + 'px';
            this.container.style.top = (e.clientY - this.dragStart.y) + 'px';
            constrainPosition();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.container.addEventListener('touchstart', (e) => {
            if (this.isLocked) return;
            this.isDragging = true;
            this.dragStart = {
                x: e.touches[0].clientX - this.container.offsetLeft,
                y: e.touches[0].clientY - this.container.offsetTop
            };
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            this.container.style.left = (e.touches[0].clientX - this.dragStart.x) + 'px';
            this.container.style.top = (e.touches[0].clientY - this.dragStart.y) + 'px';
            constrainPosition();
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }

    getKeyClassName(key) {
        const classMap = {
            'Space': 'space-key',
            'Shift': 'modifier-key',
            'Ctrl': 'modifier-key',
            'Alt': 'modifier-key',
            'Tab': 'modifier-key',
            'Caps': 'modifier-key',
            'Enter': 'modifier-key',
            'Backspace': 'modifier-key'
        };
        
        if (key.startsWith('F')) return 'function-key';
        return classMap[key] || '';
    }

    setupToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'keyboard-toggle';
        toggleBtn.innerHTML = '⌨️ Keyboard';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '10px';
        toggleBtn.style.left = '50%';
        toggleBtn.style.transform = 'translateX(-50%)';
        toggleBtn.style.zIndex = '1000';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => this.toggleKeyboard());
    }

    toggleKeyboard(show) {
        if (typeof show === 'boolean') {
            this.isVisible = show;
        } else {
            this.isVisible = !this.isVisible;
        }
        
        if (this.container) {
            this.container.classList.toggle('visible', this.isVisible);
            const input = document.querySelector('.terminal-input');
            if (input) {
                input.classList.toggle('visible', this.isVisible);
                input.focus();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.keyboard = new Keyboard();
});
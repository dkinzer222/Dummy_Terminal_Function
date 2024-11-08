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
    }

    setupKeyboard() {
        if (!this.container) return;
        
        const size = this.isLocked ? { width: '90vw', left: '5vw' } : { width: '80vw', left: '10vw' };
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
            const input = document.querySelector('.command-container');
            if (input) {
                if (this.isVisible) {
                    input.style.display = 'block';
                    input.querySelector('.command-input').focus();
                } else {
                    input.style.display = 'none';
                }
            }
        }
    }

    setupDraggable() {
        if (!this.container) return;

        const lockBtn = document.createElement('button');
        lockBtn.className = 'keyboard-lock';
        lockBtn.innerHTML = '🔒';
        lockBtn.style.position = 'absolute';
        lockBtn.style.right = '10px';
        lockBtn.style.top = '10px';
        this.container.appendChild(lockBtn);

        // Add resize handles
        const topHandle = document.createElement('div');
        topHandle.className = 'resize-handle top';
        
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resize-handle right';
        
        this.container.appendChild(topHandle);
        this.container.appendChild(rightHandle);

        let startY, startHeight, startX, startWidth;

        topHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startY = e.clientY;
            startHeight = parseInt(getComputedStyle(this.container).height);
            document.addEventListener('mousemove', resizeHeight);
            document.addEventListener('mouseup', stopResize);
        });

        rightHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(this.container).width);
            document.addEventListener('mousemove', resizeWidth);
            document.addEventListener('mouseup', stopResize);
        });

        const resizeHeight = (e) => {
            if (!this.isLocked) {
                const newHeight = startHeight - (e.clientY - startY);
                if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
                    this.container.style.height = newHeight + 'px';
                }
            }
        };

        const resizeWidth = (e) => {
            if (!this.isLocked) {
                const newWidth = startWidth + (e.clientX - startX);
                if (newWidth > 200 && newWidth < window.innerWidth * 0.9) {
                    this.container.style.width = newWidth + 'px';
                }
            }
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', resizeHeight);
            document.removeEventListener('mousemove', resizeWidth);
            document.removeEventListener('mouseup', stopResize);
        };

        lockBtn.addEventListener('click', () => {
            this.isLocked = !this.isLocked;
            lockBtn.innerHTML = this.isLocked ? '🔒' : '🔓';
            this.container.classList.toggle('draggable', !this.isLocked);
            
            if (this.isLocked) {
                this.container.style.width = '90vw';
                this.container.style.left = '5vw';
                this.container.style.bottom = '5vh';
                this.container.style.top = 'auto';
                this.container.style.height = '30vh';
                topHandle.style.display = 'none';
                rightHandle.style.display = 'none';
            } else {
                this.container.style.width = '80vw';
                this.container.style.left = '10vw';
                this.container.style.height = '30vh';
                topHandle.style.display = 'block';
                rightHandle.style.display = 'block';
            }
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.keyboard = new Keyboard();
});

class Keyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.isVisible = false;
        this.isLocked = true;
        this.isDragging = false;
        this.keyboardLayout = [
            // Function key row
            ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            // Number row
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            // QWERTY row
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            // Home row
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
            // Shift row
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            // Bottom row
            ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
        ];
        this.setupKeyboard();
        this.setupToggleButton();
        this.setupDraggable();
    }

    setupKeyboard() {
        if (!this.container) return;

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
        });

        this.container.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
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
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Add touch support
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

// Initialize keyboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.keyboard = new Keyboard();
});
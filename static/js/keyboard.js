class Keyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.isVisible = false;
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
            if (this.isVisible) {
                const input = document.querySelector('.command-input');
                if (input) {
                    input.focus();
                }
            }
        }
    }
}

// Initialize keyboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.keyboard = new Keyboard();
});

class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.layout = [
            ['✄', '□', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '←', '→'],
            ['✎', 'B', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '!', '?'],
            ['↩', '🎤', '⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫', '.', ','],
            ['🌐', '123', 'space', 'return', '⌨']
        ];
        this.isShift = false;
        this.isNumeric = false;
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = this.layout.map((row, i) => `
            <div class="keyboard-row">
                ${row.map(key => {
                    let className = 'key';
                    if (key === 'space') className += ' space-key';
                    if (key === 'return') className += ' return-key';
                    if (key === '🌐' || key === '🎤' || key === '⌨') className += ' special-key';
                    if (key === '⇧' || key === '⌫' || key === '123') className += ' system-key';
                    return `<button class="${className}" data-key="${key}">
                        ${key === 'space' ? '' : key}
                    </button>`;
                }).join('')}
            </div>
        `).join('');
    }

    handleKey(key) {
        switch(key) {
            case '⇧':
                this.isShift = !this.isShift;
                this.updateShiftState();
                break;
            case '⌫':
                this.handleBackspace();
                break;
            case 'space':
                this.insertText(' ');
                break;
            case 'return':
                this.handleReturn();
                break;
            case '123':
                this.toggleNumericKeyboard();
                break;
            case '←':
                this.moveCursor(-1);
                break;
            case '→':
                this.moveCursor(1);
                break;
            case '🌐':
            case '🎤':
            case '⌨':
                // Special keys functionality would go here
                break;
            default:
                if (key.length === 1) {
                    this.insertText(this.isShift ? key.toUpperCase() : key.toLowerCase());
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateShiftState();
                    }
                }
        }
        this.input.focus();
    }

    moveCursor(direction) {
        const pos = this.input.selectionStart;
        this.input.selectionStart = this.input.selectionEnd = pos + direction;
    }

    handleBackspace() {
        const start = this.input.selectionStart;
        const end = this.input.selectionEnd;
        if (start === end) {
            if (start > 0) {
                this.input.value = this.input.value.slice(0, start - 1) + this.input.value.slice(end);
                this.input.selectionStart = this.input.selectionEnd = start - 1;
            }
        } else {
            this.input.value = this.input.value.slice(0, start) + this.input.value.slice(end);
            this.input.selectionStart = this.input.selectionEnd = start;
        }
        const event = new Event('input');
        this.input.dispatchEvent(event);
    }

    insertText(text) {
        const start = this.input.selectionStart;
        const end = this.input.selectionEnd;
        this.input.value = this.input.value.slice(0, start) + text + this.input.value.slice(end);
        this.input.selectionStart = this.input.selectionEnd = start + text.length;
        const event = new Event('input');
        this.input.dispatchEvent(event);
    }

    handleReturn() {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        this.input.dispatchEvent(event);
    }

    updateShiftState() {
        const keys = this.container.querySelectorAll('.key:not(.special-key):not(.system-key)');
        keys.forEach(key => {
            const keyText = key.textContent.trim();
            if (keyText.length === 1 && keyText.match(/[a-zA-Z]/)) {
                key.textContent = this.isShift ? keyText.toUpperCase() : keyText.toLowerCase();
            }
        });
    }

    toggleNumericKeyboard() {
        this.isNumeric = !this.isNumeric;
        // Implementation for numeric keyboard would go here
    }

    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                const keyValue = key.dataset.key;
                this.handleKey(keyValue);
            }
        });

        // Physical keyboard input handling
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleReturn();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualKeyboard();
});

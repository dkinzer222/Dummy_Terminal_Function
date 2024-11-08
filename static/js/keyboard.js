class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.message-input');
        this.layout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
            ['123', '😊', 'space', 'return', '🎤']
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
                    if (key === 'space') className += ' space';
                    if (key === 'return') className += ' return';
                    if (key === '😊' || key === '🎤') className += ' emoji';
                    if (!key.match(/[A-Z]/)) className += ' special';
                    return `<button class="${className}">${key === 'space' ? '' : key}</button>`;
                }).join('')}
            </div>
        `).join('');
    }

    handleSpecialKeys(key) {
        switch(key) {
            case '⇧':
                this.isShift = !this.isShift;
                this.updateShiftState();
                break;
            case '⌫':
                const input = this.input;
                const start = input.selectionStart;
                const end = input.selectionEnd;
                if (start === end) {
                    input.value = input.value.slice(0, start - 1) + input.value.slice(end);
                    input.selectionStart = input.selectionEnd = start - 1;
                } else {
                    input.value = input.value.slice(0, start) + input.value.slice(end);
                    input.selectionStart = input.selectionEnd = start;
                }
                break;
            case 'space':
                this.input.value += ' ';
                break;
            case 'return':
                document.querySelector('.send-button').click();
                break;
            case '123':
                this.isNumeric = !this.isNumeric;
                this.updateNumericState();
                break;
            default:
                return false;
        }
        return true;
    }

    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (!key) return;

            const value = key.textContent;
            
            if (!this.handleSpecialKeys(value)) {
                if (value.length === 1) {
                    const input = this.input;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const char = this.isShift ? value.toUpperCase() : value.toLowerCase();
                    input.value = input.value.slice(0, start) + char + input.value.slice(end);
                    input.selectionStart = input.selectionEnd = start + 1;
                    
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateShiftState();
                    }
                }
            }
            
            this.input.focus();
        });

        // Handle physical keyboard input
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.send-button').click();
            }
        });
    }

    updateShiftState() {
        const keys = this.container.querySelectorAll('.key:not(.special)');
        keys.forEach(key => {
            key.textContent = this.isShift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        });
    }

    updateNumericState() {
        // Implementation for numeric keyboard layout would go here
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualKeyboard();
});

class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.layout = [
            ['✂️', '📋', '📄', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['☐', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '!', '?'],
            ['↩', '🎤', '⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫', '.', ','],
            ['🌐', '123', 'space', 'return', '⌨️']
        ];
        this.isShift = false;
        this.isNumeric = false;
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
        this.setupKeyboardToggle();
    }

    setupKeyboardToggle() {
        const keyboard = document.querySelector('.mobile-keyboard');
        const toggleBtn = document.querySelector('.keyboard-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                keyboard.classList.toggle('hidden');
            });
        }

        this.input.addEventListener('focus', () => {
            keyboard.classList.remove('hidden');
        });
    }

    render() {
        this.container.innerHTML = '';
        this.layout.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                if (key.length > 1 || !key.match(/[A-Za-z0-9]/)) {
                    keyDiv.className += ' special-key';
                }
                keyDiv.textContent = key;
                keyDiv.dataset.key = key;
                
                if (key === 'space') {
                    keyDiv.className += ' space-key';
                    keyDiv.textContent = '';
                } else if (key === 'return') {
                    keyDiv.className += ' return-key';
                }
                
                rowDiv.appendChild(keyDiv);
            });
            
            this.container.appendChild(rowDiv);
        });
    }

    handleSpecialKeys(key) {
        switch(key) {
            case '✂️':
                document.execCommand('cut');
                break;
            case '📋':
                document.execCommand('paste');
                break;
            case '📄':
                document.execCommand('copy');
                break;
            case '⇧':
                this.isShift = !this.isShift;
                this.updateShiftState();
                break;
            case '⌫':
                this.input.value = this.input.value.slice(0, -1);
                break;
            case 'space':
                this.input.value += ' ';
                break;
            case 'return':
                this.input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
                break;
            case '123':
                this.isNumeric = !this.isNumeric;
                this.updateNumericState();
                break;
            case '🌐':
            case '⌨️':
                // Toggle keyboard visibility
                document.querySelector('.mobile-keyboard').classList.toggle('hidden');
                break;
            case '🎤':
                // Speech recognition would be implemented here
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

            const value = key.dataset.key;
            
            if (!this.handleSpecialKeys(value)) {
                if (value.length === 1) {
                    this.input.value += this.isShift ? value.toUpperCase() : value.toLowerCase();
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateShiftState();
                    }
                }
            }
            
            this.input.focus();
        });
    }

    updateShiftState() {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            const value = key.dataset.key;
            if (value && value.length === 1 && value.match(/[a-zA-Z]/)) {
                key.textContent = this.isShift ? value.toUpperCase() : value.toLowerCase();
            }
        });
    }

    updateNumericState() {
        // Implementation for numeric keyboard layout would go here
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualKeyboard();
});

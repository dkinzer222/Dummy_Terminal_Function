class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.layout = [
            ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl'],
            ['Insert', 'Home', 'PgUp', 'Delete', 'End', 'PgDn'],
            ['↑', '←', '↓', '→'],
            ['Num', '/', '*', '-'],
            ['7', '8', '9', '+'],
            ['4', '5', '6'],
            ['1', '2', '3', 'Enter'],
            ['0', '.']
        ];
        this.isShift = false;
        this.isNumLock = true;
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = '';
        
        this.layout.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyDiv = document.createElement('button');
                keyDiv.className = 'key';
                keyDiv.textContent = key;
                keyDiv.dataset.key = key;
                
                // Add specific classes for special keys
                if (['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(key)) {
                    keyDiv.classList.add('function-key');
                } else if (['Shift', 'Ctrl', 'Alt', 'Win', 'Menu'].includes(key)) {
                    keyDiv.classList.add('modifier-key');
                } else if (['Enter', 'Backspace', 'Tab', 'Caps'].includes(key)) {
                    keyDiv.classList.add('control-key');
                } else if (key === 'Space') {
                    keyDiv.classList.add('space-key');
                } else if (['Insert', 'Home', 'PgUp', 'Delete', 'End', 'PgDn'].includes(key)) {
                    keyDiv.classList.add('navigation-key');
                } else if (['↑', '←', '↓', '→'].includes(key)) {
                    keyDiv.classList.add('arrow-key');
                }
                
                rowDiv.appendChild(keyDiv);
            });
            
            this.container.appendChild(rowDiv);
        });
    }

    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (!key) return;

            const value = key.dataset.key;
            
            switch(value) {
                case 'Shift':
                    this.isShift = !this.isShift;
                    this.updateShiftState();
                    break;
                case 'Caps':
                    key.classList.toggle('active');
                    this.isShift = !this.isShift;
                    this.updateShiftState();
                    break;
                case 'Backspace':
                    this.input.value = this.input.value.slice(0, -1);
                    break;
                case 'Space':
                    this.input.value += ' ';
                    break;
                case 'Enter':
                    if (this.input.value.trim()) {
                        this.input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
                    }
                    break;
                case 'Tab':
                    this.input.value += '\t';
                    break;
                case 'Num':
                    this.isNumLock = !this.isNumLock;
                    key.classList.toggle('active');
                    break;
                default:
                    if (value.length === 1) {
                        this.input.value += this.isShift ? value.toUpperCase() : value.toLowerCase();
                        if (this.isShift && !document.querySelector('.key[data-key="Caps"].active')) {
                            this.isShift = false;
                            this.updateShiftState();
                        }
                    }
            }
            
            this.input.focus();
            
            // Provide haptic feedback if available
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });

        // Handle touch events for better mobile experience
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('touchstart', () => {
                key.classList.add('pressed');
            });
            
            key.addEventListener('touchend', () => {
                key.classList.remove('pressed');
            });
        });
    }

    updateShiftState() {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            const value = key.dataset.key;
            if (value.length === 1 && value.match(/[a-z]/i)) {
                key.textContent = this.isShift ? value.toUpperCase() : value.toLowerCase();
            }
        });
        
        document.querySelectorAll('.key[data-key="Shift"]').forEach(key => {
            key.classList.toggle('active', this.isShift);
        });
    }
}

// Initialize keyboard when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.keyboard = new VirtualKeyboard();
    });
} else {
    window.keyboard = new VirtualKeyboard();
}

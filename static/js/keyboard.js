class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.isCollapsed = false;
        this.showSpecialKeys = false;
        
        // Main keyboard layout
        this.mainLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
        ];

        // Special keys layout
        this.specialLayout = [
            ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            ['Insert', 'Home', 'PgUp', 'Delete', 'End', 'PgDn'],
            ['↑', '←', '↓', '→']
        ];

        this.isShift = false;
        this.isCaps = false;
        this.init();
    }

    init() {
        this.createKeyboardContainer();
        this.render();
        this.addEventListeners();
    }

    createKeyboardContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'keyboard-container';
            document.body.appendChild(this.container);
        }

        // Add keyboard controls
        const controls = document.createElement('div');
        controls.className = 'keyboard-controls';
        
        const toggleSpecialKeys = document.createElement('button');
        toggleSpecialKeys.className = 'keyboard-control-btn';
        toggleSpecialKeys.innerHTML = '<i class="bx bx-chevron-down"></i>';
        toggleSpecialKeys.onclick = () => this.toggleSpecialKeys();

        const toggleKeyboard = document.createElement('button');
        toggleKeyboard.className = 'keyboard-control-btn';
        toggleKeyboard.innerHTML = '<i class="bx bx-keyboard"></i>';
        toggleKeyboard.onclick = () => this.toggleKeyboard();

        controls.appendChild(toggleSpecialKeys);
        controls.appendChild(toggleKeyboard);
        
        this.container.appendChild(controls);
    }

    render() {
        const keyboardContent = document.createElement('div');
        keyboardContent.className = 'keyboard-content';
        
        // Render special keys if enabled
        if (this.showSpecialKeys) {
            const specialKeysDiv = document.createElement('div');
            specialKeysDiv.className = 'special-keys';
            
            this.specialLayout.forEach(row => {
                const rowDiv = this.createRow(row);
                specialKeysDiv.appendChild(rowDiv);
            });
            
            keyboardContent.appendChild(specialKeysDiv);
        }

        // Render main keyboard
        const mainKeysDiv = document.createElement('div');
        mainKeysDiv.className = 'main-keys';
        
        this.mainLayout.forEach(row => {
            const rowDiv = this.createRow(row);
            mainKeysDiv.appendChild(rowDiv);
        });
        
        keyboardContent.appendChild(mainKeysDiv);
        
        // Clear and update container
        const oldContent = this.container.querySelector('.keyboard-content');
        if (oldContent) {
            oldContent.remove();
        }
        this.container.appendChild(keyboardContent);
        
        // Update container classes
        this.container.classList.toggle('collapsed', this.isCollapsed);
        this.container.classList.toggle('special-keys-visible', this.showSpecialKeys);
    }

    createRow(keys) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        keys.forEach(key => {
            const keyDiv = document.createElement('button');
            keyDiv.className = 'key';
            keyDiv.textContent = key;
            keyDiv.dataset.key = key;
            
            // Add specific classes for special keys
            if (['Shift', 'Ctrl', 'Alt'].includes(key)) {
                keyDiv.classList.add('modifier-key');
            } else if (['Enter', 'Backspace', 'Tab', 'Caps'].includes(key)) {
                keyDiv.classList.add('control-key');
            } else if (key === 'Space') {
                keyDiv.classList.add('space-key');
            }
            
            rowDiv.appendChild(keyDiv);
        });
        
        return rowDiv;
    }

    toggleSpecialKeys() {
        this.showSpecialKeys = !this.showSpecialKeys;
        this.render();
    }

    toggleKeyboard() {
        this.isCollapsed = !this.isCollapsed;
        this.render();
    }

    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (!key) return;

            const value = key.dataset.key;
            this.handleKeyPress(value);
            
            // Provide haptic feedback if available
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });

        // Handle touch events
        this.container.addEventListener('touchstart', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                key.classList.add('pressed');
            }
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                key.classList.remove('pressed');
            }
        }, { passive: true });
    }

    handleKeyPress(value) {
        if (!this.input) return;

        switch(value) {
            case 'Shift':
                this.isShift = !this.isShift;
                this.updateModifierState();
                break;
            case 'Caps':
                this.isCaps = !this.isCaps;
                this.updateModifierState();
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
            default:
                if (value.length === 1) {
                    const isUpper = (this.isShift && !this.isCaps) || (!this.isShift && this.isCaps);
                    this.input.value += isUpper ? value.toUpperCase() : value.toLowerCase();
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateModifierState();
                    }
                }
        }
        
        this.input.focus();
    }

    updateModifierState() {
        this.container.querySelectorAll('.key').forEach(key => {
            const value = key.dataset.key;
            if (value.length === 1 && value.match(/[a-z]/i)) {
                const isUpper = (this.isShift && !this.isCaps) || (!this.isShift && this.isCaps);
                key.textContent = isUpper ? value.toUpperCase() : value.toLowerCase();
            }
            if (value === 'Shift') {
                key.classList.toggle('active', this.isShift);
            }
            if (value === 'Caps') {
                key.classList.toggle('active', this.isCaps);
            }
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

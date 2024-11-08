class VirtualKeyboard {
    constructor() {
        // Initialize state
        this.isVisible = false;
        this.showSpecialKeys = false;
        this.isShift = false;
        this.isCaps = false;
        
        // Main keyboard layout
        this.mainLayout = [
            // Row 1: 12 keys
            ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            // Row 2: 20 keys
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '[', ']', 'Insert', 'Home', 'PgUp', 'Del'],
            // Row 3: 20 keys
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k'],
            // Bottom row
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            // Control row
            ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
        ];

        // Removed specialLayout as it's now integrated into mainLayout

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupElements();
        if (this.container && this.input) {
            this.createKeyboardContainer();
            this.createKeyboardToggle();
            this.render();
            this.addEventListeners();
            this.preventNativeKeyboard();
        } else {
            console.warn('Keyboard elements not found, retrying initialization...');
            setTimeout(() => this.init(), 500);
        }
    }

    setupElements() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.terminal = document.querySelector('.terminal');
    }

    preventNativeKeyboard() {
        if (this.input) {
            // Prevent native keyboard on iOS
            this.input.setAttribute('readonly', 'readonly');
            this.input.addEventListener('focus', (e) => {
                e.preventDefault();
                this.input.blur();
                setTimeout(() => {
                    this.input.focus();
                }, 100);
            });
        }
    }

    createKeyboardContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'keyboard-container';
            document.body.appendChild(this.container);
        }

        const controls = document.createElement('div');
        controls.className = 'keyboard-controls';
        
        const toggleTerminal = document.createElement('button');
        toggleTerminal.className = 'keyboard-control-btn';
        toggleTerminal.innerHTML = '<i class="bx bx-terminal"></i> Terminal';
        toggleTerminal.onclick = () => this.toggleTerminal();

        const toggleSpecialKeys = document.createElement('button');
        toggleSpecialKeys.className = 'keyboard-control-btn';
        toggleSpecialKeys.innerHTML = '<i class="bx bx-chevron-down"></i> Special';
        toggleSpecialKeys.onclick = () => this.toggleSpecialKeys();

        controls.appendChild(toggleTerminal);
        controls.appendChild(toggleSpecialKeys);
        
        this.container.appendChild(controls);
    }

    createKeyboardToggle() {
        let toggle = document.querySelector('.keyboard-toggle');
        if (!toggle) {
            toggle = document.createElement('button');
            toggle.className = 'keyboard-toggle';
            toggle.innerHTML = '<i class="bx bx-chevron-up"></i> Keyboard';
            document.body.appendChild(toggle);
        }
        
        // Remove any existing listeners and create new toggle
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        newToggle.addEventListener('click', () => this.toggleKeyboard());
    }

    toggleKeyboard() {
        if (!this.container) return;

        this.isVisible = !this.isVisible;
        this.container.classList.toggle('visible', this.isVisible);
        
        const toggle = document.querySelector('.keyboard-toggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            icon.classList.toggle('bx-chevron-up', !this.isVisible);
            icon.classList.toggle('bx-chevron-down', this.isVisible);
        }

        // Focus input when showing keyboard
        if (this.isVisible && this.input) {
            this.input.focus();
            this.input.click(); // Ensure mobile keyboard doesn't appear
        }
    }

    toggleTerminal() {
        if (this.terminal) {
            this.terminal.classList.toggle('minimized');
            const btn = this.container.querySelector('.keyboard-control-btn');
            const icon = btn.querySelector('i');
            icon.classList.toggle('bx-terminal');
            icon.classList.toggle('bx-window');
        }
    }

    toggleSpecialKeys() {
        this.showSpecialKeys = !this.showSpecialKeys;
        this.render();
        const btn = this.container.querySelectorAll('.keyboard-control-btn')[1];
        const icon = btn.querySelector('i');
        icon.classList.toggle('bx-chevron-down');
        icon.classList.toggle('bx-chevron-up');
    }

    render() {
        if (!this.container) return;

        const keyboardContent = document.createElement('div');
        keyboardContent.className = 'keyboard-content';
        
        const mainKeysDiv = document.createElement('div');
        mainKeysDiv.className = 'main-keys';
        
        this.mainLayout.forEach(row => {
            const rowDiv = this.createRow(row);
            mainKeysDiv.appendChild(rowDiv);
        });
        
        keyboardContent.appendChild(mainKeysDiv);
        
        const oldContent = this.container.querySelector('.keyboard-content');
        if (oldContent) {
            oldContent.remove();
        }
        this.container.appendChild(keyboardContent);
    }

    createRow(keys) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        keys.forEach(key => {
            const keyDiv = document.createElement('button');
            keyDiv.className = 'key';
            keyDiv.textContent = key;
            keyDiv.dataset.key = key;
            
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

    addEventListeners() {
        if (!this.container || !this.input) return;

        // Keyboard key press events
        this.container.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (!key) return;

            const value = key.dataset.key;
            this.handleKeyPress(value);
            
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });

        // Input focus events
        this.input.addEventListener('focus', () => {
            if (!this.isVisible) {
                this.toggleKeyboard();
            }
        });

        // Click outside to hide keyboard
        document.addEventListener('click', (e) => {
            if (this.isVisible && 
                !e.target.closest('.keyboard-container') && 
                !e.target.closest('.command-input') &&
                !e.target.closest('.keyboard-toggle')) {
                this.toggleKeyboard();
            }
        });
    }

    handleKeyPress(value) {
        if (!this.input) return;

        this.input.removeAttribute('readonly');
        
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
                const start = this.input.selectionStart;
                const end = this.input.selectionEnd;
                if (start === end) {
                    this.input.value = this.input.value.slice(0, start - 1) + this.input.value.slice(start);
                    this.input.selectionStart = this.input.selectionEnd = start - 1;
                } else {
                    this.input.value = this.input.value.slice(0, start) + this.input.value.slice(end);
                    this.input.selectionStart = this.input.selectionEnd = start;
                }
                break;
            case 'Space':
                this.insertAtCursor(' ');
                break;
            case 'Enter':
                if (this.input.value.trim()) {
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        bubbles: true,
                        cancelable: true
                    });
                    this.input.dispatchEvent(event);
                }
                break;
            case 'Tab':
                this.insertAtCursor('\t');
                break;
            default:
                if (value.length === 1) {
                    const isUpper = (this.isShift && !this.isCaps) || (!this.isShift && this.isCaps);
                    this.insertAtCursor(isUpper ? value.toUpperCase() : value.toLowerCase());
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateModifierState();
                    }
                }
        }

        // Ensure the input stays focused and readonly
        setTimeout(() => {
            this.input.setAttribute('readonly', 'readonly');
            this.input.focus();
        }, 0);
    }

    insertAtCursor(text) {
        const start = this.input.selectionStart;
        const end = this.input.selectionEnd;
        this.input.value = this.input.value.slice(0, start) + text + this.input.value.slice(end);
        this.input.selectionStart = this.input.selectionEnd = start + text.length;
    }

    updateModifierState() {
        if (!this.container) return;

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

// Initialize keyboard
window.keyboard = new VirtualKeyboard();
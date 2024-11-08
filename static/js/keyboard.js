class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.layout = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
            ['123', '🌐', 'space', 'return']
        ];
        this.isShift = false;
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
                
                if (key === 'space') {
                    keyDiv.style.gridColumn = 'span 6';
                } else if (key === 'return') {
                    keyDiv.style.gridColumn = 'span 2';
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
                    if (this.input.value.trim()) {
                        this.input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
                    }
                    break;
                case '123':
                    // Toggle number row visibility
                    break;
                case '🌐':
                    // Toggle keyboard visibility
                    this.container.classList.toggle('hidden');
                    break;
                default:
                    if (this.isShift) {
                        this.input.value += value.toUpperCase();
                        this.isShift = false;
                        this.updateShiftState();
                    } else {
                        this.input.value += value.toLowerCase();
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
                key.style.backgroundColor = '#3d3d3d';
            });
            
            key.addEventListener('touchend', () => {
                key.style.backgroundColor = '';
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
    }

    show() {
        this.container.classList.remove('hidden');
    }

    hide() {
        this.container.classList.add('hidden');
    }

    toggle() {
        this.container.classList.toggle('hidden');
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

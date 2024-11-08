class VirtualKeyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.input = document.querySelector('.command-input');
        this.layout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
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
        this.layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                keyDiv.textContent = key;
                keyDiv.dataset.key = key;
                
                if (key === 'space') {
                    keyDiv.style.gridColumn = 'span 4';
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
                    this.input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
                    break;
                default:
                    this.input.value += this.isShift ? value : value.toLowerCase();
                    if (this.isShift) {
                        this.isShift = false;
                        this.updateShiftState();
                    }
            }
            
            this.input.focus();
        });
    }

    updateShiftState() {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            if (key.dataset.key.length === 1 && key.dataset.key.match(/[A-Z]/)) {
                key.textContent = this.isShift ? key.dataset.key : key.dataset.key.toLowerCase();
            }
        });
    }
}

// Initialize keyboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualKeyboard();
});

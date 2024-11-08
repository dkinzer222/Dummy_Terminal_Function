class Keyboard {
    constructor() {
        this.container = document.querySelector('.keyboard-container');
        this.isVisible = false;
        this.setupToggleButton();
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
            
            // Ensure input focus when keyboard shows
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

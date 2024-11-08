class App {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.currentTab = 'progress';
    }

    initializeElements() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.modal = document.querySelector('.tool-modal');
    }

    addEventListeners() {
        // Tab navigation
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
            button.addEventListener('touchstart', () => {
                button.style.backgroundColor = 'rgba(107, 94, 217, 0.2)';
            });
            button.addEventListener('touchend', () => {
                button.style.backgroundColor = '';
            });
        });

        // Swipe detection
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Modal close button
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0 && this.currentTab === 'progress') {
            // Swipe left - go to output
            this.switchTab('output');
        } else if (diff < 0 && this.currentTab === 'output') {
            // Swipe right - go to progress
            this.switchTab('progress');
        }
    }

    showModal(title, content) {
        const modalTitle = this.modal.querySelector('.modal-header h3');
        const modalBody = this.modal.querySelector('.modal-body');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        this.modal.style.display = 'block';
        
        // Add slide-up animation class
        this.modal.querySelector('.modal-content').style.animation = 'slideUp 0.3s ease-out';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.app-content').appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loading';
        return loader;
    }
}

function createMatrixBackground() {
    const bg = document.querySelector('.matrix-bg');
    if (!bg) return;

    const characters = ['D', 'T', 'F', '0', '1'];
    
    const createText = () => {
        const text = document.createElement('div');
        text.className = 'matrix-text';
        // Randomly select character from the array
        text.textContent = characters[Math.floor(Math.random() * characters.length)];
        text.style.left = Math.random() * 100 + '%';
        text.style.animationDuration = (Math.random() * 10 + 10) + 's';
        text.style.fontSize = (Math.random() * 10 + 14) + 'px';
        bg.appendChild(text);
        setTimeout(() => text.remove(), 20000);
    };
    
    // Create more characters for denser effect
    setInterval(createText, 100);
}

// Initialize app and matrix background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    createMatrixBackground();
});

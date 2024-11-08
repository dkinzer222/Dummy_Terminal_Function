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

        // Mode menu toggle
        const modeToggle = document.getElementById('mode-toggle');
        const modeDropdown = document.querySelector('.mode-dropdown');
        
        if (modeToggle && modeDropdown) {
            modeToggle.addEventListener('click', () => {
                modeDropdown.classList.toggle('visible');
            });

            document.addEventListener('click', (e) => {
                if (!modeToggle.contains(e.target)) {
                    modeDropdown.classList.remove('visible');
                }
            });

            modeDropdown.addEventListener('click', (e) => {
                const modeBtn = e.target.closest('.mode-btn');
                if (modeBtn && window.terminal) {
                    const mode = modeBtn.dataset.mode;
                    window.terminal.setMode(mode);
                    modeDropdown.classList.remove('visible');
                }
            });
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

        if (tabName === 'output') {
            const hasWebView = document.querySelector('.output-container iframe');
            if (hasWebView && window.terminal) {
                window.terminal.updateGlowEffects('output', 3);
            }
        }
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
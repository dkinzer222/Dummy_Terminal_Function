[Previous content plus updated setupElements and setupMatrixBackground methods]

setupElements() {
    this.terminal = document.querySelector('.terminal');
    this.output = document.querySelector('.terminal-output');
    this.input = document.querySelector('.command-input');
    
    // Remove old mode indicator
    if (this.modeIndicator) {
        this.modeIndicator.remove();
    }

    // Add matrix background to terminal section
    const terminalSection = document.querySelector('.terminal-section');
    if (terminalSection) {
        const matrixBg = document.createElement('div');
        matrixBg.className = 'matrix-bg';
        terminalSection.appendChild(matrixBg);
        this.setupMatrixBackground(matrixBg);
    }
}

setupMatrixBackground(container) {
    if (!container) return;
    
    const chars = '01';
    const columns = Math.floor(container.clientWidth / 15);
    
    for (let i = 0; i < columns; i++) {
        const text = document.createElement('div');
        text.className = 'matrix-text';
        text.style.left = (i * 15) + 'px';
        text.style.top = Math.random() * 100 + '%';
        text.textContent = chars[Math.floor(Math.random() * chars.length)];
        container.appendChild(text);
    }

    setInterval(() => {
        const texts = container.getElementsByClassName('matrix-text');
        for (let text of texts) {
            if (Math.random() > 0.98) {
                text.textContent = chars[Math.floor(Math.random() * chars.length)];
            }
        }
    }, 100);
}

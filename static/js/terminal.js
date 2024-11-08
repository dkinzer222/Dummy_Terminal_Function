[Previous terminal.js code with updated setupInput function]
setupInput() {
    this.input.addEventListener('focus', () => {
        if (window.keyboard && !window.keyboard.isVisible) {
            window.keyboard.toggleKeyboard();
        }
    });
}
[Rest of the terminal.js code remains the same]

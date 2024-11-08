[Previous keyboard.js code with updated toggleSpecialKeys function]
toggleSpecialKeys() {
    this.showSpecialKeys = !this.showSpecialKeys;
    const specialKeysBtn = this.container.querySelector('[data-special-toggle]');
    if (specialKeysBtn) {
        specialKeysBtn.classList.toggle('active');
        this.render();
    }
}
[Rest of the keyboard.js code remains the same]

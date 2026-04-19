/**
 * @file text.js
 * @description Manages text updates for the kiosk display.
 */

/**
 * Updates the text content.
 * @param {string} newText - The string to be displayed on the screen.
 */
window.updateText = (newText) => {
    const titleElement = document.getElementById('text');
    if (titleElement) {
        titleElement.textContent = newText;
    }
};
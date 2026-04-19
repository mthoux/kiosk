/**
 * @file socket.js
 * @description Manages real-time communication between the Node.js server and the web interface.
 * This script acts as a bridge, routing incoming events to their respective handler functions.
 */

const socket = io();

/**
 * Handle gauge updates
 * @param {number} value - The percentage value for the chart (0-100)
 */
socket.on('update-gauge', (value) => {
    if (typeof updateGauge === 'function') {
        updateGauge(value);
    }
});

/**
 * Handle GIF updates
 * @param {string} name - The name of the GIF in the gifs folder to display
 */
socket.on('update-gif', (name) => {
    if (typeof updateGif === 'function') {
        updateGif(name);
    }
});

/**
 * Handle text updates
 * @param {string} text - The new string to display on the kiosk
 */
socket.on('update-text', (text) => {
    if (typeof updateText === 'function') {
        updateText(text);
    }
});
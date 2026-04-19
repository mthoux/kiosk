/**
 * @file gif.js
 * @description Handles the dynamic updating of GIF assets on the kiosk display.
 */

/**
 * Updates the source of the main GIF element.
 * @param {string} name - The filename (without extension) located in the /gifs folder.
 */
window.updateGif = (name) => {
    const stateGif = document.getElementById('state-gif');
    if (stateGif) {

        // Adding a timestamp ?t= to the URL prevents the browser from using a cached version, forcing the GIF to restart from the beginning.
        stateGif.src = `gifs/${name}.gif?t=${Date.now()}`;
    }
};
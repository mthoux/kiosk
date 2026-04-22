/**
 * @file gif.js
 * @description Handles the dynamic updating of GIF assets on the kiosk display.
 */

/**
 * Updates the source of the main GIF element.
 * @param {string} name - The filename (without extension) located in the /gifs folder.
 */
window.updateGif = (name) => {
    const stateGif = document.getElementById('gif');
    const newSrc = `gifs/${name}.gif`; // On définit le nouveau chemin ici
    
    if (stateGif && stateGif.getAttribute('src') !== newSrc) {
        stateGif.src = newSrc;
    }
};
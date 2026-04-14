/**
 * Change le GIF en donnant simplement son nom
 * @param {string} name - Le nom du fichier (ex: 'red-gear')
 */
window.changeGif = (name) => {
    const stateGif = document.getElementById('state-gif');
    
    if (stateGif) {
        // On construit l'URL complète ici : dossier + nom + extension + cache-bust
        const url = `gifs/${name}.gif?t=${Date.now()}`;
        stateGif.src = url;
        
        console.log(`GIF mis à jour : ${url}`);
    } else {
        console.error("L'élément #state-gif est introuvable.");
    }
};
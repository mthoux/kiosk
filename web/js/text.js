/**
 * Change le texte du titre principal
 * @param {string} newText - Le nouveau texte à afficher
 */
window.updateTitle = (newText) => {
    const titleElement = document.getElementById('text');
    if (titleElement) {
        titleElement.textContent = newText;
        console.log(`Titre mis à jour : ${newText}`);
    } else {
        console.error("L'élément #text est introuvable.");
    }
};
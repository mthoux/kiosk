const socket = io();

// Gestion du changement de GIF
window.changeGif = (stateName) => {
    const stateGif = document.getElementById('state-gif');
    if (stateGif) {
        stateGif.src = `gifs/${stateName}.gif?t=${Date.now()}`;
    }
};

// Écouteurs d'événements
socket.on('update-gauge', (valeur) => {
    if (typeof setChartTo === 'function') {
        setChartTo(valeur); 
    }
});

socket.on('update-state', (data) => {
    window.changeGif(data);
});

socket.on('update-text', (newText) => {
    window.updateTitle(newText);
});
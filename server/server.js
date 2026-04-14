const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// On sert les fichiers statiques (HTML, CSS, JS, images) depuis le dossier web
app.use(express.static(path.join(__dirname, '../web')));

/**
 * ROUTE GÉNÉRALE : /cmd/nimporte-quoi
 * Pour envoyer du texte ou des commandes simples
 */
app.get('/cmd/:message', (req, res) => {
    const msg = req.params.message;
    console.log("Commande texte reçue :", msg);
    
    io.emit('vers-le-navigateur', msg); 
    res.send(`Texte "${msg}" envoyé au kiosk.`);
});

/**
 * ROUTE DÉDIÉE À LA JAUGE : /set/75
 * Pour piloter spécifiquement ton graphique Chart.js
 */
app.get('/set/:valeur', (req, res) => {
    const v = req.params.valeur;

    // Petite sécurité : on vérifie si c'est un nombre
    if (isNaN(v)) {
        return res.status(400).send("Erreur : La valeur doit être un nombre.");
    }

    console.log(`Mise à jour jauge demandée : ${v}%`);
    
    // On envoie l'événement que ton script.js écoute
    io.emit('update-gauge', v); 
    
    res.send(`Jauge mise à jour à ${v}%`);
});

// Lancement du serveur
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`✅ Serveur Kiosk actif !`);
    console.log(`🌐 Interface : http://localhost:${PORT}`);
    console.log(`🚀 Test Jauge : curl http://localhost:${PORT}/set/50`);
    console.log(`==========================================`);
});
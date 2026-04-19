const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the web directory
app.use(express.static(path.join(__dirname, '../web')));

/**
 * API Route: Update the main text
 * Usage: GET /update-text/Hello
 */
app.get('/update-text/:text', (req, res) => {
    const text = req.params.text;
    io.emit('update-text', text);
    res.send(`Text updated to: ${text} `);
});

/**
 * API Route: Update the gauge percentage
 * Usage: GET /update-gauge/75
 */
app.get('/update-gauge/:value', (req, res) => {
    let value = parseFloat(req.params.value);
    
    if (isNaN(value)) {
        return res.status(400).send("Value must be a number.");
    }

    // Clip the value between 0 and 100
    value = Math.max(0, Math.min(100, value));
    
    io.emit('update-gauge', value);
    res.send(`Gauge updated to: ${value}% `);
});

/**
 * API Route: Update the GIF state
 * Usage: GET /update-gif/blue-gear
 */
app.get('/update-gif/:name', (req, res) => {
    const name = req.params.name;
    io.emit('update-gif', name);
    res.send(`GIF updated to: ${name} `);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Kiosk Server running on http://localhost:${PORT}`);
});
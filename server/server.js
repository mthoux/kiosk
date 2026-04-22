const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Logic to load i2c-bus only on Linux/Raspberry Pi
let i2c;
try {
    i2c = require('i2c-bus');
} catch (e) {
    console.warn("⚠️ I2C bus not found. Relay commands will be simulated.\n");
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// I2C Configuration
const RELAY_ADDR = 0x20; // Default address for many 4-relay modules
const bus = i2c ? i2c.openSync(1) : null;

app.use(express.static(path.join(__dirname, '../web')));

/**
 * API Route: Update Text, Gauge and GIF (Existing logic)
 */
app.get('/update-text/:text', (req, res) => {
    io.emit('update-text', req.params.text);
    res.send(`Text updated\n`);
});

app.get('/update-gauge/:value', (req, res) => {
    let value = Math.max(0, Math.min(100, parseFloat(req.params.value) || 0));
    io.emit('update-gauge', value);
    res.send(`Gauge updated to ${value}%\n`);
});

app.get('/update-gif/:name', (req, res) => {
    io.emit('update-gif', req.params.name);
    res.send(`GIF updated\n`);
});

/**
 * API Route: Control 4-Channel Relays via I2C
 * Usage: GET /relay/1/on or GET /relay/1/off
 */
app.get('/relay/:id/:state', (req, res) => {
    const id = parseInt(req.params.id);
    const state = req.params.state.toLowerCase();
    
    // Validation: Only 4 relays (1 to 4)
    if (isNaN(id) || id < 1 || id > 4) {
        return res.status(400).send("Invalid Relay ID. Use 1, 2, 3 or 4.\n");
    }

    const isOn = state === 'on';

    if (bus) {
        try {
            /**
             * Note: The command depends on your relay board's logic.
             * Some boards use 0xFF for ON and 0x00 for OFF.
             */
            const command = isOn ? 0xFF : 0x00; 
            bus.writeByteSync(RELAY_ADDR, id, command);
            console.log(`[I2C] Relay ${id} set to ${state}`);
        } catch (err) {
            return res.status(500).send(`I2C Error: ${err.message}\n`);
        }
    } else {
        console.log(`[SIMULATION] Relay ${id} set to ${state}`);
    }

    res.send(JSON.stringify({ relay: id, status: state }) + '\n');
});

// Default port is 3000 if not specified
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`✅ Kiosk Server running on http://localhost:${PORT}\n`);
});
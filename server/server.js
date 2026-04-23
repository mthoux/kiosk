const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mqtt = require('mqtt');

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const RELAY_ADDR = 0x20; 
const BROKER_URL = 'mqtt://10.0.0.X'; // Replace with your computer's IP
const TOPICS = {
    GAUGE: 'kiosk-update-gauge',
    TEXT: 'kiosk-update-text',
    GIF: 'kiosk-update-gif'
};

// --- INITIALIZATION ---
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Hardware: I2C Logic for Raspberry Pi
let i2c;
let bus = null;
try {
    i2c = require('i2c-bus');
    bus = i2c.openSync(1);
    console.log("✅ I2C Bus initialized.");
} catch (e) {
    console.warn("⚠️ I2C bus not found. Relay commands will be simulated.\n");
}

// Static Files
app.use(express.static(path.join(__dirname, '../web')));

// --- MQTT CLIENT LOGIC ---
const mqttClient = mqtt.connect(BROKER_URL);

mqttClient.on('connect', () => {
    console.log("✅ Connected to MQTT Broker");
    mqttClient.subscribe(Object.values(TOPICS));
});

mqttClient.on('message', (topic, message) => {
    const payload = message.toString();
    console.log(`[MQTT] Received: ${topic} -> ${payload}`);

    switch (topic) {
        case TOPICS.GAUGE:
            const val = Math.max(0, Math.min(100, parseFloat(payload) || 0));
            io.emit('update-gauge', val);
            break;
        case TOPICS.TEXT:
            io.emit('update-text', payload);
            break;
        case TOPICS.GIF:
            io.emit('update-gif', payload);
            break;
    }
});

// --- HTTP API ROUTES (BACKWARD COMPATIBILITY) ---
app.get('/update-text/:text', (req, res) => {
    io.emit('update-text', req.params.text);
    res.send(`Text updated via HTTP\n`);
});

app.get('/update-gauge/:value', (req, res) => {
    let value = Math.max(0, Math.min(100, parseFloat(req.params.value) || 0));
    io.emit('update-gauge', value);
    res.send(`Gauge updated via HTTP\n`);
});

app.get('/update-gif/:name', (req, res) => {
    io.emit('update-gif', req.params.name);
    res.send(`GIF updated via HTTP\n`);
});

app.get('/relay/:id/:state', (req, res) => {
    const id = parseInt(req.params.id);
    const state = req.params.state.toLowerCase();
    
    if (isNaN(id) || id < 1 || id > 4) {
        return res.status(400).send("Invalid Relay ID. Use 1-4.\n");
    }

    const isOn = state === 'on';
    if (bus) {
        try {
            const command = isOn ? 0xFF : 0x00; 
            bus.writeByteSync(RELAY_ADDR, id, command);
            console.log(`[I2C] Relay ${id} set to ${state}`);
        } catch (err) {
            return res.status(500).send(`I2C Error: ${err.message}\n`);
        }
    } else {
        console.log(`[SIMULATION] Relay ${id} set to ${state}`);
    }

    res.json({ relay: id, status: state });
});

// --- START SERVER ---
server.listen(PORT, () => {
    console.log(`🚀 Kiosk Server running on http://localhost:${PORT}`);
    console.log(`📡 Listening for MQTT messages from ESP32...`);
});
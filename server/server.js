const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mqtt = require('mqtt');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// --- CONFIGURATION ---
const PORT = process.env.PORT;
const BROKER_URL = process.env.BROKER_URL;
const USB_PORT_PATH = process.env.USB_PORT_PATH;

const TOPICS = {
    GAUGE: 'kiosk-update-gauge',
    TEXT: 'kiosk-update-text',
    GIF: 'kiosk-update-gif'
};

// --- INITIALIZATION ---
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- SECURITY MIDDLEWARE: LOCK DOWN THE WEB PAGE ---
app.use((req, res, next) => {
    const remoteAddress = req.socket.remoteAddress;
    if (remoteAddress === '::1' || remoteAddress === '127.0.0.1' || remoteAddress === '::ffff:127.0.0.1') {
        next(); 
    } else {
        console.warn(`🛑 Blocked external browser connection attempt from IP: ${remoteAddress}`);
        res.status(403).send('Forbidden: This kiosk interface can only be viewed on the local machine.');
    }
});

// Static Files - Serves your UI assets locally
app.use(express.static(path.join(__dirname, '../web')));


// --- PIPELINE HANDLER FUNCTION ---
function forwardDataToScreen(type, payload) {
    switch (type.toUpperCase()) {
        case 'GAUGE':
            const val = Math.max(0, Math.min(100, parseFloat(payload) || 0));
            io.emit('update-gauge', val);
            break;
        case 'TEXT':
            io.emit('update-text', payload);
            break;
        case 'GIF':
            io.emit('update-gif', payload);
            break;
        default:
            console.warn(`⚠️ Unknown data type: ${type}`);
    }
}


// --- 1. MQTT CLIENT LOGIC (WIRELESS NETWORK) ---
const mqttClient = mqtt.connect(BROKER_URL);

mqttClient.on('connect', () => {
    console.log("✅ Connected to MQTT Broker machine");
    mqttClient.subscribe(Object.values(TOPICS));
});

mqttClient.on('message', (topic, message) => {
    const payload = message.toString();
    console.log(`[MQTT] Received on ${topic} -> ${payload}`);

    if (topic === TOPICS.GAUGE) forwardDataToScreen('GAUGE', payload);
    if (topic === TOPICS.TEXT) forwardDataToScreen('TEXT', payload);
    if (topic === TOPICS.GIF) forwardDataToScreen('GIF', payload);
});


// --- START SERVER ---
server.listen(PORT, () => {
    console.log(`\n🚀 Kiosk System operational on http://localhost:${PORT}`);
});
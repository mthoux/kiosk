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


// --- 2. PHYSICAL USB / SERIAL LOGIC ---
try {
    const port = new SerialPort({ path: USB_PORT_PATH, baudRate: 9600 }, (err) => {
        if (err) {
            console.warn(`⚠️ USB Hardware not connected (${USB_PORT_PATH}). Running in simulation mode.`);
        }
    });

    // 🔴 THE FIX: Handle async error events so the server never crashes
    port.on('error', (err) => {
        // Suppress crash logs and gracefully log the error
        console.log(`ℹ️ USB Connection status: Port disconnected or unavailable.`);
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    
    // Expecting incoming USB string format: "TYPE:VALUE"
    parser.on('data', (data) => {
        const cleanData = data.toString().trim();
        console.log(`[USB Hardware] Incoming raw data: ${cleanData}`);

        const separatorIndex = cleanData.indexOf(':');
        if (separatorIndex === -1) return;

        const type = cleanData.substring(0, separatorIndex);
        const payload = cleanData.substring(separatorIndex + 1);

        forwardDataToScreen(type, payload);
    });

} catch (error) {
    console.warn("⚠️ Fatal Error initializing SerialPort instance:", error.message);
}


// --- START SERVER ---
server.listen(PORT, () => {
    console.log(`\n🚀 Kiosk System operational on http://localhost:${PORT}`);
});
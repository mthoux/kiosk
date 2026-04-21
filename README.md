# Kiosk System

A real-time interactive display system powered by Node.js. This project allows a remote machine to update a web interface (gauge, text, and GIFs) instantaneously via HTTP requests.

## 📂 Project Structure

```
.
├── README.md
├── kiosk.sh                # Main management script (Start/Stop)
├── server/
│   ├── package.json
│   ├── server.js           # Node.js server (Express + Socket.io)
│   └── test.sh             # Testing scripts
└── web/
    ├── index.html          # Main Kiosk interface
    ├── style.css           # Styling
    ├── gifs/               # Asset folder for animations
    └── js/                 # Client-side logic
        ├── socket.js       # Socket.io connection handler
        ├── gauge.js        # Gauge rendering logic
        ├── gif.js          # GIF switching logic
        ├── text.js         # Text update logic
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine.

### 2. Installation
Go to the server directory and install dependencies:
cd server
npm install

### 3. Management (kiosk.sh)
The project includes a management script at the root to handle the server and browser automatically.

**First time only, make it executable:**
chmod +x kiosk.sh

**To start the server and open the interface:**
./kiosk.sh start

**To stop the server and free the port:**
./kiosk.sh stop

*Note: You can also access the interface manually at http://localhost:3000 or http://[your-ip]:3000*

## 🕹️ Remote Control (API Routes)

The system acts as a relay. Send HTTP GET requests to these endpoints to update the Kiosk in real-time:

### Update Gauge
Updates the circular gauge percentage (0-100).
- URL: http://localhost:3000/update-gauge/:value
- Example: curl http://localhost:3000/update-gauge/85

### Update Text
Updates the main displayed text.
- URL: http://localhost:3000/update-text/:text
- Example: curl http://localhost:3000/update-text/System-Active

### Update GIF
Updates the displayed animation (from the web/gifs folder).
- URL: http://localhost:3000/update-gif/:name
- Example: curl http://localhost:3000/update-gif/red-gear

## ⚙️ Technical Overview

1. **Client Connection:** The web browser connects to the server. A persistent WebSocket session is established between the client and the server.
2. **HTTP Request:** An external client (like a firmware or terminal) sends an HTTP GET request to the Node.js server.
3. **Server Relay:** The server captures the route, extracts parameters, and uses io.emit() to broadcast the data to all connected clients via WebSockets.
4. **Kiosk Update:** The web interface receives the event through the open socket and updates the DOM (Document Object Model) immediately without a page refresh.



WORKING ON RASPBERRY PI 3 Model B V1.2
OS : Raspberry Pi OS (Legacy, 32 bit)

Kiosk config 

autostart script dans home/admin/.config/labwc/autostart
rmeettre l ecran droit dans ...

addresse ethernet 10.0.0.2


!!!!
chmod +x autolaunch.sh
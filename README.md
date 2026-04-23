# Kiosk System

![Kiosk preview](images/demo.png)

A lightweight real-time kiosk display powered by **Node.js**, designed to let an external device (like an ESP32) or remote machine control a fullscreen web interface through **MQTT** or simple **HTTP** requests.

Originally built to assist users while operating a washing station, the interface combines:

* **Instruction text** for guidance
* **Animated GIFs** for visual actions
* **Circular progress gauge** to show real-time machine data

The originally used device was a **Raspberry Pi 3 Model B v1.2** running **Raspberry Pi OS (Legacy, 32-bit)**, but the project can run on most Linux devices.

---

## Features

* **Hybrid Control:** Supports both MQTT (ideal for IoT) and HTTP API.
* **Real-time updates:** Powered by WebSockets (Socket.io) for zero-latency UI changes.
* **Fullscreen kiosk interface:** Optimized for minimal Wayland compositors (Cage).
* **Hardware Integration:** Includes I2C relay control logic for Raspberry Pi.
* **Lightweight:** Fast boot and low memory footprint.

---

## Project Structure

```text
.
├── README.md
├── autolaunch.sh              # Starts the server and kiosk interface
├── server/
│   ├── package.json           # Dependencies (express, socket.io, mqtt, i2c-bus)
│   └── server.js              # Main backend logic (MQTT Listener + HTTP API)
└── web/
    ├── index.html             # Main kiosk page
    ├── style.css              # Interface styling
    ├── gifs/                  # Animation assets
    └── js/
        ├── socket.js          # WebSocket connection
        ├── gauge.js           # Gauge rendering logic
        ├── gif.js             # GIF switching logic
        └── text.js            # Text update logic
```

---

---

## How It Works

The Node.js server acts as a bridge between remote commands (via MQTT or HTTP) and connected kiosk screens.

### Workflow

1. A browser opens the kiosk interface and connects to the server using **WebSockets**.
2. A remote device (like an **ESP32**) publishes a message to the **MQTT Broker** or sends an **HTTP request**.
3. The server receives the update and broadcasts it instantly via **Socket.io**.
4. All connected kiosk screens refresh their UI in real time without reloading.

---

## Requirements

Before installation, make sure you have:

* **Node.js** (v16+ recommended)
* A Linux system (Raspberry Pi OS Legacy 32-bit tested)
* **Cage** (Wayland compositor)
* **Chromium Browser**

---

## Installation

### 1. Clone the Project
git clone <your-repository-url>
cd kiosk

### 2. Install Dependencies
cd server
npm install

### 3. Configure MQTT
Open `server/server.js` and update the `BROKER_URL` with your computer's IP address.

### 4. Install Cage
Cage is a minimal Wayland compositor ideal for launching a single fullscreen application.
sudo apt update && sudo apt install cage

### 5. Make the Launch Script Executable
chmod +x autolaunch.sh

---

## Auto Start on Boot

To automatically launch the kiosk when the device starts, edit your shell profile:
nano ~/.bash_profile

Add this block at the end:

if [ -z "$DISPLAY" ] && [ "$XDG_VTNR" = 1 ]; then
  exec cage ./autolaunch.sh
fi

**Note:** This checks that no graphical session is already running and ensures login is on virtual terminal **TTY1**. It launches Cage in fullscreen mode and runs your kiosk automatically at boot, preventing multiple sessions from starting accidentally.

---

## Remote Control API

### MQTT Control (Recommended for IoT)
The server subscribes to these topics:
- `kiosk-update-gauge` : Send a number (0-100)
- `kiosk-update-text`  : Send a string
- `kiosk-update-gif`   : Send a filename (without .gif)

### HTTP API (Useful for debugging via ssh session)
- **Update Gauge:** `GET /update-gauge/:value` (e.g., `curl http://localhost:3000/update-gauge/85`)
- **Update Text:** `GET /update-text/:text` (e.g., `curl http://localhost:3000/update-text/STOP`)
- **Update GIF:** `GET /update-gif/:name` (e.g., `curl http://localhost:3000/update-gif/washing`)

### Relay Control (I2C)
Comming soon

---

## Recommended Optimizations for Raspberry Pi

* **Console Mode:** Boot directly to console (CLI) instead of Desktop via `raspi-config`.
* **GPU:** Ensure GPU acceleration is enabled in Chromium flags.
* **Network:** Use a static IP or reserved DHCP for the Raspberry and the Broker.

---

## License

This project is licensed under the MIT License.
Copyright © 2026 Mathys Bitsch.

---

## Summary

This project transforms any small computer into a professional, remotely controlled smart display using **Node.js**, **MQTT**, and **WebSockets**. Reliable, lightweight, and ideal for industrial or embedded kiosk systems.
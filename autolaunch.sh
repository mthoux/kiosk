#!/bin/bash

# CONFIGURATION FOR RASPBERRY PI 3 V1.2

# Graphics configuration
export DISPLAY=:0
export WAYLAND_DISPLAY=wayland-0

# Kiosk directory
DIR="/home/admin/kiosk"

# Create logs directory and cleanup old logs (7 days)
mkdir -p "$DIR/logs"
find "$DIR/logs" -name "log-*.txt" -mtime +7 -delete

# Set up dynamic logging
LOG_FILE="$DIR/logs/log-$(date +'%Y-%m-%d').txt"
exec > "$LOG_FILE" 2>&1

sleep 2

echo "--- Kiosk Startup: $(date) ---"

echo "Starting Node.js server..."
if cd "$DIR/server"; then
    /home/admin/.nvm/versions/node/v20.20.2/bin/node server.js &
else
    echo "ERROR: Server directory not found"
    exit 1
fi

# Wait for server to be ready
sleep 2

echo "Opening Chromium browser..."
chromium-browser --kiosk --incognito --password-store=basic --no-cursor --disable-features=Translate,TranslateUI --disable-translate --lang=en --check-for-update-interval=31536000 --log-level=3 --disable-component-update --ignore-gpu-blocklist --enable-gpu-rasterization http://localhost:3000
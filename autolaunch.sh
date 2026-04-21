#!/bin/bash

# Dossier du projet
DIR="/home/admin/kiosk"

# Nettoyage des logs (7 jours)
mkdir -p "$DIR/logs"
find "$DIR/logs" -name "log-*.txt" -mtime +7 -delete

# Configuration des logs
LOG_FILE="$DIR/logs/log-$(date +'%Y-%m-%d').txt"
exec > "$LOG_FILE" 2>&1

echo "--- Kiosk Startup: $(date) ---"

# 1. Nettoyage des processus fantômes (libère le port 3000)
echo "Cleaning up..."
fuser -k 3000/tcp > /dev/null 2>&1

# 2. Lancement du serveur Node.js
echo "Starting Node.js server..."
if cd "$DIR/server"; then
    /home/admin/.nvm/versions/node/v20.20.2/bin/node server.js &
else
    echo "ERROR: Server directory not found"
    exit 1
fi

# 3. Attente pour laisser le serveur démarrer
sleep 5

# 4. Lancement de Cage avec rotation et Chromium
echo "Launching Cage with rotation..."
export XDG_RUNTIME_DIR=/run/user/1000
export WLR_DRM_NO_MODIFIERS=1

# On utilise la structure exacte qui a fonctionné pour toi
exec cage -s -- bash -c "wlr-randr --output DSI-1 --transform 180; chromium-browser --kiosk --no-sandbox --user-data-dir='$DIR/.chrometemp' --password-store=basic --no-first-run --ignore-gpu-blocklist --enable-gpu-rasterization http://localhost:3000"
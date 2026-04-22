#!/bin/bash

# --- CONFIGURATION ---
DIR="/home/admin/kiosk"
PORT=3000
SCREEN_ROTATION=180
LOG_RETENTION_DAYS=5
# ---------------------

# 1. Environment Setup (Ensures 'node' command works)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Log Configuration (Year-Month-Day-Hour-Minute-Second)
mkdir -p "$DIR/logs"
find "$DIR/logs" -name "log-*.txt" -mtime +$LOG_RETENTION_DAYS -delete
LOG_FILE="$DIR/logs/log-$(date +'%Y-%m-%d-%H%M%S').txt"
exec > "$LOG_FILE" 2>&1

echo "--- Kiosk Startup: $(date) ---"
echo "Configured Port: $PORT"

# 3. Cleanup ghost processes
echo "Cleaning up port $PORT..."
fuser -k $PORT/tcp > /dev/null 2>&1

# 4. Starting Node.js server
echo "Starting Node.js server..."

if command -v node >/dev/null 2>&1; then
    # Passing the PORT as an environment variable to Node.js
    PORT=$PORT node "$DIR/server/server.js" &
    NODE_PID=$!
    
    sleep 5
    
    # Check if process is alive AND port is active
    if ps -p $NODE_PID > /dev/null && lsof -i :$PORT > /dev/null; then
        echo "SUCCESS: Node.js server is running (PID: $NODE_PID) on port $PORT"
    else
        echo "ERROR: Node.js server failed to start or port $PORT is unreachable"
    fi
else
    echo "ERROR: 'node' command not found. Check NVM installation."
fi

# 5. Launching Display Environment
echo "Launching Cage and Chromium..."
export XDG_RUNTIME_DIR=/run/user/1000
export WLR_DRM_NO_MODIFIERS=1

exec cage -s -- bash -c "wlr-randr --output DSI-1 --transform $SCREEN_ROTATION; chromium-browser --kiosk --no-sandbox --user-data-dir='$DIR/.chrometemp' --password-store=basic --no-first-run --ignore-gpu-blocklist --enable-gpu-rasterization http://localhost:$PORT"
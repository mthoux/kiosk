#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$DIR/server/.env"

if [ -d "$DIR/scripts" ]; then
    chmod +x "$DIR/scripts"/*.sh 2>/dev/null
fi

clear
echo "=================================================="
echo "      🔍 KIOSK SYSTEM PRE-LAUNCH CHECKS           "
echo "=================================================="
echo ""

echo "📡 Checking Network Gate..."

# Fetch the active local IP address
IP_ADDR=$(hostname -I | tr ' ' '\n' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)

# Check if the Raspberry Pi actually has an assigned local IP
if [ -n "$IP_ADDR" ]; then
    CURRENT_USER=$(whoami)
    
    if command -v iwgetid >/dev/null 2>&1; then
        WIFI_NAME=$(iwgetid -r)
    elif command -v nmcli >/dev/null 2>&1; then
        WIFI_NAME=$(nmcli -t -f active,ssid dev wifi | grep '^yes' | cut -d: -f2)
    fi

    if [ -z "$WIFI_NAME" ]; then
        WIFI_NAME="Connected (Ethernet/Unknown)"
    fi

    echo "✅ Machine is ONLINE (Local Network)."
    echo "   🌐 Network : $WIFI_NAME"
    echo "   🆔 IP Addr : $IP_ADDR"
    echo "   👤 User    : $CURRENT_USER"
    echo "   💻 SSH Cmd : ssh ${CURRENT_USER}@${IP_ADDR}"
else
    echo "❌ Machine is OFFLINE. No network IP detected."
    echo "➡️ Redirecting to Network configuration..."
    sleep 2
    bash "$DIR/scripts/setup_wifi.sh"
fi

echo ""

echo "💾 Checking Software Gate..."
if [ -f "$ENV_FILE" ]; then
    echo "✅ Configuration profile (.env) found."
else
    echo "❌ Configuration profile (.env) is MISSING."
    echo "➡️ Redirecting to Configuration profile..."
    sleep 2
    bash "$DIR/scripts/setup_env.sh"
fi

echo ""
echo "--------------------------------------------------"
echo "🚀 All systems verified. Launching Kiosk Interface..."
sleep 1

exec bash "$DIR/scripts/launch.sh"
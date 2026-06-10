#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$EUID" -ne 0 ]; then
    echo "🔐 This setup requires administrative privileges."
    exec sudo "$0" "$@"
fi

echo "=================================================="
echo "        📡 WIRELESS NETWORK PAIRING               "
echo "=================================================="
echo ""

while true; do
    read -p "🔹 Enter Wi-Fi Network Name (SSID): " WIFI_SSID
    read -s -p "🔹 Enter Wi-Fi Password: " WIFI_PASS
    echo ""
    echo "📡 Connecting to Wi-Fi..."
    
    if nmcli dev wifi connect "$WIFI_SSID" password "$WIFI_PASS"; then
        echo "✅ Wi-Fi successfully connected!"
        break
    else
        echo "❌ Connection failed. Please check credentials and try again."
        echo ""
    fi
done

# Wait briefly for the interface to completely finish acquiring an IP address from DHCP
sleep 2

IP_ADDR=$(hostname -I | tr ' ' '\n' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)
CURRENT_USER=$SUDO_USER
[ -z "$CURRENT_USER" ] && CURRENT_USER=$(whoami)

echo "   🆔 IP Addr : ${IP_ADDR:-Unknown}"
echo "   💻 SSH Cmd : ssh ${CURRENT_USER}@${IP_ADDR:-IP_ADDRESS}"
echo ""
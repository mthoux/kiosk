#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$DIR/server/.env"
PORT=3000

echo "=================================================="
echo "        🔧 KIOSK HARDWARE CONFIGURATION           "
echo "=================================================="
echo ""

# 1. MQTT IP Setup
while [[ ! $BROKER_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; do
    read -p "🔹 Enter MQTT Broker IP (e.g., 10.0.0.15): " BROKER_IP
    if [[ ! $BROKER_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "❌ Invalid IP format. Please try again."
    fi
done
echo ""

# 2. USB Port Picker
AVAILABLE_PORTS=$(ls /dev/ttyUSB* /dev/ttyACM* /dev/cu.usbserial* /dev/cu.usbmodem* 2>/dev/null)
if [ -z "$AVAILABLE_PORTS" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then DEFAULT_USB="/dev/cu.usbserial-0001"; else DEFAULT_USB="/dev/ttyUSB0"; fi
else
    DEFAULT_USB=$(echo "$AVAILABLE_PORTS" | head -n 1)
fi

echo "Available Ports:"
echo "${AVAILABLE_PORTS:-  None detected}"
read -p "🔹 Select USB Path [Default: $DEFAULT_USB]: " USER_USB
USB_PORT=${USER_USB:-$DEFAULT_USB}

# 3. Create the text file inside /server
mkdir -p "$(dirname "$ENV_FILE")"
cat << EOF > "$ENV_FILE"
PORT=$PORT
BROKER_URL=mqtt://$BROKER_IP
USB_PORT_PATH=$USB_PORT
EOF

echo ""
echo "🎉 Configuration Profile Built and Saved!"
sleep 1
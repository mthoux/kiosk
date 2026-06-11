#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$DIR/server/.env"

clear
echo "=================================================="
echo "                MQTT CONFIGURATION                "
echo "=================================================="
read -p "Enter MQTT Broker IP (or 'q' to quit): " broker_ip

broker_lower=$(echo "$broker_ip" | tr '[:upper:]' '[:lower:]')
if [[ "$broker_lower" == "q" ]]; then
    exit 0
fi

mkdir -p "$DIR/server"
cat << EOF > "$ENV_FILE"
BROKER_URL=mqtt://$broker_ip
EOF

echo "Configuration saved."
sleep 1
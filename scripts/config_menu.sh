#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

while true; do
    clear
    echo "=================================================="
    echo "                CONFIGURATION MENU                "
    echo "=================================================="
    echo "1. Configure Wi-Fi"
    echo "2. Configure MQTT Broker"
    echo "3. Exit and Launch"
    echo ""
    read -p "Select an option [1-3]: " choice

    case $choice in
        1) bash "$DIR/scripts/setup_wifi.sh" ;;
        2) bash "$DIR/scripts/setup_env.sh" ;;
        3) break ;;
        *) echo "Invalid option." ; sleep 1 ;;
    esac
done
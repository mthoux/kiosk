#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure scripts are executable
[ -d "$DIR/scripts" ] && chmod +x "$DIR/scripts"/*.sh 2>/dev/null

clear
echo "=================================================="
echo "                  KIOSK LAUNCHER                  "
echo "=================================================="
echo "System starting... Press 'c' within 3 seconds to enter Configuration Menu."

# Read input with 3-second timeout
read -t 3 -n 1 input

input=$(echo "$input" | tr '[:upper:]' '[:lower:]')

if [[ "$input" == "c" ]]; then
    bash "$DIR/scripts/config_menu.sh"
    exec "$0"
else
    echo -e "\nLaunching system..."
    exec bash "$DIR/scripts/launch.sh"
fi
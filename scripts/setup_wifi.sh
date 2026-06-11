#!/bin/bash

while true; do
    clear
    echo "=================================================="
    echo "            WIRELESS NETWORK PAIRING              "
    echo "=================================================="
    read -p "Enter Wi-Fi SSID (or 'q' to quit): " ssid

    ssid_lower=$(echo "$ssid" | tr '[:upper:]' '[:lower:]')
    if [[ "$ssid_lower" == "q" ]]; then
        echo "Exiting setup..."
        exit 0
    fi

    read -s -p "Enter Wi-Fi Password: " pass
    echo ""
    echo "Attempting to connect..."

    # Attempt connection
    if nmcli dev wifi connect "$ssid" password "$pass" > /dev/null 2>&1; then
        echo "Successfully connected to $ssid."
        sleep 2
        break # Exit the loop upon success
    else
        echo "Connection failed. Please check your credentials."
        read -p "Press any key to try again (or 'q' to quit)..." retry
        retry_lower=$(echo "$retry" | tr '[:upper:]' '[:lower:]')
        if [[ "$retry_lower" == "q" ]]; then
            exit 0
        fi
    fi
done
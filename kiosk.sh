#!/bin/bash

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case "$1" in
    start)
        echo "🚀 Starting server..."
        # Launch node by pointing to the correct file path
        node "$DIR/server/server.js" &
        sleep 2
        open http://localhost:3000
        ;;
    stop)
        echo "🛑 Stopping server on port 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null
        echo "✅ Server stopped."
        ;;
    *)
        echo "Usage: ./kiosk.sh {start|stop}"
        exit 1
        ;;
esac
#!/bin/bash
# Anime Character Site Auto-Start Script
# Add this to /etc/rc.local or crontab for automatic startup on boot

APP_DIR="/root/anime-character-site"
LOG_FILE="/var/log/anime-character-site.log"
PORT=3000

# Check if already running
if pgrep -f "node $APP_DIR/server.js" > /dev/null; then
    echo "Anime Character site is already running"
    exit 0
fi

# Start the application
cd $APP_DIR
nohup node server.js > $LOG_FILE 2>&1 &

# Wait a moment and verify it started
sleep 2
if pgrep -f "node $APP_DIR/server.js" > /dev/null; then
    echo "Anime Character site started successfully"
    exit 0
else
    echo "Failed to start Anime Character site"
    exit 1
fi

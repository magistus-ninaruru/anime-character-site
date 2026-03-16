#!/bin/bash
# Anime Character Site Deployment Script

APP_DIR="/root/anime-character-site"
PORT=3000

echo "Starting Anime Character Website..."
cd $APP_DIR

# Check if better-sqlite3 needs rebuilding
if [ ! -f "node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
    echo "Rebuilding native dependencies..."
    npm rebuild better-sqlite3
fi

# Start the application
exec node server.js

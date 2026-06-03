#!/bin/bash
export PATH="/Users/tvsoga/.local/bin:/usr/bin:/bin"
cd ~/chat-app
# Backup on every restart
bash backup.sh
while true; do
  node server.js 2>> ~/chat-app/crash.log
  echo "[$(date)] Server crashed, restarting in 2s..." >> ~/chat-app/crash.log
  sleep 2
done

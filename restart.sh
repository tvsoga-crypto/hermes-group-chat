#!/bin/bash
# Restart the chat app server (for cache-busted updates)
# Run this after updating the code, then users just F5 to see the new version
echo "Restarting AI漫畫對話 chat server..."
launchctl kickstart -k gui/$(id -u)/com.chat-app.hermes 2>/dev/null || \
launchctl unload ~/Library/LaunchAgents/com.chat-app.hermes.plist 2>/dev/null; \
launchctl load ~/Library/LaunchAgents/com.chat-app.hermes.plist && \
echo "✅ Server restarted! New build version will be served."
echo "Users just need to press F5 to see the update."

---
name: hermes-group-chat
description: "Use when you need to set up a multi-user web chat room for team collaboration with Hermes Agent AI. Installs a LAN-accessible group chat with login, multiple rooms, file uploads, emoji reactions, message search, and PWA support."
version: 1.0.0
author: tvsoga
license: MIT
metadata:
  hermes:
    tags: [chat, collaboration, multi-user, web, group-chat, team]
    related_skills: []
---

# Hermes Group Chat

## Overview

A multi-user web chat application that connects to your local Hermes Agent as the AI backend. Multiple users can join from any device on your local network, chat with each other and with the AI, share files, react to messages, and collaborate in real-time.

The chat app runs on `http://localhost:3000` (or your LAN IP, e.g. `http://192.168.1.xxx:3000`).

## Quick Start

### Prerequisites
Before starting the chat server, make sure Hermes Agent's **API Server** is enabled:

```bash
# 1. Set API_SERVER_KEY in Hermes config (one-time)
echo 'API_SERVER_KEY=my-chat-key' >> ~/.hermes/.env

# 2. Restart Hermes Gateway
hermes gateway restart

# 3. Verify API server is running
curl http://localhost:8642/health
# Should return: {"status": "ok", "platform": "hermes-agent"}
```

### Start the Chat Server
```bash
# Install dependencies
cd hermes-group-chat
npm install

# Start the server
node server.js

# Open in browser
open http://localhost:3000
```

### Auto-start on Boot (macOS)

Install as a launchd service so the chat server starts automatically after reboot:

```bash
# Download the plist from the repo
curl -o ~/Library/LaunchAgents/chat-app.plist \
  https://raw.githubusercontent.com/tvsoga-crypto/hermes-group-chat/main/scripts/chat-app.plist

# Load the service
launchctl load ~/Library/LaunchAgents/chat-app.plist

# Verify it's running
launchctl list | grep chat-app
curl http://localhost:3000
```

Default accounts (password: `00000000`):
| Username | Display Name | Role |
|----------|-------------|------|
| admin | 管理員 | admin |
| xiaomei | 小美 | user |
| ajie | 阿傑 | user |
| bo | 柏 | user |
| TT | TT | user |
| daniis | Daniis | user |

## Features

- **Multi-user login** — separate accounts for each team member
- **Multi-room support** — create topic-specific chat rooms with isolated AI memory
- **Real-time AI chat** — connects to Hermes Agent as the backend
- **File uploads** — images and videos with preview + caption
- **Emoji reactions** — quick 👍❤️😂😮😢🙏 reactions on any message
- **Reply to messages** — threaded replies with quote preview
- **Message search** — full-text search across messages
- **Read receipts** — see who has read messages
- **Online user list** — who's currently in the room
- **Theme customization** — 6 themes per room (dark, ocean, forest, sunset, light, midnight)
- **Room avatars** — custom avatar per room
- **PWA support** — installable as a mobile app
- **Automatic backups** — hourly DB backup, keeps 100 copies
- **Auto-restart** — keep-alive cron restarts the server if it crashes

## Architecture

```
┌──────────────┐     HTTP/Socket.IO     ┌──────────────┐
│   Browser 1   │◄──────────────────────►│              │
│   Browser 2   │                        │  Node.js     │
│   Browser 3   │                        │  Server      │
│   (LAN)       │                        │  (port 3000) │
└──────────────┘                        │              │
                                         │  SQLite DB   │
┌──────────────┐     REST API            │              │
│ Hermes Agent ├────────────────────────►│  (chat.db)   │
│ (port 8642)  │◄────────────────────────┘              │
└──────────────┘     AI response         └──────────────┘
```

## Admin Panel

Accessible via the **後台** link in the topbar (admin accounts only).

- Manage users: create, reset passwords, disable accounts
- Manage rooms: create, edit name/description/theme, upload avatar
- View all accounts

## File Structure

```
hermes-group-chat/
├── SKILL.md              ← Hermes skill definition (this file)
├── README.md             ← Full documentation
├── server.js             ← Express + Socket.IO server
├── db.js                 ← Database helper (better-sqlite3)
├── package.json          ← Node.js dependencies
├── backup.sh             ← Hourly database backup
├── keep-alive.sh         ← Auto-restart cron script
├── version.sh            ← Version management tool
├── cleanup.sh            ← Temp file cleanup
├── public/
│   ├── index.html        ← Full SPA frontend (inlined CSS/JS)
│   ├── manifest.json     ← PWA manifest
│   ├── sw.js             ← Service Worker
│   └── uploads/          ← Uploaded files storage
├── scripts/
│   └── install.sh        ← One-click install script
├── data/                 ← SQLite database (auto-created)
├── backups/              ← DB backups (auto-created)
└── versions/             ← Version snapshots (auto-created)
```

## Configuration

Environment variables (or edit directly in `server.js`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HERMES_API_URL` | `http://localhost:8642/v1/chat/completions` | Hermes Agent API Server |
| `HERMES_API_KEY` | `haima-chat-key-2026` | Must match `API_SERVER_KEY` in `~/.hermes/.env` |
| `JWT_SECRET` | auto-generated | JWT signing secret |

### Enabling the API Server (if not already done)

The Hermes Agent API Server runs on port 8642 and needs the `API_SERVER_KEY` environment variable set:

```bash
# Set your API key
echo 'API_SERVER_KEY=my-chat-key' >> ~/.hermes/.env

# Restart gateway to apply
hermes gateway restart

# Update server.js to use the same key
# Edit HERMES_API_KEY in server.js to match your API_SERVER_KEY
```

> ⚠️ **Important:** `HERMES_API_KEY` in `server.js` (or `HERMES_API_KEY` env var) must match the `API_SERVER_KEY` you set in `~/.hermes/.env`. Otherwise the chat server won't be able to authenticate with the Hermes Agent API.

## Custom AI System Prompt

The AI's personality is defined by `AI_SYSTEM_PROMPT` in `server.js`. Edit it to customize how 海馬 behaves in the chat room.

## Managing Accounts

### Via Admin Panel (Web UI)
1. Log in as `admin`
2. Click **後台** in topbar
3. Use the user management section

### Via Command Line
```bash
cd ~/chat-app
node -e "
const { getDb } = require('./db');
const db = getDb();
db.prepare('UPDATE users SET password = ? WHERE username = ?').run('newpass', 'admin');
db.close();
console.log('Password updated');
"
```

## Backup & Restore

Backups are automatic (hourly via cron). Manual:

```bash
# List backups
ls -t ~/chat-app/backups/

# Restore from backup
cp ~/chat-app/backups/chat-20260101-120000.db ~/chat-app/data/chat.db
```

## Version Management

```bash
# Save current state as a version
./version.sh save

# List versions
./version.sh list

# Restore a version
./version.sh restore v1
```

## Common Pitfalls

1. **Node.js version mismatch** — If you get `better-sqlite3` errors, make sure you're using the same Node.js version as when `npm install` was first run. Rebuild with `npm rebuild better-sqlite3`.

2. **Port already in use** — If port 3000 is taken, change the `PORT` env variable or kill the existing process: `lsof -ti:3000 | xargs kill`.

3. **AI not responding** — Make sure Hermes Agent is running and accessible at the configured `HERMES_API_URL`. Test with: `curl http://localhost:8642/v1/chat/completions`.

4. **Browser caching** — After updating the app, do a hard refresh (Cmd+Shift+R on Mac, Ctrl+F5 on Windows).

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] `node server.js` starts and shows no errors
- [ ] Login page loads at `http://localhost:3000`
- [ ] Can log in with default accounts (password: `00000000`)
- [ ] Messages send and receive in real-time
- [ ] AI (海馬) responds to messages
- [ ] File upload works (images/videos)
- [ ] Emoji reactions work (click `+` on any message)
- [ ] Message search works (🔍 in topbar)
- [ ] Multi-room switching works
- [ ] Admin panel is accessible (後台 link)

#!/bin/bash
# AI漫畫對話 資料庫自動備份腳本
# 每小時備份一次，保留最近 100 份

DB_PATH="$HOME/chat-app/data/chat.db"
BACKUP_DIR="$HOME/chat-app/backups"
MAX_BACKUPS=100

mkdir -p "$BACKUP_DIR"

# 備份：以日期時間命名
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
cp "$DB_PATH" "$BACKUP_DIR/chat-$TIMESTAMP.db"

# 清理舊備份，只留最新的 MAX_BACKUPS 份
cd "$BACKUP_DIR" 2>/dev/null && ls -t chat-*.db 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm

echo "[$(date)] Backup saved: chat-$TIMESTAMP.db ($(ls -lh "$BACKUP_DIR/chat-$TIMESTAMP.db" | awk '{print $5}'))"

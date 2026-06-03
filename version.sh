#!/bin/bash
# ─── 海馬聊天室 版本管理工具 ───
# usage: ./version.sh save "描述"  建立新版
#        ./version.sh list          列出所有版本
#        ./version.sh restore v3    還原到指定版本
#        ./version.sh current       查看目前版本

VERSIONS_DIR="$(cd "$(dirname "$0")" && pwd)/versions"
VERSION_FILE="$(cd "$(dirname "$0")" && pwd)/VERSION"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$VERSIONS_DIR"

# 要備份的檔案（排除 data、uploads、node_modules、備份相關）
FILES=(
  "server.js"
  "db.js"
  "package.json"
  "public/index.html"
  "keep-alive.sh"
  "backup.sh"
  "version.sh"
  "VERSION"
)

get_next_version() {
  local latest=$(ls -1 "$VERSIONS_DIR" 2>/dev/null | grep -E '^v[0-9]+\.tar\.gz$' | sed 's/\.tar\.gz$//' | sort -t'v' -k2 -n | tail -1)
  if [ -z "$latest" ]; then
    echo "v1"
  else
    local num=${latest#v}
    echo "v$((num + 1))"
  fi
}

get_current_version() {
  if [ -f "$VERSION_FILE" ]; then
    cat "$VERSION_FILE"
  else
    echo "未設定"
  fi
}

cmd_save() {
  local desc="${1:-無描述}"
  local version=$(get_next_version)
  local archive="$VERSIONS_DIR/$version.tar.gz"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  echo "📦 建立版本 $version ……"

  # 建立暫存目錄
  local tmpdir=$(mktemp -d)
  local tmp_app="$tmpdir/chat-app"

  mkdir -p "$tmp_app/public"
  mkdir -p "$tmp_app/data"   # 放一個空的佔位

  # 複製檔案
  for f in "${FILES[@]}"; do
    local src="$APP_DIR/$f"
    if [ -f "$src" ]; then
      mkdir -p "$tmp_app/$(dirname "$f")" 2>/dev/null || true
      cp "$src" "$tmp_app/$f"
    fi
  done

  # 寫入版本資訊
  cat > "$tmp_app/VERSION" << EOF
version=$version
date=$timestamp
description=$desc
EOF

  # 打包
  cd "$tmpdir"
  tar czf "$archive" "chat-app/"
  cd "$APP_DIR"
  rm -rf "$tmpdir"

  # 更新 VERSION 檔
  cat > "$VERSION_FILE" << EOF
version=$version
date=$timestamp
description=$desc
EOF

  echo "✅ $version 已建立 — $desc"
  echo "   時間：$timestamp"
  echo "   檔案：${archive##*/} ($(du -h "$archive" | cut -f1))"
}

cmd_list() {
  local versions=($(ls -1 "$VERSIONS_DIR" 2>/dev/null | grep -E '^v[0-9]+\.tar\.gz$' | sort -t'v' -k2 -n))
  local current=$(get_current_version | grep '^version=' | cut -d= -f2)

  if [ ${#versions[@]} -eq 0 ]; then
    echo "📭 尚無版本記錄"
    exit 0
  fi

  echo "📋 可用的版本："
  echo ""
  for archive in "${versions[@]}"; do
    local vname="${archive%.tar.gz}"
    local info=$(tar -xzf "$VERSIONS_DIR/$archive" -O "chat-app/VERSION" 2>/dev/null)
    local date=$(echo "$info" | grep '^date=' | cut -d= -f2-)
    local desc=$(echo "$info" | grep '^description=' | cut -d= -f2-)
    local marker=""
    [ "$vname" = "$current" ] && marker=" ← 目前版本"
    echo "  $vname${marker}"
    echo "    時間：${date:-未知}"
    echo "    說明：${desc:-無}"
    echo ""
  done
}

cmd_restore() {
  local target="$1"
  local archive="$VERSIONS_DIR/$target.tar.gz"

  if [ ! -f "$archive" ]; then
    echo "❌ 找不到版本 $target"
    echo "   使用 ./version.sh list 查看可用版本"
    exit 1
  fi

  echo "⚠️  即將還原到 $target"
  echo "   將覆蓋：server.js, db.js, public/index.html, package.json 等檔案"
  echo "   (資料庫 data/chat.db 和使用者上傳檔案 uploads/ 不受影響)"
  echo ""
  read -p "確定繼續？(y/N) " confirm
  [ "$confirm" != "y" ] && [ "$confirm" != "Y" ] && echo "已取消" && exit 0

  echo "🔄 還原中 ……"

  # 解壓到暫存目錄
  local tmpdir=$(mktemp -d)
  tar -xzf "$archive" -C "$tmpdir"

  # 複製檔案（排除 data/ 和 versions/）
  for f in "${FILES[@]}"; do
    local src="$tmpdir/chat-app/$f"
    if [ -f "$src" ]; then
      cp "$src" "$APP_DIR/$f"
      echo "   ✓ $f"
    fi
  done

  rm -rf "$tmpdir"

  # 複製 VERSION 到主目錄
  tar -xzf "$archive" -O "chat-app/VERSION" > "$VERSION_FILE" 2>/dev/null

  echo "✅ 已還原到 $target"
  echo "   請重新啟動伺服器：pkill -f 'node server.js' && cd ~/chat-app && node server.js &"
}

cmd_current() {
  if [ -f "$VERSION_FILE" ]; then
    echo "📌 目前版本資訊："
    cat "$VERSION_FILE"
  else
    echo "📌 目前未記錄版本"
    echo "   使用 ./version.sh save '描述' 建立第一個版本"
  fi
}

# ─── Main ───
case "${1:-help}" in
  save)
    shift
    cmd_save "$*"
    ;;
  list|ls)
    cmd_list
    ;;
  restore)
    cmd_restore "$2"
    ;;
  current|status)
    cmd_current
    ;;
  *)
    echo "海馬聊天室 版本管理工具"
    echo ""
    echo "用法："
    echo "  ./version.sh save \"說明\"   建立新版"
    echo "  ./version.sh list           列出所有版本"
    echo "  ./version.sh restore v3     還原到指定版本"
    echo "  ./version.sh current        查看目前版本"
    ;;
esac

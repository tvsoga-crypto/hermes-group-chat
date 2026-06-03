#!/usr/bin/env bash
set -e

echo "=== Hermes Group Chat Installer ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo "✓ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Create required directories
mkdir -p data backups versions public/uploads

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure Hermes Agent is running (port 8642)"
echo "  2. Start the chat server: node server.js"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "Default login: admin / 00000000"

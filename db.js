const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'chat.db');

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      system_prompt TEXT DEFAULT '',
      theme TEXT DEFAULT 'default',
      avatar_url TEXT DEFAULT '',
      is_default INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL DEFAULT 1,
      user_id INTEGER,
      display_name TEXT,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      reasoning TEXT,
      file_url TEXT,
      file_type TEXT,
      reply_to_id INTEGER DEFAULT NULL,
      edited_at TEXT DEFAULT NULL,
      deleted INTEGER DEFAULT 0,
      sticker_url TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reaction TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(message_id, user_id, reaction)
    );

    CREATE TABLE IF NOT EXISTS read_receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL DEFAULT 1,
      user_id INTEGER NOT NULL,
      last_read_message_id INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(room_id, user_id)
    );
  `);

  // Migration: ensure default room exists
  const roomCount = db.prepare('SELECT COUNT(*) as c FROM rooms').get().c;
  if (roomCount === 0) {
    db.prepare(`INSERT INTO rooms (id, name, description, system_prompt, is_default) VALUES (1, 'AI漫畫對話', '預設聊天室 — 海馬的全能對話空間', '', 1)`).run();
  }

  // Migration: ensure room_id column exists on old messages table
  const msgCols = db.prepare("PRAGMA table_info(messages)").all().map(r => r.name);
  if (!msgCols.includes('room_id')) {
    db.exec(`ALTER TABLE messages ADD COLUMN room_id INTEGER NOT NULL DEFAULT 1`);
  }

  // Migration: ensure reply_to_id, edited_at, deleted, sticker_url on pre-existing DBs
  if (!msgCols.includes('reply_to_id')) {
    db.exec(`ALTER TABLE messages ADD COLUMN reply_to_id INTEGER DEFAULT NULL`);
  }
  if (!msgCols.includes('edited_at')) {
    db.exec(`ALTER TABLE messages ADD COLUMN edited_at TEXT DEFAULT NULL`);
  }
  if (!msgCols.includes('deleted')) {
    db.exec(`ALTER TABLE messages ADD COLUMN deleted INTEGER DEFAULT 0`);
  }
  if (!msgCols.includes('sticker_url')) {
    db.exec(`ALTER TABLE messages ADD COLUMN sticker_url TEXT DEFAULT NULL`);
  }

  // Migration: ensure theme/avatar_url columns on rooms
  const roomCols = db.prepare("PRAGMA table_info(rooms)").all().map(r => r.name);
  if (!roomCols.includes('theme')) {
    db.exec(`ALTER TABLE rooms ADD COLUMN theme TEXT DEFAULT 'default'`);
  }
  if (!roomCols.includes('avatar_url')) {
    db.exec(`ALTER TABLE rooms ADD COLUMN avatar_url TEXT DEFAULT ''`);
  }

  return db;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verify;
}

function randomPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%';
  return Array.from({ length }, () => chars[crypto.randomInt(chars.length)]).join('');
}

module.exports = { getDb, hashPassword, verifyPassword, randomPassword };

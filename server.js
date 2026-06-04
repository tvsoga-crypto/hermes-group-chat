const { getDb, hashPassword, verifyPassword, randomPassword } = require('./db');
const path = require('path');
const fs = require('fs');

// ─── Hermes Gateway config ───
const HERMES_API = process.env.HERMES_API_URL || 'http://localhost:8642/v1/chat/completions';
const HERMES_API_KEY = process.env.HERMES_API_KEY || 'haima-chat-key-2026';
const AI_SYSTEM_PROMPT = process.env.AI_SYSTEM_PROMPT || `你叫做海馬（Haima），是一個由 Nous Research 打造的智能 AI 助手。

你現在在一個名為「AI漫畫對話」的群組聊天室裡，有多位使用者在跟你對話。

規則：
1. 每位使用者的訊息會以「[使用者名稱] 訊息內容」的格式呈現
2. 你要用自然、友善的繁體中文回覆
3. 記得對話上下文，認得每個人的身份和說過的話
4. 你可以使用各種工具來幫助使用者（查資料、執行程式碼、操作電腦等），但工具執行結果不會顯示在聊天室裡，你只需把結論告訴大家
5. 保持輕鬆愉快的群聊氣氛`;

const AI_HISTORY_LIMIT = 40;

// ─── DeepSeek API config for AI Creation Advisor ───
const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-8d3340b0264e4e87856b4c7222c5cb98';

const ADVISOR_SYSTEM_PROMPT = `你是「漫畫創作顧問」，隸屬於一個大型漫畫家資料庫。你的任務是透過對話引導創作者，幫助他們找到適合自己的創作風格、畫風和題材。

你的資料庫包含以下知識：

📊 七大區域漫畫家庫：日本、美國、韓國、歐洲、台灣、香港、中國，總共超過400位作家

🎯 五大讀者分類：兒童、少年、青年、成人、少女

📐 六大創作維度評分（1-10）：劇情深度、畫風細膩度、色彩豐富度、閱讀門檻（越高越難入門）、角色塑造、風格實驗性 + 熱銷程度（1-10）

🎨 十七種風格標籤：寫實派、半寫實、美型派、可愛風、萌系、精緻細膩、簡潔清新、粗獷豪放、水墨/毛筆、經典畫風、現代畫風、歐美畫風、黑暗系、童話風、極簡主義、實驗性、浮世繪風

📌 十大題材主標籤與子標籤：
- 動作/戰鬥（格鬥、冒險、忍者、武士、武俠、功夫、王道）
- 科幻（SF、機甲、機器人、賽博龐克、未來世界、AI、異世界）
- 奇幻（魔法、神話、傳說、劍與魔法、龍、轉生）
- 恐怖（驚悚、懸疑、獵奇、靈異、鬼怪、克蘇魯、心理恐怖、復仇）
- 搞笑（喜劇、諷刺、黑色幽默、四格、惡搞）
- 愛情（戀愛、純愛、BL、GL、成人戀愛、青梅竹馬）
- 懸疑/推理（解謎、犯罪、偵探、心理戰、反轉）
- 日常/生活（溫馨、療癒、親情、職人、美食、旅行）
- 歷史（時代劇、戰國、古裝、歷史改編、神話傳承）
- 運動（棒球、籃球、足球、格鬥技、競技）

引導流程（自由對話，不需嚴格按順序）：
1. 先認識創作者
2. 了解他們的漫畫故事
3. 探索創作偏好
4. 了解擅長領域與夢想

回答規則：
|- 使用繁體中文、溫暖友善的語氣
|- 【重要】每一則回覆【只能包含一個問句】。
|  例如 ❌「你叫什麼名字？你的興趣是什麼？」→ ✅「你叫什麼名字？」下一回合再問興趣。
|- 上一題對方回答後，先給予肯定回應或簡短分析，再接下一題
|- 根據對方的回答，從資料庫中找出相關的大師作為參考
|- 在適當的時候，給出具體的創作建議
|- 當你覺得已經收集足夠資訊時，可以主動給出完整的「創作者分析報告」
|- 報告格式包含：風格定位、最接近的大師、適合題材、建議強化方向、推薦閱讀作品
|- ⚠️【強制選項按鈕規則】每一則回覆只要包含問句，就必須在結尾加上 [Options: ...]。【不得有例外】
|  格式：[Options: 選項1, 選項2, 選項3]
|  就算是問名字這種開放式問題，也要給出範例按鈕選項，例如：
|  請問你叫什麼名字呀？[Options: 叫我小明, 叫我阿華, 先保密, 叫我小創]
|  你心目中「最熱血」的漫畫是哪一部？[Options: 航海王, 鬼滅之刃, 咒術迴戰, 進擊的巨人, 其他]
|  【沒有選項 = 不完整回覆】每一題都必須提供選項按鈕。`;

async function callDeepSeekAI(messages) {
  if (!DEEPSEEK_API_KEY) {
    return { content: 'AI 顧問尚未設定 API key，請管理員設定後再使用。', reasoning: null };
  }
  try {
    const response = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: ADVISOR_SYSTEM_PROMPT }, ...messages],
        temperature: 0.8,
        max_tokens: 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', response.status, errText);
      return { content: `AI 顧問連線異常，請稍後再試。（錯誤 ${response.status}）`, reasoning: null };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (content && content.trim()) {
      return { content: content.trim(), reasoning: null };
    }
    return { content: 'AI 顧問暫時沒有回應。', reasoning: null };
  } catch (err) {
    console.error('DeepSeek API call failed:', err.message);
    return { content: `AI 顧問連線異常：${err.message}`, reasoning: null };
  }
}

// ─── Call Hermes Agent via Gateway API (streaming) ───
async function callHermesAI(messages, callbacks = {}) {
  const { onToken, onDone, onError } = callbacks;
  try {
    const history = buildAIHistory(messages);
    const response = await fetch(HERMES_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HERMES_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'hermes',
        messages: history,
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hermes API error:', response.status, errText);
      if (onError) onError(`海馬暫時連不上，請稍後再試。（錯誤 ${response.status}）`);
      return { content: `海馬暫時連不上，請稍後再試。（錯誤 ${response.status}）`, reasoning: null };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    let reasoning = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const json = trimmed.slice(6);
        if (json === '[DONE]') continue;

        try {
          const parsed = JSON.parse(json);
          const choice = parsed.choices?.[0];
          const delta = choice?.delta || {};

          if (delta.content) {
            fullContent += delta.content;
            if (onToken) onToken(fullContent);
          }

          if (choice?.finish_reason) {
            // Final reasoning from the last chunk
            if (parsed.choices?.[0]?.message?.reasoning) {
              reasoning = parsed.choices[0].message.reasoning;
            }
          }
        } catch (e) {
          // partial JSON - skip
        }
      }
    }

    // Handle remaining buffer
    if (buffer.trim().startsWith('data: ')) {
      const json = buffer.trim().slice(6);
      if (json !== '[DONE]') {
        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta || {};
          if (delta.content) {
            fullContent += delta.content;
            if (onToken) onToken(fullContent);
          }
          if (parsed.choices?.[0]?.message?.reasoning) {
            reasoning = parsed.choices[0].message.reasoning;
          }
        } catch (e) {}
      }
    }

    const result = {
      content: fullContent.trim() || '海馬沒有回應，可能是睡著了 🐍',
      reasoning: reasoning || null
    };
    if (onDone) onDone(result);
    return result;
  } catch (err) {
    console.error('Hermes API call failed:', err.message);
    const errMsg = `海馬連線異常：${err.message}`;
    if (onError) onError(errMsg);
    return { content: errMsg, reasoning: null };
  }
}

function buildAIHistory(recentMessages) {
  const history = [{ role: 'system', content: AI_SYSTEM_PROMPT }];

  for (const msg of recentMessages) {
    if (msg.role === 'user') {
      history.push({
        role: 'user',
        content: msg.display_name
          ? `[${msg.display_name}] ${msg.content}`
          : msg.content,
      });
    } else if (msg.role === 'assistant') {
      history.push({ role: 'assistant', content: msg.content });
    }
  }

  return history;
}

// ─── Express middleware ───
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'haima-chat-jwt-secret-2026-fixed';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ ok: false, error: '未登入' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: '登入已過期' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ ok: false, error: '需要管理員權限' });
  }
  next();
}

// ─── Socket.IO auth ───
function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('未登入'));

  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error('登入已過期'));
  }
}

// ─── Setup Express app ───
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');

// ─── Online users tracking ───
const onlineUsers = new Set();
const onlineUserSockets = {};


// ─── File upload config ───
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const type = file.mimetype.split('/')[0];
    if (type === 'image' || type === 'video') cb(null, true);
    else cb(new Error('只支援圖片和影片檔案'));
  },
});

function createApp() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  // ─── Compute app version at startup ───
  const now = new Date();
  const buildTime =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  const APP_VERSION = buildTime;  // e.g. "20260604-141530"

  // Read & inject version into HTML once at startup (cache-busting)
  const rawHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
  const processedHtml = rawHtml.replace(/<!--APP_VERSION-->/g, APP_VERSION);

  // Serve version-injected HTML for root (BEFORE express.static)
  app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.type('html').send(processedHtml);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(UPLOAD_DIR));
  // No-cache for static HTML files (other pages like index.html accessed directly)
  app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.csv') || filePath.endsWith('.json')) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  // ── Auth API ──
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDb();

    try {
      const user = db.prepare('SELECT * FROM users WHERE username = ? AND active = 1').get(username);
      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ ok: false, error: '帳號或密碼不正確' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, displayName: user.display_name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        ok: true,
        token,
        user: { id: user.id, username: user.username, displayName: user.display_name, role: user.role },
      });
    } finally {
      db.close();
    }
  });

  app.post('/api/register', (req, res) => {
    const db = getDb();
    try {
      const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count > 0;
      if (hasUsers) {
        return res.status(403).json({ ok: false, error: '已有使用者，請登入' });
      }

      const { username, display_name, password } = req.body;
      if (!username || !display_name || !password || password.length < 8) {
        return res.status(400).json({ ok: false, error: '請填寫完整，密碼至少 8 字元' });
      }

      db.prepare('INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, ?)').run(
        username, display_name, hashPassword(password), 'admin'
      );

      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: '帳號可能已存在' });
    } finally {
      db.close();
    }
  });

  app.get('/api/check-setup', (req, res) => {
    const db = getDb();
    try {
      const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      res.json({ needsSetup: count === 0 });
    } finally {
      db.close();
    }
  });

  // ── Messages API (cursor pagination) ──
  app.get('/api/messages', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const limit = Math.min(parseInt(req.query.limit) || 30, 80);
      const before = parseInt(req.query.before) || null;
      const roomId = parseInt(req.query.room_id) || 1;

      let messages;
      if (before) {
        messages = db.prepare(`
          SELECT id, role, content, reasoning, display_name, created_at, file_url, file_type, room_id, reply_to_id, edited_at, deleted, sticker_url
          FROM messages WHERE room_id = ? AND id < ? ORDER BY id DESC LIMIT ?
        `).all(roomId, before, limit).reverse();
      } else {
        messages = db.prepare(`
          SELECT id, role, content, reasoning, display_name, created_at, file_url, file_type, room_id, reply_to_id, edited_at, deleted, sticker_url
          FROM messages WHERE room_id = ? ORDER BY id DESC LIMIT ?
        `).all(roomId, limit).reverse();
      }

      const hasMore = messages.length === limit;
      res.json({ ok: true, messages, hasMore });
    } finally {
      db.close();
    }
  });

  // ── Search messages ──
  app.get('/api/messages/search', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const q = req.query.q || '';
      const roomId = parseInt(req.query.room_id) || null;
      if (!q.trim()) {
        return res.json({ ok: true, messages: [] });
      }

      const searchPattern = `%${q}%`;
      let messages;
      if (roomId) {
        messages = db.prepare(`
          SELECT id, role, content, reasoning, display_name, created_at, file_url, file_type, room_id, reply_to_id, edited_at, deleted, sticker_url
          FROM messages WHERE content LIKE ? AND room_id = ? ORDER BY id DESC LIMIT 50
        `).all(searchPattern, roomId);
      } else {
        messages = db.prepare(`
          SELECT id, role, content, reasoning, display_name, created_at, file_url, file_type, room_id, reply_to_id, edited_at, deleted, sticker_url
          FROM messages WHERE content LIKE ? ORDER BY id DESC LIMIT 50
        `).all(searchPattern);
      }

      res.json({ ok: true, messages });
    } finally {
      db.close();
    }
  });

  // ── Get single message (for reply quoting) ──
  app.get('/api/messages/:id', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const id = parseInt(req.params.id);
      const msg = db.prepare(`
        SELECT id, role, content, display_name, created_at, file_url, file_type, room_id, reply_to_id, edited_at, deleted, sticker_url
        FROM messages WHERE id = ?
      `).get(id);
      if (!msg) {
        return res.status(404).json({ ok: false, error: '訊息不存在' });
      }
      res.json({ ok: true, message: msg });
    } finally {
      db.close();
    }
  });

  // ── Edit message ──
  app.post('/api/messages/:id/edit', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ ok: false, error: '內容不能為空' });
      }

      const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
      if (!msg) {
        return res.status(404).json({ ok: false, error: '訊息不存在' });
      }

      if (msg.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, error: '沒有權限編輯此訊息' });
      }

      db.prepare("UPDATE messages SET content = ?, edited_at = datetime('now') WHERE id = ?")
        .run(content.trim(), id);

      res.json({ ok: true });
    } finally {
      db.close();
    }
  });

  // ── Delete message ──
  app.post('/api/messages/:id/delete', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const id = parseInt(req.params.id);
      const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
      if (!msg) {
        return res.status(404).json({ ok: false, error: '訊息不存在' });
      }

      if (msg.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, error: '沒有權限刪除此訊息' });
      }

      db.prepare('UPDATE messages SET deleted = 1 WHERE id = ?').run(id);

      res.json({ ok: true });
    } finally {
      db.close();
    }
  });

  // ── Read receipts ──
  app.post('/api/read-receipt', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const { last_read_message_id, room_id } = req.body;
      if (!last_read_message_id || !room_id) {
        return res.status(400).json({ ok: false, error: '缺少必要參數' });
      }

      db.prepare(`
        INSERT INTO read_receipts (room_id, user_id, last_read_message_id, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(room_id, user_id) DO UPDATE SET
          last_read_message_id = excluded.last_read_message_id,
          updated_at = datetime('now')
      `).run(room_id, req.user.id, last_read_message_id);

      res.json({ ok: true });
    } finally {
      db.close();
    }
  });

  app.get('/api/read-receipts/:room_id', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const roomId = parseInt(req.params.room_id) || 1;
      const receipts = db.prepare(`
        SELECT r.last_read_message_id, r.updated_at, u.id as user_id, u.display_name as displayName
        FROM read_receipts r
        JOIN users u ON u.id = r.user_id
        WHERE r.room_id = ?
      `).all(roomId);

      res.json({ ok: true, receipts });
    } finally {
      db.close();
    }
  });

  // ── Online users API ──
  app.get('/api/users/online', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const users = [];
      for (const userId of onlineUsers) {
        const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(userId);
        if (user) {
          users.push({ id: user.id, username: user.username, displayName: user.display_name });
        }
      }
      res.json({ ok: true, users });
    } finally {
      db.close();
    }
  });

  // ── File upload ──
  app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, error: '請選擇檔案' });
    const fileUrl = '/uploads/' + req.file.filename;
    const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    res.json({ ok: true, fileUrl, fileType, fileName: req.file.originalname });
  });

  // ── Rooms API ──
  app.get('/api/rooms', authMiddleware, (req, res) => {
    const db = getDb();
    try {
      const rooms = db.prepare('SELECT id, name, description, system_prompt, theme, avatar_url, is_default, active, created_at FROM rooms WHERE active = 1 ORDER BY id').all();
      res.json({ ok: true, rooms });
    } finally {
      db.close();
    }
  });

  // Admin: create room
  app.post('/api/admin/rooms', authMiddleware, adminMiddleware, (req, res) => {
    const { name, description, system_prompt } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, error: '請填寫聊天室名稱' });
    }
    const db = getDb();
    try {
      const result = db.prepare(
        'INSERT INTO rooms (name, description, system_prompt, created_by) VALUES (?, ?, ?, ?)'
      ).run(name.trim(), description || '', system_prompt || '', req.user.id);
      res.json({ ok: true, roomId: result.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ ok: false, error: '建立失敗' });
    } finally {
      db.close();
    }
  });

  // Admin: update room
  app.post('/api/admin/rooms/:id', authMiddleware, adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, system_prompt, theme } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, error: '請填寫聊天室名稱' });
    }
    const db = getDb();
    try {
      db.prepare(
        'UPDATE rooms SET name = ?, description = ?, system_prompt = ?, theme = ? WHERE id = ?'
      ).run(name.trim(), description || '', system_prompt || '', theme || 'default', id);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: '更新失敗' });
    } finally {
      db.close();
    }
  });

  // Admin: upload room avatar
  app.post('/api/admin/rooms/:id/avatar', authMiddleware, adminMiddleware, upload.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, error: '請選擇圖片' });
    const id = parseInt(req.params.id);
    const avatarUrl = '/uploads/' + req.file.filename;
    const db = getDb();
    try {
      db.prepare('UPDATE rooms SET avatar_url = ? WHERE id = ?').run(avatarUrl, id);
      res.json({ ok: true, avatarUrl });
    } finally {
      db.close();
    }
  });

  // Admin: toggle room active
  app.post('/api/admin/rooms/:id/toggle', authMiddleware, adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const db = getDb();
    try {
      const room = db.prepare('SELECT id, is_default FROM rooms WHERE id = ?').get(id);
      if (!room) return res.status(404).json({ ok: false, error: '聊天室不存在' });
      if (room.is_default) return res.status(400).json({ ok: false, error: '不能停用預設聊天室' });

      db.prepare('UPDATE rooms SET active = CASE active WHEN 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
      res.json({ ok: true });
    } finally {
      db.close();
    }
  });

  // ── Admin API ──
  app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
    const db = getDb();
    try {
      const users = db.prepare('SELECT id, username, display_name, role, active, created_at FROM users ORDER BY id').all();
      res.json({ ok: true, users });
    } finally {
      db.close();
    }
  });

  app.post('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
    const { username, display_name, password } = req.body;
    if (!username || !display_name || !password || password.length < 4) {
      return res.status(400).json({ ok: false, error: '請填寫帳號、顯示名稱、密碼（至少 4 字元）' });
    }

    const db = getDb();
    try {
      db.prepare('INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, ?)').run(
        username, display_name, hashPassword(password), 'member'
      );
      res.json({ ok: true, username, password });
    } catch {
      res.status(400).json({ ok: false, error: '建立失敗，帳號可能已存在' });
    } finally {
      db.close();
    }
  });

  app.post('/api/admin/users/:id/reset', authMiddleware, adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const db = getDb();
    try {
      const password = randomPassword();
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), id);
      const user = db.prepare('SELECT username FROM users WHERE id = ?').get(id);
      res.json({ ok: true, username: user?.username, password });
    } finally {
      db.close();
    }
  });

  app.post('/api/admin/users/:id/toggle', authMiddleware, adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ ok: false, error: '不能停用自己' });

    const db = getDb();
    try {
      db.prepare('UPDATE users SET active = CASE active WHEN 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
      res.json({ ok: true });
    } finally {
      db.close();
    }
  });

  // ── Update user (username, display_name, password) ──
  app.post('/api/admin/users/:id/update', authMiddleware, adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const { username, display_name, password } = req.body;
    if (!username || !display_name) {
      return res.status(400).json({ ok: false, error: '帳號與顯示名稱必填' });
    }

    const db = getDb();
    try {
      if (password && password.length >= 4) {
        db.prepare('UPDATE users SET username = ?, display_name = ?, password_hash = ? WHERE id = ?')
          .run(username, display_name, hashPassword(password), id);
      } else {
        db.prepare('UPDATE users SET username = ?, display_name = ? WHERE id = ?')
          .run(username, display_name, id);
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: '更新失敗，帳號可能已被使用' });
    } finally {
      db.close();
    }
  });

  // ── User self-update profile ──
  app.post('/api/profile/update', authMiddleware, (req, res) => {
    const { username, display_name, password } = req.body;
    if (!username || !display_name) {
      return res.status(400).json({ ok: false, error: '帳號與顯示名稱必填' });
    }

    const db = getDb();
    try {
      const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, req.user.id);
      if (existing) {
        return res.status(400).json({ ok: false, error: '此帳號已被使用' });
      }

      if (password && password.length >= 4) {
        db.prepare('UPDATE users SET username = ?, display_name = ?, password_hash = ? WHERE id = ?')
          .run(username, display_name, hashPassword(password), req.user.id);
      } else {
        db.prepare('UPDATE users SET username = ?, display_name = ? WHERE id = ?')
          .run(username, display_name, req.user.id);
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: '更新失敗' });
    } finally {
      db.close();
    }
  });

  // ── Version API ──
  app.get('/api/version', (req, res) => {
    res.json({ version: APP_VERSION, buildTime: new Date().toISOString() });
  });

  // ── Server stats (Socket.IO connections) ──
  app.get('/api/stats', (req, res) => {
    try {
      const sockets = io.sockets.sockets;
      const rooms = io.sockets.adapter.rooms;
      // Count unique users per room from connected sockets
      const roomUsers = {};
      for (const [sid, socket] of sockets) {
        const user = socket.user || { displayName: 'unknown' };
        for (const room of socket.rooms) {
          if (room !== sid) { // skip the default socket room
            if (!roomUsers[room]) roomUsers[room] = new Set();
            roomUsers[room].add(user.displayName || user.username || 'unknown');
          }
        }
      }
      res.json({
        ok: true,
        totalConnections: sockets.size,
        rooms: Object.fromEntries(
          Object.entries(roomUsers).map(([room, users]) => [room, [...users]])
        )
      });
    } catch(e) {
      res.json({ ok: false, error: e.message });
    }
  });

  // ── AI Creation Advisor API ──
  app.post('/api/advisor', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ ok: false, error: '請提供對話內容' });
      }
      const result = await callDeepSeekAI(messages);
      res.json({ ok: true, reply: result.content });
    } catch (err) {
      console.error('/api/advisor error:', err);
      res.status(500).json({ ok: false, error: '伺服器錯誤' });
    }
  });

  // ── SPA fallback (serve version-injected HTML) ──
  app.get(['/chat', '/login', '/admin', '/setup', '/'], (req, res) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.type('html').send(processedHtml);
  });

  // ── Socket.IO ──
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`[connect] ${socket.user.displayName} (${socket.id})`);

    // ── Online users tracking ──
    onlineUsers.add(socket.user.id);
    onlineUserSockets[socket.user.id] = socket.id;

    // Broadcast updated online users list
    const db = getDb();
    try {
      const usersList = [];
      for (const userId of onlineUsers) {
        const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(userId);
        if (user) {
          usersList.push({ id: user.id, username: user.username, displayName: user.display_name });
        }
      }
      io.emit('users:online', { users: usersList });
    } finally {
      db.close();
    }

    socket.join('room:main');

    socket.on('chat:message', async (data) => {
      const content = data?.content?.trim() || '';
      const fileUrl = data?.fileUrl || null;
      const fileType = data?.fileType || null;
      const stickerUrl = data?.stickerUrl || null;
      const roomId = data?.roomId || 1;
      const replyToId = data?.replyTo || data?.reply_to_id || null;
      if (!content && !fileUrl && !stickerUrl) return;

      const db = getDb();
      try {
        const userMsgId = db.prepare(
          'INSERT INTO messages (room_id, user_id, display_name, role, content, file_url, file_type, reply_to_id, sticker_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(roomId, socket.user.id, socket.user.displayName, 'user', content, fileUrl, fileType, replyToId, stickerUrl).lastInsertRowid;

        const userMsg = db.prepare('SELECT * FROM messages WHERE id = ?').get(userMsgId);
        io.to('room:main').emit('chat:new_message', {
          id: userMsg.id,
          roomId: userMsg.room_id,
          role: 'user',
          content: userMsg.content,
          fileUrl: userMsg.file_url,
          fileType: userMsg.file_type,
          stickerUrl: userMsg.sticker_url || null,
          replyToId: userMsg.reply_to_id,
          displayName: socket.user.displayName,
          createdAt: userMsg.created_at,
        });

        let aiInputText = content;
        if (stickerUrl) {
          aiInputText = `[${socket.user.displayName}] 發送了一個貼圖：${stickerUrl}`;
        } else if (fileUrl) {
          const mediaLabel = fileType === 'video' ? '上傳了影片' : '上傳了圖片';
          const fullUrl = `http://192.168.11.113:3000${fileUrl}`;
          aiInputText = content
            ? `[${socket.user.displayName}] ${content}（並${mediaLabel}：${fullUrl}）`
            : `[${socket.user.displayName}] ${mediaLabel}：${fullUrl}`;
        } else {
          aiInputText = `[${socket.user.displayName}] ${content}`;
        }

        const recentMessages = db.prepare(`
          SELECT role, content, display_name FROM messages
          WHERE room_id = ? AND role IN ('user', 'assistant')
          ORDER BY id DESC LIMIT ?
        `).all(roomId, AI_HISTORY_LIMIT).reverse();

        recentMessages.push({ role: 'user', content: aiInputText, display_name: null });

        // Don't emit typing - we'll use streaming status instead
        io.to('room:main').emit('chat:ai_status', {
          step: 'thinking',
          text: '🐍 海馬正在思考',
          replyToUserMsgId: userMsgId,
        });

        let finalContent = '';
        let finalReasoning = null;

        await callHermesAI(recentMessages, {
          onToken: (fullContent) => {
            io.to('room:main').emit('chat:ai_status', {
              step: 'streaming',
              text: '✍️ 正在撰寫...',
              content: fullContent,
              replyToUserMsgId: userMsgId,
            });
          },
          onDone: (result) => {
            finalContent = result.content;
            finalReasoning = result.reasoning;
          },
          onError: (errMsg) => {
            finalContent = errMsg;
          },
        });

        const aiContent = finalContent;
        const aiReasoning = finalReasoning;

        const aiMsgId = db.prepare(
          'INSERT INTO messages (room_id, user_id, display_name, role, content, reasoning) VALUES (?, NULL, ?, ?, ?, ?)'
        ).run(roomId, '海馬', 'assistant', aiContent, aiReasoning).lastInsertRowid;

        const aiMsg = db.prepare('SELECT * FROM messages WHERE id = ?').get(aiMsgId);
        io.to('room:main').emit('chat:ai_done', {
          id: aiMsg.id,
          roomId: aiMsg.room_id,
          role: 'assistant',
          content: aiContent,
          reasoning: aiReasoning,
          displayName: '海馬',
          createdAt: aiMsg.created_at,
        });

      } catch (err) {
        console.error('chat:message error:', err);
        socket.emit('chat:error', '發送失敗，請重試');
      } finally {
        db.close();
      }
    });

    // ── Reactions ──
    socket.on('chat:reaction', (data) => {
      const { message_id, reaction, roomId } = data;
      if (!message_id || !reaction || !roomId) return;

      const db = getDb();
      try {
        const existing = db.prepare(
          'SELECT id FROM reactions WHERE message_id = ? AND user_id = ? AND reaction = ?'
        ).get(message_id, socket.user.id, reaction);

        if (existing) {
          db.prepare('DELETE FROM reactions WHERE id = ?').run(existing.id);
        } else {
          db.prepare(
            'INSERT INTO reactions (message_id, user_id, reaction) VALUES (?, ?, ?)'
          ).run(message_id, socket.user.id, reaction);
        }

        const reactions = db.prepare(`
          SELECT r.user_id, u.display_name AS displayName, r.reaction
          FROM reactions r
          JOIN users u ON u.id = r.user_id
          WHERE r.message_id = ?
        `).all(message_id);

        io.to('room:main').emit('chat:reaction_update', {
          messageId: message_id,
          reactions: reactions.map(r => ({
            user_id: r.user_id,
            display_name: r.displayName,
            reaction: r.reaction,
          })),
        });
      } catch (err) {
        console.error('chat:reaction error:', err);
      } finally {
        db.close();
      }
    });

    // ── Read receipt ──
    socket.on('chat:read_receipt', (data) => {
      const { last_read_message_id, room_id } = data;
      if (!last_read_message_id || !room_id) return;

      const db = getDb();
      try {
        db.prepare(`
          INSERT INTO read_receipts (room_id, user_id, last_read_message_id, updated_at)
          VALUES (?, ?, ?, datetime('now'))
          ON CONFLICT(room_id, user_id) DO UPDATE SET
            last_read_message_id = excluded.last_read_message_id,
            updated_at = datetime('now')
        `).run(room_id, socket.user.id, last_read_message_id);

        socket.to('room:main').emit('chat:read_receipt', {
          userId: socket.user.id,
          displayName: socket.user.displayName,
          lastReadMessageId: last_read_message_id,
          roomId: room_id,
        });
      } catch (err) {
        console.error('chat:read_receipt error:', err);
      } finally {
        db.close();
      }
    });

    socket.on('chat:typing', (data) => {
      socket.to('room:main').emit('chat:typing', {
        ...data,
        userId: socket.user.id,
        displayName: socket.user.displayName,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[disconnect] ${socket.user.displayName}`);

      onlineUsers.delete(socket.user.id);
      delete onlineUserSockets[socket.user.id];

      const db = getDb();
      try {
        const usersList = [];
        for (const userId of onlineUsers) {
          const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(userId);
          if (user) {
            usersList.push({ id: user.id, username: user.username, displayName: user.display_name });
          }
        }
        io.emit('users:online', { users: usersList });
      } finally {
        db.close();
      }
    });
  });

  return { app, server, io };
}

// ─── Setup admin from CLI ───
function setupAdminFromCLI() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const db = getDb();
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (count > 0) {
      console.log('已有管理員，跳過設定。');
      process.exit(0);
    }

    console.log('=== 首次安裝 — 建立管理員 ===\n');
    readline.question('帳號: ', (username) => {
      readline.question('顯示名稱: ', (displayName) => {
        readline.question('密碼 (至少 8 字元): ', (password) => {
          if (!username || !displayName || password.length < 8) {
            console.log('請填寫完整，密碼至少 8 字元。');
            process.exit(1);
          }
          db.prepare('INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, ?)').run(
            username, displayName, hashPassword(password), 'admin'
          );
          console.log(`管理員「${displayName}」建立成功！`);
          process.exit(0);
        });
      });
    });
  } finally {
    // Don't close db here since readline is async
  }
}

if (require.main === module) {
  if (process.argv.includes('--setup-admin')) {
    setupAdminFromCLI();
  } else {
    const { server } = createApp();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🐍 海馬群聊伺服器啟動：http://0.0.0.0:${PORT}`);
      console.log(`   Hermes API: ${HERMES_API}`);
    });
  }
}

module.exports = { createApp, getDb, hashPassword, verifyPassword, randomPassword };

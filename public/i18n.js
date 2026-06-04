// ─── i18n: 多語系支援 ───
// Loaded before main script. Provides window.__() and language switcher.

(function() {
  const STORAGE_KEY = 'haima_lang';

  // ── Translations (auto-generated from i18n-strings.json) ──
  const LOCALE = {
  "AI漫畫對話": {
    "hans": "AI漫画对话",
    "en": "AI Comic Chat"
  },
  "AI漫畫": {
    "hans": "AI漫画",
    "en": "AI Comic"
  },
  "首次安裝 — 建立管理員帳號": {
    "hans": "首次安装 — 建立管理员账号",
    "en": "First Install — Create Admin Account"
  },
  "帳號": {
    "hans": "账号",
    "en": "Username"
  },
  "顯示名稱": {
    "hans": "显示名称",
    "en": "Display Name"
  },
  "密碼": {
    "hans": "密码",
    "en": "Password"
  },
  "建立管理員": {
    "hans": "建立管理员",
    "en": "Create Admin"
  },
  "登入後以自己的身份加入 AI 群組對話": {
    "hans": "登录后以自己的身份加入 AI 群组对话",
    "en": "Log in to join the AI group chat as yourself"
  },
  "登入": {
    "hans": "登录",
    "en": "Log In"
  },
  "後台": {
    "hans": "后台",
    "en": "Admin"
  },
  "設定": {
    "hans": "设置",
    "en": "Settings"
  },
  "登出": {
    "hans": "登出",
    "en": "Log Out"
  },
  "🐍 海馬": {
    "hans": "🐍 海马",
    "en": "🐍 Sea Horse"
  },
  "訪客": {
    "hans": "访客",
    "en": "Guest"
  },
  "未知": {
    "hans": "未知",
    "en": "Unknown"
  },
  "搜尋訊息": {
    "hans": "搜索消息",
    "en": "Search Messages"
  },
  "線上用戶": {
    "hans": "在线用户",
    "en": "Online Users"
  },
  "上傳檔案": {
    "hans": "上传文件",
    "en": "Upload File"
  },
  "輸入訊息... (Enter 送出)": {
    "hans": "输入消息... (Enter 发送)",
    "en": "Type a message... (Enter to send)"
  },
  "送出": {
    "hans": "发送",
    "en": "Send"
  },
  "跳到最新": {
    "hans": "跳至最新",
    "en": "Jump to Latest"
  },
  "載入中...": {
    "hans": "加载中...",
    "en": "Loading..."
  },
  "海馬正在輸入...": {
    "hans": "海马正在输入...",
    "en": "Sea Horse is typing..."
  },
  "🐍 海馬正在輸入...": {
    "hans": "🐍 海马正在输入...",
    "en": "🐍 Sea Horse is typing..."
  },
  "回覆": {
    "hans": "回复",
    "en": "Reply"
  },
  "載入更早的訊息": {
    "hans": "加载更早的消息",
    "en": "Load Earlier Messages"
  },
  "還沒有訊息，來打聲招呼吧！👋": {
    "hans": "还没有消息，来打个招呼吧！👋",
    "en": "No messages yet, say hello! 👋"
  },
  "線上人數:": {
    "hans": "在线人数:",
    "en": "Online:"
  },
  "已讀:": {
    "hans": "已读:",
    "en": "Read by:"
  },
  "頭像": {
    "hans": "头像",
    "en": "Avatar"
  },
  "圖片": {
    "hans": "图片",
    "en": "Image"
  },
  "此訊息已刪除": {
    "hans": "此消息已删除",
    "en": "This message has been deleted"
  },
  "(已編輯)": {
    "hans": "(已编辑)",
    "en": "(edited)"
  },
  "💭 查看思考過程": {
    "hans": "💭 查看思考过程",
    "en": "💭 View reasoning"
  },
  "確定要刪除此訊息？": {
    "hans": "确定要删除此消息？",
    "en": "Are you sure you want to delete this message?"
  },
  "編輯": {
    "hans": "编辑",
    "en": "Edit"
  },
  "刪除": {
    "hans": "删除",
    "en": "Delete"
  },
  "儲存": {
    "hans": "保存",
    "en": "Save"
  },
  "取消": {
    "hans": "取消",
    "en": "Cancel"
  },
  "複製": {
    "hans": "复制",
    "en": "Copy"
  },
  "已複製": {
    "hans": "已复制",
    "en": "Copied"
  },
  "編輯失敗": {
    "hans": "编辑失败",
    "en": "Edit failed"
  },
  "刪除失敗": {
    "hans": "删除失败",
    "en": "Delete failed"
  },
  "搜尋訊息...": {
    "hans": "搜索消息...",
    "en": "Search messages..."
  },
  "輸入關鍵字開始搜尋": {
    "hans": "输入关键词开始搜索",
    "en": "Enter keywords to search"
  },
  "搜尋中...": {
    "hans": "搜索中...",
    "en": "Searching..."
  },
  "沒有找到相關訊息": {
    "hans": "没有找到相关消息",
    "en": "No relevant messages found"
  },
  "搜尋失敗": {
    "hans": "搜索失败",
    "en": "Search failed"
  },
  "[檔案]": {
    "hans": "[文件]",
    "en": "[File]"
  },
  "[已刪除]": {
    "hans": "[已删除]",
    "en": "[Deleted]"
  },
  "後台管理": {
    "hans": "后台管理",
    "en": "Admin Panel"
  },
  "建立帳號密碼，交給要加入聊天室的人": {
    "hans": "创建账号密码，交给要加入聊天室的人",
    "en": "Create login credentials for people to join the chat"
  },
  "← 回聊天室": {
    "hans": "← 回聊天室",
    "en": "← Back to Chat"
  },
  "新的登入資料": {
    "hans": "新的登录资料",
    "en": "New Login Credentials"
  },
  "帳號：": {
    "hans": "账号：",
    "en": "Username:"
  },
  "密碼：": {
    "hans": "密码：",
    "en": "Password:"
  },
  "新增帳號": {
    "hans": "新增账号",
    "en": "Add Account"
  },
  "建立帳號": {
    "hans": "建立账号",
    "en": "Create Account"
  },
  "帳號列表": {
    "hans": "账号列表",
    "en": "Account List"
  },
  "✅ 啟用": {
    "hans": "✅ 启用",
    "en": "✅ Active"
  },
  "⛔ 停用": {
    "hans": "⛔ 停用",
    "en": "⛔ Disabled"
  },
  "重設密碼": {
    "hans": "重置密码",
    "en": "Reset Password"
  },
  "停用": {
    "hans": "停用",
    "en": "Disable"
  },
  "啟用": {
    "hans": "启用",
    "en": "Enable"
  },
  "聊天室管理": {
    "hans": "聊天室管理",
    "en": "Room Management"
  },
  "名稱": {
    "hans": "名称",
    "en": "Name"
  },
  "例如：漫畫討論": {
    "hans": "例如：漫画讨论",
    "en": "e.g. Comic Discussion"
  },
  "說明": {
    "hans": "说明",
    "en": "Description"
  },
  "簡短描述這個聊天室的主題": {
    "hans": "简短描述这个聊天室的主题",
    "en": "Briefly describe this chat room's topic"
  },
  "新增聊天室": {
    "hans": "新增聊天室",
    "en": "Add Room"
  },
  "無描述": {
    "hans": "无描述",
    "en": "No description"
  },
  "無說明": {
    "hans": "无说明",
    "en": "No description"
  },
  "⭐ 預設": {
    "hans": "⭐ 预设",
    "en": "⭐ Default"
  },
  "✅ 頭像已更新": {
    "hans": "✅ 头像已更新",
    "en": "✅ Avatar updated"
  },
  "上傳失敗": {
    "hans": "上传失败",
    "en": "Upload failed"
  },
  "✅ 聊天室已建立": {
    "hans": "✅ 聊天室已建立",
    "en": "✅ Room created"
  },
  "✅ 帳號資訊已更新": {
    "hans": "✅ 账号信息已更新",
    "en": "✅ Account info updated"
  },
  "深色": {
    "hans": "深色",
    "en": "Dark"
  },
  "海洋": {
    "hans": "海洋",
    "en": "Ocean"
  },
  "森林": {
    "hans": "森林",
    "en": "Forest"
  },
  "日落": {
    "hans": "日落",
    "en": "Sunset"
  },
  "淺色": {
    "hans": "浅色",
    "en": "Light"
  },
  "午夜": {
    "hans": "午夜",
    "en": "Midnight"
  },
  "✏️ 編輯聊天室": {
    "hans": "✏️ 编辑聊天室",
    "en": "✏️ Edit Room"
  },
  "主題配色": {
    "hans": "主题配色",
    "en": "Theme"
  },
  "🌑 深色": {
    "hans": "🌑 深色",
    "en": "🌑 Dark"
  },
  "🌊 海洋": {
    "hans": "🌊 海洋",
    "en": "🌊 Ocean"
  },
  "🌲 森林": {
    "hans": "🌲 森林",
    "en": "🌲 Forest"
  },
  "🌅 日落": {
    "hans": "🌅 日落",
    "en": "🌅 Sunset"
  },
  "☀️ 淺色": {
    "hans": "☀️ 浅色",
    "en": "☀️ Light"
  },
  "🌙 午夜": {
    "hans": "🌙 午夜",
    "en": "🌙 Midnight"
  },
  "預設 GitHub 暗色": {
    "hans": "预设 GitHub 暗色",
    "en": "Default GitHub dark"
  },
  "藍色系深海風格": {
    "hans": "蓝色系深海风格",
    "en": "Blue deep-sea style"
  },
  "綠色系自然風格": {
    "hans": "绿色系自然风格",
    "en": "Green nature style"
  },
  "暖色系橘紅風格": {
    "hans": "暖色系橘红风格",
    "en": "Warm orange-red style"
  },
  "白天明亮模式": {
    "hans": "白天明亮模式",
    "en": "Daytime bright mode"
  },
  "紫色系暗色風格": {
    "hans": "紫色系暗色风格",
    "en": "Purple dark style"
  },
  "✅ 聊天室已更新": {
    "hans": "✅ 聊天室已更新",
    "en": "✅ Room updated"
  },
  "⚙️ 個人設定": {
    "hans": "⚙️ 个人设置",
    "en": "⚙️ Personal Settings"
  },
  "修改你的帳號、暱稱或密碼": {
    "hans": "修改你的账号、昵称或密码",
    "en": "Modify your username, nickname or password"
  },
  "顯示名稱（暱稱）": {
    "hans": "显示名称（昵称）",
    "en": "Display Name (Nickname)"
  },
  "新密碼（留空不修改）": {
    "hans": "新密码（留空不修改）",
    "en": "New Password (leave blank to keep current)"
  },
  "留空則不變": {
    "hans": "留空则不变",
    "en": "Leave blank to keep unchanged"
  },
  "✅ 已更新！請重新登入套用變更。": {
    "hans": "✅ 已更新！请重新登录以应用变更。",
    "en": "✅ Updated! Please log in again to apply changes."
  },
  "更新失敗": {
    "hans": "更新失败",
    "en": "Update failed"
  },
  "編輯帳號": {
    "hans": "编辑账号",
    "en": "Edit Account"
  },
  "🎬 影片": {
    "hans": "🎬 影片",
    "en": "🎬 Video"
  },
  "🖼️ 圖片": {
    "hans": "🖼️ 图片",
    "en": "🖼️ Image"
  },
  "添加說明...": {
    "hans": "添加说明...",
    "en": "Add a caption..."
  },
  "🐍": {
    "hans": "🐍",
    "en": "🐍"
  }
};

  // ── Detect language ──
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    // Auto-detect from browser
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (lang.startsWith('zh-hans') || lang.startsWith('zh-cn') || lang.startsWith('zh-sg') || lang.startsWith('zh-my')) return 'zh-Hans';
    if (lang.startsWith('zh')) return 'zh-Hant'; // zh-HK, zh-TW, Traditional
    if (lang.startsWith('en')) return 'en';
    return 'zh-Hant'; // default
  }

  let currentLang = detectLang();

  // ── Translation function ──
  window.__ = function(zhHant) {
    if (currentLang === 'zh-Hant') return zhHant;
    const entry = LOCALE[zhHant];
    if (!entry) return zhHant; // fallback
    return entry[currentLang] || zhHant;
  };

  // ── Get current lang ──
  window.__lang = function() { return currentLang; };

  // ── Set language and re-render ──
  window.__setLang = function(lang) {
    if (!['zh-Hant', 'zh-Hans', 'en'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
    // Re-render current view
    const app = document.getElementById('app');
    if (app && window.render && window.state) {
      // Determine current view and re-render
      if (state.user) render.chat();
      else if (state.needsSetup) render.setup();
      else render.login();
    }
    // Update language switcher button text
    updateLangBtn();
  };

  // ── Language names ──
  const LANG_NAMES = {
    'zh-Hant': '繁',
    'zh-Hans': '简',
    'en': 'EN'
  };

  // ── Language switcher button ──
  let langBtn = null;

  function createLangBtn() {
    langBtn = document.createElement('div');
    langBtn.id = 'haimaLangBtn';
    langBtn.style.cssText =
      'position:fixed;bottom:12px;left:12px;z-index:99999;' +
      'display:flex;gap:2px;padding:3px;border-radius:8px;' +
      'background:rgba(33,38,45,0.9);backdrop-filter:blur(8px);' +
      'border:1px solid rgba(48,54,61,0.8);';
    langBtn.setAttribute('role', 'radiogroup');
    langBtn.setAttribute('aria-label', 'Language');
    updateLangBtn();
    document.body.appendChild(langBtn);
  }

  function updateLangBtn() {
    if (!langBtn) return;
    const langs = ['zh-Hant', 'zh-Hans', 'en'];
    langBtn.innerHTML = langs.map(l =>
      `<button data-lang="${l}" style="` +
      `padding:2px 7px;border:none;border-radius:5px;cursor:pointer;` +
      `font-size:11px;font-weight:600;transition:all 0.15s;` +
      `background:${l === currentLang ? 'var(--brand,#58a6ff)' : 'transparent'};` +
      `color:${l === currentLang ? '#fff' : 'var(--muted,#8b949e)'};">` +
      `${LANG_NAMES[l]}</button>`
    ).join('');
    // Attach click handlers
    langBtn.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => window.__setLang(btn.dataset.lang);
    });
  }

  // ── Init ──
  // Set HTML lang attribute
  document.documentElement.lang = currentLang === 'en' ? 'en' : currentLang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';

  // Create language button after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLangBtn);
  } else {
    createLangBtn();
  }
})();

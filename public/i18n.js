/* ============================================================
   i18n.js — 三語支援系統 (zh-Hant / zh-Hans / en)
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'chat-lang';

  // ---------- 翻譯表 ----------
  const translations = {
    // 登入頁面
    'AI漫畫對話': { 'zh-Hant': 'AI漫畫對話', 'zh-Hans': 'AI漫画对话', 'en': 'AI Comic Chat' },
    '帳號': { 'zh-Hant': '帳號', 'zh-Hans': '账号', 'en': 'Username' },
    '密碼': { 'zh-Hant': '密碼', 'zh-Hans': '密码', 'en': 'Password' },
    '登入': { 'zh-Hant': '登入', 'zh-Hans': '登录', 'en': 'Login' },
    'AI 聊天室': { 'zh-Hant': 'AI 聊天室', 'zh-Hans': 'AI 聊天室', 'en': 'AI Chatroom' },
    '正在登入...': { 'zh-Hant': '正在登入...', 'zh-Hans': '正在登录...', 'en': 'Logging in...' },
    '記住我': { 'zh-Hant': '記住我', 'zh-Hans': '记住我', 'en': 'Remember me' },
    '登入失敗：': { 'zh-Hant': '登入失敗：', 'zh-Hans': '登录失败：', 'en': 'Login failed: ' },

    // 主介面
    '好友': { 'zh-Hant': '好友', 'zh-Hans': '好友', 'en': 'Friends' },
    '群組': { 'zh-Hant': '群組', 'zh-Hans': '群组', 'en': 'Groups' },
    '聊天': { 'zh-Hant': '聊天', 'zh-Hans': '聊天', 'en': 'Chat' },
    '通訊錄': { 'zh-Hant': '通訊錄', 'zh-Hans': '通讯录', 'en': 'Contacts' },
    '搜尋好友或群組...': { 'zh-Hant': '搜尋好友或群組...', 'zh-Hans': '搜索好友或群组...', 'en': 'Search friends or groups...' },
    '搜尋訊息...': { 'zh-Hant': '搜尋訊息...', 'zh-Hans': '搜索消息...', 'en': 'Search messages...' },
    '沒有好友': { 'zh-Hant': '沒有好友', 'zh-Hans': '没有好友', 'en': 'No friends' },
    '沒有群組': { 'zh-Hant': '沒有群組', 'zh-Hans': '没有群组', 'en': 'No groups' },
    '個人檔案': { 'zh-Hant': '個人檔案', 'zh-Hans': '个人档案', 'en': 'Profile' },
    '個人資料': { 'zh-Hant': '個人資料', 'zh-Hans': '个人资料', 'en': 'Profile' },
    '設定': { 'zh-Hant': '設定', 'zh-Hans': '设置', 'en': 'Settings' },
    '登出': { 'zh-Hant': '登出', 'zh-Hans': '登出', 'en': 'Logout' },
    '關於': { 'zh-Hant': '關於', 'zh-Hans': '关于', 'en': 'About' },
    '輸入訊息...': { 'zh-Hant': '輸入訊息...', 'zh-Hans': '输入消息...', 'en': 'Type a message...' },
    '發送': { 'zh-Hant': '發送', 'zh-Hans': '发送', 'en': 'Send' },
    '選擇聊天以開始對話': { 'zh-Hant': '選擇聊天以開始對話', 'zh-Hans': '选择聊天以开始对话', 'en': 'Select a chat to start' },
    '離線': { 'zh-Hant': '離線', 'zh-Hans': '离线', 'en': 'Offline' },
    '在線': { 'zh-Hant': '在線', 'zh-Hans': '在线', 'en': 'Online' },
    '請選擇一個聊天': { 'zh-Hant': '請選擇一個聊天', 'zh-Hans': '请选择一个聊天', 'en': 'Please select a chat' },
    '正在輸入...': { 'zh-Hant': '正在輸入...', 'zh-Hans': '正在输入...', 'en': 'Typing...' },

    // 好友管理
    '新增好友': { 'zh-Hant': '新增好友', 'zh-Hans': '添加好友', 'en': 'Add Friend' },
    '輸入好友帳號': { 'zh-Hant': '輸入好友帳號', 'zh-Hans': '输入好友账号', 'en': 'Enter friend username' },
    '已送出好友請求': { 'zh-Hant': '已送出好友請求', 'zh-Hans': '已发送好友请求', 'en': 'Friend request sent' },
    '好友請求已接受': { 'zh-Hant': '好友請求已接受', 'zh-Hans': '好友请求已接受', 'en': 'Friend request accepted' },
    '拒絕': { 'zh-Hant': '拒絕', 'zh-Hans': '拒绝', 'en': 'Decline' },
    '接受': { 'zh-Hant': '接受', 'zh-Hans': '接受', 'en': 'Accept' },
    '刪除好友': { 'zh-Hant': '刪除好友', 'zh-Hans': '删除好友', 'en': 'Remove friend' },
    '確定刪除好友？': { 'zh-Hant': '確定刪除好友？', 'zh-Hans': '确定删除好友？', 'en': 'Are you sure you want to remove this friend?' },
    '封鎖': { 'zh-Hant': '封鎖', 'zh-Hans': '封锁', 'en': 'Block' },
    '解除封鎖': { 'zh-Hant': '解除封鎖', 'zh-Hans': '解除封锁', 'en': 'Unblock' },
    '好友請求': { 'zh-Hant': '好友請求', 'zh-Hans': '好友请求', 'en': 'Friend Requests' },
    '沒有待處理的請求': { 'zh-Hant': '沒有待處理的請求', 'zh-Hans': '没有待处理的请求', 'en': 'No pending requests' },

    // 群組管理
    '建立群組': { 'zh-Hant': '建立群組', 'zh-Hans': '创建群组', 'en': 'Create Group' },
    '群組名稱': { 'zh-Hant': '群組名稱', 'zh-Hans': '群组名称', 'en': 'Group Name' },
    '群組頭貼': { 'zh-Hant': '群組頭貼', 'zh-Hans': '群组头像', 'en': 'Group Avatar' },
    '成員管理': { 'zh-Hant': '成員管理', 'zh-Hans': '成员管理', 'en': 'Member Management' },
    '退出群組': { 'zh-Hant': '退出群組', 'zh-Hans': '退出群组', 'en': 'Leave Group' },
    '確定退出群組？': { 'zh-Hant': '確定退出群組？', 'zh-Hans': '确定退出群组？', 'en': 'Are you sure you want to leave this group?' },
    '群組已建立': { 'zh-Hant': '群組已建立', 'zh-Hans': '群组已创建', 'en': 'Group created' },
    '邀請好友': { 'zh-Hant': '邀請好友', 'zh-Hans': '邀请好友', 'en': 'Invite Friends' },
    '移除成員': { 'zh-Hant': '移除成員', 'zh-Hans': '移除成员', 'en': 'Remove Member' },
    '設為管理員': { 'zh-Hant': '設為管理員', 'zh-Hans': '设为管理员', 'en': 'Make Admin' },
    '取消管理員': { 'zh-Hant': '取消管理員', 'zh-Hans': '取消管理员', 'en': 'Remove Admin' },

    // AI / Hermes
    '與 AI 對話': { 'zh-Hant': '與 AI 對話', 'zh-Hans': '与 AI 对话', 'en': 'Chat with AI' },
    'AI 助手': { 'zh-Hant': 'AI 助手', 'zh-Hans': 'AI 助手', 'en': 'AI Assistant' },
    '正在等待 AI 回覆...': { 'zh-Hant': '正在等待 AI 回覆...', 'zh-Hans': '正在等待 AI 回复...', 'en': 'Waiting for AI response...' },
    '連接 AI 伺服器...': { 'zh-Hant': '連接 AI 伺服器...', 'zh-Hans': '连接 AI 服务器...', 'en': 'Connecting to AI server...' },
    'AI 服務無法使用': { 'zh-Hant': 'AI 服務無法使用', 'zh-Hans': 'AI 服务无法使用', 'en': 'AI service unavailable' },
    '無法取得 AI 回覆：': { 'zh-Hant': '無法取得 AI 回覆：', 'zh-Hans': '无法获取 AI 回复：', 'en': 'AI response error: ' },

    // 訊息操作
    '複製': { 'zh-Hant': '複製', 'zh-Hans': '复制', 'en': 'Copy' },
    '已複製': { 'zh-Hant': '已複製', 'zh-Hans': '已复制', 'en': 'Copied' },
    '刪除': { 'zh-Hant': '刪除', 'zh-Hans': '删除', 'en': 'Delete' },
    '編輯': { 'zh-Hant': '編輯', 'zh-Hans': '编辑', 'en': 'Edit' },
    '轉發': { 'zh-Hant': '轉發', 'zh-Hans': '转发', 'en': 'Forward' },
    '回覆': { 'zh-Hant': '回覆', 'zh-Hans': '回复', 'en': 'Reply' },
    '引用': { 'zh-Hant': '引用', 'zh-Hans': '引用', 'en': 'Quote' },
    '確定刪除此訊息？': { 'zh-Hant': '確定刪除此訊息？', 'zh-Hans': '确定删除此消息？', 'en': 'Are you sure you want to delete this message?' },
    '確定': { 'zh-Hant': '確定', 'zh-Hans': '确定', 'en': 'Confirm' },
    '取消': { 'zh-Hant': '取消', 'zh-Hans': '取消', 'en': 'Cancel' },
    '儲存': { 'zh-Hant': '儲存', 'zh-Hans': '保存', 'en': 'Save' },
    '關閉': { 'zh-Hant': '關閉', 'zh-Hans': '关闭', 'en': 'Close' },
    '全部已讀': { 'zh-Hant': '全部已讀', 'zh-Hans': '全部已读', 'en': 'Mark all read' },

    // 通知與 Toast
    '連線中斷，嘗試重新連線...': { 'zh-Hant': '連線中斷，嘗試重新連線...', 'zh-Hans': '连接中断，正在尝试重新连接...', 'en': 'Connection lost, reconnecting...' },
    '已重新連線': { 'zh-Hant': '已重新連線', 'zh-Hans': '已重新连接', 'en': 'Reconnected' },
    '新訊息': { 'zh-Hant': '新訊息', 'zh-Hans': '新消息', 'en': 'New message' },
    '無新訊息': { 'zh-Hant': '無新訊息', 'zh-Hans': '无新消息', 'en': 'No new messages' },
    '上傳中...': { 'zh-Hant': '上傳中...', 'zh-Hans': '上传中...', 'en': 'Uploading...' },
    '上傳完成': { 'zh-Hant': '上傳完成', 'zh-Hans': '上传完成', 'en': 'Upload complete' },
    '上傳失敗': { 'zh-Hant': '上傳失敗', 'zh-Hans': '上传失败', 'en': 'Upload failed' },
    '檔案過大': { 'zh-Hant': '檔案過大', 'zh-Hans': '文件过大', 'en': 'File too large' },
    '不支援的檔案類型': { 'zh-Hant': '不支援的檔案類型', 'zh-Hans': '不支持的文件类型', 'en': 'Unsupported file type' },

    // 設定頁面
    '個人設定': { 'zh-Hant': '個人設定', 'zh-Hans': '个人设置', 'en': 'Personal Settings' },
    '顯示名稱': { 'zh-Hant': '顯示名稱', 'zh-Hans': '显示名称', 'en': 'Display Name' },
    '大頭貼': { 'zh-Hant': '大頭貼', 'zh-Hans': '头像', 'en': 'Avatar' },
    '狀態訊息': { 'zh-Hant': '狀態訊息', 'zh-Hans': '状态消息', 'en': 'Status' },
    '編輯個人資料': { 'zh-Hant': '編輯個人資料', 'zh-Hans': '编辑个人资料', 'en': 'Edit Profile' },
    '主題': { 'zh-Hant': '主題', 'zh-Hans': '主题', 'en': 'Theme' },
    '深色模式': { 'zh-Hant': '深色模式', 'zh-Hans': '深色模式', 'en': 'Dark Mode' },
    '淺色模式': { 'zh-Hant': '淺色模式', 'zh-Hans': '浅色模式', 'en': 'Light Mode' },
    '通知': { 'zh-Hant': '通知', 'zh-Hans': '通知', 'en': 'Notifications' },
    '音效': { 'zh-Hant': '音效', 'zh-Hans': '音效', 'en': 'Sound' },
    '已儲存': { 'zh-Hant': '已儲存', 'zh-Hans': '已保存', 'en': 'Saved' },
    '儲存失敗': { 'zh-Hant': '儲存失敗', 'zh-Hans': '保存失败', 'en': 'Save failed' },

    // 後台管理（如有）
    '後台管理': { 'zh-Hant': '後台管理', 'zh-Hans': '后台管理', 'en': 'Admin Panel' },
    '使用者管理': { 'zh-Hant': '使用者管理', 'zh-Hans': '用户管理', 'en': 'User Management' },
    '系統日誌': { 'zh-Hant': '系統日誌', 'zh-Hans': '系统日志', 'en': 'System Logs' },

    // 日期與時間
    '今天': { 'zh-Hant': '今天', 'zh-Hans': '今天', 'en': 'Today' },
    '昨天': { 'zh-Hant': '昨天', 'zh-Hans': '昨天', 'en': 'Yesterday' },
    '剛剛': { 'zh-Hant': '剛剛', 'zh-Hans': '刚刚', 'en': 'Just now' },
    '分鐘前': { 'zh-Hant': '分鐘前', 'zh-Hans': '分钟前', 'en': 'min ago' },
    '小時前': { 'zh-Hant': '小時前', 'zh-Hans': '小时前', 'en': 'h ago' },
    '天前': { 'zh-Hant': '天前', 'zh-Hans': '天前', 'en': 'd ago' },
    '週一': { 'zh-Hant': '週一', 'zh-Hans': '周一', 'en': 'Mon' },
    '週二': { 'zh-Hant': '週二', 'zh-Hans': '周二', 'en': 'Tue' },
    '週三': { 'zh-Hant': '週三', 'zh-Hans': '周三', 'en': 'Wed' },
    '週四': { 'zh-Hant': '週四', 'zh-Hans': '周四', 'en': 'Thu' },
    '週五': { 'zh-Hant': '週五', 'zh-Hans': '周五', 'en': 'Fri' },
    '週六': { 'zh-Hant': '週六', 'zh-Hans': '周六', 'en': 'Sat' },
    '週日': { 'zh-Hant': '週日', 'zh-Hans': '周日', 'en': 'Sun' },

    // 其他
    '載入中...': { 'zh-Hant': '載入中...', 'zh-Hans': '加载中...', 'en': 'Loading...' },
    '錯誤：': { 'zh-Hant': '錯誤：', 'zh-Hans': '错误：', 'en': 'Error: ' },
    '成功': { 'zh-Hant': '成功', 'zh-Hans': '成功', 'en': 'Success' },
    '失敗': { 'zh-Hant': '失敗', 'zh-Hans': '失败', 'en': 'Failed' },
    '無': { 'zh-Hant': '無', 'zh-Hans': '无', 'en': 'None' },
    '全部': { 'zh-Hant': '全部', 'zh-Hans': '全部', 'en': 'All' },
    '返回': { 'zh-Hant': '返回', 'zh-Hans': '返回', 'en': 'Back' },
    '沒有更多訊息': { 'zh-Hant': '沒有更多訊息', 'zh-Hans': '没有更多消息', 'en': 'No more messages' },
    '點擊載入更多': { 'zh-Hant': '點擊載入更多', 'zh-Hans': '点击加载更多', 'en': 'Click to load more' },
    '搜尋結果': { 'zh-Hant': '搜尋結果', 'zh-Hans': '搜索结果', 'en': 'Search Results' },
    '沒有結果': { 'zh-Hant': '沒有結果', 'zh-Hans': '没有结果', 'en': 'No results' },
    '搜尋': { 'zh-Hant': '搜尋', 'zh-Hans': '搜索', 'en': 'Search' },

    // 管理與設定（補上缺少的 key）
    '首次安裝 — 建立管理員帳號': { 'zh-Hant': '首次安裝 — 建立管理員帳號', 'zh-Hans': '首次安装 — 创建管理员账号', 'en': 'First-time setup — create admin account' },
    '建立管理員': { 'zh-Hant': '建立管理員', 'zh-Hans': '创建管理员', 'en': 'Create Admin' },
    '登入後以自己的身份加入 AI 群組對話': { 'zh-Hant': '登入後以自己的身份加入 AI 群組對話', 'zh-Hans': '登录后以自己身份加入 AI 群组对话', 'en': 'Login to join AI group chat' },
    '訪客': { 'zh-Hant': '訪客', 'zh-Hans': '访客', 'en': 'Guest' },
    '已刪除': { 'zh-Hant': '已刪除', 'zh-Hans': '已删除', 'en': 'Deleted' },
    '此訊息已刪除': { 'zh-Hant': '此訊息已刪除', 'zh-Hans': '此消息已删除', 'en': 'This message has been deleted' },
    '已編輯': { 'zh-Hant': '已編輯', 'zh-Hans': '已编辑', 'en': 'Edited' },
    '已讀：': { 'zh-Hant': '已讀：', 'zh-Hans': '已读：', 'en': 'Read: ' },
    '查看思考過程': { 'zh-Hant': '查看思考過程', 'zh-Hans': '查看思考过程', 'en': 'View reasoning' },
    '還沒有訊息，來打聲招呼吧！👋': { 'zh-Hant': '還沒有訊息，來打聲招呼吧！👋', 'zh-Hans': '还没有消息，来打个招呼吧！👋', 'en': 'No messages yet. Say hello! 👋' },
    '載入更多': { 'zh-Hant': '載入更多', 'zh-Hans': '加载更多', 'en': 'Load more' },
    '輸入關鍵字開始搜尋': { 'zh-Hant': '輸入關鍵字開始搜尋', 'zh-Hans': '输入关键字开始搜索', 'en': 'Type to search' },
    '沒有找到相關訊息': { 'zh-Hant': '沒有找到相關訊息', 'zh-Hans': '没有找到相关消息', 'en': 'No messages found' },
    '搜尋失敗': { 'zh-Hant': '搜尋失敗', 'zh-Hans': '搜索失败', 'en': 'Search failed' },
    '搜尋中...': { 'zh-Hant': '搜尋中...', 'zh-Hans': '搜索中...', 'en': 'Searching...' },
    '上傳': { 'zh-Hant': '上傳', 'zh-Hans': '上传', 'en': 'Upload' },
    '影片': { 'zh-Hant': '影片', 'zh-Hans': '视频', 'en': 'Video' },
    '圖片': { 'zh-Hant': '圖片', 'zh-Hans': '图片', 'en': 'Image' },
    '頭像': { 'zh-Hant': '頭像', 'zh-Hans': '头像', 'en': 'Avatar' },
    '添加說明': { 'zh-Hant': '添加說明', 'zh-Hans': '添加说明', 'en': 'Add caption' },
    '最新': { 'zh-Hant': '最新', 'zh-Hans': '最新', 'en': 'Latest' },
    '線上人數：': { 'zh-Hant': '線上人數：', 'zh-Hans': '在线人数：', 'en': 'Online: ' },
    '帳號：': { 'zh-Hant': '帳號：', 'zh-Hans': '账号：', 'en': 'Username: ' },
    '密碼：': { 'zh-Hant': '密碼：', 'zh-Hans': '密码：', 'en': 'Password: ' },
    '新的登入資料': { 'zh-Hant': '新的登入資料', 'zh-Hans': '新的登录凭证', 'en': 'New credentials' },
    '新增帳號': { 'zh-Hant': '新增帳號', 'zh-Hans': '添加账号', 'en': 'Add User' },
    '建立帳號': { 'zh-Hant': '建立帳號', 'zh-Hans': '创建账号', 'en': 'Create User' },
    '帳號列表': { 'zh-Hant': '帳號列表', 'zh-Hans': '账号列表', 'en': 'User List' },
    '聊天室管理': { 'zh-Hant': '聊天室管理', 'zh-Hans': '聊天室管理', 'en': 'Room Management' },
    '新增聊天室': { 'zh-Hant': '新增聊天室', 'zh-Hans': '添加聊天室', 'en': 'Add Room' },
    '名稱': { 'zh-Hant': '名稱', 'zh-Hans': '名称', 'en': 'Name' },
    '主題配色': { 'zh-Hant': '主題配色', 'zh-Hans': '主题配色', 'en': 'Theme' },
    '編輯帳號': { 'zh-Hant': '編輯帳號', 'zh-Hans': '编辑账号', 'en': 'Edit User' },
    '編輯聊天室': { 'zh-Hant': '編輯聊天室', 'zh-Hans': '编辑聊天室', 'en': 'Edit Room' },
    '重設密碼': { 'zh-Hant': '重設密碼', 'zh-Hans': '重置密码', 'en': 'Reset Password' },
    '停用': { 'zh-Hant': '停用', 'zh-Hans': '停用', 'en': 'Disable' },
    '啟用': { 'zh-Hant': '啟用', 'zh-Hans': '启用', 'en': 'Enable' },
    '無說明': { 'zh-Hant': '無說明', 'zh-Hans': '无说明', 'en': 'No description' },
    '預設': { 'zh-Hant': '預設', 'zh-Hans': '默认', 'en': 'Default' },
    '深色': { 'zh-Hant': '深色', 'zh-Hans': '深色', 'en': 'Dark' },
    '海洋': { 'zh-Hant': '海洋', 'zh-Hans': '海洋', 'en': 'Ocean' },
    '森林': { 'zh-Hant': '森林', 'zh-Hans': '森林', 'en': 'Forest' },
    '日落': { 'zh-Hant': '日落', 'zh-Hans': '日落', 'en': 'Sunset' },
    '淺色': { 'zh-Hant': '淺色', 'zh-Hans': '浅色', 'en': 'Light' },
    '午夜': { 'zh-Hant': '午夜', 'zh-Hans': '午夜', 'en': 'Midnight' },
    '預設 GitHub 暗色': { 'zh-Hant': '預設 GitHub 暗色', 'zh-Hans': '默认 GitHub 暗色', 'en': 'Default GitHub dark' },
    '藍色系深海風格': { 'zh-Hant': '藍色系深海風格', 'zh-Hans': '蓝色系深海风格', 'en': 'Ocean blue style' },
    '綠色系自然風格': { 'zh-Hant': '綠色系自然風格', 'zh-Hans': '绿色系自然风格', 'en': 'Forest green style' },
    '暖色系橘紅風格': { 'zh-Hant': '暖色系橘紅風格', 'zh-Hans': '暖色系橘红风格', 'en': 'Warm sunset style' },
    '白天明亮模式': { 'zh-Hant': '白天明亮模式', 'zh-Hans': '白天明亮模式', 'en': 'Light mode' },
    '紫色系暗色風格': { 'zh-Hant': '紫色系暗色風格', 'zh-Hans': '紫色系暗色风格', 'en': 'Purple midnight style' },
    '例如：漫畫討論': { 'zh-Hant': '例如：漫畫討論', 'zh-Hans': '例如：漫画讨论', 'en': 'e.g. Comic Chat' },
    '簡短描述這個聊天室的主題': { 'zh-Hant': '簡短描述這個聊天室的主題', 'zh-Hans': '简短描述这个聊天室的主题', 'en': 'Briefly describe this room' },
    '建立帳號密碼，交給要加入聊天室的人': { 'zh-Hant': '建立帳號密碼，交給要加入聊天室的人', 'zh-Hans': '创建账号密码，交给要加入聊天室的人', 'en': 'Create accounts for people joining the chat' },
    '回聊天室': { 'zh-Hant': '回聊天室', 'zh-Hans': '回聊天室', 'en': 'Back to Chat' },
    '個人設定': { 'zh-Hant': '個人設定', 'zh-Hans': '个人设置', 'en': 'Personal Settings' },
    '修改你的帳號、暱稱或密碼': { 'zh-Hant': '修改你的帳號、暱稱或密碼', 'zh-Hans': '修改你的账号、昵称或密码', 'en': 'Edit your username, display name or password' },
    '顯示名稱（暱稱）': { 'zh-Hant': '顯示名稱（暱稱）', 'zh-Hans': '显示名称（昵称）', 'en': 'Display Name (Nickname)' },
    '新密碼（留空不修改）': { 'zh-Hant': '新密碼（留空不修改）', 'zh-Hans': '新密码（留空不修改）', 'en': 'New password (leave blank to keep)' },
    '留空則不變': { 'zh-Hant': '留空則不變', 'zh-Hans': '留空则不变', 'en': 'Leave blank to keep current' },
    '已更新！請重新登入套用變更。': { 'zh-Hant': '已更新！請重新登入套用變更。', 'zh-Hans': '已更新！请重新登录以应用变更。', 'en': 'Updated! Please login again.' },
    '頭像已更新': { 'zh-Hant': '頭像已更新', 'zh-Hans': '头像已更新', 'en': 'Avatar updated' },
    '聊天室已建立': { 'zh-Hant': '聊天室已建立', 'zh-Hans': '聊天室已创建', 'en': 'Room created' },
    '聊天室已更新': { 'zh-Hant': '聊天室已更新', 'zh-Hans': '聊天室已更新', 'en': 'Room updated' },
    '帳號資訊已更新': { 'zh-Hant': '帳號資訊已更新', 'zh-Hans': '账号信息已更新', 'en': 'User info updated' },
    '更新失敗': { 'zh-Hant': '更新失敗', 'zh-Hans': '更新失败', 'en': 'Update failed' },
    '[檔案]': { 'zh-Hant': '[檔案]', 'zh-Hans': '[文件]', 'en': '[File]' },
    '🎬 影片': { 'zh-Hant': '🎬 影片', 'zh-Hans': '🎬 视频', 'en': '🎬 Video' },
    '🖼️ 圖片': { 'zh-Hant': '🖼️ 圖片', 'zh-Hans': '🖼️ 图片', 'en': '🖼️ Image' },
  };

  // ---------- 目前語言 ----------
  function detectBrowserLang() {
    var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.startsWith('zh-hans') || navLang.startsWith('zh-cn')) return 'zh-Hans';
    if (navLang.startsWith('zh')) return 'zh-Hant';
    if (navLang.startsWith('en')) return 'en';
    return null;
  }
  let currentLang = localStorage.getItem(STORAGE_KEY) || detectBrowserLang() || 'zh-Hant';
  let appReady = false; // 標記 app 是否已初始化

  // ---------- __() 翻譯函數 ----------
  window.__ = function (key) {
    const entry = translations[key];
    if (!entry) {
      console.warn('[i18n] Missing translation key:', key);
      return key; // fallback: 顯示原始 key
    }
    return entry[currentLang] || key;
  };

  // ---------- 設定語言 ----------
  window.setLanguage = function (lang) {
    if (!['zh-Hant', 'zh-Hans', 'en'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // 更新語言按鈕高亮
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 更新 HTML lang 屬性
    document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant');

    // 觸發全頁面翻譯
    translatePage();

    // 如果 app 已初始化，通知 app 重新渲染
    if (window.onLanguageChange) {
      window.onLanguageChange(lang);
    }
  };

  // ---------- 取得目前語言 ----------
  window.getCurrentLang = function () {
    return currentLang;
  };

  // ---------- 全頁面翻譯（掃描有 data-i18n 屬性的元素）----------
  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = window.__(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = window.__(key);
    });
    // Handle title tag
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      document.title = window.__(titleEl.getAttribute('data-i18n'));
    }
  }

  // ---------- 語言切換按鈕 HTML ----------
  function createLangBar() {
    var div = document.createElement('div');
    div.className = 'lang-bar';
    div.innerHTML =
      '<button class="lang-btn" data-lang="zh-Hant">繁</button>' +
      '<button class="lang-btn" data-lang="zh-Hans">简</button>' +
      '<button class="lang-btn" data-lang="en">EN</button>';
    div.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (btn) window.setLanguage(btn.dataset.lang);
    });
    document.body.appendChild(div);

    // 高亮目前語言
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  // ---------- 初始化 ----------
  function init() {
    // 創建語言列
    createLangBar();

    // 套用目前語言
    document.documentElement.lang = currentLang === 'en' ? 'en' : (currentLang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant');
    translatePage();
  }

  // DOM ready 後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

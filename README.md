# Body Notes · 部署指南

## 文件结构

```
fitsite/
├── index.html          ← 首页（根目录入口）
├── css/
│   └── style.css       ← 全站样式（改颜色/字体从这里改）
├── js/
│   └── app.js          ← 全站共享逻辑（登录/存储/周期计算）
└── pages/
    ├── login.html      ← 登录 & 注册
    ├── onboarding.html ← 初始设置（3步问卷）
    ├── today.html      ← 今日体感问卷 + 计划结果（核心页面）
    ├── library.html    ← 动作库（筛选 + 弹出详情）
    ├── profile.html    ← 个人中心
    ├── disclaimer.html ← 免责声明
    └── about.html      ← 关于本站
```

---

## 上线到 GitHub Pages（步骤）

### 第一次设置（约 10 分钟）

1. **注册 GitHub 账号**（如果还没有）
   → 去 https://github.com 注册

2. **创建新仓库**
   → 点右上角「+」→「New repository」
   → 仓库名建议：`body-notes`
   → 选「Public」（Pages 免费版必须公开）
   → 点「Create repository」

3. **上传文件**
   → 进入仓库页面，点「uploading an existing file」
   → 把整个 fitsite 文件夹内的文件全部拖进去
   ⚠️  注意：要保持文件夹结构（css/、js/、pages/都要上传）

4. **开启 GitHub Pages**
   → 仓库页 → Settings → Pages（左侧菜单）
   → Source 选「Deploy from a branch」
   → Branch 选「main」，文件夹选「/ (root)」
   → 点 Save

5. **等待 1-2 分钟后访问**
   → 网址格式：`https://你的用户名.github.io/body-notes/`
   → 首次部署可能要等 3-5 分钟

---

### 以后更新内容

1. 打开仓库页面
2. 点要修改的文件 → 点铅笔图标（编辑）
3. 修改内容 → 点「Commit changes」
4. 等约 1 分钟自动更新

---

## 常见问题

**Q：打开页面是空白的？**
A：检查路径。css/style.css 和 js/app.js 的相对路径要正确。
   index.html 用 `css/style.css` 和 `js/app.js`
   pages/ 里的文件用 `../css/style.css` 和 `../js/app.js`

**Q：想换颜色怎么做？**
A：打开 css/style.css，找到 `:root { }` 块，改里面的变量：
   `--accent: #b5ff47`  ← 主强调色（改这里换整站颜色）
   `--bg-base: #0d0d0f` ← 底色

**Q：想加一个新动作怎么做？**
A：打开 pages/library.html，找到 `const EX = [` 数组，
   复制已有的一个对象，改里面的内容，保存即可。

**Q：想接真实登录（Firebase）怎么做？**
A：打开 pages/login.html，找到注释 `// TODO：替换为 Firebase Auth` 的地方，
   替换成 Firebase 的 signIn/createUser 代码即可。
   其他所有页面不需要改。

---

## 自定义域名（可选）

如果你有自己的域名（如 bodynotes.com）：
1. 在仓库根目录创建一个叫 `CNAME` 的文件（无后缀）
2. 文件内容只写你的域名：`bodynotes.com`
3. 去你的域名注册商那里，添加一条 CNAME 记录指向 `你的用户名.github.io`

---

## 技术说明（给未来的你）

- **无框架**：纯 HTML + CSS + JavaScript，浏览器直接运行
- **无构建工具**：不需要 npm、webpack 等，直接编辑文件就能改
- **数据存储**：目前用 localStorage（浏览器本地），数据在用户自己的设备
- **接后端**：未来接 Firebase 时，只需改 `js/app.js` 里的 Auth 函数和
  `pages/login.html` 里的登录/注册函数

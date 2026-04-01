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


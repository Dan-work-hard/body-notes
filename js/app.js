/* ================================================
   BODY NOTES · app.js
   全站共享逻辑

   📦 包含：
   1. 认证模拟（localStorage，接 Firebase 时替换）
   2. 数据存取（体感/计划/onboarding）
   3. 导航栏渲染
   4. 周期阶段计算
   5. 工具函数

   ⚠️  目前是"纯前端模拟"——数据存在浏览器里
       接真实后端时只需替换 Auth 和存储两个模块
   ================================================ */

/* ────────────────────────────────────────────────
   1. AUTH 模块
   ──────────────────────────────────────────────── */

function getCurrentUser() {
  const raw = localStorage.getItem('bn_user');
  return raw ? JSON.parse(raw) : null;
}

function loginUser(email, name) {
  const user = {
    email,
    name: name || email.split('@')[0],
    onboardingDone: false,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('bn_user', JSON.stringify(user));
  return user;
}

function updateUser(fields) {
  const user = getCurrentUser();
  if (!user) return;
  Object.assign(user, fields);
  localStorage.setItem('bn_user', JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem('bn_user');
  window.location.href = getBasePath() + 'index.html';
}

/**
 * 需要登录的页面在顶部调用。
 * 未登录 → 跳转登录页，并带上 redirect 参数方便登录后回来。
 */
function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href =
      getBasePath() + 'pages/login.html?redirect=' +
      encodeURIComponent(window.location.href);
    return false;
  }
  return true;
}

/* ────────────────────────────────────────────────
   2. 数据存取
   ──────────────────────────────────────────────── */

function saveOnboarding(data) {
  localStorage.setItem('bn_onboarding', JSON.stringify(data));
  updateUser({ onboardingDone: true });
}
function getOnboarding() {
  const r = localStorage.getItem('bn_onboarding');
  return r ? JSON.parse(r) : {};
}

function saveCheckin(data) {
  const key = 'bn_checkins';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.unshift({ ...data, date: today() });
  localStorage.setItem(key, JSON.stringify(list.slice(0, 90)));
}
function getCheckins() {
  return JSON.parse(localStorage.getItem('bn_checkins') || '[]');
}

function savePlan(data) {
  const key = 'bn_plans';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.unshift({ ...data, date: today() });
  localStorage.setItem(key, JSON.stringify(list.slice(0, 90)));
}
function getPlans() {
  return JSON.parse(localStorage.getItem('bn_plans') || '[]');
}

/* ────────────────────────────────────────────────
   3. 导航栏
   ──────────────────────────────────────────────── */
function initNav() {
  const el = document.getElementById('nav');
  if (!el) return;
  const user = getCurrentUser();
  const base = getBasePath();

  el.innerHTML = `
    <nav class="nav">
      <a href="${base}index.html" class="nav__logo">Body<span>Notes</span></a>
      <div class="nav__links" id="navLinks">
        <a href="${base}pages/today.html">今日计划</a>
        <a href="${base}pages/library.html">动作库</a>
        <a href="${base}pages/about.html">关于</a>
        ${user
          ? `<a href="${base}pages/profile.html">▸ ${user.name}</a>`
          : `<a href="${base}pages/login.html" class="nav__cta">开始</a>`}
      </div>
      <button class="nav__burger" id="navBurger" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </nav>`;

  document.getElementById('navBurger').onclick = () =>
    document.getElementById('navLinks').classList.toggle('open');

  // 高亮当前页
  const cur = window.location.pathname;
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && cur.endsWith(href.replace(/^.*\//, ''))) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', initNav);

/* ────────────────────────────────────────────────
   4. 周期计算
   ──────────────────────────────────────────────── */

/**
 * 根据上次月经日期和周期长度推算今天所在阶段
 * @returns { phase: string, dayOfCycle: number }
 */
function calcPhase(lastPeriodDate, cycleLength = 28) {
  if (!lastPeriodDate) return { phase: 'unknown', dayOfCycle: null };
  const diff = Math.floor(
    (new Date() - new Date(lastPeriodDate)) / 86400000
  );
  const day = (diff % cycleLength) + 1;
  let phase;
  if      (day <= 5)                        phase = 'menstrual';
  else if (day <= 13)                       phase = 'follicular';
  else if (day >= 14 && day <= 16)          phase = 'ovulation';
  else                                      phase = 'luteal';
  return { phase, dayOfCycle: day };
}

/* 周期阶段元数据 */
const PHASES = {
  menstrual:  { label: '月经期', color: 'var(--phase-menstrual)',  bg: 'var(--alert-dim)',  emoji: '🔴' },
  follicular: { label: '卵泡期', color: 'var(--phase-follicular)', bg: '#2d2510',           emoji: '🟡' },
  ovulation:  { label: '排卵期', color: 'var(--phase-ovulation)',  bg: 'var(--accent-dim)', emoji: '🟢' },
  luteal:     { label: '黄体期', color: 'var(--phase-luteal)',     bg: '#1e1030',           emoji: '🟣' },
  unknown:    { label: '未知阶段', color: 'var(--text-secondary)', bg: 'var(--bg-hover)',   emoji: '⚪' },
};

/* ────────────────────────────────────────────────
   5. 工具函数
   ──────────────────────────────────────────────── */

function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 简单的 HTML 转义，防止 XSS */
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

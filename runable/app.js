/* ============================================
   RunAble — Application Logic
   ============================================ */

// ============================================
// DATA LAYER (localStorage)
// ============================================
const DB = {
  get(key, def = null) {
    try { return JSON.parse(localStorage.getItem('runable_' + key)) || def; }
    catch { return def; }
  },
  set(key, val) {
    localStorage.setItem('runable_' + key, JSON.stringify(val));
  },
  remove(key) { localStorage.removeItem('runable_' + key); }
};

// ============================================
// STATE
// ============================================
let currentUser = null;
let currentPage = 'dashboard';
let runInterval = null;
let runState = {
  active: false, paused: false,
  startTime: null, elapsed: 0,
  distance: 0, target: 3, mode: 'outdoor',
  timerInterval: null
};

const COINS_PER_KM = 100;
const CALORIES_PER_KM = 65;

const ACHIEVEMENTS = [
  { id: 'first_run', name: 'First Step', icon: '👟', desc: 'Complete your first run', check: u => getTotalRuns(u) >= 1 },
  { id: 'total_5km', name: '5K Club', icon: '🏅', desc: 'Run 5 km total', check: u => getTotalKm(u) >= 5 },
  { id: 'total_10km', name: '10K Runner', icon: '🎯', desc: 'Run 10 km total', check: u => getTotalKm(u) >= 10 },
  { id: 'total_50km', name: 'Half Marathon', icon: '🏃', desc: 'Run 50 km total', check: u => getTotalKm(u) >= 50 },
  { id: 'total_100km', name: 'Century', icon: '💯', desc: 'Run 100 km total', check: u => getTotalKm(u) >= 100 },
  { id: 'runs_10', name: 'Dedicated', icon: '🔥', desc: 'Complete 10 runs', check: u => getTotalRuns(u) >= 10 },
  { id: 'runs_50', name: 'Marathon Spirit', icon: '⚡', desc: 'Complete 50 runs', check: u => getTotalRuns(u) >= 50 },
  { id: 'coins_1000', name: 'Coin Collector', icon: '🪙', desc: 'Earn 1,000 coins', check: u => getCoins(u) >= 1000 },
  { id: 'coins_5000', name: 'Rich Runner', icon: '💰', desc: 'Earn 5,000 coins', check: u => getCoins(u) >= 5000 },
];

const SHOP_ITEMS = [
  { id: 'premium_badge', name: 'Premium Badge', icon: '⭐', price: 500 },
  { id: 'custom_theme', name: 'Custom Theme', icon: '🎨', price: 1000 },
  { id: 'extra_coins_2x', name: '2x Coins (1 week)', icon: '🪙', price: 2000 },
  { id: 'virtual_shoes', name: 'Virtual Shoes', icon: '👟', price: 800 },
  { id: 'runner_cap', name: 'Runner Cap', icon: '🧢', price: 300 },
  { id: 'medal_gold', name: 'Gold Medal', icon: '🥇', price: 3000 },
];

// Sample community users
const SAMPLE_USERS = [
  { name: 'Budi Santoso', username: 'budi_run', coins: 3200, totalKm: 32, totalRuns: 15 },
  { name: 'Sari Dewi', username: 'sari_dew', coins: 2800, totalKm: 28, totalRuns: 12 },
  { name: 'Andi Pratama', username: 'andi_run', coins: 1500, totalKm: 15, totalRuns: 8 },
  { name: 'Rina Wati', username: 'rina_w', coins: 900, totalKm: 9, totalRuns: 5 },
  { name: 'Dimas Agung', username: 'dimas_a', coins: 4100, totalKm: 41, totalRuns: 20 },
];

// ============================================
// HELPERS
// ============================================
function getTotalKm(user) {
  return (user.runs || []).reduce((s, r) => s + r.distance, 0);
}
function getTotalRuns(user) { return (user.runs || []).length; }
function getCoins(user) { return user.coins || 0; }
function getAvgPace(run) {
  if (!run.distance || !run.duration) return '0:00';
  const paceMin = run.duration / 60 / run.distance;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
function formatDate(ts) {
  const d = new Date(ts);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// ============================================
// AUTH
// ============================================
function initAuth() {
  const saved = DB.get('currentUser');
  if (saved) {
    currentUser = saved;
    showApp();
  } else {
    showAuth();
  }
}

function showAuth() {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  refreshAll();
}

function showLogin(e) {
  if (e) e.preventDefault();
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}

function showRegister(e) {
  if (e) e.preventDefault();
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pw = document.getElementById('login-password').value;
  const users = DB.get('users', {});
  const user = users[email];
  if (!user) { toast('Account not found. Please register.', 'error'); return; }
  if (user.password !== pw) { toast('Wrong password.', 'error'); return; }
  currentUser = user;
  DB.set('currentUser', user);
  showApp();
  toast(`Welcome back, ${user.name}!`, 'success');
});

document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim().toLowerCase();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pw = document.getElementById('reg-password').value;

  if (username.length < 3) { toast('Username must be at least 3 characters', 'error'); return; }

  const users = DB.get('users', {});
  if (users[email]) { toast('Email already registered', 'error'); return; }

  // Check username uniqueness
  const allUsers = Object.values(users);
  if (allUsers.find(u => u.username === username)) { toast('Username already taken', 'error'); return; }

  const newUser = {
    id: genId(), name, username, email, password: pw,
    coins: 0, runs: [], achievements: [],
    bio: 'Running enthusiast', weight: 70, height: 170,
    joinedAt: Date.now(), darkMode: false, unit: 'km',
    reactions: {}
  };
  users[email] = newUser;
  DB.set('users', users);
  currentUser = newUser;
  DB.set('currentUser', newUser);
  showApp();
  toast('Account created! Welcome to RunAble 🎉', 'success');
});

function logout() {
  currentUser = null;
  DB.remove('currentUser');
  stopRun();
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  showAuth();
  toast('Logged out', 'info');
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

// ============================================
// NAVIGATION
// ============================================
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', activity: 'Activity',
    tracker: 'Running', rewards: 'Rewards', profile: 'Profile'
  };
  document.getElementById('page-title').textContent = titles[page] || 'RunAble';

  refreshAll();
}

// ============================================
// REFRESH / RENDER
// ============================================
function refreshAll() {
  if (!currentUser) return;
  renderDashboard();
  renderActivity();
  renderRewards();
  renderProfile();
}

function save() {
  const users = DB.get('users', {});
  users[currentUser.email] = currentUser;
  DB.set('users', users);
  DB.set('currentUser', currentUser);
}

// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
  document.getElementById('greeting-label').textContent = getGreeting();
  document.getElementById('greeting-name').textContent = currentUser.name.split(' ')[0] + '!';
  document.getElementById('dash-coins').textContent = getCoins(currentUser).toLocaleString();
  document.getElementById('topbar-avatar-text').textContent = getInitials(currentUser.name);

  // Today stats
  const today = new Date().toDateString();
  const todayRuns = currentUser.runs.filter(r => new Date(r.date).toDateString() === today);
  const todayKm = todayRuns.reduce((s, r) => s + r.distance, 0);
  const todayCal = todayRuns.reduce((s, r) => s + r.calories, 0);
  const todaySec = todayRuns.reduce((s, r) => s + r.duration, 0);

  document.getElementById('stat-today-distance').textContent = todayKm.toFixed(2);
  document.getElementById('stat-today-cal').textContent = Math.round(todayCal);
  document.getElementById('stat-today-time').textContent = formatTime(todaySec);
  document.getElementById('stat-today-runs').textContent = todayRuns.length;

  // Weekly chart
  renderWeeklyChart();

  // Leaderboard
  renderLeaderboard('dashboard-leaderboard', 5);

  // Recent runs
  renderRecentRuns();
}

function renderWeeklyChart() {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Get week's data
  const weekData = new Array(7).fill(0);
  currentUser.runs.forEach(r => {
    const d = new Date(r.date);
    const diff = Math.floor((today - d) / 86400000);
    if (diff < 7) {
      const rd = d.getDay();
      weekData[rd] += r.distance;
    }
  });

  const maxDist = Math.max(...weekData, 1);
  let weeklyTotal = 0;

  days.forEach((day, i) => {
    const el = document.getElementById('chart-' + day);
    const height = (weekData[i] / maxDist) * 100;
    el.style.height = Math.max(height, 4) + '%';
    if (i === dayOfWeek) el.classList.add('today');
    else el.classList.remove('today');
    weeklyTotal += weekData[i];
  });

  document.getElementById('weekly-total').textContent = weeklyTotal.toFixed(1) + ' km';
}

function renderLeaderboard(containerId, limit) {
  const users = DB.get('users', {});
  let allUsers = Object.values(users).map(u => ({
    name: u.name, username: u.username,
    coins: getCoins(u), totalKm: getTotalKm(u), email: u.email
  }));
  allUsers.push(...SAMPLE_USERS.map(u => ({ ...u, email: 'sample_' + u.username })));
  allUsers.sort((a, b) => b.coins - a.coins);
  if (limit) allUsers = allUsers.slice(0, limit);

  const container = document.getElementById(containerId);
  container.innerHTML = allUsers.map((u, i) => {
    const isMe = u.email === currentUser.email;
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    return `
      <div class="lb-item ${isMe ? 'me' : ''}">
        <div class="lb-rank ${rankClass}">${i + 1}</div>
        <div class="lb-avatar">${getInitials(u.name)}</div>
        <div class="lb-info">
          <span class="lb-name">${u.name}${isMe ? ' (You)' : ''}</span>
          <span class="lb-sub">${u.totalKm.toFixed(1)} km · ${u.username}</span>
        </div>
        <div class="lb-coins">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFB800"/><text x="12" y="16" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">$</text></svg>
          ${u.coins.toLocaleString()}
        </div>
      </div>`;
  }).join('');
}

function renderRecentRuns() {
  const runs = [...currentUser.runs].sort((a, b) => b.date - a.date).slice(0, 5);
  const container = document.getElementById('dashboard-recent');
  if (runs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        <p>No runs yet. Start your first run!</p>
      </div>`;
    return;
  }
  container.innerHTML = runs.map(r => `
    <div class="recent-run-item">
      <div class="recent-run-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div class="recent-run-info">
        <div class="recent-run-distance">${r.distance.toFixed(2)} km ${r.mode === 'indoor' ? '(Indoor)' : ''}</div>
        <div class="recent-run-meta">${formatTime(r.duration)} · ${formatDate(r.date)}</div>
      </div>
      <div class="recent-run-coins">+${r.coinsEarned}</div>
    </div>`).join('');
}

// ============================================
// ACTIVITY
// ============================================
function switchActivityTab(tab) {
  document.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.activity-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('activity-' + tab).classList.add('active');
}

function renderActivity() {
  renderFeed();
  renderLeaderboard('leaderboard-full');
  renderFullLeaderboardPodium();
  renderMyRuns();
}

function renderFeed() {
  const users = DB.get('users', {});
  let allRuns = [];
  Object.values(users).forEach(u => {
    (u.runs || []).forEach(r => {
      allRuns.push({ ...r, userName: u.name, userUsername: u.username, userId: u.id });
    });
  });
  // Add sample runs
  const sampleRuns = generateSampleFeed();
  allRuns.push(...sampleRuns);
  allRuns.sort((a, b) => b.date - a.date);

  const container = document.getElementById('feed-list');
  if (allRuns.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No activity yet</p></div>';
    return;
  }

  container.innerHTML = allRuns.slice(0, 20).map(r => {
    const isMe = r.userId === currentUser.id;
    const reactions = currentUser.reactions || {};
    const liked = reactions['like_' + r.date] || false;
    return `
      <div class="feed-item">
        <div class="feed-header">
          <div class="feed-avatar">${getInitials(r.userName)}</div>
          <div class="feed-user-info">
            <span class="feed-username">${r.userName}${isMe ? ' (You)' : ''}</span>
            <span class="feed-time">${timeAgo(r.date)}</span>
          </div>
        </div>
        <div class="feed-body">
          <div class="feed-run-title">${r.mode === 'indoor' ? '🏠' : '🏃'} ${r.distance.toFixed(2)} km Run</div>
          <div class="feed-stats">
            <div class="feed-stat">
              <span class="feed-stat-val">${formatTime(r.duration)}</span>
              <span class="feed-stat-lbl">Duration</span>
            </div>
            <div class="feed-stat">
              <span class="feed-stat-val">${getAvgPace(r)}</span>
              <span class="feed-stat-lbl">Pace/km</span>
            </div>
            <div class="feed-stat">
              <span class="feed-stat-val">${Math.round(r.calories)}</span>
              <span class="feed-stat-lbl">Calories</span>
            </div>
          </div>
        </div>
        <div class="feed-reactions">
          <button class="feed-reaction ${liked ? 'active' : ''}" onclick="toggleReaction('${r.date}')">
            <svg viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Like
          </button>
          <button class="feed-reaction">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Comment
          </button>
        </div>
      </div>`;
  }).join('');
}

function toggleReaction(date) {
  if (!currentUser.reactions) currentUser.reactions = {};
  const key = 'like_' + date;
  currentUser.reactions[key] = !currentUser.reactions[key];
  save();
  renderFeed();
}

function generateSampleFeed() {
  const actions = ['morning run', 'evening jog', 'interval training', 'long run', 'tempo run'];
  return SAMPLE_USERS.slice(0, 3).map((u, i) => ({
    distance: (2 + Math.random() * 8).toFixed(2) * 1,
    duration: Math.floor(1200 + Math.random() * 2400),
    calories: Math.floor(130 + Math.random() * 400),
    date: Date.now() - (i + 1) * 3600000 * (2 + Math.random() * 6),
    mode: Math.random() > 0.3 ? 'outdoor' : 'indoor',
    coinsEarned: 0,
    userName: u.name,
    userUsername: u.username,
    userId: 'sample_' + u.username
  }));
}

function renderFullLeaderboardPodium() {
  const users = DB.get('users', {});
  let allUsers = Object.values(users).map(u => ({
    name: u.name, coins: getCoins(u)
  }));
  allUsers.push(...SAMPLE_USERS.map(u => ({ name: u.name, coins: u.coins })));
  allUsers.sort((a, b) => b.coins - a.coins);

  for (let i = 1; i <= 3; i++) {
    const u = allUsers[i - 1];
    const el = document.getElementById(`lb-pod-${i}-avatar`);
    const nameEl = document.getElementById(`lb-pod-${i}-name`);
    const coinsEl = document.getElementById(`lb-pod-${i}-coins`);
    if (u) {
      el.textContent = getInitials(u.name);
      nameEl.textContent = u.name.split(' ')[0];
      coinsEl.textContent = u.coins.toLocaleString() + ' RC';
    }
  }
}

function renderMyRuns() {
  const runs = [...currentUser.runs].sort((a, b) => b.date - a.date);
  const container = document.getElementById('my-runs-list');
  if (runs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No runs recorded yet</p></div>';
    return;
  }
  container.innerHTML = runs.map(r => `
    <div class="my-run-card">
      <div class="my-run-header">
        <span class="my-run-date">${formatDate(r.date)}</span>
        <span class="my-run-type">${r.mode === 'indoor' ? 'Indoor' : 'Outdoor'}</span>
      </div>
      <div class="my-run-stats">
        <div class="my-run-stat">
          <span class="my-run-stat-val">${r.distance.toFixed(2)}</span>
          <span class="my-run-stat-lbl">km</span>
        </div>
        <div class="my-run-stat">
          <span class="my-run-stat-val">${formatTime(r.duration)}</span>
          <span class="my-run-stat-lbl">duration</span>
        </div>
        <div class="my-run-stat">
          <span class="my-run-stat-val">${getAvgPace(r)}</span>
          <span class="my-run-stat-lbl">pace/km</span>
        </div>
        <div class="my-run-stat">
          <span class="my-run-stat-val">${Math.round(r.calories)}</span>
          <span class="my-run-stat-lbl">kcal</span>
        </div>
      </div>
      <div class="my-run-coin">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFB800"/></svg>
        +${r.coinsEarned} Run Coins
      </div>
    </div>`).join('');
}

// ============================================
// TRACKER
// ============================================
function selectMode(mode, btn) {
  runState.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setTarget(km) {
  runState.target = km;
  document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function startRun() {
  runState.active = true;
  runState.paused = false;
  runState.distance = 0;
  runState.elapsed = 0;
  runState.startTime = Date.now();

  document.getElementById('tracker-idle').classList.add('hidden');
  document.getElementById('tracker-active').classList.remove('hidden');
  document.getElementById('tracker-complete').classList.add('hidden');

  document.getElementById('tracker-target-label').textContent = runState.target;

  // Start timer
  runState.timerInterval = setInterval(updateTrackerTimer, 1000);

  // Simulate running (pace varies)
  runInterval = setInterval(simulateRun, 500);

  toast('Run started! Good luck! 🏃', 'success');
}

function simulateRun() {
  if (runState.paused) return;

  // Simulate pace: 5-7 min/km with variation
  const basePace = 5.5 + Math.random() * 1.5; // min per km
  const speedKmPerSec = 1 / (basePace * 60);
  const increment = speedKmPerSec * 0.5; // 500ms interval
  runState.distance += increment;

  // Update display
  document.getElementById('tracker-distance').textContent = runState.distance.toFixed(2);

  const paceMin = basePace;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  document.getElementById('tracker-pace').textContent = `${min}:${sec.toString().padStart(2, '0')}`;

  // Calories
  const cal = runState.distance * CALORIES_PER_KM;
  document.getElementById('tracker-calories').textContent = Math.round(cal);

  // Coins
  const coins = Math.floor(runState.distance * COINS_PER_KM);
  document.getElementById('tracker-coins').textContent = coins;

  // Progress ring
  const pct = Math.min(runState.distance / runState.target, 1);
  const circumference = 2 * Math.PI * 120;
  document.getElementById('tracker-progress-ring').style.strokeDashoffset = circumference * (1 - pct);

  // Target progress bar
  document.getElementById('tracker-target-fill').style.width = (pct * 100) + '%';

  // Check if target reached
  if (runState.distance >= runState.target) {
    completeRun();
  }
}

function updateTrackerTimer() {
  if (runState.paused) return;
  runState.elapsed++;
  document.getElementById('tracker-time').textContent = formatTime(runState.elapsed);
}

function pauseRun() {
  runState.paused = !runState.paused;
  const btn = document.getElementById('btn-pause');
  if (runState.paused) {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    toast('Paused', 'info');
  } else {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }
}

function stopRun() {
  if (!runState.active) return;
  if (runState.distance < 0.01) {
    resetTracker();
    return;
  }
  completeRun();
}

function completeRun() {
  clearInterval(runInterval);
  clearInterval(runState.timerInterval);
  runInterval = null;

  const coinsEarned = Math.floor(runState.distance * COINS_PER_KM);
  const calories = Math.floor(runState.distance * CALORIES_PER_KM);

  // Save run
  const run = {
    id: genId(),
    distance: parseFloat(runState.distance.toFixed(2)),
    duration: runState.elapsed,
    calories,
    coinsEarned,
    mode: runState.mode,
    date: Date.now()
  };
  currentUser.runs.push(run);
  currentUser.coins = (currentUser.coins || 0) + coinsEarned;

  // Check achievements
  const newAchievements = [];
  ACHIEVEMENTS.forEach(a => {
    if (!currentUser.achievements.includes(a.id) && a.check(currentUser)) {
      currentUser.achievements.push(a.id);
      newAchievements.push(a);
    }
  });

  save();

  // Add transaction
  addTransaction('run_complete', `Run: ${run.distance} km ${run.mode}`, coinsEarned);

  // Show complete screen
  document.getElementById('tracker-active').classList.add('hidden');
  document.getElementById('tracker-complete').classList.remove('hidden');

  document.getElementById('complete-name').textContent = currentUser.name.split(' ')[0];
  document.getElementById('final-distance').textContent = run.distance.toFixed(2);
  document.getElementById('final-time').textContent = formatTime(run.duration);
  document.getElementById('final-cal').textContent = run.calories;
  document.getElementById('final-coins').textContent = coinsEarned;
  document.getElementById('final-pace').textContent = getAvgPace(run);

  // Achievement notifications
  if (newAchievements.length > 0) {
    setTimeout(() => {
      newAchievements.forEach(a => {
        toast(`🏆 Achievement unlocked: ${a.name}!`, 'success');
      });
    }, 1000);
  }

  runState.active = false;
  toast(`+${coinsEarned} Run Coins earned!`, 'success');
}

function resetTracker() {
  clearInterval(runInterval);
  clearInterval(runState.timerInterval);
  runInterval = null;
  runState.active = false;
  runState.distance = 0;
  runState.elapsed = 0;

  document.getElementById('tracker-idle').classList.remove('hidden');
  document.getElementById('tracker-active').classList.add('hidden');
  document.getElementById('tracker-complete').classList.add('hidden');

  // Reset ring
  document.getElementById('tracker-progress-ring').style.strokeDashoffset = 754;
}

// ============================================
// REWARDS
// ============================================
function renderRewards() {
  document.getElementById('reward-balance').textContent = getCoins(currentUser).toLocaleString();

  // Transactions
  const txs = DB.get('tx_' + currentUser.id, []);
  const txContainer = document.getElementById('transaction-list');
  if (txs.length === 0) {
    txContainer.innerHTML = '<div class="empty-state"><p>No transactions yet</p></div>';
  } else {
    txContainer.innerHTML = txs.slice(0, 20).map(tx => `
      <div class="tx-item">
        <div class="tx-icon ${tx.amount > 0 ? 'earned' : 'spent'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${tx.amount > 0 ? '<path d="M12 19V5M5 12l7-7 7 7"/>' : '<path d="M12 5v14M19 12l-7 7-7-7"/>'}
          </svg>
        </div>
        <div class="tx-info">
          <div class="tx-desc">${tx.desc}</div>
          <div class="tx-date">${formatDate(tx.date)}</div>
        </div>
        <div class="tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}">
          ${tx.amount > 0 ? '+' : ''}${tx.amount}
        </div>
      </div>`).join('');
  }

  // Shop
  const shopContainer = document.getElementById('shop-grid');
  const purchased = DB.get('purchases_' + currentUser.id, []);
  shopContainer.innerHTML = SHOP_ITEMS.map(item => {
    const isPurchased = purchased.includes(item.id);
    const canAfford = getCoins(currentUser) >= item.price;
    return `
      <div class="shop-item">
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFB800"/></svg>
          ${item.price.toLocaleString()}
        </div>
        <button class="shop-buy-btn ${isPurchased ? 'unavailable' : canAfford ? 'available' : 'unavailable'}"
          ${isPurchased || !canAfford ? 'disabled' : `onclick="buyItem('${item.id}')"`}>
          ${isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Not enough'}
        </button>
      </div>`;
  }).join('');
}

function buyItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item || getCoins(currentUser) < item.price) return;

  const purchased = DB.get('purchases_' + currentUser.id, []);
  if (purchased.includes(itemId)) return;

  currentUser.coins -= item.price;
  purchased.push(itemId);
  DB.set('purchases_' + currentUser.id, purchased);
  save();
  addTransaction('shop_buy', `Bought: ${item.name}`, -item.price);
  renderRewards();
  renderDashboard();
  toast(`Purchased ${item.name}! 🎉`, 'success');
}

function addTransaction(type, desc, amount) {
  const txs = DB.get('tx_' + currentUser.id, []);
  txs.unshift({ type, desc, amount, date: Date.now() });
  DB.set('tx_' + currentUser.id, txs);
}

// ============================================
// PROFILE
// ============================================
function renderProfile() {
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-username').textContent = '@' + currentUser.username;
  document.getElementById('profile-bio').textContent = currentUser.bio || 'Running enthusiast';
  document.getElementById('profile-avatar').textContent = getInitials(currentUser.name);

  document.getElementById('pstat-total-km').textContent = getTotalKm(currentUser).toFixed(1);
  document.getElementById('pstat-total-runs').textContent = getTotalRuns(currentUser);
  document.getElementById('pstat-total-cal').textContent =
    currentUser.runs.reduce((s, r) => s + r.calories, 0).toLocaleString();
  document.getElementById('pstat-coins').textContent = getCoins(currentUser).toLocaleString();

  // Edit form
  document.getElementById('edit-name').value = currentUser.name;
  document.getElementById('edit-username').value = currentUser.username;
  document.getElementById('edit-bio').value = currentUser.bio || '';
  document.getElementById('edit-weight').value = currentUser.weight || 70;
  document.getElementById('edit-height').value = currentUser.height || 170;

  // Settings
  document.getElementById('toggle-dark').checked = currentUser.darkMode || false;
  document.getElementById('toggle-unit').checked = currentUser.unit === 'miles';

  // Achievements
  renderAchievements();

  // Dark mode
  document.body.classList.toggle('dark', currentUser.darkMode);
}

function renderAchievements() {
  const container = document.getElementById('achievements-list');
  container.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = currentUser.achievements.includes(a.id);
    return `
      <div class="achievement ${unlocked ? '' : 'locked'}">
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-name">${a.name}</div>
        <div class="achievement-desc">${a.desc}</div>
      </div>`;
  }).join('');
}

document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-name').value.trim();
  const username = document.getElementById('edit-username').value.trim().toLowerCase();
  const bio = document.getElementById('edit-bio').value.trim();
  const weight = parseInt(document.getElementById('edit-weight').value);
  const height = parseInt(document.getElementById('edit-height').value);

  if (username.length < 3) { toast('Username must be at least 3 characters', 'error'); return; }

  // Check username uniqueness
  const users = DB.get('users', {});
  const existing = Object.values(users).find(u => u.username === username && u.email !== currentUser.email);
  if (existing) { toast('Username already taken', 'error'); return; }

  currentUser.name = name;
  currentUser.username = username;
  currentUser.bio = bio;
  currentUser.weight = weight;
  currentUser.height = height;
  save();
  renderProfile();
  renderDashboard();
  toast('Profile updated!', 'success');
});

function toggleDarkMode() {
  currentUser.darkMode = document.getElementById('toggle-dark').checked;
  document.body.classList.toggle('dark', currentUser.darkMode);
  save();
}

function toggleUnit() {
  currentUser.unit = document.getElementById('toggle-unit').checked ? 'miles' : 'km';
  save();
  toast(`Unit set to ${currentUser.unit}`, 'info');
}

function changeAvatar() {
  const colors = [
    'linear-gradient(135deg, #6C63FF, #FF6B35)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #F59E0B, #EF4444)',
    'linearGradient(135deg, #EC4899, #8B5CF6)',
  ];
  const initials = getInitials(currentUser.name);
  const avatar = document.getElementById('profile-avatar');
  avatar.style.background = colors[Math.floor(Math.random() * colors.length)];
  toast('Avatar updated!', 'info');
}

function deleteAllData() {
  if (confirm('This will delete all your data and reset the app. Are you sure?')) {
    localStorage.clear();
    currentUser = null;
    location.reload();
  }
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotifications() {
  const txs = DB.get('tx_' + currentUser.id, []);
  const recent = txs.slice(0, 5);
  const achievements = currentUser.achievements || [];

  let html = '<div style="display:flex;flex-direction:column;gap:12px;">';

  if (achievements.length > 0) {
    html += '<div style="font-weight:700;font-size:0.9rem;">🏆 Achievements</div>';
    achievements.slice(-3).forEach(aId => {
      const a = ACHIEVEMENTS.find(x => x.id === aId);
      if (a) html += `<div class="tx-item"><div class="tx-icon earned"><span class="toast-icon">${a.icon}</span></div><div class="tx-info"><div class="tx-desc">${a.name}</div><div class="tx-date">${a.desc}</div></div></div>`;
    });
  }

  if (recent.length > 0) {
    html += '<div style="font-weight:700;font-size:0.9rem;margin-top:8px;">💰 Recent Coins</div>';
    recent.forEach(tx => {
      html += `<div class="tx-item"><div class="tx-icon ${tx.amount > 0 ? 'earned' : 'spent'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div><div class="tx-info"><div class="tx-desc">${tx.desc}</div><div class="tx-date">${timeAgo(tx.date)}</div></div><div class="tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}">${tx.amount > 0 ? '+' : ''}${tx.amount}</div></div>`;
    });
  }

  if (achievements.length === 0 && recent.length === 0) {
    html += '<div class="empty-state"><p>No notifications yet</p></div>';
  }

  html += '</div>';

  openModal('Notifications', html);
}

// ============================================
// MODAL
// ============================================
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ============================================
// TOAST
// ============================================
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Splash screen
  setTimeout(() => {
    initAuth();
  }, 2800);
});

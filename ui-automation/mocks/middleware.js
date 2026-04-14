/**
 * middleware.js — Mock Auth & Route Guard for Playwright E2E Testing
 *
 * Token store: simulates localStorage-based JWT session.
 * Role hierarchy: admin > staff > customer
 */

const MOCK_USERS = [
  {
    email: "john@email.com",
    password: "Password123",
    name: "John Smith",
    phone: "0812345678",
    role: "customer",
    token: "mock_token_customer_101"
  },
  {
    email: "jane@email.com",
    password: "Password123",
    name: "Jane Grok",
    phone: "0965554211",
    role: "customer",
    token: "mock_token_customer_102"
  },
  {
    email: "staff@test.com",
    password: "StaffPass1",
    name: "Staff User",
    phone: "",
    role: "staff",
    token: "mock_token_staff_201"
  },
  {
    email: "admin@test.com",
    password: "AdminPass1",
    name: "Admin User",
    phone: "",
    role: "admin",
    token: "mock_token_admin_301"
  }
]

const ROLE_LEVELS = { customer: 1, staff: 2, admin: 3 };

/* ── Session helpers ───────────────────────────────────────────── */

function saveSession(user) {
  localStorage.setItem('rts_token', user.token);
  localStorage.setItem('rts_user',  JSON.stringify({
    email: user.email,
    name:  user.name,
    phone: user.phone,
    role:  user.role,
    token: user.token,
  }));
}

function getSession() {
  try {
    const raw = localStorage.getItem('rts_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearSession() {
  localStorage.removeItem('rts_token');
  localStorage.removeItem('rts_user');
}

/* ── Mock login ────────────────────────────────────────────────── */

/**
 * login(email, password)
 * Returns { ok:true, user } or { ok:false, error }
 * Playwright can call this directly via page.evaluate()
 */
function login(email, password) {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: 'Invalid credentials' };
  saveSession(user);
  return { ok: true, user: { email:user.email, name:user.name, phone:user.phone, role:user.role, token:user.token } };
}

/* ── Route guard ───────────────────────────────────────────────── */

/**
 * requireRole(minRole)
 * Call at the top of each page's <script>.
 * If session is missing or role is insufficient, redirects to login.html with a reason param.
 *
 * Access rules:
 *   customer → customer pages only
 *   staff    → customer pages + staff pages
 *   admin    → all pages
 */
function requireRole(minRole) {
  const session = getSession();

  // Not logged in at all
  if (!session || !session.token) {
    window.location.href = `../Auth/login.html?redirect=${encodeURIComponent(window.location.pathname)}&reason=unauthenticated`;
    return null;
  }

  // Validate token matches a known mock user
  const known = MOCK_USERS.find(u => u.token === session.token && u.email === session.email);
  if (!known) {
    clearSession();
    window.location.href = `../Auth/login.html?reason=invalid_token`;
    return null;
  }

  const userLevel = ROLE_LEVELS[session.role] ?? 0;
  const minLevel  = ROLE_LEVELS[minRole]      ?? 99;

  if (userLevel < minLevel) {
    // Show access-denied inline rather than redirect, so Playwright can assert the message
    renderAccessDenied(session.role, minRole);
    return null;
  }

  return session;
}

/* ── Access-denied renderer ────────────────────────────────────── */

function renderAccessDenied(userRole, requiredRole) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,sans-serif;background:#f9f9f9">
      <div data-testid="access-denied" style="text-align:center;padding:40px;background:#fff;border-radius:12px;border:1px solid #e0e0e0;max-width:400px">
        <div style="font-size:48px;margin-bottom:16px">🚫</div>
        <h2 style="color:#A32D2D;font-size:20px;margin-bottom:8px">Access Denied</h2>
        <p style="color:#666;font-size:14px;margin-bottom:16px">
          Your role <strong>${userRole}</strong> does not have permission to view this page.<br>
          Required role: <strong>${requiredRole}</strong> or higher.
        </p>
        <a href="../login.html" style="display:inline-block;padding:8px 20px;background:#1D9E75;color:#fff;border-radius:6px;text-decoration:none;font-size:13px">← Back to Login</a>
      </div>
    </div>`;
}

/* ── Logout ────────────────────────────────────────────────────── */

function logout() {
  clearSession();
  window.location.href = '../login.html';
}

/* ── Shared nav/topbar renderer ────────────────────────────────── */

function renderShell(session, navItems, firstScreen, screensMap) {
  // Avatar initials
  const initials = session.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  document.querySelector('#user-avatar').textContent = initials;
  document.querySelector('#user-info').innerHTML = `
    <div style="font-size:12px;font-weight:500;color:var(--color-text-primary)">${session.name}</div>
    <div style="font-size:11px;color:var(--color-text-secondary)">${session.role.charAt(0).toUpperCase()+session.role.slice(1)}</div>`;

  renderNav(navItems, firstScreen, screensMap);
  goScreen(firstScreen, screensMap);
}

function renderNav(navItems, currentScreen, screensMap) {
  const nav = document.getElementById('nav-area');
  nav.innerHTML = navItems.map(item => `
    <button class="nav-item ${item.id === currentScreen ? 'active' : ''}"
            data-testid="nav-${item.id}"
            onclick="goScreen('${item.id}', window.__screens)">
      <span class="nav-icon">${item.icon}</span>${item.label}
    </button>`).join('');
}

function goScreen(id, screensMap) {
  const map = screensMap || window.__screens;
  if (!map) return;
  const fn = map[id];
  if (!fn) return;
  document.getElementById('content-area').innerHTML = fn();
  document.getElementById('page-title').textContent = window.__titles?.[id] || id;
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('onclick').includes(`'${id}'`));
  });
}

function showTables() {
  document.getElementById('avail-result').innerHTML = `
    <div class="card">
      <div class="section-title">Available tables — 2026-05-20 at 18:00 for 4 guests</div>
      <div class="avail-grid">
        <div class="table-card" onclick="selectTable(this,'T-02')"><div class="tc-name">T-02</div><div class="tc-cap">4 pax capacity</div><div class="tc-status"><span class="badge badge-green">Available</span></div></div>
        <div class="table-card selected" onclick="selectTable(this,'T-03')"><div class="tc-name">T-03</div><div class="tc-cap">6 pax capacity</div><div class="tc-status"><span class="badge badge-green">Available</span></div></div>
        <div class="table-card" onclick="selectTable(this,'T-05')"><div class="tc-name">T-05</div><div class="tc-cap">8 pax capacity</div><div class="tc-status"><span class="badge badge-green">Available</span></div></div>
        <div class="table-card" style="opacity:0.45;cursor:not-allowed"><div class="tc-name">T-01</div><div class="tc-cap">2 pax capacity</div><div class="tc-status"><span class="badge badge-red">Too small</span></div></div>
      </div>
      <button class="btn btn-primary" onclick="goScreen('make',window.__screens)">Proceed to Book ↗</button>
    </div>`;
}

function selectTable(el) {
  document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}
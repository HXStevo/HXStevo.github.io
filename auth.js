// HX SEO Tools — Google Auth
// Restricts access to @holidayextras.com Google accounts
// Replace CLIENT_ID below with your Google OAuth 2.0 Client ID
// Setup: console.cloud.google.com → APIs & Services → Credentials → Create OAuth 2.0 Client ID
// Authorized JS origins: https://hxstevo.github.io

const HX_AUTH = {
  CLIENT_ID: 'REPLACE_WITH_GOOGLE_CLIENT_ID',
  ALLOWED_DOMAIN: 'holidayextras.com',
  SESSION_KEY: 'hx_auth_session',
  SESSION_HOURS: 8,

  overlay: null,

  init() {
    // Check existing session
    if (this.validSession()) {
      this.showContent();
      return;
    }
    // Hide content, show login
    this.showLogin();
    this.loadGoogleSDK();
  },

  validSession() {
    try {
      const s = JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
      if (!s) return false;
      if (Date.now() > s.expires) { localStorage.removeItem(this.SESSION_KEY); return false; }
      if (!s.email.endsWith('@' + this.ALLOWED_DOMAIN)) return false;
      return true;
    } catch { return false; }
  },

  getSession() {
    try { return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null'); } catch { return null; }
  },

  showLogin() {
    document.documentElement.style.overflow = 'hidden';
    this.overlay = document.createElement('div');
    this.overlay.id = 'hx-auth-overlay';
    this.overlay.innerHTML = `
      <style>
        #hx-auth-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: #0f1117;
          display: flex; align-items: center; justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #hx-auth-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 48px 40px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
        #hx-auth-box .logo { font-size: 2.5rem; margin-bottom: 16px; }
        #hx-auth-box h1 { color: #fff; font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; }
        #hx-auth-box p { color: #64748b; font-size: 0.88rem; margin-bottom: 28px; line-height: 1.5; }
        #hx-auth-box .restriction {
          background: #162032; border: 1px solid #1e3a5f;
          border-radius: 8px; padding: 10px 14px;
          color: #7dd3fc; font-size: 0.8rem; margin-bottom: 24px;
        }
        #google-signin-btn {
          display: inline-flex; align-items: center; gap: 12px;
          background: #fff; color: #1f2937;
          border: none; border-radius: 8px;
          padding: 12px 24px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; width: 100%;
          justify-content: center;
          transition: background 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        #google-signin-btn:hover { background: #f3f4f6; }
        #google-signin-btn img { width: 20px; height: 20px; }
        #hx-auth-status { color: #94a3b8; font-size: 0.8rem; margin-top: 16px; min-height: 20px; }
        #hx-auth-error { color: #ef4444; font-size: 0.82rem; margin-top: 12px; display:none; }
      </style>
      <div id="hx-auth-box">
        <div class="logo">✈️</div>
        <h1>HX SEO Tools</h1>
        <p>Internal tools for the Holiday Extras SEO team.<br>Sign in with your HX Google account to continue.</p>
        <div class="restriction">🔒 @holidayextras.com accounts only</div>
        <button id="google-signin-btn" onclick="HX_AUTH.signIn()">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
        <div id="hx-auth-status">Waiting for sign-in...</div>
        <div id="hx-auth-error"></div>
      </div>
    `;
    document.body.prepend(this.overlay);
  },

  loadGoogleSDK() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => this.initGoogle();
    document.head.appendChild(script);
  },

  initGoogle() {
    if (typeof google === 'undefined') {
      document.getElementById('hx-auth-status').textContent = 'Failed to load Google SDK';
      return;
    }
    google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (response) => this.handleCredential(response),
      auto_select: false,
    });
    document.getElementById('hx-auth-status').textContent = 'Ready — click to sign in';
  },

  signIn() {
    if (typeof google === 'undefined') {
      document.getElementById('hx-auth-error').style.display = 'block';
      document.getElementById('hx-auth-error').textContent = 'Google SDK not loaded. Check Client ID configuration.';
      return;
    }
    google.accounts.id.prompt();
  },

  handleCredential(response) {
    try {
      // Decode JWT payload (no verification needed client-side — Google already verified it)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = payload.email || '';
      const name = payload.name || email;

      if (!email.endsWith('@' + this.ALLOWED_DOMAIN)) {
        document.getElementById('hx-auth-error').style.display = 'block';
        document.getElementById('hx-auth-error').textContent = `Access denied. Only @${this.ALLOWED_DOMAIN} accounts can access this tool. You signed in as: ${email}`;
        return;
      }

      // Store session
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        email, name,
        expires: Date.now() + (this.SESSION_HOURS * 3600 * 1000)
      }));

      this.showContent();
    } catch(e) {
      document.getElementById('hx-auth-error').style.display = 'block';
      document.getElementById('hx-auth-error').textContent = 'Sign-in error: ' + e.message;
    }
  },

  showContent() {
    if (this.overlay) { this.overlay.remove(); this.overlay = null; }
    document.documentElement.style.overflow = '';
    // Show signed-in user badge
    const s = this.getSession();
    if (s) {
      const badge = document.createElement('div');
      badge.style.cssText = 'position:fixed;bottom:16px;right:16px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 14px;font-size:0.75rem;color:#94a3b8;z-index:9999;font-family:sans-serif;display:flex;align-items:center;gap:8px;';
      badge.innerHTML = `<span>🔐</span><span>${s.email}</span><button onclick="HX_AUTH.signOut()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.75rem;padding:0 4px;">Sign out</button>`;
      document.body.appendChild(badge);
    }
  },

  signOut() {
    localStorage.removeItem(this.SESSION_KEY);
    location.reload();
  }
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HX_AUTH.init());
} else {
  HX_AUTH.init();
}

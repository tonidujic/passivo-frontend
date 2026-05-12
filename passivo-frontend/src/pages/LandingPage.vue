<template>
  <q-page class="landing-page">
    <header class="navbar">
      <img src="~assets/logo-passivo.png" class="nav-logo" />

      <nav class="nav-links">
        <a>Features</a>
        <a>Security</a>
        <a>Pricing</a>
        <a>FAQ</a>
        <a>Contact</a>
      </nav>

      <div class="nav-actions">
        <router-link to="/auth/login" class="login-link">Log in</router-link>
        <q-btn
          unelevated
          label="Sign up"
          icon-right="arrow_forward"
          class="signup-btn"
          to="/auth/signup"
        />
      </div>
    </header>

    <section class="hero">
      <div class="hero-left">
        <div class="badge">
          <q-icon name="verified_user" />
          Secure. Private. <span>Only yours.</span>
        </div>

        <h1>
          Your data.<br />
          <span>Only yours.</span>
        </h1>

        <p>
          Passivo is a modern password manager that keeps your passwords and sensitive data safe
          with end-to-end encryption and zero-knowledge architecture.
        </p>

        <div class="hero-actions">
          <q-btn
            unelevated
            label="Get started for free"
            icon-right="arrow_forward"
            class="main-btn"
            to="/auth/signup"
          />

          <q-btn outline label="Log in" class="outline-btn" to="/auth/login" />
        </div>

        <div class="features-row">
          <span><q-icon name="lock" /> End-to-end encrypted</span>
          <span><q-icon name="shield" /> Zero-knowledge</span>
          <span><q-icon name="group" /> Private by design</span>
        </div>
      </div>

      <div class="hero-right">
        <div class="vault-card">
          <div class="vault-sidebar">
            <img src="~assets/logo-passivo.png" class="mini-logo" />
            <div class="active"><q-icon name="lock" /> Vault</div>
            <div><q-icon name="star_border" /> Favorites</div>
            <div><q-icon name="vpn_key" /> Passwords</div>
            <div><q-icon name="upload_file" />Files</div>
            <div><q-icon name="note" /> Notes</div>

            <div><q-icon name="settings" /> Settings</div>
          </div>

          <div class="vault-content">
            <h2>Vault</h2>

            <div class="search">
              <q-icon name="search" />
              <span>Search anything...</span>
            </div>

            <div class="item" v-for="item in items" :key="item.name">
              <div class="app-icon">{{ item.icon }}</div>
              <div>
                <strong>{{ item.name }}</strong>
                <p>john.doe@gmail.com</p>
              </div>
              <q-icon name="star" class="star" />
            </div>
          </div>
        </div>

        <div class="phone-card">
          <img src="~assets/logo-passivo.png" class="phone-logo" />
          <h3>Welcome back</h3>
          <p>john.doe@gmail.com</p>
          <div class="password-box">•••••••••• <q-icon name="visibility" /></div>
          <q-btn unelevated label="Unlock" class="unlock-btn" />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
const items = [
  { name: 'Google', icon: 'G' },
  { name: 'GitHub', icon: 'GH' },
  { name: 'Amazon', icon: 'A' },
  { name: 'Netflix', icon: 'N' },
  { name: 'PayPal', icon: 'P' },
]
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 85%, rgba(47, 143, 47, 0.18), transparent 25%),
    linear-gradient(135deg, #f7f9f8 0%, #edf4ef 100%);
  color: #17201a;
  overflow: hidden;
}

.navbar {
  height: 86px;
  padding: 0 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  width: 230px;
}

.nav-links {
  display: flex;
  gap: 42px;
  font-weight: 600;
  color: #1f2a24;
}

.nav-links a {
  cursor: pointer;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 26px;
}

.login-link {
  color: #17201a;
  font-weight: 600;
  text-decoration: none;
}

.signup-btn,
.main-btn,
.unlock-btn {
  background: #2f8f2f;
  color: white;
  border-radius: 10px;
  font-weight: 700;
}

.signup-btn {
  padding: 10px 18px;
}

.hero {
  min-height: calc(100vh - 86px);
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  align-items: center;
  gap: 70px;
  padding: 40px 72px 80px;
}

.badge {
  width: fit-content;
  padding: 10px 18px;
  border: 1px solid rgba(47, 143, 47, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  color: #233027;
  margin-bottom: 34px;
}

.badge span {
  color: #2f8f2f;
}

.hero-left h1 {
  font-size: 82px;
  line-height: 0.98;
  letter-spacing: -3px;
  margin: 0 0 28px;
  font-weight: 900;
}

.hero-left h1 span {
  color: #2f8f2f;
}

.hero-left p {
  max-width: 620px;
  font-size: 22px;
  line-height: 1.55;
  color: #4f5d55;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 24px;
  margin: 36px 0;
}

.main-btn {
  height: 58px;
  padding: 0 28px;
  font-size: 17px;
}

.outline-btn {
  height: 58px;
  padding: 0 28px;
  border-radius: 10px;
  color: #57956c;
  font-weight: 700;
}

.features-row {
  display: flex;
  gap: 30px;
  color: #344139;
  font-weight: 600;
}

.features-row span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.features-row .q-icon {
  color: #2f8f2f;
}

.hero-right {
  position: relative;
  min-height: 560px;
}

.vault-card {
  width: 760px;
  height: 520px;
  display: grid;
  grid-template-columns: 250px 1fr;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  box-shadow: 0 35px 90px rgba(20, 40, 30, 0.16);
  border: 1px solid rgba(20, 40, 30, 0.12);
  overflow: hidden;
}

.vault-sidebar {
  padding: 30px;
  border-right: 1px solid rgba(20, 40, 30, 0.08);
}

.mini-logo {
  width: 150px;
  margin-bottom: 26px;
}

.vault-sidebar div {
  padding: 13px 14px;
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 600;
  color: #35443a;
}

.vault-sidebar .active {
  background: rgba(47, 143, 47, 0.14);
  color: #2f8f2f;
}

.vault-content {
  padding: 42px;
}

.vault-content h2 {
  font-size: 34px;
  margin: 0 0 22px;
}

.search {
  height: 58px;
  border: 1px solid rgba(20, 40, 30, 0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
  color: #7a857d;
  margin-bottom: 20px;
}

.item {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(20, 40, 30, 0.09);
  border-radius: 14px;
  padding: 0 18px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.75);
}

.item p {
  margin: 2px 0 0;
  color: #718078;
  font-size: 13px;
}

.app-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f2f6f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.star {
  margin-left: auto;
  color: #2f8f2f;
}

.phone-card {
  position: absolute;
  right: 0;
  top: 110px;
  width: 230px;
  min-height: 410px;
  border-radius: 34px;
  background: white;
  border: 8px solid #111;
  box-shadow: 0 30px 70px rgba(20, 40, 30, 0.25);
  padding: 38px 22px;
}

.phone-logo {
  width: 150px;
  margin-bottom: 28px;
}

.phone-card h3 {
  font-size: 22px;
  margin: 0 0 6px;
}

.phone-card p {
  color: #65736b;
  margin-bottom: 26px;
}

.password-box {
  height: 48px;
  border: 1px solid rgba(20, 40, 30, 0.14);
  border-radius: 10px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.unlock-btn {
  width: 100%;
  height: 48px;
}

@media (max-width: 1100px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-right {
    display: none;
  }

  .navbar {
    padding: 0 24px;
  }

  .nav-links {
    display: none;
  }
}
</style>

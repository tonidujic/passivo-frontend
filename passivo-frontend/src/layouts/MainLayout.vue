<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <header class="navbar">
      <router-link to="/">
        <img src="~assets/logo-passivo.png" class="nav-logo" />
      </router-link>

      <nav class="nav-links">
        <router-link to="/features">Features</router-link>
        <router-link to="/security">Security</router-link>
        <router-link to="/pricing">Pricing</router-link>
        <router-link to="/faq">FAQ</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>

      <div class="nav-actions">
        <router-link to="/auth/login" class="login-link"> Log in </router-link>

        <q-btn
          unelevated
          label="Sign up"
          icon-right="arrow_forward"
          class="signup-btn"
          to="/auth/signup"
        />
      </div>
    </header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.main-layout {
  background:
    radial-gradient(circle at 15% 85%, rgba(47, 143, 47, 0.18), transparent 25%),
    linear-gradient(135deg, #f7f9f8 0%, #edf4ef 100%);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  height: 86px;
  padding: 0 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);

  border-bottom: 1px solid rgba(20, 40, 30, 0.06);
}

.nav-logo {
  width: 220px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 42px;
}

.nav-links a {
  text-decoration: none;
  color: #1f2a24;
  font-weight: 700;
  transition: 0.2s ease;
}

.nav-links a:hover {
  color: #2f8f2f;
}

.router-link-active {
  color: #2f8f2f !important;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.login-link {
  text-decoration: none;
  color: #17201a;
  font-weight: 700;
}

.signup-btn {
  height: 46px;
  padding: 0 18px;

  border-radius: 12px;
  background: #2f8f2f;
  color: white;

  font-weight: 800;
}

@media (max-width: 1100px) {
  .navbar {
    padding: 0 24px;
  }

  .nav-links {
    display: none;
  }

  .nav-logo {
    width: 180px;
  }
}
</style>

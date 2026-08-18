<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-header class="main-header">
      <q-toolbar class="navbar">
        <router-link to="/" class="logo-link">
          <div class="navbar-logo-wrapper">
            <img :src="logoSrc" class="navbar-logo" alt="Passivo" />
          </div>
        </router-link>

        <nav class="nav-links">
          <router-link to="/features"> Features </router-link>

          <router-link to="/security"> Security </router-link>

          <router-link to="/pricing"> Pricing </router-link>

          <router-link to="/faq"> FAQ </router-link>

          <router-link to="/contact"> Contact </router-link>
        </nav>

        <div class="nav-actions">
          <q-btn flat no-caps label="Log in" class="login-btn" @click="goToLogin" />

          <q-btn
            unelevated
            no-caps
            label="Sign up"
            icon-right="arrow_forward"
            class="signup-btn"
            @click="goToSignup"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'

import { useRouter } from 'vue-router'

import { useThemeStore } from 'src/stores/themeStore'

import logoLight from 'src/assets/logo-passivo-light.png'
import logoDark from 'src/assets/logo-passivo-dark.png'

const router = useRouter()

const theme = useThemeStore()

const logoSrc = computed(() => {
  return theme.mode === 'dark' ? logoDark : logoLight
})

function goToLogin() {
  router.push('/auth/login')
}

function goToSignup() {
  router.push('/auth/signup')
}
</script>

<style scoped>
.main-layout {
  background: var(--app-page-bg);

  color: var(--app-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.main-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 4%, var(--app-surface)),
    var(--app-surface) 45%,
    color-mix(in srgb, var(--q-secondary) 4%, var(--app-surface))
  );

  color: var(--app-text);

  border-bottom: 1px solid color-mix(in srgb, var(--q-primary) 12%, var(--app-border));

  box-shadow: 0 6px 30px color-mix(in srgb, var(--q-primary) 6%, transparent);

  backdrop-filter: blur(18px);

  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.navbar {
  height: 88px;

  max-width: 1450px;

  margin: 0 auto;

  padding: 0 72px;

  display: flex;

  align-items: center;
}

.logo-link {
  display: flex;

  align-items: center;

  text-decoration: none;

  flex-shrink: 0;
}

.navbar-logo-wrapper {
  width: 200px;

  height: 74px;

  display: flex;

  align-items: center;

  justify-content: flex-start;

  overflow: visible;
}

.navbar-logo {
  display: block;

  width: 195px;

  height: 72px;

  object-fit: contain;

  object-position: left center;

  margin: 0;

  padding: 0;

  flex-shrink: 0;
}

.nav-links {
  display: flex;

  align-items: center;

  gap: 42px;

  margin: 0 auto;
}

.nav-links a {
  position: relative;

  padding: 10px 2px;

  color: var(--app-text);

  font-size: 14px;

  font-weight: 800;

  text-decoration: none;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.nav-links a::after {
  content: '';

  position: absolute;

  left: 50%;

  bottom: 1px;

  width: 0;

  height: 3px;

  border-radius: 999px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, var(--q-primary), var(--q-secondary));

  transition: width 0.25s ease;
}

.nav-links a:hover {
  color: var(--q-primary);

  transform: translateY(-1px);
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

.nav-links a.router-link-active {
  color: var(--q-primary);
}

.nav-actions {
  display: flex;

  align-items: center;

  gap: 14px;

  flex-shrink: 0;
}

.login-btn {
  min-height: 46px;

  padding: 0 20px;

  border-radius: 13px;

  color: var(--app-text);

  font-weight: 800;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.login-btn:hover {
  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 8%, transparent);

  transform: translateY(-1px);
}

.signup-btn {
  min-height: 48px;

  padding: 0 22px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 900;

  box-shadow: 0 12px 28px color-mix(in srgb, var(--q-primary) 20%, transparent);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.signup-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 34px color-mix(in srgb, var(--q-primary) 28%, transparent);
}

@media (max-width: 1000px) {
  .navbar {
    padding: 0 28px;
  }

  .nav-links {
    gap: 22px;
  }

  .navbar-logo-wrapper {
    width: 175px;

    height: 68px;
  }

  .navbar-logo {
    width: 170px;

    height: 64px;
  }
}

@media (max-width: 800px) {
  .nav-links {
    display: none;
  }

  .nav-actions {
    margin-left: auto;
  }
}

@media (max-width: 500px) {
  .navbar {
    height: 74px;

    padding: 0 16px;
  }

  .navbar-logo-wrapper {
    width: 155px;

    height: 60px;
  }

  .navbar-logo {
    width: 150px;

    height: 58px;
  }

  .login-btn {
    display: none;
  }

  .signup-btn {
    min-height: 42px;

    padding: 0 15px;
  }
}
</style>

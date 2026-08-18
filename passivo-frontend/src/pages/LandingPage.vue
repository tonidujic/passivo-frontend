<template>
  <q-page class="landing-page">
    <section class="hero">
      <div class="hero-left">
        <h1>
          Your data.<br />

          <span> Only yours. </span>
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
          <span>
            <q-icon name="lock" />

            End-to-end encrypted
          </span>

          <span>
            <q-icon name="shield" />

            Zero-knowledge
          </span>

          <span>
            <q-icon name="group" />

            Private by design
          </span>
        </div>
      </div>

      <div class="hero-right">
        <div class="vault-card">
          <div class="vault-sidebar">
            <div class="mini-logo-wrap">
              <img :src="logoSrc" alt="Passivo" class="mini-logo" />
            </div>

            <div class="active">
              <q-icon name="lock" />

              Vault
            </div>

            <div>
              <q-icon name="star_border" />

              Favorites
            </div>

            <div>
              <q-icon name="vpn_key" />

              Passwords
            </div>

            <div>
              <q-icon name="upload_file" />

              Files
            </div>

            <div>
              <q-icon name="note" />

              Notes
            </div>

            <div>
              <q-icon name="settings" />

              Settings
            </div>
          </div>

          <div class="vault-content">
            <h2>Vault</h2>

            <div class="search">
              <q-icon name="search" />

              <span> Search anything... </span>
            </div>

            <div class="item" v-for="item in items" :key="item.name">
              <div class="app-icon">
                <img
                  :src="`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`"
                  class="logo-img"
                />
              </div>

              <div>
                <strong>
                  {{ item.name }}
                </strong>

                <p>john.doe@gmail.com</p>
              </div>

              <q-icon name="star" class="star" />
            </div>
          </div>
        </div>

        <div class="phone-card">
          <div class="phone-logo-wrap">
            <img :src="logoSrc" alt="Passivo" class="phone-logo" />
          </div>

          <h3>Welcome back</h3>

          <p>john.doe@gmail.com</p>

          <div class="password-box">
            ••••••••••

            <q-icon name="visibility" />
          </div>

          <q-btn unelevated label="Unlock" class="unlock-btn" />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'

import { useThemeStore } from 'src/stores/themeStore'

import logoLight from 'src/assets/logo-passivo-light.png'
import logoDark from 'src/assets/logo-passivo-dark.png'

const theme = useThemeStore()

const logoSrc = computed(() => {
  return theme.mode === 'dark' ? logoDark : logoLight
})

const items = [
  {
    name: 'Google',
    domain: 'google.com',
  },
  {
    name: 'GitHub',
    domain: 'github.com',
  },
  {
    name: 'Amazon',
    domain: 'amazon.com',
  },
  {
    name: 'Netflix',
    domain: 'netflix.com',
  },
  {
    name: 'PayPal',
    domain: 'paypal.com',
  },
]
</script>

<style scoped>
.landing-page {
  min-height: calc(100vh - 86px);

  overflow: hidden;

  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--q-primary) 10%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at 12% 85%,
      color-mix(in srgb, var(--q-secondary) 7%, transparent),
      transparent 32%
    ),
    var(--app-page-bg);

  color: var(--app-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.hero {
  min-height: calc(100vh - 86px);

  display: grid;

  grid-template-columns: 1fr 1.35fr;

  align-items: center;

  gap: 70px;

  padding: 40px 72px 80px;
}

.badge .q-icon {
  color: var(--q-primary);
}

.hero-left h1 {
  margin: 0 0 28px;

  font-size: 82px;

  line-height: 0.98;

  letter-spacing: -3px;

  font-weight: 900;

  color: var(--app-text);
}

.hero-left h1 span {
  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;

  -webkit-text-fill-color: transparent;
}

.hero-left p {
  max-width: 620px;

  font-size: 22px;

  line-height: 1.55;

  color: var(--app-text-muted);

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

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  border-radius: 12px;

  font-size: 17px;

  font-weight: 800;

  box-shadow: 0 14px 30px color-mix(in srgb, var(--q-primary) 24%, transparent);
}

.outline-btn {
  height: 58px;

  padding: 0 28px;

  border-radius: 12px;

  color: var(--q-primary);

  font-weight: 700;
}

.features-row {
  display: flex;

  gap: 30px;

  color: var(--app-text);

  font-weight: 600;
}

.features-row span {
  display: flex;

  align-items: center;

  gap: 8px;
}

.features-row span:nth-child(1) .q-icon {
  color: var(--q-primary);
}

.features-row span:nth-child(2) .q-icon {
  color: var(--q-secondary);
}

.features-row span:nth-child(3) .q-icon {
  color: var(--q-accent);
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

  background: color-mix(in srgb, var(--app-surface) 92%, transparent);

  backdrop-filter: blur(18px);

  box-shadow: 0 35px 90px color-mix(in srgb, var(--q-primary) 10%, rgba(0, 0, 0, 0.12));

  border: 1px solid var(--app-border);

  overflow: hidden;
}

.vault-sidebar {
  padding: 30px;

  border-right: 1px solid var(--app-border);

  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--q-primary) 4%, var(--app-surface)),
    color-mix(in srgb, var(--q-secondary) 3%, var(--app-surface))
  );
}

.mini-logo-wrap {
  height: 62px;

  margin-bottom: 20px;

  display: flex;

  align-items: center;

  justify-content: flex-start;
}

.mini-logo {
  display: block;

  width: 160px;

  height: 58px;

  object-fit: contain;

  object-position: left center;

  margin: 0;

  padding: 0;
}

.vault-sidebar div:not(.mini-logo-wrap) {
  padding: 13px 14px;

  margin-bottom: 8px;

  border-radius: 10px;

  display: flex;

  gap: 10px;

  align-items: center;

  font-weight: 600;

  color: var(--app-text-muted);
}

.vault-sidebar .active {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 16%, transparent),
    color-mix(in srgb, var(--q-secondary) 10%, transparent)
  );

  color: var(--q-primary);
}

.vault-content {
  padding: 42px;

  color: var(--app-text);
}

.vault-content h2 {
  margin: 0 0 22px;

  font-size: 34px;
}

.search {
  height: 58px;

  border: 1px solid var(--app-border);

  border-radius: 12px;

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 0 18px;

  color: var(--app-text-muted);

  background: var(--app-surface-2);

  margin-bottom: 20px;
}

.search .q-icon {
  color: var(--q-primary);
}

.item {
  height: 72px;

  display: flex;

  align-items: center;

  gap: 16px;

  border: 1px solid var(--app-border);

  border-radius: 14px;

  padding: 0 18px;

  margin-bottom: 12px;

  background: var(--app-surface);

  color: var(--app-text);
}

.item p {
  margin: 2px 0 0;

  color: var(--app-text-muted);

  font-size: 13px;
}

.app-icon {
  width: 42px;

  height: 42px;

  border-radius: 12px;

  background: var(--app-surface-2);

  display: flex;

  align-items: center;

  justify-content: center;
}

.logo-img {
  width: 26px;

  height: 26px;

  object-fit: contain;
}

.star {
  margin-left: auto;

  color: var(--q-secondary);
}

.phone-card {
  position: absolute;

  right: 0;

  top: 110px;

  width: 230px;

  min-height: 410px;

  border-radius: 34px;

  background: linear-gradient(
    155deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 4%, var(--app-surface))
  );

  color: var(--app-text);

  border: 8px solid #111;

  box-shadow: 0 30px 70px color-mix(in srgb, var(--q-secondary) 12%, rgba(0, 0, 0, 0.2));

  padding: 38px 22px;
}

.phone-logo-wrap {
  height: 66px;

  margin-bottom: 22px;

  display: flex;

  align-items: center;

  justify-content: flex-start;
}

.phone-logo {
  display: block;

  width: 155px;

  height: 60px;

  object-fit: contain;

  object-position: left center;

  margin: 0;

  padding: 0;
}

.phone-card h3 {
  margin: 0 0 6px;

  font-size: 22px;
}

.phone-card p {
  color: var(--app-text-muted);

  margin-bottom: 26px;
}

.password-box {
  height: 48px;

  border: 1px solid var(--app-border);

  border-radius: 10px;

  padding: 0 12px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: var(--app-surface-2);

  margin-bottom: 18px;
}

.password-box .q-icon {
  color: var(--q-primary);
}

.unlock-btn {
  width: 100%;

  height: 48px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  border-radius: 10px;

  font-weight: 800;
}

@media (max-width: 1100px) {
  .hero {
    grid-template-columns: 1fr;

    padding: 40px 24px 80px;
  }

  .hero-right {
    display: none;
  }

  .hero-left h1 {
    font-size: 58px;
  }

  .hero-left p {
    font-size: 18px;
  }

  .features-row {
    flex-direction: column;

    gap: 14px;
  }
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="auth-page">
        <section class="brand-side">
          <div class="brand-content">
            <div class="brand-logo">
              <img :src="logoSrc" alt="Passivo" class="brand-logo-image" />
            </div>

            <h1>
              Secure your data.
              <span>Only yours.</span>
            </h1>

            <p>End-to-end encrypted password manager built with zero-knowledge architecture.</p>

            <div class="brand-features">
              <div class="brand-feature">
                <div class="feature-icon primary-feature">
                  <q-icon name="lock" />
                </div>

                <span>End-to-end encrypted</span>
              </div>

              <div class="brand-feature">
                <div class="feature-icon secondary-feature">
                  <q-icon name="visibility_off" />
                </div>

                <span>Zero-knowledge</span>
              </div>

              <div class="brand-feature">
                <div class="feature-icon accent-feature">
                  <q-icon name="shield" />
                </div>

                <span>Private by design</span>
              </div>
            </div>
          </div>
        </section>

        <section class="form-side">
          <div class="form-glow form-glow-one"></div>
          <div class="form-glow form-glow-two"></div>

          <div class="router-wrapper">
            <router-view />
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
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
</script>

<style scoped>
.auth-layout {
  height: 100vh;
  min-height: 100vh;

  background: var(--app-page-bg);

  color: var(--app-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.auth-page {
  height: 100vh;
  min-height: 100vh;

  display: grid;
  grid-template-columns: 1fr 1fr;

  position: relative;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 10% 10%,
      color-mix(in srgb, var(--q-primary) 7%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 85%,
      color-mix(in srgb, var(--q-secondary) 6%, transparent),
      transparent 32%
    ),
    var(--app-page-bg);
}

.brand-side {
  height: 100vh;
  min-height: 100vh;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: flex-end;

  padding: 80px 80px 80px 60px;

  position: relative;

  overflow: hidden;
}

.brand-side::before {
  content: '';

  position: absolute;

  width: 440px;
  height: 440px;

  left: -180px;
  top: -170px;

  border-radius: 50%;

  background: color-mix(in srgb, var(--q-primary) 9%, transparent);

  filter: blur(100px);

  pointer-events: none;
}

.brand-side::after {
  content: '';

  position: absolute;

  width: 360px;
  height: 360px;

  right: -80px;
  bottom: -160px;

  border-radius: 50%;

  background: color-mix(in srgb, var(--q-secondary) 7%, transparent);

  filter: blur(100px);

  pointer-events: none;
}

.brand-content {
  width: 100%;

  max-width: 600px;

  position: relative;

  z-index: 1;

  transform: translateX(35px);
}

.brand-logo {
  width: 100%;

  height: 105px;

  margin-bottom: 28px;

  display: flex;

  align-items: center;

  justify-content: flex-start;
}

.brand-logo-image {
  display: block;

  width: 270px;

  height: 100px;

  max-width: 100%;

  object-fit: contain;

  object-position: left center;

  margin: 0;

  padding: 0;

  flex-shrink: 0;
}

.brand-content h1 {
  margin: 0;

  font-size: 62px;

  line-height: 1.02;

  letter-spacing: -3px;

  font-weight: 950;

  color: var(--app-text);
}

.brand-content h1 span {
  display: block;

  margin-top: 5px;

  width: fit-content;

  background: linear-gradient(
    135deg,
    var(--q-primary) 0%,
    var(--q-secondary) 65%,
    var(--q-accent) 100%
  );

  background-clip: text;

  -webkit-background-clip: text;

  -webkit-text-fill-color: transparent;
}

.brand-content > p {
  max-width: 560px;

  margin: 34px 0 0;

  font-size: 20px;

  line-height: 1.65;

  color: var(--app-text-muted);

  font-weight: 600;
}

.brand-features {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 35px;
}

.brand-feature {
  padding: 9px 13px;

  border-radius: 999px;

  display: flex;

  align-items: center;

  gap: 7px;

  background: color-mix(in srgb, var(--app-surface) 75%, transparent);

  border: 1px solid var(--app-border);

  color: var(--app-text-muted);

  font-size: 11px;

  font-weight: 800;

  backdrop-filter: blur(10px);
}

.feature-icon {
  width: 24px;
  height: 24px;

  border-radius: 8px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.primary-feature {
  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 13%, transparent);
}

.secondary-feature {
  color: var(--q-secondary);

  background: color-mix(in srgb, var(--q-secondary) 13%, transparent);
}

.accent-feature {
  color: var(--q-accent);

  background: color-mix(in srgb, var(--q-accent) 13%, transparent);
}

.form-side {
  height: 100vh;
  min-height: 100vh;

  box-sizing: border-box;

  display: flex;

  justify-content: flex-start;

  padding: 50px 50px 50px 60px;

  position: relative;

  overflow-y: auto;

  overflow-x: hidden;
}

.form-glow {
  position: absolute;

  border-radius: 50%;

  filter: blur(100px);

  pointer-events: none;
}

.form-glow-one {
  width: 400px;
  height: 400px;

  top: 10%;

  right: -120px;

  background: color-mix(in srgb, var(--q-primary) 9%, transparent);
}

.form-glow-two {
  width: 350px;
  height: 350px;

  bottom: -100px;

  left: 0;

  background: color-mix(in srgb, var(--q-secondary) 7%, transparent);
}

.router-wrapper {
  position: relative;

  z-index: 1;

  width: 100%;

  max-width: 520px;

  margin: auto 0;

  transform: translateX(30px);
}

@media (max-width: 1050px) {
  .auth-layout {
    height: auto;
    min-height: 100vh;
  }

  .auth-page {
    height: auto;
    min-height: 100vh;

    grid-template-columns: 1fr;

    overflow: visible;
  }

  .brand-side {
    height: auto;
    min-height: auto;

    justify-content: center;

    padding: 60px 30px 25px;

    overflow: visible;
  }

  .brand-content {
    max-width: 620px;

    text-align: center;

    transform: none;
  }

  .brand-logo {
    justify-content: center;
  }

  .brand-logo-image {
    object-position: center center;
  }

  .brand-content h1 {
    font-size: 52px;
  }

  .brand-content h1 span {
    margin-left: auto;

    margin-right: auto;
  }

  .brand-content > p {
    margin-left: auto;

    margin-right: auto;
  }

  .brand-features {
    justify-content: center;
  }

  .form-side {
    height: auto;
    min-height: auto;

    justify-content: center;

    overflow: visible;

    padding: 30px 24px 70px;
  }

  .router-wrapper {
    margin: 0;

    transform: none;
  }
}

@media (max-width: 600px) {
  .brand-side {
    padding: 40px 20px 20px;
  }

  .brand-logo {
    height: 88px;

    margin-bottom: 20px;
  }

  .brand-logo-image {
    width: 225px;

    height: 82px;
  }

  .brand-content h1 {
    font-size: 42px;

    letter-spacing: -2px;
  }

  .brand-content > p {
    margin-top: 24px;

    font-size: 16px;
  }

  .brand-features {
    display: none;
  }

  .form-side {
    padding: 20px 16px 50px;
  }
}
</style>

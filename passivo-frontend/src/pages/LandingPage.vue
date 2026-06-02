<template>
  <q-page class="landing-page">
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
              <span>Search anything...</span>
            </div>

            <div class="item" v-for="item in items" :key="item.name">
              <div class="app-icon">
                <img
                  :src="`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`"
                  class="logo-img"
                />
              </div>

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
const items = [
  { name: 'Google', domain: 'google.com' },
  { name: 'GitHub', domain: 'github.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'PayPal', domain: 'paypal.com' },
]
</script>

<style scoped>
.landing-page {
  min-height: calc(100vh - 86px);
  overflow: hidden;
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
  margin-bottom: 34px;

  border: 1px solid rgba(47, 143, 47, 0.18);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.7);

  font-weight: 700;
  color: #233027;
}

.badge span {
  color: #2f8f2f;
}

.hero-left h1 {
  margin: 0 0 28px;

  font-size: 82px;
  line-height: 0.98;
  letter-spacing: -3px;

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

  background: #2f8f2f;
  color: white;

  border-radius: 12px;

  font-size: 17px;
  font-weight: 800;
}

.outline-btn {
  height: 58px;
  padding: 0 28px;

  border-radius: 12px;

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
  margin-bottom: 8px;

  border-radius: 10px;

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
  margin: 0 0 22px;

  font-size: 34px;
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
  width: 42px;
  height: 42px;

  border-radius: 12px;

  background: #f2f6f3;

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
  margin: 0 0 6px;

  font-size: 22px;
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

  background: #2f8f2f;
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

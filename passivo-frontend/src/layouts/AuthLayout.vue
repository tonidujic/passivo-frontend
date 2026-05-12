<template>
  <q-layout class="auth-layout" view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page">
        <section class="brand">
          <img src="~assets/logo-passivo.png" class="brand-logo" />

          <h1>
            Secure your data.<br />
            <span>Only yours.</span>
          </h1>

          <p>End-to-end encrypted password manager built with zero-knowledge architecture.</p>
        </section>

        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 30% 30%, rgba(47, 143, 47, 0.2), transparent 25%),
    radial-gradient(circle at 70% 10%, rgba(46, 143, 47, 0.2), transparent 25%),
    radial-gradient(circle at 90% 80%, rgba(46, 143, 47, 0.2), transparent 25%),
    linear-gradient(135deg, #f7f9f8 0%, #eef3ef 100%);
}

.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 520px 460px;
  align-items: center;
  justify-content: center;
  gap: 100px;
  padding: 40px;
}

.brand {
  max-width: 520px;
}

.brand-logo {
  width: 280px;
  max-width: 100%;
  height: auto;
}

.brand h1 {
  margin: 0 0 20px;
  font-size: 52px;
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #17201a;
}

.brand h1 span {
  color: #2f8f2f;
}

.brand p {
  max-width: 460px;
  font-size: 20px;
  line-height: 1.65;
  font-weight: 500;
  color: #5c6b61;
}

@media (max-width: 1000px) {
  .auth-page {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .brand-logo {
    margin: 0 auto 32px;
  }
}
</style>

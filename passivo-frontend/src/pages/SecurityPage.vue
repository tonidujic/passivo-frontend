<template>
  <q-page class="security-page">
    <div class="hero">
      <h1>Security first.</h1>
      <p>Your vault is protected with end-to-end encryption and zero-knowledge design.</p>
    </div>

    <div class="cards">
      <div class="security-card" v-for="item in security" :key="item.title">
        <q-icon :name="item.icon" />

        <h3>{{ item.title }}</h3>

        <p>{{ item.description }}</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const security = [
  {
    icon: 'lock',
    title: 'End-to-end encryption',
    description: 'Your data is encrypted before leaving your device.',
  },
  {
    icon: 'visibility_off',
    title: 'Zero-knowledge',
    description: 'Passivo servers never see your plaintext data.',
  },
  {
    icon: 'devices',
    title: 'Device keys',
    description: 'Private keys stay securely protected on your device.',
  },
  {
    icon: 'verified_user',
    title: 'Secure authentication',
    description: 'Your password is never directly stored or exposed.',
  },
]
</script>

<style scoped>
.security-page {
  min-height: calc(100vh - 86px);
  padding: 90px 70px;
  background:
    radial-gradient(circle at top right, rgba(47, 143, 47, 0.1), transparent 30%), #f6f8f6;
}

.hero {
  max-width: 850px;
  margin: 0 auto;
  text-align: center;
}

.hero h1 {
  margin: 0;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -3px;
  font-weight: 900;
  color: #17201a;
}

.hero p {
  margin-top: 24px;
  font-size: 21px;
  line-height: 1.6;
  color: #66746b;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  margin-top: 70px;
}

.security-card {
  width: 260px;
  min-height: 240px;
  padding: 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 50px rgba(20, 40, 30, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: 0.25s ease;
}

.security-card:hover {
  transform: translateY(-8px);
}

.security-card .q-icon {
  font-size: 42px;
  color: #2f8f2f;
}

.security-card h3 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #17201a;
}

.security-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #66746b;
}

@media (max-width: 900px) {
  .security-page {
    padding: 70px 24px;
  }

  .hero h1 {
    font-size: 48px;
  }

  .hero p {
    font-size: 18px;
  }

  .security-card {
    width: 100%;
    max-width: 340px;
  }
}
</style>

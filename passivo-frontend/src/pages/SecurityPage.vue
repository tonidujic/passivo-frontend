<template>
  <q-page class="security-page">
    <div class="hero">
      <div class="hero-badge">
        <q-icon name="verified_user" />
        Security
      </div>

      <h1>Security first.</h1>

      <p>Your vault is protected with end-to-end encryption and zero-knowledge design.</p>
    </div>

    <div class="cards">
      <div class="security-card" v-for="item in security" :key="item.title">
        <div class="icon-box">
          <q-icon :name="item.icon" />
        </div>

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
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--q-primary) 12%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom left,
      color-mix(in srgb, var(--q-secondary) 9%, transparent),
      transparent 30%
    ),
    var(--app-page-bg);

  color: var(--app-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.hero {
  max-width: 850px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  width: fit-content;

  margin: 0 auto 20px;

  padding: 8px 14px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 15%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );

  color: var(--q-primary);

  font-size: 12px;
  font-weight: 800;

  display: flex;
  align-items: center;
  gap: 6px;
}

.hero h1 {
  margin: 0;

  font-size: 64px;
  line-height: 1;

  letter-spacing: -3px;

  font-weight: 900;

  background: linear-gradient(135deg, var(--app-text) 30%, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  margin-top: 24px;

  font-size: 21px;
  line-height: 1.6;

  color: var(--app-text-muted);
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

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 20px 50px color-mix(in srgb, var(--q-primary) 6%, rgba(0, 0, 0, 0.08));

  display: flex;
  flex-direction: column;

  gap: 18px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.security-card:hover {
  transform: translateY(-8px);

  border-color: color-mix(in srgb, var(--q-primary) 35%, var(--app-border));

  box-shadow: 0 25px 60px color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.icon-box {
  width: 64px;
  height: 64px;

  border-radius: 20px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box .q-icon {
  font-size: 36px;
}

.security-card h3 {
  margin: 0;

  font-size: 21px;
  font-weight: 800;

  color: var(--app-text);
}

.security-card p {
  margin: 0;

  font-size: 15px;
  line-height: 1.7;

  color: var(--app-text-muted);
}

.security-card:nth-child(even) .icon-box {
  color: var(--q-secondary);
}

.security-card:nth-child(3) .icon-box {
  color: var(--q-accent);
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

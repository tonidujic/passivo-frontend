<template>
  <q-page class="features-page">
    <div class="hero">
      <div class="hero-badge">
        <q-icon name="auto_awesome" />
        Passivo features
      </div>

      <h1>Everything encrypted. Everything private.</h1>

      <p>
        Passivo helps you securely store passwords, notes, and files with modern end-to-end
        encryption.
      </p>
    </div>

    <div class="cards">
      <div class="info-card" v-for="(item, index) in features" :key="item.title">
        <div class="icon-box" :class="`icon-${index % 3}`">
          <q-icon :name="item.icon" />
        </div>

        <h3>{{ item.title }}</h3>

        <p>{{ item.description }}</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const features = [
  {
    icon: 'vpn_key',
    title: 'Password Vault',
    description: 'Securely store and manage all your passwords.',
  },
  {
    icon: 'note',
    title: 'Secure Notes',
    description: 'Write encrypted private notes accessible only to you.',
  },
  {
    icon: 'upload_file',
    title: 'Encrypted Files',
    description: 'Upload and protect files with AES-GCM encryption.',
  },
  {
    icon: 'star',
    title: 'Favorites',
    description: 'Quickly access your most important vault items.',
  },
  {
    icon: 'shield',
    title: 'Zero-knowledge',
    description: 'Only you can decrypt your data.',
  },
]
</script>

<style scoped>
.features-page {
  min-height: 100vh;

  padding: 90px 70px;

  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--q-primary) 11%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom left,
      color-mix(in srgb, var(--q-secondary) 8%, transparent),
      transparent 30%
    ),
    var(--app-page-bg);

  color: var(--app-text);
}

.hero {
  max-width: 900px;

  margin: 0 auto;

  text-align: center;
}

.hero-badge {
  width: fit-content;

  margin: 0 auto 22px;

  padding: 8px 15px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 15%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;

  gap: 7px;

  font-size: 12px;
  font-weight: 800;
}

.hero h1 {
  margin: 0;

  font-size: 72px;
  line-height: 1;

  letter-spacing: -3px;

  font-weight: 900;

  background: linear-gradient(135deg, var(--app-text) 25%, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  margin-top: 28px;

  font-size: 24px;
  line-height: 1.7;

  color: var(--app-text-muted);
}

.cards {
  display: flex;
  justify-content: center;

  gap: 20px;

  flex-wrap: nowrap;

  margin-top: 70px;
}

.info-card {
  width: 220px;
  min-height: 250px;

  padding: 32px;

  border-radius: 28px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  backdrop-filter: blur(12px);

  border: 1px solid var(--app-border);

  box-shadow: 0 20px 50px color-mix(in srgb, var(--q-primary) 6%, rgba(0, 0, 0, 0.06));

  display: flex;
  flex-direction: column;

  gap: 18px;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.info-card:hover {
  transform: translateY(-8px);

  border-color: color-mix(in srgb, var(--q-primary) 35%, var(--app-border));

  box-shadow: 0 25px 60px color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.icon-box {
  width: 62px;
  height: 62px;

  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );
}

.icon-box .q-icon {
  font-size: 34px;
}

.icon-0 {
  color: var(--q-primary);
}

.icon-1 {
  color: var(--q-secondary);
}

.icon-2 {
  color: var(--q-accent);
}

.info-card h3 {
  margin: 0;

  font-size: 20px;
  font-weight: 800;

  color: var(--app-text);
}

.info-card p {
  margin: 0;

  line-height: 1.7;

  color: var(--app-text-muted);

  font-size: 15px;
}

@media (max-width: 1400px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 900px) {
  .features-page {
    padding: 70px 24px;
  }

  .hero h1 {
    font-size: 48px;
  }

  .hero p {
    font-size: 18px;
  }

  .cards {
    margin-top: 50px;
  }

  .info-card {
    width: 100%;
    max-width: 340px;
  }
}
</style>

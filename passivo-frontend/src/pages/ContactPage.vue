<template>
  <q-page class="contact-page">
    <div class="hero">
      <div class="badge">
        <q-icon name="mail" />
        Get in touch
      </div>

      <h1>Contact Passivo</h1>

      <p>Have questions, feedback, or security concerns? I’d love to hear from you.</p>
    </div>

    <div class="contact-card">
      <div class="contact-item" v-for="(item, index) in contactItems" :key="item.title">
        <div class="icon-box" :class="`icon-${index % 3}`">
          <q-icon :name="item.icon" />
        </div>

        <div>
          <span>{{ item.title }}</span>

          <a v-if="item.href" :href="item.href">
            {{ item.value }}
          </a>

          <p v-else>
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const contactItems = [
  {
    icon: 'mail',
    title: 'Email',
    value: 'tonidujic19@gmail.com',
    href: 'mailto:tonidujic19@gmail.com',
  },
  {
    icon: 'code',
    title: 'GitHub',
    value: 'tonidujic',
  },
  {
    icon: 'schedule',
    title: 'Response time',
    value: 'Usually within 24 hours',
  },
]
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 86px);

  padding: 90px 24px;

  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--q-primary) 12%, transparent),
      transparent 32%
    ),
    radial-gradient(
      circle at bottom left,
      color-mix(in srgb, var(--q-secondary) 8%, transparent),
      transparent 32%
    ),
    var(--app-page-bg);

  color: var(--app-text);
}

.hero {
  text-align: center;

  max-width: 780px;

  margin: 0 auto 55px;
}

.badge {
  width: fit-content;

  margin: 0 auto 22px;

  padding: 9px 16px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 15%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );

  color: var(--q-primary);

  font-weight: 800;

  display: flex;
  align-items: center;

  gap: 8px;
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
  margin: 24px auto 0;

  max-width: 620px;

  font-size: 16px;
  line-height: 1.7;

  color: var(--app-text-muted);
}

.contact-card {
  max-width: 760px;

  margin: 0 auto;

  padding: 18px;

  border-radius: 32px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 24px 70px color-mix(in srgb, var(--q-primary) 8%, rgba(0, 0, 0, 0.06));

  display: grid;

  gap: 14px;
}

.contact-item {
  padding: 24px;

  border-radius: 24px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);

  display: flex;
  align-items: center;

  gap: 18px;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.contact-item:hover {
  transform: translateX(4px);

  border-color: color-mix(in srgb, var(--q-primary) 30%, var(--app-border));

  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 7%, var(--app-surface-2)),
    color-mix(in srgb, var(--q-secondary) 5%, var(--app-surface-2))
  );
}

.icon-box {
  width: 54px;
  height: 54px;

  border-radius: 18px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 13%, transparent)
  );

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 26px;
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

.contact-item span {
  display: block;

  margin-bottom: 4px;

  color: var(--app-text-muted);

  font-size: 13px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.06em;
}

.contact-item p,
.contact-item a {
  margin: 0;

  color: var(--app-text);

  font-size: 20px;
  font-weight: 800;

  text-decoration: none;

  transition: color 0.2s ease;
}

.contact-item a:hover {
  color: var(--q-primary);
}

@media (max-width: 700px) {
  .hero h1 {
    font-size: 46px;
  }

  .contact-item {
    align-items: flex-start;
  }
}
</style>

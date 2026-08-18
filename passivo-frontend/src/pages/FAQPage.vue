<template>
  <q-page class="page">
    <div class="container">
      <div class="faq-badge">
        <q-icon name="help_outline" />
        Help center
      </div>

      <h1>Frequently asked questions</h1>

      <p class="intro">Everything you need to know about Passivo, encryption and your vault.</p>

      <q-expansion-item
        v-for="faq in faqs"
        :key="faq.question"
        :label="faq.question"
        expand-separator
        class="faq"
        header-class="faq-header"
      >
        <div class="answer">
          {{ faq.answer }}
        </div>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup>
const faqs = [
  {
    question: 'Is my data encrypted?',
    answer: 'Yes. All data is encrypted before leaving your device.',
  },
  {
    question: 'Can Passivo see my passwords?',
    answer: 'No. Passivo uses zero-knowledge encryption.',
  },
  {
    question: 'What happens if I forget my password?',
    answer: 'Your encrypted data cannot be recovered without your password.',
  },
  {
    question: 'Are files encrypted too?',
    answer: 'Yes. Files are encrypted using AES-GCM before upload.',
  },
  {
    question: 'Is Passivo free?',
    answer: 'Yes, currently completely free.',
  },
]
</script>

<style scoped>
.page {
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

.container {
  max-width: 950px;

  margin: 0 auto;
}

.faq-badge {
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

  display: flex;
  align-items: center;

  gap: 6px;

  font-size: 12px;
  font-weight: 800;
}

h1 {
  margin: 0;

  text-align: center;

  font-size: 64px;
  line-height: 1;

  letter-spacing: -3px;

  font-weight: 900;

  background: linear-gradient(135deg, var(--app-text) 30%, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.intro {
  max-width: 620px;

  margin: 24px auto 55px;

  text-align: center;

  color: var(--app-text-muted);

  font-size: 18px;
  line-height: 1.6;
}

.faq {
  margin-bottom: 18px;

  border-radius: 28px;

  overflow: hidden;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 20px 50px color-mix(in srgb, var(--q-primary) 6%, rgba(0, 0, 0, 0.08));

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.faq:hover {
  transform: translateY(-5px);

  border-color: color-mix(in srgb, var(--q-primary) 35%, var(--app-border));

  box-shadow: 0 25px 60px color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.faq :deep(.q-expansion-item__container) {
  border-radius: 28px;
}

.faq :deep(.q-item) {
  min-height: 82px;

  padding: 0 28px;

  color: var(--app-text);
}

.faq :deep(.q-item__label) {
  font-size: 1.15rem;

  font-weight: 800;

  color: var(--app-text);
}

.faq :deep(.q-expansion-item__toggle-icon) {
  color: var(--q-primary);

  font-size: 1.25rem;
}

.faq :deep(.q-separator) {
  background: color-mix(in srgb, var(--q-primary) 12%, var(--app-border));
}

.faq :deep(.q-expansion-item--expanded .q-item) {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 11%, transparent),
    color-mix(in srgb, var(--q-secondary) 8%, transparent)
  );
}

.faq:nth-of-type(even) :deep(.q-expansion-item__toggle-icon) {
  color: var(--q-secondary);
}

.answer {
  padding: 5px 28px 28px;

  color: var(--app-text-muted);

  font-size: 1rem;

  line-height: 1.8;
}

@media (max-width: 900px) {
  .page {
    padding: 70px 24px;
  }

  h1 {
    font-size: 48px;
  }

  .intro {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .faq :deep(.q-item__label) {
    font-size: 1rem;
  }
}
</style>

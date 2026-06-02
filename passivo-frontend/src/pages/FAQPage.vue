<template>
  <q-page class="page">
    <div class="container">
      <h1>Frequently asked questions</h1>

      <q-expansion-item v-for="faq in faqs" :key="faq.question" :label="faq.question" class="faq">
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
  min-height: 100vh;
  background: #f6f8f6;
  padding: 70px 24px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  font-size: 54px;
  font-weight: 900;
  margin-bottom: 40px;
}

.faq {
  margin-bottom: 18px;
  border-radius: 18px;
  background: white;
  padding: 8px 18px;
}

.answer {
  padding: 12px 0 18px;
  color: #66746b;
  line-height: 1.7;
}
</style>

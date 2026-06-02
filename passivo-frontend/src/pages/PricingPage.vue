<!-- PricingPage.vue -->
<template>
  <q-page class="page">
    <div class="container">
      <h1>Simple pricing.</h1>

      <div class="pricing-card">
        <h2>Free Plan</h2>

        <div class="price">$0</div>

        <ul>
          <li>Unlimited passwords</li>
          <li>Secure notes</li>
          <li>Encrypted files</li>
          <li>End-to-end encryption</li>
          <li>Zero-knowledge security</li>
          <li>Cross-device session restore</li>
        </ul>

        <q-btn unelevated label="Get started" class="btn" to="/auth/signup" />
      </div>

      <p class="bottom-text">Passivo is currently completely free.</p>
    </div>
  </q-page>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f8f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.container {
  text-align: center;
}

h1 {
  font-size: 58px;
  font-weight: 900;
  margin-bottom: 40px;
}

.pricing-card {
  width: 420px;
  max-width: 100%;
  padding: 40px;
  border-radius: 28px;
  background: white;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
}

.price {
  font-size: 70px;
  font-weight: 900;
  color: #2f8f2f;
  margin: 20px 0;
}

ul {
  text-align: left;
  padding-left: 20px;
  line-height: 2;
  color: #66746b;
}

.btn {
  margin-top: 30px;
  width: 100%;
  height: 50px;
  border-radius: 14px;
  background: #2f8f2f;
  color: white;
  font-weight: 800;
}

.bottom-text {
  margin-top: 30px;
  color: #66746b;
}
</style>

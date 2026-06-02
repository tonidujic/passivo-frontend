<template>
  <q-page class="features-page">
    <div class="hero">
      <h1>Everything encrypted. Everything private.</h1>

      <p>
        Passivo helps you securely store passwords, notes, and files with modern end-to-end
        encryption.
      </p>
    </div>

    <div class="cards">
      <div class="info-card">
        <q-icon name="vpn_key" />

        <h3>Password Vault</h3>

        <p>Securely store and manage all your passwords.</p>
      </div>

      <div class="info-card">
        <q-icon name="note" />

        <h3>Secure Notes</h3>

        <p>Write encrypted private notes accessible only to you.</p>
      </div>

      <div class="info-card">
        <q-icon name="upload_file" />

        <h3>Encrypted Files</h3>

        <p>Upload and protect files with AES-GCM encryption.</p>
      </div>

      <div class="info-card">
        <q-icon name="star" />

        <h3>Favorites</h3>

        <p>Quickly access your most important vault items.</p>
      </div>

      <div class="info-card">
        <q-icon name="shield" />

        <h3>Zero-knowledge</h3>

        <p>Only you can decrypt your data.</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.features-page {
  min-height: 100vh;
  padding: 90px 70px;
  background:
    radial-gradient(circle at top right, rgba(47, 143, 47, 0.1), transparent 30%), #f6f8f6;
}

.hero {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.hero h1 {
  margin: 0;
  font-size: 72px;
  line-height: 1;
  letter-spacing: -3px;
  font-weight: 900;
  color: #17201a;
}

.hero p {
  margin-top: 28px;
  font-size: 24px;
  line-height: 1.7;
  color: #66746b;
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(20, 40, 30, 0.08);

  display: flex;
  flex-direction: column;
  gap: 18px;

  transition: 0.25s ease;
}

.info-card:hover {
  transform: translateY(-8px);
}

.info-card .q-icon {
  font-size: 42px;
  color: #2f8f2f;
}

.info-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #17201a;
}

.info-card p {
  margin: 0;
  line-height: 1.7;
  color: #66746b;
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

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
      <div class="contact-item">
        <div class="icon-box">
          <q-icon name="mail" />
        </div>

        <div>
          <span>Email</span>
          <a href="mailto:tonidujic19@gmail.com">tonidujic19@gmail.com</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="icon-box">
          <q-icon name="code" />
        </div>

        <div>
          <span>GitHub</span>
          <p>tonidujic</p>
        </div>
      </div>

      <div class="contact-item">
        <div class="icon-box">
          <q-icon name="schedule" />
        </div>

        <div>
          <span>Response time</span>
          <p>Usually within 24 hours</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.contact-page {
  min-height: calc(100vh - 86px);
  padding: 90px 24px;
  background:
    radial-gradient(circle at top right, rgba(47, 143, 47, 0.12), transparent 32%), #f6f8f6;
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
  background: rgba(47, 143, 47, 0.12);
  color: #2f8f2f;
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
  color: #17201a;
}

.hero p {
  margin: 24px auto 0;
  max-width: 620px;
  font-size: 16px;
  line-height: 1.7;
  color: #66746b;
}

.contact-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 18px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 70px rgba(20, 40, 30, 0.09);
  display: grid;
  gap: 14px;
}

.contact-item {
  padding: 24px;
  border-radius: 24px;
  background: #f8fbf8;
  display: flex;
  align-items: center;
  gap: 18px;
}

.icon-box {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: rgba(47, 143, 47, 0.12);
  color: #2f8f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.contact-item span {
  display: block;
  margin-bottom: 4px;
  color: #66746b;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.contact-item p,
.contact-item a {
  margin: 0;
  color: #17201a;
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
}

.contact-item a:hover {
  color: #2f8f2f;
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

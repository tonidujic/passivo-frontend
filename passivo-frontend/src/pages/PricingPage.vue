<template>
  <q-page class="page">
    <div class="container">
      <div class="pricing-badge">
        <q-icon name="verified" />
        Simple and transparent
      </div>

      <h1>Simple pricing.</h1>

      <p class="hero-text">Everything you need to secure your digital data.</p>

      <div class="pricing-card">
        <div class="plan-header">
          <h2>Free Plan</h2>

          <span class="plan-badge"> Current plan </span>
        </div>

        <div class="price">$0</div>

        <div class="price-subtitle">Free forever</div>

        <ul>
          <li>
            <q-icon name="check_circle" />
            Unlimited passwords
          </li>

          <li>
            <q-icon name="check_circle" />
            Secure notes
          </li>

          <li>
            <q-icon name="check_circle" />
            Encrypted files
          </li>

          <li>
            <q-icon name="check_circle" />
            End-to-end encryption
          </li>

          <li>
            <q-icon name="check_circle" />
            Zero-knowledge security
          </li>

          <li>
            <q-icon name="check_circle" />
            Cross-device session restore
          </li>
        </ul>

        <q-btn unelevated label="Get started" class="btn" to="/auth/signup" />
      </div>

      <p class="bottom-text">Passivo is currently completely free.</p>
    </div>
  </q-page>
</template>

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
  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  text-align: center;
}

.pricing-badge {
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

  font-size: 64px;
  line-height: 1;

  letter-spacing: -3px;

  font-weight: 900;

  background: linear-gradient(135deg, var(--app-text) 30%, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-text {
  margin: 24px auto 45px;

  max-width: 620px;

  font-size: 18px;
  line-height: 1.6;

  color: var(--app-text-muted);
}

.pricing-card {
  width: 420px;
  max-width: 100%;

  padding: 40px;

  margin: 0 auto;

  border-radius: 28px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 20px 50px color-mix(in srgb, var(--q-primary) 6%, rgba(0, 0, 0, 0.08));

  position: relative;
  overflow: hidden;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);

  border-color: color-mix(in srgb, var(--q-primary) 35%, var(--app-border));

  box-shadow: 0 25px 60px color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.pricing-card::before {
  content: '';

  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 5px;

  background: linear-gradient(90deg, var(--q-primary), var(--q-secondary), var(--q-accent));
}

.plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plan-header h2 {
  margin: 0;

  color: var(--app-text);

  font-size: 24px;
  font-weight: 900;
}

.plan-badge {
  padding: 6px 10px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 15%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );

  color: var(--q-primary);

  font-size: 11px;
  font-weight: 800;
}

.price {
  font-size: 70px;
  font-weight: 900;

  margin: 20px 0 0;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price-subtitle {
  color: var(--app-text-muted);

  font-size: 13px;
  font-weight: 700;

  margin-bottom: 25px;
}

ul {
  list-style: none;

  text-align: left;

  padding: 0;
  margin: 0;

  color: var(--app-text-muted);
}

li {
  min-height: 42px;

  display: flex;
  align-items: center;

  gap: 10px;

  font-weight: 600;
}

li .q-icon {
  color: var(--q-primary);

  font-size: 20px;
}

li:nth-child(even) .q-icon {
  color: var(--q-secondary);
}

li:nth-child(3n) .q-icon {
  color: var(--q-accent);
}

.btn {
  margin-top: 30px;

  width: 100%;
  height: 52px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 14px 30px color-mix(in srgb, var(--q-primary) 24%, transparent);
}

.bottom-text {
  margin-top: 30px;

  color: var(--app-text-muted);
}

@media (max-width: 700px) {
  .page {
    padding: 70px 24px;
  }

  h1 {
    font-size: 48px;
  }

  .hero-text {
    font-size: 18px;
  }

  .pricing-card {
    padding: 30px 24px;
  }
}
</style>

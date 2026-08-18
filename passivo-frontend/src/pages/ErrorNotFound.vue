<template>
  <q-page class="error-page">
    <div class="error-card">
      <div class="error-icon">
        <q-icon name="search_off" />
      </div>

      <h1>404</h1>

      <h2>Page not found</h2>

      <p>The page you are looking for does not exist or has been moved.</p>

      <q-btn unelevated icon="home" label="Back home" to="/" class="home-btn" />
    </div>
  </q-page>
</template>

<style scoped>
.error-page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;

  background:
    radial-gradient(
      circle at 70% 20%,
      color-mix(in srgb, var(--q-primary) 13%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at 25% 80%,
      color-mix(in srgb, var(--q-secondary) 10%, transparent),
      transparent 35%
    ),
    var(--app-page-bg);

  color: var(--app-text);
}

.error-card {
  width: 520px;

  max-width: 100%;

  padding: 50px;

  border-radius: 32px;

  text-align: center;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 4%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 25px 70px color-mix(in srgb, var(--q-primary) 9%, rgba(0, 0, 0, 0.08));
}

.error-icon {
  width: 72px;
  height: 72px;

  margin: 0 auto 18px;

  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 16%, transparent)
  );

  color: var(--q-primary);

  font-size: 36px;
}

h1 {
  margin: 0;

  font-size: 90px;
  line-height: 1;

  font-weight: 950;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary), var(--q-accent));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  margin: 18px 0 8px;

  font-size: 28px;

  color: var(--app-text);
}

p {
  margin: 0 auto 28px;

  max-width: 350px;

  color: var(--app-text-muted);

  line-height: 1.7;
}

.home-btn {
  height: 50px;

  padding: 0 24px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 14px 28px color-mix(in srgb, var(--q-primary) 22%, transparent);
}
</style>

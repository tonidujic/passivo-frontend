<template>
  <q-card class="auth-card">
    <q-card-section class="auth-header">
      <h1>Welcome back</h1>

      <p>Sign in to access your secure vault</p>
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="login">
        <q-input
          v-model="email"
          outlined
          label="Email"
          color="primary"
          type="email"
          autocomplete="email"
        >
          <template #prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          outlined
          label="Password"
          color="primary"
          :type="show ? 'text' : 'password'"
          autocomplete="current-password"
        >
          <template #prepend>
            <q-icon name="lock_outline" />
          </template>

          <template #append>
            <q-icon
              :name="show ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="show = !show"
            />
          </template>
        </q-input>

        <div class="row items-center justify-between">
          <q-checkbox v-model="remember" label="Remember me" color="primary" />
        </div>

        <q-btn
          unelevated
          type="submit"
          class="full-width main-btn"
          label="Sign in"
          :loading="loading"
          :disable="loading"
        />
      </q-form>

      <p class="switch">
        Don’t have an account?

        <router-link to="/auth/signup"> Sign up </router-link>
      </p>

      <q-banner v-if="errorMessage" dense rounded class="error-banner q-mt-md">
        {{ errorMessage }}
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { useThemeStore } from 'src/stores/themeStore'

const router = useRouter()

const auth = useAuthStore()
const theme = useThemeStore()

const email = ref('')
const password = ref('')

const remember = ref(false)
const show = ref(false)
const loading = ref(false)

const errorMessage = ref('')

onMounted(() => {
  const rememberedEmail = localStorage.getItem('passivoRememberedEmail')

  if (rememberedEmail) {
    email.value = rememberedEmail
    remember.value = true
  }
})

async function login() {
  errorMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Email is required'
    return
  }

  if (!password.value) {
    errorMessage.value = 'Password is required'
    return
  }

  loading.value = true

  try {
    await auth.logIn({
      email: email.value.trim(),
      password: password.value,
      remember: remember.value,
    })

    if (remember.value) {
      localStorage.setItem('passivoRememberedEmail', email.value.trim())
    } else {
      localStorage.removeItem('passivoRememberedEmail')
    }

    theme.loadTheme(auth.user)

    await router.push('/dashboard/vault')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  width: 460px;

  padding: 36px;

  border-radius: 24px;

  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--q-primary) 5%, var(--app-surface)),
    color-mix(in srgb, var(--q-secondary) 4%, var(--app-surface))
  );

  backdrop-filter: blur(14px);

  border: 1px solid var(--app-border);

  box-shadow: 0 20px 50px color-mix(in srgb, var(--q-primary) 7%, rgba(0, 0, 0, 0.08));

  color: var(--app-text);

  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.auth-header {
  padding-bottom: 8px;
}

h1 {
  margin: 0;

  font-size: 32px;
  font-weight: 800;

  color: var(--app-text);
}

p {
  color: var(--app-text-muted);
}

.main-btn {
  height: 52px;

  border-radius: 12px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 12px 25px color-mix(in srgb, var(--q-primary) 22%, transparent);
}

.switch {
  text-align: center;

  margin-top: 28px;
}

a {
  color: var(--q-primary);

  font-weight: 700;

  text-decoration: none;

  transition: color 0.2s ease;
}

a:hover {
  color: var(--q-secondary);
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: var(--app-text);
}

:deep(.q-field__label) {
  color: var(--app-text-muted);
}

:deep(.q-field__prepend),
:deep(.q-field__append) {
  color: var(--q-primary);
}

:deep(.q-checkbox__label) {
  color: var(--app-text-muted);
}

.error-banner {
  background: color-mix(in srgb, #ef4444 10%, var(--app-surface));

  color: #ef4444;

  border: 1px solid color-mix(in srgb, #ef4444 20%, transparent);
}
</style>

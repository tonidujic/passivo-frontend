<template>
  <q-card class="auth-card">
    <q-card-section class="auth-header">
      <h1>Create your account</h1>

      <p>Start securing your data today</p>
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="handleSignUp">
        <q-input v-model="fullName" outlined label="Full name" color="primary">
          <template #prepend>
            <q-icon name="person_outline" />
          </template>
        </q-input>

        <q-input v-model="email" outlined label="Email" type="email" color="primary">
          <template #prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          outlined
          label="Password"
          color="primary"
          :type="showPassword ? 'text' : 'password'"
        >
          <template #prepend>
            <q-icon name="lock_outline" />
          </template>

          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-input
          v-model="confirmPassword"
          outlined
          label="Confirm password"
          color="primary"
          :type="showPassword ? 'text' : 'password'"
        >
          <template #prepend>
            <q-icon name="lock_outline" />
          </template>

          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-checkbox v-model="terms" color="primary">
          <span>
            I agree to the

            <a href="#"> Terms of Service </a>

            and

            <a href="#"> Privacy Policy </a>
          </span>
        </q-checkbox>

        <q-btn unelevated type="submit" class="full-width main-btn" label="CREATE ACCOUNT" />
      </q-form>

      <p class="switch">
        Already have an account?

        <router-link to="/auth/login"> Sign in </router-link>
      </p>

      <q-banner v-if="errorMessage" dense rounded class="error-banner q-mt-md">
        {{ errorMessage }}
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useAuthStore } from 'src/stores/authStore'
import { useThemeStore } from 'src/stores/themeStore'

import { signUpSchema } from 'src/validators/authValidator'

const router = useRouter()

const auth = useAuthStore()
const theme = useThemeStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const terms = ref(false)
const showPassword = ref(false)

const errorMessage = ref('')

async function handleSignUp() {
  errorMessage.value = ''

  const payload = {
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  }

  const result = signUpSchema.safeParse(payload)

  if (!result.success) {
    errorMessage.value = result.error.issues[0]?.message || 'Please check your information'

    return
  }

  try {
    if (!terms.value) {
      throw new Error('You have to agree to the Terms of Service and Privacy Policy to use Passivo')
    }

    const { ...signUpData } = result.data

    await auth.signUp(signUpData)

    theme.loadTheme(auth.user)

    await router.push('/dashboard/vault')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Signup failed'
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
  height: 54px;

  border-radius: 12px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 12px 25px color-mix(in srgb, var(--q-primary) 22%, transparent);
}

.switch {
  text-align: center;

  margin-top: 28px;

  font-size: 14px;
}

a {
  color: var(--q-primary);

  font-weight: 700;

  text-decoration: none;
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

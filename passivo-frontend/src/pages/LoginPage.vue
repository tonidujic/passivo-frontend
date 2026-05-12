<template>
  <q-card class="auth-card">
    <q-card-section>
      <h1>Welcome back</h1>
      <p>Sign in to access your secure vault</p>
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="login">
        <q-input outlined label="Email" v-model="email">
          <template #prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input outlined label="Password" v-model="password" :type="show ? 'text' : 'password'">
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
          <q-checkbox v-model="remember" label="Remember me" color="green" />
          <router-link to="/forgot-password">Forgot password?</router-link>
        </div>

        <q-btn unelevated type="submit" class="full-width main-btn" label="Sign in" />
      </q-form>

      <p class="switch">
        Don’t have an account?
        <router-link to="/auth/signup">Sign up</router-link>
      </p>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAuthStore } from 'src/stores/authStore'
import { ref } from 'vue'
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const remember = ref(true)
const show = ref(false)

async function login() {
  await auth.logIn({
    email: email.value,
    password: password.value,
  })

  router.push('/dashboard/vault')
}
</script>

<style scoped>
.auth-card {
  width: 460px;
  padding: 36px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.55);

  backdrop-filter: blur(12px);

  border: 1px solid rgba(0, 0, 0, 0.05);

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #17201a;
}

p {
  color: #6d776f;
}

.main-btn {
  height: 52px;
  border-radius: 10px;
  background: #2f8f2f;
  color: white;
  font-weight: 700;
}

.switch {
  text-align: center;
  margin-top: 28px;
}

a {
  color: #2f8f2f;
  font-weight: 700;
  text-decoration: none;
}
</style>

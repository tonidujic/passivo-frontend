<template>
  <q-card class="auth-card">
    <q-card-section>
      <h1>Create your account</h1>
      <p>Start securing your data today</p>
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="createAccount">
        <q-input outlined v-model="fullName" label="Full name">
          <template #prepend>
            <q-icon name="person_outline" />
          </template>
        </q-input>

        <q-input outlined v-model="email" label="Email" type="email">
          <template #prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="password"
          label="Password"
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
          outlined
          v-model="confirmPassword"
          label="Confirm password"
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

        <q-checkbox v-model="terms" color="green">
          <span>
            I agree to the
            <a href="#">Terms of Service</a>
            and
            <a href="#">Privacy Policy</a>
          </span>
        </q-checkbox>

        <q-btn unelevated type="submit" class="full-width main-btn" label="CREATE ACCOUNT" />
      </q-form>

      <p class="switch">
        Already have an account?
        <router-link to="/auth/login">Sign in</router-link>
      </p>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAuthStore } from 'src/stores/authStore'
const auth = useAuthStore()
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const terms = ref(false)
const showPassword = ref(false)
const createAccount = async () => {
  if (terms.value) {
    await auth.signUp({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })

    router.push('/dashboard/vault')
  }
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
  color: #69746d;
}

.main-btn {
  height: 54px;
  border-radius: 10px;
  background: #2f8f2f;
  color: white;
  font-weight: 700;
}

.switch {
  text-align: center;
  margin-top: 28px;
  font-size: 14px;
}

a {
  color: #2f8f2f;
  font-weight: 700;
  text-decoration: none;
}
</style>

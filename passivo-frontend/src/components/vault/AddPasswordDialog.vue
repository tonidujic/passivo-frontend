<template>
  <q-dialog v-model="dialogModel">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <h2>Add password</h2>
        <p>Save website credentials securely.</p>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input outlined dense v-model="form.title" label="Title">
            <template #prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-input outlined dense v-model="form.website" label="Website URL">
            <template #prepend>
              <q-icon name="language" />
            </template>
          </q-input>

          <q-input outlined dense v-model="form.username" label="Username / Email">
            <template #prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            v-model="form.password"
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

          <div class="actions">
            <q-btn flat label="Cancel" class="cancel-btn" v-close-popup />
            <q-btn unelevated type="submit" label="Save password" class="save-btn" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const showPassword = ref(false)

const form = ref({
  title: '',
  website: '',
  username: '',
  password: '',
  favorite: '',
})

async function submit() {
  emit('submit', { ...form.value })

  form.value = {
    title: '',
    website: '',
    username: '',
    password: '',
  }

  dialogModel.value = false
}
</script>
<style scoped>
.dialog-card {
  width: 520px;
  max-width: 95vw;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px rgba(24, 42, 31, 0.18);
}

.dialog-header {
  padding-bottom: 8px;
}

h2 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
  color: #17201a;
}

p {
  margin-top: 8px;
  color: #6c766f;
  font-size: 15px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.cancel-btn {
  color: #5c6b61;
  font-weight: 700;
}

.save-btn {
  height: 44px;
  padding: 0 20px;
  background: #2f8f2f;
  color: white;
  border-radius: 12px;
  font-weight: 800;
}
</style>

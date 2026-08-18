<template>
  <q-dialog v-model="dialogModel">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <div class="dialog-icon">
          <q-icon name="vpn_key" />
        </div>

        <div>
          <h2>Add password</h2>

          <p>Save website credentials securely.</p>
        </div>
      </q-card-section>

      <q-card-section class="dialog-content">
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input
            outlined
            dense
            v-model="form.title"
            label="Title"
            color="primary"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            v-model="form.website"
            label="Website URL"
            color="primary"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="language" />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            v-model="form.username"
            label="Username / Email"
            color="primary"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            v-model="form.password"
            label="Password"
            color="primary"
            class="dialog-input"
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

          <div class="security-info">
            <q-icon name="verified_user" />

            <span> Credentials are encrypted before leaving your device. </span>
          </div>

          <div class="actions">
            <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />

            <q-btn
              unelevated
              no-caps
              type="submit"
              icon="lock"
              label="Save password"
              class="save-btn"
            />
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
  emit('submit', {
    ...form.value,
  })

  form.value = {
    title: '',
    website: '',
    username: '',
    password: '',
    favorite: '',
  }

  showPassword.value = false

  dialogModel.value = false
}
</script>

<style scoped>
.dialog-card {
  width: 520px;
  max-width: 95vw;

  padding: 20px;

  border-radius: 28px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  color: var(--app-text);

  border: 1px solid color-mix(in srgb, var(--q-primary) 15%, var(--app-border));

  backdrop-filter: blur(18px);

  box-shadow: 0 30px 90px color-mix(in srgb, var(--q-primary) 12%, rgba(0, 0, 0, 0.25));
}

.dialog-header {
  padding-bottom: 14px;

  display: flex;
  align-items: center;

  gap: 16px;
}

.dialog-icon {
  width: 56px;
  height: 56px;

  flex-shrink: 0;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 27px;

  color: var(--q-primary);

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );
}

h2 {
  margin: 0;

  font-size: 30px;
  font-weight: 900;

  color: var(--app-text);
}

p {
  margin: 6px 0 0;

  color: var(--app-text-muted);

  font-size: 15px;
}

.dialog-content {
  padding-top: 12px;
}

.dialog-input :deep(.q-field__control) {
  border-radius: 14px;

  background: color-mix(in srgb, var(--q-primary) 2%, var(--app-surface-2));

  color: var(--app-text);
}

.dialog-input :deep(.q-field__native),
.dialog-input :deep(.q-field__input) {
  color: var(--app-text);
}

.dialog-input :deep(.q-field__label) {
  color: var(--app-text-muted);
}

.dialog-input :deep(.q-field__prepend) {
  color: var(--q-primary);
}

.dialog-input :deep(.q-field__append) {
  color: var(--q-secondary);
}

.dialog-input :deep(.q-field--outlined .q-field__control::before) {
  border-color: var(--app-border);
}

.dialog-input :deep(.q-field--outlined:hover .q-field__control::before) {
  border-color: color-mix(in srgb, var(--q-primary) 45%, var(--app-border));
}

.dialog-input :deep(.q-field--focused .q-field__control::after) {
  border-color: var(--q-primary);
}

.security-info {
  padding: 12px 14px;

  border-radius: 14px;

  display: flex;
  align-items: center;

  gap: 8px;

  color: var(--app-text-muted);

  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 8%, transparent),
    color-mix(in srgb, var(--q-secondary) 5%, transparent)
  );

  font-size: 12px;
  font-weight: 700;
}

.security-info .q-icon {
  color: var(--q-primary);
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 12px;

  margin-top: 18px;
}

.cancel-btn {
  min-height: 46px;

  padding: 0 18px;

  border-radius: 14px;

  color: var(--app-text-muted);

  font-weight: 800;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.cancel-btn:hover {
  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 8%, transparent);
}

.save-btn {
  min-height: 46px;

  padding: 0 22px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 900;

  box-shadow: 0 12px 28px color-mix(in srgb, var(--q-primary) 22%, transparent);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-1px);

  box-shadow: 0 16px 34px color-mix(in srgb, var(--q-primary) 28%, transparent);
}

@media (max-width: 550px) {
  .dialog-card {
    padding: 14px;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>

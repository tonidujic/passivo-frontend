<template>
  <q-dialog v-model="model">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <div class="dialog-icon">
          <q-icon name="sticky_note_2" />
        </div>

        <div>
          <h2>Add note</h2>
          <p>Write and encrypt a private note securely.</p>
        </div>
      </q-card-section>

      <q-card-section class="dialog-content">
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input
            outlined
            v-model="form.title"
            label="Note title"
            color="primary"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-editor
            v-model="form.content"
            min-height="240px"
            placeholder="Write your secure note..."
            class="editor"
            :toolbar="[
              ['bold', 'italic', 'underline', 'strike'],
              ['unordered', 'ordered'],
              ['quote', 'hr'],
              ['undo', 'redo'],
              ['viewsource'],
            ]"
          />

          <div class="security-info">
            <q-icon name="lock" />

            <span> Your note is encrypted before being stored. </span>
          </div>

          <div class="actions">
            <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />

            <q-btn
              unelevated
              no-caps
              type="submit"
              icon="lock"
              label="Save note"
              class="save-btn"
              :disable="!form.content"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const model = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    model.value = val
  },
)

watch(model, (val) => {
  emit('update:modelValue', val)
})

const form = ref({
  title: '',
  content: '',
})

function submit() {
  emit('submit', {
    title: form.value.title || 'Untitled note',
    content: form.value.content,
  })

  form.value = {
    title: '',
    content: '',
  }

  model.value = false
}
</script>

<style scoped>
.dialog-card {
  width: 750px;
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

  box-shadow: 0 30px 90px color-mix(in srgb, var(--q-primary) 12%, rgba(0, 0, 0, 0.25));
}

.dialog-header {
  display: flex;
  align-items: center;

  gap: 16px;

  padding-bottom: 14px;
}

.dialog-icon {
  width: 58px;
  height: 58px;

  flex-shrink: 0;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;

  color: var(--q-accent);

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-accent) 18%, transparent),
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

  font-size: 14px;
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

.dialog-input :deep(.q-field--outlined .q-field__control::before) {
  border-color: var(--app-border);
}

.dialog-input :deep(.q-field--focused .q-field__control::after) {
  border-color: var(--q-primary);
}

.editor {
  border-radius: 16px;

  overflow: hidden;

  border: 1px solid var(--app-border);

  background: var(--app-surface-2);

  color: var(--app-text);
}

.editor :deep(.q-editor__toolbar) {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 9%, var(--app-surface-2)),
    color-mix(in srgb, var(--q-secondary) 7%, var(--app-surface-2))
  );

  border-bottom: 1px solid var(--app-border);

  color: var(--app-text);
}

.editor :deep(.q-editor__toolbar .q-btn) {
  color: var(--app-text-muted);
}

.editor :deep(.q-editor__toolbar .q-btn:hover) {
  color: var(--q-primary);
}

.editor :deep(.q-editor__content) {
  background: var(--app-surface);

  color: var(--app-text);
}

.editor :deep(.q-editor__content:focus) {
  outline: none;
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
  align-items: center;
  justify-content: flex-end;

  gap: 12px;

  margin-top: 16px;
}

.cancel-btn {
  min-height: 46px;

  padding: 0 18px;

  border-radius: 14px;

  color: var(--app-text-muted);

  font-weight: 800;
}

.save-btn {
  min-height: 46px;

  padding: 0 22px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 900;

  box-shadow: 0 12px 28px color-mix(in srgb, var(--q-primary) 22%, transparent);
}

.save-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 650px) {
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

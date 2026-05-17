<template>
  <q-dialog v-model="model">
    <q-card class="dialog-card">
      <q-card-section>
        <h2>Add note</h2>
        <p>Write and encrypt a private note securely.</p>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input outlined v-model="form.title" label="Note title">
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

          <div class="actions">
            <q-btn flat label="Cancel" v-close-popup />

            <q-btn
              unelevated
              type="submit"
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
  border-radius: 24px;
  padding: 20px;
}

h2 {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  color: #17201a;
}

p {
  margin-top: 8px;
  color: #6c766f;
  font-size: 14px;
}

.editor {
  border-radius: 16px;
  overflow: hidden;
  background: white;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.save-btn {
  background: #2f8f2f;
  color: white;
  border-radius: 12px;
  font-weight: 800;
}
</style>

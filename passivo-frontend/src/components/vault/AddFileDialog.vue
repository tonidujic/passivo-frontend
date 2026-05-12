<template>
  <q-dialog v-model="model">
    <q-card class="dialog-card">
      <q-card-section>
        <h2>Add file</h2>
        <p>Upload and encrypt a file securely.</p>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input outlined v-model="title" label="File title">
            <template #prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-file outlined v-model="file" label="Choose file">
            <template #prepend>
              <q-icon name="upload_file" />
            </template>
          </q-file>

          <div class="actions">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn unelevated type="submit" label="Save file" class="save-btn" :disable="!file" />
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
  (val) => (model.value = val),
)

watch(model, (val) => emit('update:modelValue', val))

const title = ref('')
const file = ref(null)

function submit() {
  emit('save', {
    title: title.value || file.value?.name,
    file: file.value,
  })

  title.value = ''
  file.value = null
  model.value = false
}
</script>

<style scoped>
.dialog-card {
  width: 500px;
  max-width: 95vw;
  padding: 20px;
  border-radius: 18px;
}

h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

p {
  color: #6c766f;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-btn {
  background: #2f8f2f;
  color: white;
  border-radius: 10px;
  font-weight: 700;
}
</style>

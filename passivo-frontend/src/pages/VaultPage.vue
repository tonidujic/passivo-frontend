<template>
  <q-page class="vault-page">
    <div class="vault-shell">
      <main class="vault-main">
        <q-inner-loading :showing="loading" class="vault-loader">
          <q-spinner color="primary" size="42px" />
        </q-inner-loading>

        <div class="hero">
          <div class="hero-content">
            <div class="hero-badge">
              <q-icon name="lock" />
              End-to-end encrypted
            </div>

            <h1>Vault</h1>

            <p>
              Manage your saved passwords, private notes, and encrypted files in one secure place.
            </p>
          </div>

          <div class="hero-right">
            <div class="hero-card">
              <strong>{{ vault.items.length }}</strong>
              <span>secured items</span>
            </div>

            <q-btn unelevated icon="add" label="New item" class="add-btn">
              <q-menu anchor="bottom right" self="top right" class="new-item-menu">
                <q-list>
                  <q-item clickable v-close-popup @click="passwordDialog = true" class="menu-item">
                    <q-item-section avatar>
                      <div class="icon-box">
                        <q-icon name="vpn_key" />
                      </div>
                    </q-item-section>

                    <q-item-section>
                      <div class="title">Password</div>
                      <div class="subtitle">Save login credentials</div>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="fileDialog = true" class="menu-item">
                    <q-item-section avatar>
                      <div class="icon-box">
                        <q-icon name="upload_file" />
                      </div>
                    </q-item-section>

                    <q-item-section>
                      <div class="title">File</div>
                      <div class="subtitle">Upload encrypted file</div>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="notesDialog = true" class="menu-item">
                    <q-item-section avatar>
                      <div class="icon-box">
                        <q-icon name="notes" />
                      </div>
                    </q-item-section>

                    <q-item-section>
                      <div class="title">Notes</div>
                      <div class="subtitle">Write encrypted notes</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <q-input
          outlined
          v-model="vault.search"
          placeholder="Search anything..."
          class="search-input"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="type-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'type-tab',
              {
                active: vault.selectedType === tab.value,
              },
            ]"
            @click="vault.selectedType = tab.value"
          >
            <q-icon :name="tab.icon" />
            {{ tab.label }}
          </button>
        </div>

        <div class="items">
          <VaultItem
            v-for="item in vault.filteredItems"
            :key="item.id"
            :item="item"
            @click-more="handleMore"
            @toggle-favorite="vault.toggleFavorite"
            @copy-password="vault.copyPassword"
            @copy-username="vault.copyUsername"
            @open-website="vault.openWebsite"
            @delete-item="vault.deleteItem"
            @download-file="vault.downloadFile"
          />
        </div>
      </main>

      <aside class="vault-side">
        <div class="side-card">
          <div class="side-header">
            <div>
              <h3>Password generator</h3>
              <p>Create strong passwords instantly</p>
            </div>

            <div class="side-icon">
              <q-icon name="password" />
            </div>
          </div>

          <div class="generated-password">
            {{ generatedPassword }}
          </div>

          <div class="generator-row">
            <span>Length</span>
            <strong>{{ passwordLength }}</strong>
          </div>

          <q-slider
            v-model="passwordLength"
            :min="8"
            :max="32"
            color="primary"
            @update:model-value="generatePassword"
          />

          <q-toggle
            v-model="useNumbers"
            label="Numbers"
            color="primary"
            @update:model-value="generatePassword"
          />

          <q-toggle
            v-model="useSymbols"
            label="Symbols"
            color="secondary"
            @update:model-value="generatePassword"
          />

          <q-toggle
            v-model="useUppercase"
            label="Uppercase"
            color="accent"
            @update:model-value="generatePassword"
          />

          <div class="generator-actions">
            <q-btn unelevated class="generate-btn" @click="generatePassword">
              <q-icon name="refresh" size="20px" />
              <span>Regenerate</span>
            </q-btn>

            <q-btn round flat class="copy-btn" @click="copyGeneratedPassword">
              <q-icon name="content_copy" size="20px" />
            </q-btn>
          </div>
        </div>
      </aside>

      <AddPasswordDialog v-model="passwordDialog" @submit="vault.addPasswordItem" />

      <AddFileDialog v-model="fileDialog" @submit="vault.addFileItem" />

      <AddNoteDialog v-model="notesDialog" @submit="vault.addNoteItem" />

      <q-dialog v-model="revealDialog">
        <q-card class="reveal-card">
          <div class="reveal-icon">
            <q-icon name="lock_open" />
          </div>

          <h2>Saved password</h2>

          <p class="reveal-subtitle">Your decrypted password is shown below.</p>

          <div class="password-box">
            <span>{{ revealedPassword }}</span>

            <q-btn flat round dense icon="content_copy" @click="copyPassword" />
          </div>

          <q-btn unelevated label="Close" class="close-btn" v-close-popup />
        </q-card>
      </q-dialog>

      <q-dialog v-model="filePreviewDialog">
        <q-card class="file-preview-card">
          <img
            v-if="filePreviewType?.startsWith('image/')"
            :src="filePreviewUrl"
            class="file-preview-image"
          />

          <iframe
            v-else-if="filePreviewType === 'application/pdf'"
            :src="filePreviewUrl"
            class="file-preview-pdf"
          />

          <div v-else class="file-preview-empty">Preview not available</div>

          <q-btn unelevated label="Close" class="close-btn" v-close-popup />
        </q-card>
      </q-dialog>

      <q-dialog v-model="noteDialog">
        <q-card class="note-preview-card">
          <div class="note-header">
            <q-icon name="sticky_note_2" />
            <h2>Secure note</h2>
          </div>

          <q-editor v-model="revealedNote" readonly min-height="300px" class="note-editor" />

          <q-btn unelevated label="Close" class="close-btn" v-close-popup />
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useVaultStore } from 'src/stores/vaultStore'

import VaultItem from 'components/vault/VaultItem.vue'
import AddPasswordDialog from 'components/vault/AddPasswordDialog.vue'
import AddFileDialog from 'components/vault/AddFileDialog.vue'
import AddNoteDialog from 'components/vault/AddNoteDialog.vue'

const vault = useVaultStore()

const passwordDialog = ref(false)
const fileDialog = ref(false)
const notesDialog = ref(false)
const loading = ref(false)

const revealDialog = ref(false)
const revealedPassword = ref('')

const filePreviewDialog = ref(false)
const filePreviewUrl = ref('')
const filePreviewType = ref('')

const noteDialog = ref(false)
const revealedNote = ref('')

const generatedPassword = ref('')
const passwordLength = ref(18)
const useNumbers = ref(true)
const useSymbols = ref(true)
const useUppercase = ref(true)

const tabs = [
  {
    label: 'All',
    value: 'all',
    icon: 'dashboard',
  },
  {
    label: 'Favorites',
    value: 'favorite',
    icon: 'star',
  },
  {
    label: 'Passwords',
    value: 'password',
    icon: 'vpn_key',
  },
  {
    label: 'Files',
    value: 'file',
    icon: 'description',
  },
  {
    label: 'Notes',
    value: 'note',
    icon: 'sticky_note_2',
  },
]

function generatePassword() {
  let chars = 'abcdefghijklmnopqrstuvwxyz'

  if (useUppercase.value) {
    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }

  if (useSymbols.value) {
    chars += '!@#$%^&*()_+-=[]{};:,.<>?'
  }

  if (useNumbers.value) {
    chars += '123456789'
  }

  let password = ''

  for (let i = 0; i < passwordLength.value; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  generatedPassword.value = password
}

async function copyGeneratedPassword() {
  if (!generatedPassword.value) {
    generatePassword()
  }

  await navigator.clipboard.writeText(generatedPassword.value)
}

async function showPassword(item) {
  if (item.type !== 'password') {
    return
  }

  if (!item.credential) {
    return
  }

  const decrypted = await vault.revealCredential(item)

  revealedPassword.value = decrypted.replace(/^"|"$/g, '')

  revealDialog.value = true
}

async function showFile(item) {
  if (item.type !== 'file') {
    return
  }

  filePreviewUrl.value = await vault.fetchFile(item)

  filePreviewType.value = item.fileType

  filePreviewDialog.value = true
}

async function showNote(item) {
  if (item.type !== 'note') {
    return
  }

  revealedNote.value = item.content

  noteDialog.value = true
}

async function handleMore(item) {
  if (item.type === 'password') {
    await showPassword(item)
  }

  if (item.type === 'file') {
    await showFile(item)
  }

  if (item.type === 'note') {
    await showNote(item)
  }
}

async function copyPassword() {
  await navigator.clipboard.writeText(revealedPassword.value)
}

onMounted(async () => {
  generatePassword()

  loading.value = true

  try {
    await vault.fetchVault()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.vault-page {
  padding: 32px 48px;
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 88% 8%,
      color-mix(in srgb, var(--q-primary) 10%, transparent),
      transparent 28%
    ),
    radial-gradient(
      circle at 10% 90%,
      color-mix(in srgb, var(--q-secondary) 7%, transparent),
      transparent 30%
    ),
    var(--app-page-bg);

  color: var(--app-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.vault-shell {
  max-width: 1280px;
  width: 100%;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;

  gap: 28px;
}

.vault-main {
  position: relative;
  min-width: 0;
  min-height: 520px;
}

.vault-loader {
  border-radius: 26px;
}

.vault-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero {
  width: 100%;
  min-height: 160px;

  padding: 22px 26px;
  margin-bottom: 20px;

  border-radius: 26px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 11%, var(--app-surface)),
    color-mix(in srgb, var(--q-secondary) 7%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  box-shadow: 0 12px 30px color-mix(in srgb, var(--q-primary) 7%, transparent);

  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  width: fit-content;

  padding: 5px 12px;
  margin-bottom: 14px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 16%, transparent),
    color-mix(in srgb, var(--q-secondary) 12%, transparent)
  );

  color: var(--q-primary);

  font-size: 11px;
  font-weight: 800;

  display: flex;
  align-items: center;
  gap: 6px;
}

.hero h1 {
  margin: 0;

  font-size: 34px;
  font-weight: 900;

  color: var(--app-text);
}

.hero p {
  margin-top: 10px;

  max-width: 420px;

  color: var(--app-text-muted);

  font-size: 14px;
  line-height: 1.5;
}

.hero-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hero-card {
  min-width: 125px;

  padding: 14px 18px;

  border-radius: 20px;

  background: var(--app-surface);

  border: 1px solid var(--app-border);

  text-align: center;
}

.hero-card strong {
  display: block;

  font-size: 30px;
  font-weight: 950;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-card span {
  font-size: 13px;
  font-weight: 800;

  color: var(--app-text-muted);
}

.add-btn {
  height: 52px;

  padding: 0 22px;

  border-radius: 18px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-size: 13px;
  font-weight: 900;

  letter-spacing: 0.3px;

  box-shadow: 0 16px 34px color-mix(in srgb, var(--q-primary) 25%, transparent);
}

.search-input {
  width: 100%;

  margin-bottom: 16px;

  background: var(--app-surface);

  border-radius: 18px;
}

.search-input :deep(.q-field__control) {
  color: var(--app-text);
}

.search-input :deep(.q-field__native) {
  color: var(--app-text);
}

.search-input :deep(.q-field__native::placeholder) {
  color: var(--app-text-muted);
}

.search-input :deep(.q-icon) {
  color: var(--q-primary);
}

.type-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  margin-bottom: 22px;
}

.type-tab {
  height: 42px;

  padding: 0 16px;

  border: 1px solid var(--app-border);

  border-radius: 999px;

  background: var(--app-surface);

  color: var(--app-text-muted);

  font-weight: 800;

  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 7px;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.type-tab:hover {
  color: var(--q-primary);

  border-color: color-mix(in srgb, var(--q-primary) 35%, var(--app-border));

  transform: translateY(-1px);
}

.type-tab.active {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, var(--app-surface)),
    color-mix(in srgb, var(--q-secondary) 12%, var(--app-surface))
  );

  color: var(--q-primary);

  border-color: color-mix(in srgb, var(--q-primary) 30%, transparent);
}

.items {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 14px;
}

.side-card {
  padding: 22px;

  border-radius: 32px;

  background: var(--app-surface);

  border: 1px solid var(--app-border);

  box-shadow: 0 12px 30px color-mix(in srgb, var(--q-primary) 6%, transparent);

  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.side-header {
  margin-bottom: 16px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 14px;
}

.side-header h3 {
  margin: 0;

  font-size: 18px;
  font-weight: 900;

  color: var(--app-text);
}

.side-header p {
  margin: 5px 0 0;

  color: var(--app-text-muted);

  font-size: 13px;
}

.side-icon {
  width: 44px;
  height: 44px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 15%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.generated-password {
  min-height: 62px;

  padding: 16px 18px;

  border-radius: 18px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 8%, var(--app-surface-2)),
    color-mix(in srgb, var(--q-secondary) 8%, var(--app-surface-2))
  );

  border: 1px solid color-mix(in srgb, var(--q-primary) 18%, var(--app-border));

  font-size: 16px;
  font-weight: 800;

  letter-spacing: 0.4px;

  color: var(--app-text);

  display: flex;
  align-items: center;

  word-break: break-all;

  margin: 18px 0 20px;
}

.generator-row {
  margin-top: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--app-text-muted);

  font-weight: 800;
}

.generator-row strong {
  color: var(--app-text);

  font-size: 18px;
  font-weight: 900;
}

.generator-actions {
  margin-top: 18px;

  display: flex;
  align-items: center;

  gap: 12px;
}

.generate-btn {
  flex: 1;

  height: 52px;

  border-radius: 18px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-size: 13px;
  font-weight: 900;

  letter-spacing: 0.5px;

  box-shadow: 0 12px 26px color-mix(in srgb, var(--q-primary) 24%, transparent);
}

.copy-btn {
  width: 52px;
  height: 52px;

  border-radius: 18px;

  background: color-mix(in srgb, var(--q-secondary) 10%, var(--app-surface));

  color: var(--q-secondary);

  border: 1px solid color-mix(in srgb, var(--q-secondary) 18%, var(--app-border));
}

.reveal-card {
  width: 380px;

  padding: 28px;

  border-radius: 32px;

  text-align: center;

  background: var(--app-surface);

  color: var(--app-text);

  border: 1px solid var(--app-border);

  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.22);
}

.reveal-icon {
  width: 58px;
  height: 58px;

  margin: 0 auto 16px;

  border-radius: 18px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
}

.reveal-card h2 {
  margin: 0;

  font-size: 28px;
  font-weight: 900;

  color: var(--app-text);
}

.reveal-subtitle {
  margin: 8px 0 20px;

  color: var(--app-text-muted);

  font-size: 14px;
}

.password-box {
  min-height: 54px;

  padding: 0 12px 0 18px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 8%, var(--app-surface-2)),
    color-mix(in srgb, var(--q-secondary) 6%, var(--app-surface-2))
  );

  color: var(--app-text);

  font-size: 18px;
  font-weight: 800;

  display: flex;
  align-items: center;
  justify-content: space-between;

  word-break: break-all;
}

.close-btn {
  width: 100%;

  height: 48px;

  margin-top: 22px;

  border-radius: 16px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;
}

.file-preview-card {
  width: 900px;

  max-width: 95vw;

  padding: 20px;

  border-radius: 32px;

  background: var(--app-surface);

  color: var(--app-text);

  border: 1px solid var(--app-border);
}

.file-preview-image {
  width: 100%;

  max-height: 75vh;

  object-fit: contain;

  border-radius: 16px;
}

.file-preview-pdf {
  width: 100%;

  height: 75vh;

  border: 0;

  border-radius: 16px;
}

.file-preview-empty {
  height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--app-text-muted);

  font-weight: 800;
}

.note-preview-card {
  width: 850px;

  max-width: 95vw;

  padding: 24px;

  border-radius: 32px;

  background: var(--app-surface);

  color: var(--app-text);

  border: 1px solid var(--app-border);
}

.note-header {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 18px;

  color: var(--q-primary);
}

.note-header h2 {
  margin: 0;

  font-size: 26px;
  font-weight: 900;
}

.note-editor {
  border-radius: 16px;

  overflow: hidden;
}

@media (max-width: 1100px) {
  .vault-page {
    padding: 24px;
  }

  .vault-shell {
    grid-template-columns: 1fr;
  }

  .vault-side {
    display: none;
  }
}
</style>

<style>
.new-item-menu {
  width: 290px;

  padding: 12px;

  border-radius: 32px;

  background: var(--app-surface);

  color: var(--app-text);

  border: 1px solid var(--app-border);

  backdrop-filter: blur(18px);

  box-shadow: 0 22px 70px rgba(15, 23, 42, 0.16);

  overflow: hidden;
}

.new-item-menu .q-list {
  padding: 0;
}

.new-item-menu .menu-item {
  min-height: 86px;

  padding: 14px;

  border-radius: 24px;

  margin-bottom: 8px;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.new-item-menu .menu-item:hover {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 10%, transparent),
    color-mix(in srgb, var(--q-secondary) 8%, transparent)
  );

  transform: translateX(2px);
}

.new-item-menu .icon-box {
  width: 54px;
  height: 54px;

  border-radius: 20px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 17%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.new-item-menu .title {
  font-size: 16px;
  font-weight: 900;

  color: var(--app-text);
}

.new-item-menu .subtitle {
  margin-top: 4px;

  font-size: 13px;

  color: var(--app-text-muted);
}
</style>

<template>
  <q-page class="vault-page">
    <div class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <q-icon name="lock" />
          End-to-end encrypted
        </div>

        <h1>Vault</h1>

        <p>Manage your saved passwords, private notes, and encrypted files in one secure place.</p>
      </div>

      <div class="hero-right">
        <div class="hero-card">
          <div>
            <strong>{{ vault.items.length }}</strong>
            <span>secured items</span>
          </div>
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
                  <div class="icon-box file">
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
                  <div class="icon-box file">
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

    <q-input outlined v-model="vault.search" placeholder="Search anything..." class="search-input">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="items">
      <VaultItem
        v-for="item in vault.filteredItems"
        :key="item.id"
        :item="item"
        @click-more="handleMore(item)"
        @toggle-favorite="vault.toggleFavorite"
      />
    </div>

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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useVaultStore } from 'src/stores/vaultStore'
import { useAuthStore } from 'src/stores/authStore'

import VaultItem from 'components/vault/VaultItem.vue'
import AddPasswordDialog from 'components/vault/AddPasswordDialog.vue'
import AddFileDialog from 'components/vault/AddFileDialog.vue'
import AddNoteDialog from 'components/vault/AddNoteDialog.vue'

const auth = useAuthStore()
const vault = useVaultStore()

const passwordDialog = ref(false)
const fileDialog = ref(false)
const notesDialog = ref(false)

const revealDialog = ref(false)
const revealedPassword = ref('')

const filePreviewDialog = ref(false)
const filePreviewUrl = ref('')
const filePreviewType = ref('')

const noteDialog = ref(false)
const revealedNote = ref('')

async function showFile(item) {
  if (item.type !== 'file') return

  filePreviewUrl.value = await vault.fetchFile(item)
  filePreviewType.value = item.fileType
  filePreviewDialog.value = true
}

async function showPassword(item) {
  if (item.type !== 'password') return

  const decrypted = await vault.revealCredential(item)

  revealedPassword.value = decrypted.replace(/^"|"$/g, '')

  revealDialog.value = true
}

async function showNote(item) {
  if (item.type !== 'note') return

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
  await auth.restoreCryptoSession()
  await vault.fetchPasswords()
  await vault.fetchFiles()
  await vault.fetchNotes()
})
</script>

<style scoped>
.vault-page {
  padding: 32px;
  min-height: 100vh;
  background: radial-gradient(circle at 90% 10%, rgba(47, 143, 47, 0.08), transparent 25%), #f6f8f6;
}

.hero {
  max-width: 760px;
  min-height: 170px;
  padding: 22px 26px;
  margin-bottom: 20px;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(47, 143, 47, 0.08), rgba(255, 255, 255, 0.94));
  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.05);
}

.hero-content {
  flex: 1;
}

.hero-badge {
  width: fit-content;
  padding: 5px 12px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: rgba(47, 143, 47, 0.12);
  color: #2f8f2f;
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
  color: #142018;
}

.hero p {
  margin-top: 10px;
  max-width: 360px;
  color: #66746b;
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
  background: white;
  text-align: center;
}

.hero-card strong {
  display: block;
  font-size: 30px;
  font-weight: 950;
  color: #142018;
}

.hero-card span {
  font-size: 13px;
  font-weight: 800;
  color: #66746b;
}

.add-btn {
  height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  background: #2f8f2f;
  color: white;
  font-size: 13px;
  font-weight: 800;
}

.search-input {
  max-width: 620px;
  margin-bottom: 24px;
  background: white;
  border-radius: 14px;
}

.items {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.new-item-menu {
  width: 290px;
  padding: 12px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(24, 42, 31, 0.16);
}

.menu-item {
  min-height: 76px;
  padding: 12px;
  border-radius: 18px;
  margin-bottom: 8px;
  transition: 0.2s ease;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: rgba(47, 143, 47, 0.08);
}

.icon-box {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(47, 143, 47, 0.12);
  color: #2f8f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.title {
  font-size: 15px;
  font-weight: 800;
  color: #17201a;
}

.subtitle {
  font-size: 12px;
  color: #7b847d;
}

.reveal-card {
  width: 380px;
  padding: 28px;
  border-radius: 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 30px 80px rgba(24, 42, 31, 0.22);
}

.reveal-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 18px;
  background: rgba(47, 143, 47, 0.12);
  color: #2f8f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.reveal-card h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  color: #17201a;
}

.reveal-subtitle {
  margin: 8px 0 20px;
  color: #6c766f;
  font-size: 14px;
}

.password-box {
  min-height: 54px;
  padding: 0 12px 0 18px;
  border-radius: 14px;
  background: #eef4ef;
  color: #17201a;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: space-between;
  word-break: break-all;
}

.close-btn {
  width: 100%;
  height: 46px;
  margin-top: 22px;
  border-radius: 12px;
  background: #2f8f2f;
  color: white;
  font-weight: 800;
}

.file-preview-card {
  width: 900px;
  max-width: 95vw;
  padding: 20px;
  border-radius: 24px;
  background: white;
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
  color: #66746b;
  font-weight: 800;
}

.note-preview-card {
  width: 850px;
  max-width: 95vw;
  padding: 24px;
  border-radius: 24px;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  color: #2f8f2f;
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
</style>

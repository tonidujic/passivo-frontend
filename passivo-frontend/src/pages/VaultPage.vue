<template>
  <q-page class="vault-page">
    <div class="topbar">
      <div>
        <h1>Vault</h1>
        <p>Manage your saved passwords and encrypted files</p>
      </div>

      <q-btn unelevated icon="add" label="New item" class="add-btn">
        <q-menu class="new-item-menu">
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
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <q-input outlined v-model="vault.search" placeholder="Search anything..." class="search-input">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="items">
      <q-card v-for="item in vault.filteredItems" :key="item.id" class="vault-item">
        <div class="app-icon">
          <q-icon v-if="item.type === 'file'" name="description" />
          <span v-else>{{ item.icon }}</span>
        </div>

        <div class="item-info">
          <strong>{{ item.title }}</strong>
          <p>{{ item.subtitle }}</p>
        </div>

        <q-icon
          v-if="item.type === 'password'"
          :name="item.favorite ? 'star' : 'star_border'"
          class="favorite"
        />

        <q-btn flat round dense icon="more_vert" @click="showPassword(item)" />
      </q-card>
    </div>

    <AddPasswordDialog v-model="passwordDialog" @submit="vault.addPasswordItem" />
    <AddFileDialog v-model="fileDialog" @submit="vault.addFileItem" />
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
  </q-page>
</template>

<script setup>
import { useVaultStore } from 'src/stores/vaultStore'
import { onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
const auth = useAuthStore()
const vault = useVaultStore()

import AddPasswordDialog from 'components/vault/AddPasswordDialog.vue'
import AddFileDialog from 'components/vault/AddFileDialog.vue'

const passwordDialog = ref(false)
const fileDialog = ref(false)

const revealedPassword = ref('')

const revealDialog = ref(false)

async function showPassword(item) {
  const decrypted = await vault.revealCredential(item)

  revealedPassword.value = decrypted.replace(/^"|"$/g, '')
  revealDialog.value = true
}
async function copyPassword() {
  const cleanPassword = revealedPassword.value.replace(/^"|"$/g, '')

  await navigator.clipboard.writeText(cleanPassword)
}

onMounted(async () => {
  await auth.restoreCryptoSession()

  await vault.fetchPasswords()
})
</script>

<style scoped>
.vault-page {
  padding: 48px;
  min-height: 100vh;
  background: radial-gradient(circle at 90% 10%, rgba(47, 143, 47, 0.12), transparent 25%), #f6f8f6;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

h1 {
  margin: 0;
  font-size: 38px;
  font-weight: 900;
  color: #17201a;
}

p {
  margin: 6px 0 0;
  color: #6c766f;
}

.add-btn {
  height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  background: #2f8f2f;
  color: white;
  font-weight: 700;
}
.new-item-menu {
  width: 290px;
  padding: 12px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(24, 42, 31, 0.12);
  border: 1px solid rgba(47, 143, 47, 0.08);
}

.menu-item {
  min-height: 82px;
  padding: 12px;
  border-radius: 26px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: rgba(47, 143, 47, 0.07);
  transform: scale(1.015);
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(47, 143, 47, 0.15), rgba(47, 143, 47, 0.07));

  display: flex;
  align-items: center;
  justify-content: center;

  color: #2f8f2f;
  font-size: 24px;
}

.icon-box.file {
  background: linear-gradient(135deg, rgba(47, 143, 47, 0.12), rgba(47, 143, 47, 0.05));
}

.title {
  font-size: 16px;
  font-weight: 800;
  color: #17201a;
  margin-bottom: 2px;
}

.subtitle {
  font-size: 13px;
  line-height: 1.35;
  color: #7b847d;
}

.search-input {
  max-width: 620px;
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
}

.items {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vault-item {
  height: 78px;
  padding: 0 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.06);
}

.app-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef4ef;
  color: #2f8f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.item-info {
  flex: 1;
}

.item-info strong {
  font-size: 17px;
  color: #17201a;
}

.item-info p {
  margin: 2px 0 0;
  font-size: 14px;
}

.favorite {
  font-size: 24px;
  color: #2f8f2f;
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
</style>

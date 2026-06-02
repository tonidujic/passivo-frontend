<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-drawer show-if-above bordered :width="270" class="sidebar">
      <div class="sidebar-inner">
        <div class="logo">
          <img src="~assets/logo-passivo.png" />
          <p>End-to-end encrypted</p>
        </div>

        <div class="nav-section">
          <span class="section-label">Main</span>

          <q-list>
            <q-item
              clickable
              :active="vault.selectedType === 'all'"
              @click="selectType('all')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="lock" />
              </q-item-section>

              <q-item-section>Vault</q-item-section>

              <q-item-section side>
                <q-badge rounded color="green">{{ totalCount }}</q-badge>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="vault.selectedType === 'favorite'"
              @click="selectType('favorite')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="star_border" />
              </q-item-section>

              <q-item-section>Favorites</q-item-section>

              <q-item-section side>
                <q-badge rounded color="green">{{ favoriteCount }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="nav-section">
          <span class="section-label">Content</span>

          <q-list>
            <q-item
              clickable
              :active="vault.selectedType === 'password'"
              @click="selectType('password')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="vpn_key" />
              </q-item-section>

              <q-item-section>Passwords</q-item-section>

              <q-item-section side>
                <q-badge rounded color="green">{{ passwordCount }}</q-badge>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              :active="vault.selectedType === 'file'"
              @click="selectType('file')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>

              <q-item-section>Files</q-item-section>

              <q-item-section side>
                <q-badge rounded color="green">{{ fileCount }}</q-badge>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="vault.selectedType === 'note'"
              @click="selectType('note')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="sticky_note_2" />
              </q-item-section>

              <q-item-section>Notes</q-item-section>

              <q-item-section side>
                <q-badge rounded color="green">{{ noteCount }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="nav-section">
          <span class="section-label">System</span>

          <q-list>
            <q-item clickable class="nav-item">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section>Settings</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="sidebar-bottom">
          <div class="profile-section">
            <q-avatar class="profile-avatar" size="40px" color="green" text-color="white">
              {{ auth.userInitial }}
            </q-avatar>

            <div class="profile-info">
              <strong>{{ auth.user?.fullName || 'User' }}</strong>
            </div>
          </div>

          <q-btn flat icon="logout" label="Log out" class="logout-btn" @click="logout" />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useVaultStore } from 'src/stores/vaultStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const vault = useVaultStore()

const totalCount = computed(() => vault.items.length)
const favoriteCount = computed(() => vault.items.filter((item) => item.favorite).length)
const passwordCount = computed(() => vault.items.filter((item) => item.type === 'password').length)
const fileCount = computed(() => vault.items.filter((item) => item.type === 'file').length)
const noteCount = computed(() => vault.items.filter((item) => item.type === 'note').length)

async function logout() {
  await auth.logout()
  await router.push('/auth/login')
}

function selectType(type) {
  vault.selectedType = type
}
</script>

<style scoped>
.dashboard-layout {
  background: #f6f8f6;
}

.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f7faf7 100%);
  border-right: 1px solid rgba(20, 32, 24, 0.07);
}

.sidebar-inner {
  height: 100%;
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 4px 8px 26px;
}

.logo img {
  width: 170px;
  display: block;
}

.logo p {
  margin: 8px 0 0 54px;
  font-size: 11px;
  color: #2f8f2f;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.nav-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  margin: 0 12px 8px;
  font-size: 11px;
  font-weight: 900;
  color: #91a096;
  text-transform: uppercase;
  letter-spacing: 0.9px;
}

.nav-item {
  min-height: 52px;
  margin: 6px 0;
  padding: 0 12px;
  border-radius: 16px;
  font-weight: 800;
  color: #26332b;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-item:hover {
  background: rgba(47, 143, 47, 0.07);
  transform: translateX(3px);
}

.nav-item.q-item--active {
  background: rgba(47, 143, 47, 0.14);
  color: #2f8f2f;
  box-shadow: 0 10px 24px rgba(47, 143, 47, 0.12);
}

.nav-item :deep(.q-icon) {
  font-size: 25px;
}

.nav-item :deep(.q-item__section--avatar) {
  min-width: 44px;
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.storage-card {
  padding: 16px;
  border-radius: 22px;
  background: rgba(47, 143, 47, 0.08);
  border: 1px solid rgba(47, 143, 47, 0.08);
}

.storage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.storage-top span {
  font-size: 13px;
  font-weight: 900;
  color: #26332b;
}

.storage-top strong {
  font-size: 13px;
  color: #2f8f2f;
}

.storage-bar {
  height: 8px;
  margin: 14px 0 10px;
  border-radius: 999px;
  background: rgba(47, 143, 47, 0.14);
  overflow: hidden;
}

.storage-fill {
  width: 48%;
  height: 100%;
  border-radius: inherit;
  background: #2f8f2f;
}

.storage-card p {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #66746b;
}

.profile-section {
  padding: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  font-weight: 900;
}

.profile-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  max-width: 150px;
  font-size: 14px;
  color: #17201a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-info span {
  font-size: 12px;
  color: #7b847d;
  font-weight: 700;
}

.logout-btn {
  height: 50px;
  border-radius: 16px;
  background: white;
  color: #26332b;
  font-weight: 900;
  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.07);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.logout-btn:hover {
  color: #d94444;
  background: rgba(217, 68, 68, 0.08);
  transform: translateY(-1px);
}
</style>

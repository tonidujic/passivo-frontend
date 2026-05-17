<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-drawer show-if-above bordered :width="260" class="sidebar">
      <div class="logo">
        <img src="~assets/logo-passivo.png" />
      </div>

      <q-list padding>
        <q-item clickable active>
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>Vault</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="star_border" />
          </q-item-section>
          <q-item-section>Favorites</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="vpn_key" />
          </q-item-section>
          <q-item-section>Passwords</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Files</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="note" />
          </q-item-section>
          <q-item-section>Notes</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>

      <q-btn flat icon="logout" label="Log out" class="logout-btn" @click="logout" />

      <div class="profile-section">
        <q-avatar class="profile-avatar" size="36px" color="green" text-color="white">
          {{ auth.userInitial }}
        </q-avatar>

        <div class="profile-info">
          <strong>{{ auth.user?.fullName }}</strong>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useAuthStore } from 'src/stores/authStore'

const auth = useAuthStore()
</script>

<style scoped>
.dashboard-layout {
  background: #f6f8f6;
}

.sidebar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
}

.logo {
  padding: 28px 22px;
}

.logo img {
  width: 170px;
}

.q-item {
  margin: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  color: #26332b;
}

.q-item--active {
  background: rgba(47, 143, 47, 0.14);
  color: #2f8f2f;
}

.logout-btn {
  position: absolute;
  bottom: 24px;
  left: 18px;
  right: 18px;
  padding: 16px;
  border-radius: 14px;
  background: white;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.08);
}
.logout-btn:hover {
  color: red;
}

.profile-section {
  position: absolute;
  bottom: 100px;
  left: 24px;

  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  font-weight: 800;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  font-size: 15px;
  color: #17201a;
}

.profile-info span {
  font-size: 12px;
  color: #7b847d;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <q-drawer show-if-above bordered :width="270" class="sidebar">
      <div class="sidebar-inner">
        <div class="logo">
          <img
            v-if="theme.mode === 'dark'"
            src="~assets/logo-passivo-dark.png"
            alt="Passivo"
            class="logo-image"
          />

          <img v-else src="~assets/logo-passivo-light.png" alt="Passivo" class="logo-image" />
        </div>

        <div class="nav-section">
          <span class="section-label"> Main </span>

          <q-list>
            <q-item
              clickable
              to="/dashboard/vault"
              :active="vault.selectedType === 'all'"
              @click="selectType('all')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="lock" />
              </q-item-section>

              <q-item-section> Vault </q-item-section>

              <q-item-section side>
                <q-badge rounded color="primary">
                  {{ totalCount }}
                </q-badge>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/dashboard/vault"
              :active="vault.selectedType === 'favorite'"
              @click="selectType('favorite')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="star_border" />
              </q-item-section>

              <q-item-section> Favorites </q-item-section>

              <q-item-section side>
                <q-badge rounded color="secondary">
                  {{ favoriteCount }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="nav-section">
          <span class="section-label"> Content </span>

          <q-list>
            <q-item
              clickable
              to="/dashboard/vault"
              :active="vault.selectedType === 'password'"
              @click="selectType('password')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="vpn_key" />
              </q-item-section>

              <q-item-section> Passwords </q-item-section>

              <q-item-section side>
                <q-badge rounded color="primary">
                  {{ passwordCount }}
                </q-badge>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/dashboard/vault"
              :active="vault.selectedType === 'file'"
              @click="selectType('file')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>

              <q-item-section> Files </q-item-section>

              <q-item-section side>
                <q-badge rounded color="secondary">
                  {{ fileCount }}
                </q-badge>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/dashboard/vault"
              :active="vault.selectedType === 'note'"
              @click="selectType('note')"
              class="nav-item"
            >
              <q-item-section avatar>
                <q-icon name="sticky_note_2" />
              </q-item-section>

              <q-item-section> Notes </q-item-section>

              <q-item-section side>
                <q-badge rounded color="accent">
                  {{ noteCount }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="nav-section">
          <span class="section-label"> System </span>

          <q-list>
            <q-item
              clickable
              to="/dashboard/settings"
              class="nav-item"
              active-class="settings-active"
            >
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section> Settings </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="sidebar-bottom">
          <div class="profile-section">
            <q-avatar class="profile-avatar" size="40px">
              <img v-if="profileImage" :src="profileImage" class="sidebar-profile-image" />

              <q-icon v-else name="person" size="24px" color="white" />
            </q-avatar>

            <div class="profile-info">
              <strong>
                {{ auth.user?.fullName || 'User' }}
              </strong>
            </div>
          </div>

          <q-btn flat icon="logout" label="Log out" class="logout-btn" @click="logout" />
        </div>
      </div>
    </q-drawer>

    <q-page-container class="dashboard-content">
      <router-view />
    </q-page-container>

    <q-footer class="mobile-dashboard-nav">
      <q-tabs dense no-caps indicator-color="transparent" active-color="primary">
        <q-route-tab
          to="/dashboard/vault"
          icon="lock"
          label="Vault"
          @click="selectType('all')"
        />
        <q-route-tab
          to="/dashboard/vault"
          icon="star_border"
          label="Favorites"
          @click="selectType('favorite')"
        />
        <q-route-tab to="/dashboard/settings" icon="settings" label="Settings" />
        <q-tab icon="logout" label="Log out" @click="logout" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useAuthStore } from 'src/stores/authStore'
import { useThemeStore } from 'src/stores/themeStore'
import { useVaultStore } from 'src/stores/vaultStore'

const router = useRouter()

const auth = useAuthStore()
const theme = useThemeStore()
const vault = useVaultStore()

onMounted(async () => {
  try {
    await auth.restoreCryptoSession()

    if (auth.user && !theme.activeUserKey) {
      theme.loadTheme(auth.user)
    }
  } catch (err) {
    console.error('Failed to restore user session:', err)
  }
})

const profileStorageKey = computed(() => {
  const userKey = auth.user?.id || auth.user?._id || auth.user?.email

  if (!userKey) {
    return null
  }

  return `passivoProfileImage:${userKey}`
})

const profileImage = computed(() => {
  if (auth.user?.profileImage) {
    return auth.user.profileImage
  }

  if (!profileStorageKey.value) {
    return ''
  }

  return localStorage.getItem(profileStorageKey.value) || ''
})

const totalCount = computed(() => {
  return vault.items.length
})

const favoriteCount = computed(() => {
  return vault.items.filter((item) => item.favorite).length
})

const passwordCount = computed(() => {
  return vault.items.filter((item) => item.type === 'password').length
})

const fileCount = computed(() => {
  return vault.items.filter((item) => item.type === 'file').length
})

const noteCount = computed(() => {
  return vault.items.filter((item) => item.type === 'note').length
})

async function logout() {
  try {
    await auth.logout()

    theme.resetTheme()

    await router.push('/auth/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

function selectType(type) {
  vault.selectedType = type
}
</script>

<style scoped>
.dashboard-layout {
  background: var(--app-page-bg);

  color: var(--app-text, #1e293b);

  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.dashboard-content {
  background: var(--app-page-bg);

  min-height: 100vh;

  transition: background 0.25s ease;
}

.mobile-dashboard-nav {
  display: none;
}

@media (max-width: 1023px) {
  .mobile-dashboard-nav {
    display: block;
    padding-bottom: env(safe-area-inset-bottom);
    background: color-mix(in srgb, var(--app-surface) 94%, transparent);
    color: var(--app-text);
    border-top: 1px solid var(--app-border);
    backdrop-filter: blur(18px);
    box-shadow: 0 -10px 35px color-mix(in srgb, var(--q-primary) 8%, transparent);
  }

  .mobile-dashboard-nav :deep(.q-tab) {
    min-height: 62px;
    padding: 6px 2px;
    font-size: 11px;
    font-weight: 800;
  }

  .mobile-dashboard-nav :deep(.q-tab__icon) {
    font-size: 22px;
  }
}

.sidebar {
  background: var(--app-surface);

  border-right: 1px solid var(--app-border);

  transition:
    background 0.25s ease,
    border-color 0.25s ease;
}

.sidebar-inner {
  height: 100%;

  padding: 24px 14px;

  display: flex;

  flex-direction: column;
}

/* LOGO */

.logo {
  height: 98px;

  padding: 6px 8px 28px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: flex-start;

  flex-shrink: 0;
}

.logo-image {
  display: block;

  width: 220px;

  height: 80px;

  max-width: 220px;

  object-fit: contain;

  object-position: left center;

  margin: 0;

  padding: 0;

  flex-shrink: 0;
}

/* NAVIGATION */

.nav-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;

  margin: 0 12px 8px;

  font-size: 11px;

  font-weight: 900;

  color: #94a3b8;

  text-transform: uppercase;

  letter-spacing: 0.9px;
}

.nav-item {
  min-height: 52px;

  margin: 6px 0;

  padding: 0 12px;

  border-radius: 16px;

  font-weight: 800;

  color: var(--app-text, #26332b);

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-item:hover {
  background: color-mix(in srgb, var(--q-primary) 8%, transparent);

  color: var(--q-primary);

  transform: translateX(3px);
}

.nav-item.q-item--active {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 16%, transparent),
    color-mix(in srgb, var(--q-secondary) 10%, transparent)
  );

  color: var(--q-primary);

  box-shadow: 0 10px 24px color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.settings-active {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 16%, transparent),
    color-mix(in srgb, var(--q-secondary) 10%, transparent)
  );

  color: var(--q-primary);
}

.nav-item :deep(.q-icon) {
  font-size: 25px;
}

.nav-item :deep(.q-item__section--avatar) {
  min-width: 44px;
}

.nav-item :deep(.q-badge) {
  min-width: 20px;

  min-height: 20px;

  justify-content: center;

  font-weight: 800;
}

/* BOTTOM */

.sidebar-bottom {
  margin-top: auto;

  display: flex;

  flex-direction: column;

  gap: 14px;
}

/* PROFILE */

.profile-section {
  padding: 12px;

  border-radius: 20px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);

  display: flex;

  align-items: center;

  gap: 12px;

  transition:
    background 0.25s ease,
    border-color 0.25s ease;
}

.profile-avatar {
  position: relative;

  flex-shrink: 0;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  border: 2px solid color-mix(in srgb, var(--q-primary) 35%, transparent);

  box-shadow: 0 5px 15px color-mix(in srgb, var(--q-primary) 15%, transparent);

  font-weight: 900;
}

.profile-avatar :deep(.q-avatar__content) {
  position: absolute;

  inset: 0;

  width: 100% !important;

  height: 100% !important;

  padding: 0 !important;

  margin: 0 !important;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;
}

.profile-avatar :deep(.q-avatar__content img),
.sidebar-profile-image {
  position: absolute;

  top: 0;
  left: 0;

  width: 100% !important;

  height: 100% !important;

  min-width: 100% !important;

  min-height: 100% !important;

  max-width: none !important;

  max-height: none !important;

  margin: 0 !important;

  padding: 0 !important;

  display: block;

  object-fit: cover !important;

  object-position: center center;

  border-radius: 50%;
}

.profile-info {
  min-width: 0;

  display: flex;

  flex-direction: column;
}

.profile-info strong {
  max-width: 150px;

  font-size: 14px;

  color: var(--app-text, #17201a);

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

/* LOGOUT */

.logout-btn {
  height: 50px;

  border-radius: 16px;

  background: var(--app-surface-2);

  color: var(--app-text, #26332b);

  font-weight: 900;

  border: 1px solid var(--app-border);

  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.05);

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.logout-btn:hover {
  color: #ef4444;

  background: rgba(239, 68, 68, 0.08);

  transform: translateY(-1px);
}

:global(.body--dark) .section-label {
  color: #64748b;
}
</style>

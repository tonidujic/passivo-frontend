import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Dark, setCssVar } from 'quasar'

const DEFAULT_MODE = 'light'
const DEFAULT_PRESET = 'emerald'

const REMEMBER_ME_KEY = 'passivoRememberMe'
const ACTIVE_USER_KEY = 'passivoActiveUser'

const presets = [
  {
    key: 'emerald',
    name: 'Emerald',
    primary: '#16a34a',
    secondary: '#0ea5e9',
    accent: '#7c3aed',
  },
  {
    key: 'ruby-blue',
    name: 'Ruby Blue',
    primary: '#dc2626',
    secondary: '#2563eb',
    accent: '#7c3aed',
  },
  {
    key: 'sunset',
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ec4899',
    accent: '#8b5cf6',
  },
  {
    key: 'ocean',
    name: 'Ocean',
    primary: '#0891b2',
    secondary: '#2563eb',
    accent: '#14b8a6',
  },
]

function getStoredActiveUser() {
  const remember = localStorage.getItem(REMEMBER_ME_KEY) === 'true'

  if (remember) {
    return localStorage.getItem(ACTIVE_USER_KEY)
  }

  return sessionStorage.getItem(ACTIVE_USER_KEY)
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref(DEFAULT_MODE)
  const presetKey = ref(DEFAULT_PRESET)
  const activeUserKey = ref(null)

  const allPresets = computed(() => presets)

  const currentPreset = computed(() => {
    return presets.find((preset) => preset.key === presetKey.value) || presets[0]
  })

  function getUserKey(user) {
    return user?.id || user?._id || user?.email || null
  }

  function getModeStorageKey(userKey) {
    if (!userKey) {
      return null
    }

    return `themeMode:${userKey}`
  }

  function getPresetStorageKey(userKey) {
    if (!userKey) {
      return null
    }

    return `themePreset:${userKey}`
  }

  function readUserTheme(userKey) {
    if (!userKey) {
      return {
        mode: DEFAULT_MODE,
        preset: DEFAULT_PRESET,
      }
    }

    const savedMode = localStorage.getItem(getModeStorageKey(userKey))

    const savedPreset = localStorage.getItem(getPresetStorageKey(userKey))

    const validMode = savedMode === 'dark' || savedMode === 'light'

    const validPreset = presets.some((preset) => preset.key === savedPreset)

    return {
      mode: validMode ? savedMode : DEFAULT_MODE,

      preset: validPreset ? savedPreset : DEFAULT_PRESET,
    }
  }

  function applyTheme({ persist = true } = {}) {
    const preset = currentPreset.value

    Dark.set(mode.value === 'dark')

    setCssVar('primary', preset.primary)

    setCssVar('secondary', preset.secondary)

    setCssVar('accent', preset.accent)

    document.documentElement.style.setProperty(
      '--app-page-bg',
      mode.value === 'dark' ? '#0b1120' : '#f6f8fb',
    )

    document.documentElement.style.setProperty(
      '--app-surface',
      mode.value === 'dark' ? '#111827' : '#ffffff',
    )

    document.documentElement.style.setProperty(
      '--app-surface-2',
      mode.value === 'dark' ? '#1e293b' : '#f1f5f9',
    )

    document.documentElement.style.setProperty(
      '--app-border',
      mode.value === 'dark' ? 'rgba(255, 255, 255, 0.09)' : '#e5e7eb',
    )

    document.documentElement.style.setProperty(
      '--app-text',
      mode.value === 'dark' ? '#f1f5f9' : '#17201a',
    )

    document.documentElement.style.setProperty(
      '--app-text-muted',
      mode.value === 'dark' ? '#94a3b8' : '#64748b',
    )

    document.documentElement.style.backgroundColor = mode.value === 'dark' ? '#0b1120' : '#f6f8fb'

    if (!persist || !activeUserKey.value) {
      return
    }

    localStorage.setItem(getModeStorageKey(activeUserKey.value), mode.value)

    localStorage.setItem(getPresetStorageKey(activeUserKey.value), presetKey.value)
  }

  function initTheme() {
    localStorage.removeItem('themeMode')

    localStorage.removeItem('themePreset')

    const userKey = getStoredActiveUser()

    activeUserKey.value = userKey

    if (!userKey) {
      mode.value = DEFAULT_MODE

      presetKey.value = DEFAULT_PRESET

      applyTheme({
        persist: false,
      })

      return
    }

    const savedTheme = readUserTheme(userKey)

    mode.value = savedTheme.mode

    presetKey.value = savedTheme.preset

    applyTheme({
      persist: false,
    })
  }

  function loadTheme(user) {
    const userKey = getUserKey(user)

    activeUserKey.value = userKey

    if (!userKey) {
      mode.value = DEFAULT_MODE

      presetKey.value = DEFAULT_PRESET

      applyTheme({
        persist: false,
      })

      return
    }

    const savedTheme = readUserTheme(userKey)

    mode.value = savedTheme.mode

    presetKey.value = savedTheme.preset

    applyTheme({
      persist: false,
    })
  }

  function setMode(newMode) {
    if (newMode !== 'light' && newMode !== 'dark') {
      return
    }

    mode.value = newMode

    applyTheme()
  }

  function setPreset(newPreset) {
    const exists = presets.some((preset) => preset.key === newPreset)

    if (!exists) {
      return
    }

    presetKey.value = newPreset

    applyTheme()
  }

  function resetTheme() {
    activeUserKey.value = null

    mode.value = DEFAULT_MODE

    presetKey.value = DEFAULT_PRESET

    applyTheme({
      persist: false,
    })
  }

  return {
    mode,
    presetKey,
    activeUserKey,

    allPresets,
    currentPreset,

    initTheme,
    loadTheme,
    applyTheme,

    setMode,
    setPreset,

    resetTheme,
  }
})

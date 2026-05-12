import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { encryptCredential, decryptCredential } from 'src/utils/crypto/encryption'
import { api } from 'boot/axios'
import { arrayBufferToBase64 } from 'src/utils/crypto/encoding'

export const useVaultStore = defineStore('vault', () => {
  const auth = useAuthStore()
  const search = ref('')

  const items = ref([])

  const filteredItems = computed(() => {
    return items.value.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase()),
    )
  })

  async function fetchPasswords() {
    const res = await api.get('/api/password')

    items.value = res.data.data.result.map((item) => ({
      id: item.id,
      type: 'password',
      title: item.title,
      subtitle: item.username,
      icon: item.title.charAt(0).toUpperCase(),
      favorite: false,
      website: item.website,
      encryptedCredential: item.encryptedCredential,
    }))
  }

  async function revealCredential(item) {
    const decrypted = await decryptCredential(
      item.encryptedCredential,

      auth.privateKey,
    )

    return decrypted
  }
  async function addPasswordItem(payload) {
    await auth.restoreCryptoSession()

    const encryptedCredential = await encryptCredential(
      payload.password,

      auth.publicKey,
    )

    const encryptedCredentialBase64 = arrayBufferToBase64(encryptedCredential)

    await api.post('/api/password', {
      title: payload.title,
      website: payload.website,
      username: payload.username,
      encryptedCredential: encryptedCredentialBase64,
    })

    items.value.unshift({
      id: Date.now(),
      type: 'password',
      title: payload.title,
      subtitle: payload.username,
      icon: payload.title.charAt(0).toUpperCase(),
      favorite: false,
      website: payload.website,
      encryptedCredential: encryptedCredentialBase64,
    })
  }

  function addFileItem(payload) {
    items.value.unshift({
      id: Date.now(),
      type: 'file',
      title: payload.title || payload.file?.name || 'Encrypted file',
      subtitle: payload.file?.name || 'No file selected',
      favorite: false,
    })
  }

  return {
    search,
    items,
    filteredItems,
    addPasswordItem,
    addFileItem,
    fetchPasswords,
    revealCredential,
  }
})

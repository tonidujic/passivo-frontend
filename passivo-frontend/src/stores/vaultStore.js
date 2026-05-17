import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

import {
  encryptCredential,
  decryptCredential,
  encryptData,
  decryptData,
  encryptFile,
  encryptAESKey,
} from 'src/utils/crypto/encryption'

import { generateKey } from 'src/utils/crypto/keys'
import { api } from 'boot/axios'

import {
  arrayBufferToBase64,
  uint8ArrayToBase64,
  base64ToArrayBuffer,
  base64ToUint8Array,
} from 'src/utils/crypto/encoding'

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
    await auth.restoreCryptoSession()

    const res = await api.get('/api/password')

    const passwords = await Promise.all(
      res.data.data.result.map(async (item) => {
        const title = await decryptData(item.title, auth.privateKey)
        const website = await decryptData(item.website, auth.privateKey)
        const username = await decryptData(item.username, auth.privateKey)

        return {
          id: item.id,
          type: 'password',
          title,
          subtitle: username,
          icon: title.charAt(0).toUpperCase(),
          favorite: false,
          website,
          credential: item.credential,
        }
      }),
    )

    items.value = passwords
  }

  async function fetchFiles() {
    await auth.restoreCryptoSession()

    const res = await api.get('/api/drive')

    const result = res.data.data.result || res.data.data || []

    const files = await Promise.all(
      result.map(async (item) => {
        const title = await decryptData(item.title, auth.privateKey)
        const fileName = await decryptData(item.fileName, auth.privateKey)
        const fileType = await decryptData(item.fileType, auth.privateKey)

        let previewUrl = null

        if (fileType.startsWith('image/')) {
          previewUrl = await fetchFile({
            encryptedFile: item.file,
            encryptedKey: item.key,
            iv: item.iv,
            fileType,
          })
        }

        return {
          id: item.id,
          type: 'file',
          title,
          subtitle: fileName,
          favorite: false,
          fileType,
          previewUrl,
          encryptedFile: item.file,
          encryptedKey: item.key,
          iv: item.iv,
        }
      }),
    )

    items.value = [...items.value, ...files]
  }

  async function fetchFile(item) {
    await auth.restoreCryptoSession()

    if (!item.encryptedKey || !item.encryptedFile || !item.iv) {
      console.error('Missing crypto data:', item)
      throw new Error('Missing file crypto data')
    }

    const rawAesKey = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      auth.privateKey,
      base64ToArrayBuffer(item.encryptedKey),
    )

    const aesKey = await crypto.subtle.importKey('raw', rawAesKey, { name: 'AES-GCM' }, false, [
      'decrypt',
    ])

    const decryptedFile = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToUint8Array(item.iv),
      },
      aesKey,
      base64ToArrayBuffer(item.encryptedFile),
    )

    const blob = new Blob([decryptedFile], {
      type: item.fileType,
    })

    return URL.createObjectURL(blob)
  }

  async function revealCredential(item) {
    return await decryptCredential(item.credential, auth.privateKey)
  }

  async function addPasswordItem(payload) {
    await auth.restoreCryptoSession()

    const credential = await encryptCredential(payload.password, auth.publicKey)
    const credentialBase64 = arrayBufferToBase64(credential)

    const title = await encryptData(payload.title, auth.publicKey)
    const username = await encryptData(payload.username, auth.publicKey)
    const website = await encryptData(payload.website, auth.publicKey)

    await api.post('/api/password', {
      title: arrayBufferToBase64(title),
      website: arrayBufferToBase64(website),
      username: arrayBufferToBase64(username),
      credential: credentialBase64,
    })

    items.value.unshift({
      id: Date.now(),
      type: 'password',
      title: payload.title,
      subtitle: payload.username,
      icon: payload.title.charAt(0).toUpperCase(),
      favorite: false,
      website: payload.website,
      credential: credentialBase64,
    })
  }

  async function addFileItem(payload) {
    await auth.restoreCryptoSession()

    const fileTypePlain = payload.file?.type || 'application/octet-stream'

    const title = await encryptData(payload.title || payload.file?.name, auth.publicKey)
    const fileName = await encryptData(payload.file?.name, auth.publicKey)
    const fileType = await encryptData(fileTypePlain, auth.publicKey)

    const generatedKey = await generateKey()
    const { file, iv } = await encryptFile(payload.file, generatedKey)
    const key = await encryptAESKey(generatedKey, auth.publicKey)

    const encryptedFileBase64 = arrayBufferToBase64(file)
    const encryptedKeyBase64 = arrayBufferToBase64(key)
    const ivBase64 = uint8ArrayToBase64(iv)

    await api.post('/api/drive', {
      fileName: arrayBufferToBase64(fileName),
      file: encryptedFileBase64,
      fileType: arrayBufferToBase64(fileType),
      title: arrayBufferToBase64(title),
      iv: ivBase64,
      key: encryptedKeyBase64,
    })

    items.value.unshift({
      id: Date.now(),
      type: 'file',
      title: payload.title || payload.file?.name || 'Encrypted file',
      subtitle: payload.file?.name || 'No file selected',
      favorite: false,
      fileType: fileTypePlain,
      previewUrl:
        fileTypePlain.startsWith('image/') || fileTypePlain === 'application/pdf'
          ? URL.createObjectURL(payload.file)
          : null,
      encryptedFile: encryptedFileBase64,
      encryptedKey: encryptedKeyBase64,
      iv: ivBase64,
    })
  }

  function addNoteItem(payload) {
    items.value.unshift({
      id: Date.now(),
      type: 'note',
      title: payload.title || 'Encrypted note',
      subtitle: 'Secure note',
      icon: 'sticky_note_2',
      content: payload.content,
      favorite: false,
    })
  }

  function toggleFavorite(id) {
    const item = items.value.find((item) => item.id === id)

    if (item) {
      item.favorite = !item.favorite
    }
  }

  const favoriteItems = computed(() => {
    return items.value.filter((item) => item.favorite)
  })

  return {
    search,
    items,
    filteredItems,
    fetchPasswords,
    fetchFiles,
    fetchFile,
    revealCredential,
    addPasswordItem,
    addFileItem,
    addNoteItem,
    toggleFavorite,
    favoriteItems,
  }
})

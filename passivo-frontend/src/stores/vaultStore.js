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
  const selectedType = ref('all')

  const filteredItems = computed(() => {
    let filtered = items.value

    if (selectedType.value === 'favorite') {
      filtered = filtered.filter((item) => item.favorite)
    } else if (selectedType.value !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedType.value)
    }

    return filtered.filter((item) =>
      String(item.title || '')
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    )
  })

  async function fetchPasswords() {
    await auth.restoreCryptoSession()

    const res = await api.get('/api/password')
    const result = res.data?.data?.result?.result || res.data?.data?.result || res.data?.data || []

    return await Promise.all(
      result.map(async (item) => {
        const title = await decryptData(item.title, auth.privateKey)
        const website = await decryptData(item.website, auth.privateKey)
        const username = await decryptData(item.username, auth.privateKey)

        return {
          id: item.id || item._id,
          type: 'password',
          title,
          subtitle: username,
          icon: title?.charAt(0)?.toUpperCase() || 'P',
          favorite: item.favorite || false,
          website,
          credential: item.credential,
        }
      }),
    )
  }

  async function fetchFiles() {
    await auth.restoreCryptoSession()

    try {
      const res = await api.get('/api/drive')
      const result =
        res.data?.data?.result?.result || res.data?.data?.result || res.data?.data || []
      return await Promise.all(
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
            id: item.id || item._id,
            key: item.key,
            type: 'file',
            title,
            subtitle: fileName,
            favorite: item.favorite || false,
            fileType,
            previewUrl,
            encryptedFile: item.file,
            encryptedKey: item.key,
            iv: item.iv,
          }
        }),
      )
    } catch (err) {
      console.error('FILES ERROR:', err)
      return []
    }
  }

  async function fetchNotes() {
    await auth.restoreCryptoSession()

    try {
      const res = await api.get('/api/notes')
      const result =
        res.data?.data?.result?.result || res.data?.data?.result || res.data?.data || []
      return await Promise.all(
        result.map(async (item) => {
          const title = await decryptData(item.title, auth.privateKey)
          const note = await decryptData(item.content, auth.privateKey)

          return {
            id: item.id || item._id,
            type: 'note',
            title,
            subtitle: note.replace(/<[^>]*>/g, '').slice(0, 80),
            icon: 'sticky_note_2',
            favorite: item.favorite || false,
            content: note,
          }
        }),
      )
    } catch (err) {
      console.error('NOTES ERROR:', err)
      return []
    }
  }

  async function copyPassword(item) {
    const decrypted = await revealCredential(item)
    await navigator.clipboard.writeText(decrypted)
  }
  async function copyUsername(item) {
    await navigator.clipboard.writeText(item.subtitle)
  }
  async function openWebsite(item) {
    if (!item.website) return

    const url = item.website.startsWith('http') ? item.website : `https://${item.website}`

    window.open(url, '_blank')
  }

  async function deleteItem(item) {
    try {
      if (item.type === 'password') {
        api.delete(`/api/password/${item.id}`)
      }

      if (item.type === 'file') {
        api.delete(`/api/file/${encodeURIComponent(item.key)}`)
      }

      if (item.type === 'notes') {
        api.delete(`/api/notes/${item.id}`)
      }

      items.value = items.value.filter((i) => i.id !== item.id)
    } catch (err) {
      console.error('DELETE ERROR:', err.response?.data || err)
    }
  }

  async function downloadFile(item) {
    const url = await fetchFile(item)

    const link = document.createElement('a')
    link.href = url
    link.download = item.subtitle || item.title || 'downloaded-file'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }
  async function fetchVault() {
    await auth.restoreCryptoSession()

    const [passwordsResult, filesResult, notesResult] = await Promise.allSettled([
      fetchPasswords(),
      fetchFiles(),
      fetchNotes(),
    ])

    const passwords = passwordsResult.status === 'fulfilled' ? passwordsResult.value : []
    const files = filesResult.status === 'fulfilled' ? filesResult.value : []
    const notes = notesResult.status === 'fulfilled' ? notesResult.value : []

    items.value = [
      ...(Array.isArray(passwords) ? passwords : []),
      ...(Array.isArray(files) ? files : []),
      ...(Array.isArray(notes) ? notes : []),
    ]
  }

  async function fetchFile(item) {
    await auth.restoreCryptoSession()

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
    await auth.restoreCryptoSession()

    if (!auth.privateKey) {
      throw new Error('Private key is missing')
    }
    return await decryptCredential(item.credential, auth.privateKey)
  }

  async function addPasswordItem(payload) {
    await auth.restoreCryptoSession()

    const credential = await encryptCredential(payload.password, auth.publicKey)
    const credentialBase64 = arrayBufferToBase64(credential)

    const title = await encryptData(payload.title, auth.publicKey)
    const username = await encryptData(payload.username, auth.publicKey)
    const website = await encryptData(payload.website, auth.publicKey)

    const res = await api.post('/api/password', {
      title: arrayBufferToBase64(title),
      website: arrayBufferToBase64(website),
      username: arrayBufferToBase64(username),
      credential: credentialBase64,
      favorite: false,
    })

    const saved = res.data.data.result || res.data.data

    items.value.unshift({
      id: saved?.id || saved?._id || Date.now(),
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

    const res = await api.post('/api/drive', {
      fileName: arrayBufferToBase64(fileName),
      file: encryptedFileBase64,
      fileType: arrayBufferToBase64(fileType),
      title: arrayBufferToBase64(title),
      iv: ivBase64,
      key: encryptedKeyBase64,
      favorite: false,
    })

    const saved = res.data.data.result || res.data.data

    items.value.unshift({
      id: saved?.id || saved?._id || Date.now(),
      key: encryptedKeyBase64,
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

  async function addNoteItem(payload) {
    await auth.restoreCryptoSession()

    const note = await encryptData(payload.content, auth.publicKey)
    const title = await encryptData(payload.title, auth.publicKey)

    const res = await api.post('/api/notes', {
      title: arrayBufferToBase64(title),
      content: arrayBufferToBase64(note),
      favorite: false,
    })

    const saved = res.data.data.result || res.data.data

    items.value.unshift({
      id: saved?.id || saved?._id || Date.now(),
      type: 'note',
      title: payload.title,
      subtitle: payload.content.replace(/<[^>]*>/g, '').slice(0, 80),
      icon: 'sticky_note_2',
      content: payload.content,
      favorite: false,
    })
  }

  async function toggleFavorite(id) {
    const item = items.value.find((item) => item.id === id)

    if (!item) return

    const oldValue = item.favorite
    item.favorite = !item.favorite

    try {
      if (item.type === 'password') {
        await api.patch(`/api/password/${item.id}`, {
          favorite: item.favorite,
        })
      }

      if (item.type === 'file') {
        await api.patch(`/api/drive/${encodeURIComponent(item.key)}`, {
          favorite: item.favorite,
        })
      }

      if (item.type === 'note') {
        await api.patch(`/api/notes/${item.id}`, {
          favorite: item.favorite,
        })
      }
    } catch (err) {
      item.favorite = oldValue
      console.error('Favorite update failed:', err.response?.data || err)
    }
  }

  return {
    search,
    items,
    selectedType,
    filteredItems,
    fetchVault,
    fetchPasswords,
    fetchFiles,
    fetchFile,
    fetchNotes,
    revealCredential,
    addPasswordItem,
    addFileItem,
    addNoteItem,
    toggleFavorite,
    copyPassword,
    copyUsername,
    openWebsite,
    deleteItem,
    downloadFile,
  }
})

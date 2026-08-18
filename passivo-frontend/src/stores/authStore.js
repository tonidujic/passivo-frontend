import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

import {
  deriveAuthAndEncryptionKeys,
  generateUserKeyPair,
  exportAuthKey,
} from 'src/utils/crypto/keys'

import {
  encryptPrivateKey,
  generateDeviceKey,
  exportDeviceKey,
  importDeviceKey,
  encryptPrivateKeyForDevice,
  decryptPrivateKeyForDevice,
  encryptData,
  decryptData,
} from 'src/utils/crypto/encryption'

import {
  arrayBufferToBase64,
  uint8ArrayToBase64,
  base64ToUint8Array,
  base64ToArrayBuffer,
} from 'src/utils/crypto/encoding'

import { saveDeviceKey, getDeviceKey, removeDeviceKey } from 'src/utils/crypto/deviceStorage'

const REMEMBER_ME_KEY = 'passivoRememberMe'

const ACTIVE_USER_KEY = 'passivoActiveUser'

const PUBLIC_KEY_KEY = 'publicKey'

const PRIVATE_KEY_DEVICE_KEY = 'privateKeyForDevice'

const PRIVATE_KEY_IV_KEY = 'devicePrivateKeyIv'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const privateKey = ref(null)
  const publicKey = ref(null)

  let autoLockInterval = null

  function setApiToken(token) {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      return
    }

    delete api.defaults.headers.common.Authorization
  }

  const userInitial = computed(() => {
    return user.value?.fullName?.charAt(0)?.toUpperCase() || ''
  })

  function isRememberMeEnabled() {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  }

  function getUserStorageKey(currentUser) {
    return currentUser?.id || currentUser?._id || currentUser?.email || null
  }

  function clearStorageKeys(storage) {
    storage.removeItem(PUBLIC_KEY_KEY)

    storage.removeItem(PRIVATE_KEY_DEVICE_KEY)

    storage.removeItem(PRIVATE_KEY_IV_KEY)
  }

  function clearActiveUserStorage() {
    localStorage.removeItem(ACTIVE_USER_KEY)

    sessionStorage.removeItem(ACTIVE_USER_KEY)
  }

  function saveActiveUserStorage(currentUser, remember) {
    const userKey = getUserStorageKey(currentUser)

    clearActiveUserStorage()

    if (!userKey) {
      return
    }

    const storage = remember ? localStorage : sessionStorage

    storage.setItem(ACTIVE_USER_KEY, String(userKey))
  }

  function saveCryptoStorage({
    publicKeyBase64,
    privateKeyForDevice,
    devicePrivateKeyIv,
    remember,
  }) {
    clearStorageKeys(localStorage)

    clearStorageKeys(sessionStorage)

    const storage = remember ? localStorage : sessionStorage

    storage.setItem(PUBLIC_KEY_KEY, publicKeyBase64)

    storage.setItem(PRIVATE_KEY_DEVICE_KEY, privateKeyForDevice)

    storage.setItem(PRIVATE_KEY_IV_KEY, devicePrivateKeyIv)

    if (remember) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true')
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY)
    }
  }

  function getCryptoStorage() {
    if (isRememberMeEnabled()) {
      return localStorage
    }

    return sessionStorage
  }

  async function restoreCryptoSession() {
    try {
      if (!publicKey.value || !privateKey.value) {
        const storage = getCryptoStorage()

        const publicKeyBase64 = storage.getItem(PUBLIC_KEY_KEY)

        const privateKeyForDevice = storage.getItem(PRIVATE_KEY_DEVICE_KEY)

        const devicePrivateKeyIv = storage.getItem(PRIVATE_KEY_IV_KEY)

        const deviceKeyBase64 = await getDeviceKey()

        if (!publicKeyBase64 || !privateKeyForDevice || !devicePrivateKeyIv || !deviceKeyBase64) {
          return false
        }

        publicKey.value = await crypto.subtle.importKey(
          'spki',
          base64ToArrayBuffer(publicKeyBase64),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['encrypt'],
        )

        const deviceKey = await importDeviceKey(deviceKeyBase64)

        const decryptedPrivateKey = await decryptPrivateKeyForDevice(
          privateKeyForDevice,
          devicePrivateKeyIv,
          deviceKey,
        )

        privateKey.value = await crypto.subtle.importKey(
          'pkcs8',
          decryptedPrivateKey,
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['decrypt'],
        )
      }

      if (!user.value) {
        const res = await api.get('/api/auth/me')

        const me = res.data.data.user

        user.value = me

        if (user.value?.fullName && privateKey.value) {
          user.value.fullName = await decryptData(user.value.fullName, privateKey.value)
        }
      }

      saveActiveUserStorage(user.value, isRememberMeEnabled())

      return true
    } catch (err) {
      console.error('RESTORE SESSION ERROR:', err.response?.data || err.message)

      return false
    }
  }

  const signUp = async (payload) => {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16))

      const { authKey, encryptionKey } = await deriveAuthAndEncryptionKeys(payload.password, salt)

      const keyPair = await generateUserKeyPair()

      const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey)

      const rawAuthKey = await exportAuthKey(authKey)

      const { privateKey: encryptedPrivateKey, iv } = await encryptPrivateKey(
        keyPair.privateKey,
        encryptionKey,
      )

      const encryptedFullName = await encryptData(payload.fullName, keyPair.publicKey)

      const signUpPayload = {
        fullName: arrayBufferToBase64(encryptedFullName),

        email: payload.email,

        salt: uint8ArrayToBase64(salt),

        payloadAuthKey: rawAuthKey,

        publicKey: arrayBufferToBase64(exportedPublicKey),

        privateKey: arrayBufferToBase64(encryptedPrivateKey),

        iv: uint8ArrayToBase64(iv),
      }

      const res = await api.post('/api/auth/signup', signUpPayload)

      user.value = res.data.data.user

      privateKey.value = keyPair.privateKey

      publicKey.value = keyPair.publicKey

      user.value.fullName = payload.fullName

      const deviceKey = await generateDeviceKey()

      const deviceKeyBase64 = await exportDeviceKey(deviceKey)

      const { privateKeyForDevice, devicePrivateKeyIv } = await encryptPrivateKeyForDevice(
        privateKey.value,
        deviceKey,
      )

      saveCryptoStorage({
        publicKeyBase64: arrayBufferToBase64(exportedPublicKey),

        privateKeyForDevice,

        devicePrivateKeyIv,

        remember: false,
      })

      saveActiveUserStorage(user.value, false)

      await saveDeviceKey(deviceKeyBase64)

      await autoLock()

      return res.data
    } catch (err) {
      console.error('SIGNUP STATUS:', err.response?.status)

      throw err
    }
  }

  const logIn = async ({ email, password, remember = false }) => {
    try {
      const initRes = await api.post('/api/auth/login/init', {
        email,
      })

      const salt = base64ToUint8Array(initRes.data.data.salt)

      const { authKey, encryptionKey } = await deriveAuthAndEncryptionKeys(password, salt)

      const rawAuthKey = await exportAuthKey(authKey)

      const res = await api.post('/api/auth/login', {
        email,
        authKey: rawAuthKey,
        remember,
      })

      setApiToken(res.data.data.token)

      user.value = res.data.data.user

      publicKey.value = await crypto.subtle.importKey(
        'spki',
        base64ToArrayBuffer(res.data.data.user.publicKey),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt'],
      )

      const decryptedPrivateKey = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',

          iv: base64ToUint8Array(res.data.data.user.iv),
        },

        encryptionKey,

        base64ToArrayBuffer(res.data.data.user.privateKey),
      )

      privateKey.value = await crypto.subtle.importKey(
        'pkcs8',
        decryptedPrivateKey,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['decrypt'],
      )

      user.value.fullName = await decryptData(user.value.fullName, privateKey.value)

      const deviceKey = await generateDeviceKey()

      const deviceKeyBase64 = await exportDeviceKey(deviceKey)

      const { privateKeyForDevice, devicePrivateKeyIv } = await encryptPrivateKeyForDevice(
        privateKey.value,
        deviceKey,
      )

      saveCryptoStorage({
        publicKeyBase64: res.data.data.user.publicKey,

        privateKeyForDevice,

        devicePrivateKeyIv,

        remember,
      })

      saveActiveUserStorage(user.value, remember)

      await saveDeviceKey(deviceKeyBase64)

      await autoLock()

      return res.data
    } catch (err) {
      console.error('STATUS:', err.response?.status)

      console.error('LOGIN ERROR:', err.response?.data || err.message)

      throw err
    }
  }

  async function clearSession() {
    setApiToken(null)

    user.value = null

    privateKey.value = null

    publicKey.value = null

    clearStorageKeys(sessionStorage)

    clearStorageKeys(localStorage)

    localStorage.removeItem(REMEMBER_ME_KEY)

    clearActiveUserStorage()

    await removeDeviceKey()
  }

  async function logout() {
    window.postMessage(
      {
        source: 'PASSIVO_APP',
        type: 'PASSIVO_LOGOUT',
      },
      window.location.origin,
    )

    await api.post('/api/auth/logout')

    await clearSession()
  }

  async function autoLock() {
    await resetTimer()

    window.removeEventListener('mousemove', resetTimer)

    window.removeEventListener('click', resetTimer)

    window.removeEventListener('scroll', resetTimer)

    window.removeEventListener('keydown', resetTimer)

    window.addEventListener('mousemove', resetTimer)

    window.addEventListener('click', resetTimer)

    window.addEventListener('scroll', resetTimer)

    window.addEventListener('keydown', resetTimer)
  }

  async function resetTimer() {
    clearTimeout(autoLockInterval)

    autoLockInterval = setTimeout(
      async () => {
        await clearSession()
      },
      30 * 60 * 1000,
    )
  }

  const verifyCurrentPassword = async (password) => {
    if (!user.value?.email) {
      throw new Error('User email is missing')
    }

    const initRes = await api.post('/api/auth/login/init', {
      email: user.value.email,
    })

    const salt = base64ToUint8Array(initRes.data.data.salt)

    const { authKey } = await deriveAuthAndEncryptionKeys(password, salt)

    const rawAuthKey = await exportAuthKey(authKey)

    const loginRes = await api.post('/api/auth/login', {
      email: user.value.email,

      authKey: rawAuthKey,

      remember: isRememberMeEnabled(),
    })

    setApiToken(loginRes.data.data.token)

    return true
  }

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user.value?.email) {
      throw new Error('User email is missing')
    }

    if (!privateKey.value) {
      throw new Error('Private key is not available')
    }

    const initRes = await api.post('/api/auth/login/init', {
      email: user.value.email,
    })

    const currentSalt = base64ToUint8Array(initRes.data.data.salt)

    const { authKey: currentAuthKey } = await deriveAuthAndEncryptionKeys(
      currentPassword,
      currentSalt,
    )

    const rawCurrentAuthKey = await exportAuthKey(currentAuthKey)

    const newSalt = crypto.getRandomValues(new Uint8Array(16))

    const { authKey: newAuthKey, encryptionKey: newEncryptionKey } =
      await deriveAuthAndEncryptionKeys(newPassword, newSalt)

    const rawNewAuthKey = await exportAuthKey(newAuthKey)

    const { privateKey: encryptedPrivateKey, iv } = await encryptPrivateKey(
      privateKey.value,
      newEncryptionKey,
    )

    await api.patch('/api/auth/change-password', {
      currentAuthKey: rawCurrentAuthKey,

      newAuthKey: rawNewAuthKey,

      salt: uint8ArrayToBase64(newSalt),

      privateKey: arrayBufferToBase64(encryptedPrivateKey),

      iv: uint8ArrayToBase64(iv),
    })
  }

  return {
    user,
    privateKey,
    publicKey,

    userInitial,

    signUp,
    logIn,
    logout,

    restoreCryptoSession,
    clearSession,

    verifyCurrentPassword,
    changePassword,
  }
})

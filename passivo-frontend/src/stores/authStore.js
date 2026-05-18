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

import { saveDeviceKey, getDeviceKey } from 'src/utils/crypto/deviceStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const privateKey = ref(null)
  const publicKey = ref(null)

  const userInitial = computed(() => {
    return user.value?.fullName?.charAt(0)?.toUpperCase() || ''
  })

  async function restoreCryptoSession() {
    if (publicKey.value && privateKey.value) {
      return
    }

    try {
      const publicKeyBase64 = sessionStorage.getItem('publicKey')

      const privateKeyForDevice = sessionStorage.getItem('privateKeyForDevice')

      const devicePrivateKeyIv = sessionStorage.getItem('devicePrivateKeyIv')

      const deviceKeyBase64 = await getDeviceKey()

      if (!publicKeyBase64 || !privateKeyForDevice || !devicePrivateKeyIv || !deviceKeyBase64) {
        return
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
      const res = await api.get('/api/auth/me')
      const me = res.data.data.user

      user.value = me

      if (user.value?.fullName) {
        user.value.fullName = await decryptData(user.value.fullName, privateKey.value)
      }
    } catch (err) {
      console.error('error:', err)
    }
  }

  const signUp = async (payload) => {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const { authKey, encryptionKey } = await deriveAuthAndEncryptionKeys(payload.password, salt)
      const keyPair = await generateUserKeyPair()
      const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      const rawAuthKey = await exportAuthKey(authKey)

      const { privateKey, iv } = await encryptPrivateKey(keyPair.privateKey, encryptionKey)
      let fullName = await encryptData(payload.fullName, keyPair.publicKey)

      const signUpPayload = {
        fullName: arrayBufferToBase64(fullName),
        email: payload.email,
        salt: uint8ArrayToBase64(salt),
        payloadAuthKey: rawAuthKey,
        publicKey: arrayBufferToBase64(exportedPublicKey),
        privateKey: arrayBufferToBase64(privateKey),
        iv: uint8ArrayToBase64(iv),
      }
      const res = await api.post('/api/auth/signup', signUpPayload)
      user.value = res.data.data.user
      privateKey.value = keyPair.privateKey
      publicKey.value = keyPair.publicKey
      const deviceKey = await generateDeviceKey()
      const deviceKeyBase64 = await exportDeviceKey(deviceKey)
      user.value.fullName = payload.fullName
      const { privateKeyForDevice, devicePrivateKeyIv } = await encryptPrivateKeyForDevice(
        privateKey.value,
        deviceKey,
      )

      sessionStorage.setItem('publicKey', arrayBufferToBase64(exportedPublicKey))
      sessionStorage.setItem('privateKeyForDevice', privateKeyForDevice)
      sessionStorage.setItem('devicePrivateKeyIv', devicePrivateKeyIv)

      await saveDeviceKey(deviceKeyBase64)
    } catch (err) {
      console.error('STATUS:', err.response?.status)

      throw err
    }
  }
  const logIn = async (payload) => {
    try {
      const initRes = await api.post('/api/auth/login/init', {
        email: payload.email,
      })

      const salt = base64ToUint8Array(initRes.data.data.salt)

      const { authKey, encryptionKey } = await deriveAuthAndEncryptionKeys(payload.password, salt)

      const rawAuthKey = await exportAuthKey(authKey)

      const res = await api.post('/api/auth/login', {
        email: payload.email,
        authKey: rawAuthKey,
      })

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

      sessionStorage.setItem('publicKey', res.data.data.user.publicKey)
      sessionStorage.setItem('privateKeyForDevice', privateKeyForDevice)
      sessionStorage.setItem('devicePrivateKeyIv', devicePrivateKeyIv)

      await saveDeviceKey(deviceKeyBase64)

      return res.data
    } catch (err) {
      console.error('STATUS:', err.response?.status)
      console.error('LOGIN ERROR:', err.response?.data || err.message)
      throw err
    }
  }

  return {
    signUp,
    logIn,
    user,
    privateKey,
    publicKey,
    restoreCryptoSession,
    userInitial,
  }
})

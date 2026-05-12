import { base64ToArrayBuffer, arrayBufferToBase64, uint8ArrayToBase64 } from './encoding'
export async function encryptPrivateKey(privateKey, encryptionKey) {
  // encryptedPrivateKey + iv

  const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', privateKey)

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encryptedPrivateKey = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    encryptionKey,
    exportedPrivateKey,
  )

  return { encryptedPrivateKey, iv }
}

export async function encryptCredential(credential, publicKey) {
  const encodedCredential = new TextEncoder().encode(credential)
  const encryptedCredential = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    encodedCredential,
  )

  return encryptedCredential
}

export async function decryptCredential(encryptedCredential, privateKey) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },

    privateKey,

    base64ToArrayBuffer(encryptedCredential),
  )

  return new TextDecoder().decode(decrypted)
}

export async function generateDeviceKey() {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },

    true,

    ['encrypt', 'decrypt'],
  )
}

export async function exportDeviceKey(deviceKey) {
  const raw = await crypto.subtle.exportKey('raw', deviceKey)

  return arrayBufferToBase64(raw)
}

export async function encryptPrivateKeyForDevice(privateKey, deviceKey) {
  const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', privateKey)

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },

    deviceKey,

    exportedPrivateKey,
  )

  return {
    encryptedPrivateKeyForDevice: arrayBufferToBase64(encrypted),

    devicePrivateKeyIv: uint8ArrayToBase64(iv),
  }
}
export async function importDeviceKey(deviceKeyBase64) {
  return await crypto.subtle.importKey(
    'raw',

    base64ToArrayBuffer(deviceKeyBase64),

    { name: 'AES-GCM' },

    true,

    ['encrypt', 'decrypt'],
  )
}

export async function decryptPrivateKeyForDevice(encryptedPrivateKeyForDevice, iv, deviceKey) {
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',

      iv: base64ToArrayBuffer(iv),
    },

    deviceKey,

    base64ToArrayBuffer(encryptedPrivateKeyForDevice),
  )
}

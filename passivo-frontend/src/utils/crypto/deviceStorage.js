const DB_NAME = 'passivo-device-db'
const STORE_NAME = 'keys'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDeviceKey(deviceKeyBase64) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')

    tx.objectStore(STORE_NAME).put(deviceKeyBase64, 'deviceKey')

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getDeviceKey() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')

    const request = tx.objectStore(STORE_NAME).get('deviceKey')

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
export async function removeDeviceKey() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')

    const store = tx.objectStore(STORE_NAME)

    const request = store.delete('deviceKey')

    request.onsuccess = () => resolve()

    request.onerror = () => reject(request.error)
  })
}

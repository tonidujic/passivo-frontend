import { boot } from 'quasar/wrappers'

import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore'

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : 'https://api.passivo.site')

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.user = null
      window.location.href = '/auth/login'
    }

    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { api }

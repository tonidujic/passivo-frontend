import { boot } from 'quasar/wrappers'
import { useThemeStore } from 'src/stores/themeStore'

export default boot(({ store }) => {
  const theme = useThemeStore(store)

  theme.initTheme()
})

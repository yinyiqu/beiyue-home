import { ref } from 'vue'

const KEY = 'yuetool-theme'

/** 初始值由 index.html 里的预置脚本写在 <html data-theme> 上，这里直接接过来 */
const theme = ref(
  typeof document !== 'undefined' ? document.documentElement.dataset.theme || 'dark' : 'dark'
)

function apply(next) {
  theme.value = next
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch (e) {
    /* 隐私模式下写不进去，不影响使用 */
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', next === 'light' ? '#f4f1ea' : '#08080c')
}

export function useTheme() {
  const toggle = () => apply(theme.value === 'dark' ? 'light' : 'dark')
  return { theme, toggle }
}

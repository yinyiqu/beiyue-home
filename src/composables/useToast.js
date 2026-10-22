import { ref } from 'vue'

/** 全局只留一条提示，后一条顶掉前一条 */
const message = ref('')
let timer = 0

export function useToast() {
  function show(text, duration = 2600) {
    message.value = text
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      message.value = ''
    }, duration)
  }
  return { message, show }
}

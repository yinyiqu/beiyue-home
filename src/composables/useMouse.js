import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 归一化鼠标坐标，范围 -1 ~ 1，供背景视差使用。
 * 只在精确指针设备上监听，触屏不做无意义的计算。
 */
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  let raf = 0
  let targetX = 0
  let targetY = 0

  function tick() {
    x.value += (targetX - x.value) * 0.08
    y.value += (targetY - y.value) * 0.08
    if (Math.abs(targetX - x.value) > 0.001 || Math.abs(targetY - y.value) > 0.001) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
    }
  }

  function onMove(e) {
    targetX = (e.clientX / window.innerWidth) * 2 - 1
    targetY = (e.clientY / window.innerHeight) * 2 - 1
    if (!raf) raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', onMove, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove)
    if (raf) cancelAnimationFrame(raf)
  })

  return { x, y }
}

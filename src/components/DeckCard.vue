<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  app: { type: Object, required: true },
  index: { type: Number, default: 0 },
  isLast: { type: Boolean, default: false }
})

const { show } = useToast()
const iconOk = ref(true)

/** 触屏按下时的手感：先抬起高亮，再跳转，别让动画一闪而过 */
const pressed = ref(false)
let pointerType = 'mouse'
let releaseTimer = 0
let navTimer = 0
let navigating = false

const sample = computed(() => !props.app.url)
const series = computed(() => String(props.index + 1).padStart(2, '0'))

/** 卡片左缘竖排的地址：域名 + 路径，去掉协议头与末尾斜杠 */
const address = computed(() => {
  if (!props.app.url) return 'sample — url not set'
  try {
    const { hostname, pathname, search, hash } = new URL(props.app.url, document.baseURI)
    return `${hostname.replace(/^www\./, '')}${pathname}${search}${hash}`.replace(/\/+$/, '')
  } catch (e) {
    return props.app.url
  }
})

const initial = computed(() => props.app.name.slice(0, 1))

const style = computed(() => ({
  '--hue': props.app.hue,
  '--i': props.index,
  '--tilt': `${props.index % 2 === 0 ? -0.35 : 0.35}deg`
}))

function onPointerDown(event) {
  pointerType = event.pointerType || 'mouse'
  if (pointerType === 'mouse') return
  clearTimeout(releaseTimer)
  pressed.value = true
}

function onPointerUp() {
  if (pointerType === 'mouse') return
  clearTimeout(releaseTimer)
  releaseTimer = window.setTimeout(() => {
    pressed.value = false
  }, 220)
}

function onPointerCancel() {
  if (navigating) return
  clearTimeout(releaseTimer)
  pressed.value = false
}

onBeforeUnmount(() => {
  clearTimeout(releaseTimer)
  clearTimeout(navTimer)
})

/** 指针位置换算成卡面百分比，驱动高光跟着手走 */
function onPointerMove(event) {
  const face = event.currentTarget.querySelector('.card__face')
  if (!face) return
  const rect = face.getBoundingClientRect()
  face.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
  face.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`)
}

function onOpen(event) {
  if (sample.value) {
    event.preventDefault()
    pressed.value = false
    show(`示例牌 · 在 src/data/site.js 里给「${props.app.name}」填上 url`)
    return
  }

  // 触屏：先让「抽牌」动完再跳转
  if (pointerType === 'touch' || pointerType === 'pen') {
    event.preventDefault()
    navigating = true
    pressed.value = true
    clearTimeout(navTimer)
    navTimer = window.setTimeout(() => {
      window.location.href = props.app.url
    }, 190)
  }
}
</script>

<template>
  <a
    class="card"
    :class="{ 'is-pressed': pressed }"
    :href="app.url || '#'"
    :style="style"
    :aria-label="`${app.name}${app.tag ? '，' + app.tag : ''}${app.desc ? '，' + app.desc : ''}`"
    @click="onOpen"
    @pointermove="onPointerMove"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @pointerleave="onPointerCancel"
  >
    <span class="card__face">
      <span class="card__frame" aria-hidden="true" />

      <!-- 大号序号：整张牌完全露出时才看得全，像牌角上的点数 -->
      <span class="card__series" aria-hidden="true">{{ series }}</span>

      <span class="card__corner">
        <span class="card__text">
          <span class="card__name">{{ app.name }}</span>
          <span class="card__meta">
            <span class="card__en">{{ app.en }}</span>
            <span v-if="app.tag" class="card__dot" aria-hidden="true">·</span>
            <span v-if="app.tag">{{ app.tag }}</span>
          </span>
          <span v-if="app.desc" class="card__desc">{{ app.desc }}</span>
        </span>

        <span class="card__icon" aria-hidden="true">
          <img
            v-if="app.icon && iconOk"
            class="card__icon-img"
            :src="app.icon"
            alt=""
            loading="lazy"
            decoding="async"
            @error="iconOk = false"
          />
          <span v-else-if="app.emoji" class="card__emoji">{{ app.emoji }}</span>
          <span v-else class="card__initial">{{ initial }}</span>
        </span>
      </span>

      <span class="card__spine" aria-hidden="true">{{ address }}</span>

      <span v-if="isLast" class="card__cta" aria-hidden="true">
        <span>打开项目</span>
        <span class="card__cta-arrow">↗</span>
      </span>

    </span>
  </a>
</template>


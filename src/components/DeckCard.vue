<script setup>
import { computed, ref } from 'vue'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  app: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const { show } = useToast()
const iconOk = ref(true)

const sample = computed(() => !props.app.url)
const series = computed(() => String(props.index + 1).padStart(2, '0'))

/** 卡片左缘竖排的地址：域名 + 路径，去掉协议头与末尾斜杠 */
const address = computed(() => {
  if (!props.app.url) return 'sample — url not set'
  try {
    const { hostname, pathname, search, hash } = new URL(props.app.url)
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

function onOpen(event) {
  if (sample.value) {
    event.preventDefault()
    show(`示例牌 · 在 src/data/site.js 里给「${props.app.name}」填上 url`)
  }
}
</script>

<template>
  <a
    class="card"
    :href="app.url || '#'"
    :style="style"
    :aria-label="`${app.name}${app.tag ? '，' + app.tag : ''}${app.desc ? '，' + app.desc : ''}`"
    @click="onOpen"
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

    </span>
  </a>
</template>


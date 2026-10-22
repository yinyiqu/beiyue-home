<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  app: { type: Object, required: true },
  index: { type: Number, default: 0 },
  // 最后一张整张露出，作为整叠的收尾
  isLast: { type: Boolean, default: false }
})

const iconOk = ref(true)

const showIcon = computed(() => Boolean(props.app.icon) && iconOk.value)
const showEmoji = computed(() => !showIcon.value && Boolean(props.app.emoji))
const initial = computed(() => props.app.name.slice(0, 1))

/** 左缘竖排的地址：域名 + 路径，去掉协议头与末尾斜杠 */
const address = computed(() => {
  if (!props.app.url) return 'url not set'
  try {
    const { hostname, pathname, search, hash } = new URL(props.app.url, document.baseURI)
    return `${hostname.replace(/^www\./, '')}${pathname}${search}${hash}`.replace(/\/+$/, '')
  } catch (e) {
    return props.app.url
  }
})

/** 奇偶微微交错，像被随手码好的一叠牌；底牌端正摆放 */
const style = computed(() => {
  const stagger = props.isLast ? 0 : props.index % 2 === 0 ? -1 : 1
  return {
    '--hue': props.app.hue,
    '--i': props.index,
    '--tilt': `${(stagger * 0.3).toFixed(2)}deg`,
    '--fan': `${(stagger * 1.5).toFixed(2)}px`
  }
})
</script>

<template>
  <a
    :href="app.url || '#'"
    class="card"
    :class="{ 'card--last': isLast }"
    :style="style"
    :aria-label="`${app.name}${app.tag ? '，' + app.tag : ''}${app.desc ? '，' + app.desc : ''}`"
  >
    <span class="card__face">
      <span class="card__frame" aria-hidden="true" />

      <!-- 牌心的大号序号，被压住也不影响角落那一条 -->
      <span class="card__series" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>

      <!-- 名称在左上、图标在右上：叠起来时唯一必须看清的一整行 -->
      <span class="card__corner">
        <span class="card__text">
          <span class="card__name">{{ app.name }}</span>
          <span class="card__meta">
            <span class="card__en">{{ app.en }}</span>
            <span v-if="app.tag" class="card__dot" aria-hidden="true">·</span>
            <span v-if="app.tag">{{ app.tag }}</span>
          </span>
        </span>

        <span class="card__icon" aria-hidden="true">
          <img
            v-if="showIcon"
            class="card__icon-img"
            :src="app.icon"
            alt=""
            loading="lazy"
            decoding="async"
            @error="iconOk = false"
          />
          <span v-else-if="showEmoji" class="card__emoji">{{ app.emoji }}</span>
          <span v-else class="card__initial">{{ initial }}</span>
        </span>
      </span>

      <span v-if="app.desc" class="card__desc">{{ app.desc }}</span>

      <!-- 左缘竖排地址：牌向左抽出时，这一条始终在视野里 -->
      <span class="card__spine" aria-hidden="true">{{ address }}</span>
    </span>
  </a>
</template>

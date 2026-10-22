<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DeckCard from './DeckCard.vue'

const props = defineProps({
  apps: { type: Array, default: () => [] },
  deal: { type: Number, default: 0 }
})
const emit = defineEmits(['clear'])

const deckEl = ref(null)
const stageEl = ref(null)
const progress = ref(0)
const count = computed(() => props.apps.length)

/** 每一张牌占 80% 屏高，末尾再留一屏收尾 */
const sectionHeight = computed(() => `${Math.max(1, count.value - 1) * 80 + 100}vh`)

let raf = 0

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

/** 滚动进度 → 每张牌的层叠位置（0 = 最前面那张） */
function frame() {
  raf = 0
  const section = deckEl.value
  if (!section) return
  const vh = window.innerHeight
  const step = vh * 0.8
  const top = section.getBoundingClientRect().top + window.scrollY
  const p = clamp((window.scrollY - top) / step, 0, Math.max(0, count.value - 1))
  progress.value = p

  const items = Array.from(stageEl.value?.querySelectorAll('.deck__item') || [])
  items.forEach((el, i) => {
    const offset = i - p // 0 在最前；正数叠在后面；负数已经翻过去
    let transform = ''
    let opacity = 1

    if (offset >= 0) {
      // 后面的牌：略微缩小、向下错开，露出一条边；轮到它时自然向上归位
      const d = Math.min(offset, 3)
      transform = `translate3d(0, ${d * 44}px, 0) scale(${1 - d * 0.06})`
      opacity = offset > 2.7 ? 0 : 1
    } else {
      // 翻过去的牌：加速向上飞走并淡出，把位置让给下一张
      const t = Math.min(1, -offset)
      const ease = 1 - Math.pow(1 - t, 3)
      transform = `translate3d(0, ${-ease * 150}%, 0) rotate(${-ease * 9}deg) scale(${1 - ease * 0.08})`
      opacity = Math.max(0, 1 - t * 1.15)
    }

    el.style.transform = transform
    el.style.opacity = String(opacity)
    el.style.zIndex = String(20 - i)
    el.style.pointerEvents = offset > 0.5 ? 'none' : 'auto'
    el.inert = offset > 0.5
    el.classList.toggle('is-active', Math.abs(offset) < 0.6)
  })
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(frame)
}

function scrollToIndex(index) {
  const section = deckEl.value
  if (!section) return
  const vh = window.innerHeight
  const top = section.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: top + index * vh * 0.8, behavior: 'smooth' })
}

function moveFocus(step) {
  const cards = Array.from(stageEl.value?.querySelectorAll('.card') || [])
  if (!cards.length) return
  const current = cards.indexOf(document.activeElement)
  const next = current === -1 ? 0 : Math.min(Math.max(current + step, 0), cards.length - 1)
  scrollToIndex(next)
  window.setTimeout(() => cards[next]?.focus({ preventScroll: true }), 420)
}

function onKeydown(event) {
  if (event.target instanceof HTMLInputElement) return
  const key = event.key
  if (key === 'ArrowDown' || key === 'ArrowRight') {
    event.preventDefault()
    moveFocus(1)
  } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
    event.preventDefault()
    moveFocus(-1)
  }
}

// 搜索 / 洗牌后 DOM 重建，需要重新算一次层叠位置
watch(
  () => props.apps.map((a) => a.id).join('|') + '#' + props.deal,
  () => nextTick(frame)
)

onMounted(() => {
  frame()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="deck-root">
    <div v-if="apps.length" ref="deckEl" class="deck" :style="{ height: sectionHeight }">
      <div ref="stageEl" class="deck__stage" @keydown="onKeydown">
        <div
          v-for="(app, i) in apps"
          :key="`${app.id}-${deal}`"
          class="deck__item"
          :style="{ '--i': i }"
        >
          <DeckCard :app="app" :index="i" :is-last="i === apps.length - 1" />
        </div>

        <div class="deck__dots" aria-hidden="true">
          <span
            v-for="(app, i) in apps"
            :key="app.id"
            class="deck__dot"
            :class="{ 'is-on': Math.round(progress) === i }"
          />
        </div>
      </div>
    </div>

    <div v-else class="empty" role="status">
      <span class="empty__mark" aria-hidden="true">🃏</span>
      <p class="empty__title">牌堆里没有这一张</p>
      <p class="empty__hint">换个关键词，或者把牌都摊开看看。</p>
      <button class="empty__btn" type="button" @click="emit('clear')">清空搜索</button>
    </div>
  </div>
</template>

<style scoped>
.deck-root {
  width: 100%;
  --card-w: min(100%, 760px);
  --card-rw: 3;
  --card-rh: 4;
}

.deck {
  position: relative;
  width: 100%;
}

/* 叠卡舞台：占满一屏、吸顶，所有牌叠在同一格里 */
.deck__stage {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  padding-inline: 18px;
}

.deck__item {
  grid-area: 1 / 1;
  width: var(--card-w);
  transform-origin: 50% 50%;
  will-change: transform, opacity;
  transition: transform 120ms linear, opacity 120ms linear;
}

/* 舞台底部的页码点 */
.deck__dots {
  position: absolute;
  left: 50%;
  bottom: max(22px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 60;
  pointer-events: none;
}

.deck__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--line-strong);
  transition: background var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-spring);
}

.deck__dot.is-on {
  background: var(--accent);
  transform: scale(1.35);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-inline: auto;
  max-width: 520px;
  padding: clamp(56px, 10vw, 96px) 24px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-card);
  text-align: center;
}
.empty__mark {
  font-size: 2rem;
  opacity: 0.7;
  margin-bottom: 4px;
}
.empty__title {
  font-size: 1rem;
  font-weight: 600;
}
.empty__hint {
  font-size: 0.82rem;
  color: var(--text-3);
}
.empty__btn {
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line-strong);
  font-size: 0.8rem;
  color: var(--text-2);
  transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.empty__btn:hover {
  color: var(--text);
  background: var(--surface);
}

@media (max-width: 899.98px) {
  .deck-root {
    --card-w: min(calc(100vw - 40px), 520px);
  }
}

@media (min-width: 900px) {
  .deck-root {
    --card-rw: 16;
    --card-rh: 9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck__item {
    transition: none;
  }
}
</style>

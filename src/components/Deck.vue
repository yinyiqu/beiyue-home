<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DeckCard from './DeckCard.vue'

defineProps({
  apps: { type: Array, default: () => [] },
  deal: { type: Number, default: 0 }
})
const emit = defineEmits(['clear'])

const deckEl = ref(null)
let raf = 0

/** 滚动时只让「当前那张」突出：其余压暗 */
function updateActive() {
  const items = Array.from(deckEl.value?.querySelectorAll('.deck__item') || [])
  if (!items.length) return
  // 当前突出的，是最上面那张「已经升起」的牌：它的顶边一进入视口就算数
  const vh = window.innerHeight
  let active = 0
  for (let i = 0; i < items.length; i++) {
    if (items[i].getBoundingClientRect().top < vh * 0.9) active = i
  }
  items.forEach((el, i) => el.classList.toggle('is-active', i === active))
  raf = 0
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(updateActive)
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

/** ↑↓ / ←→ 在牌堆里移动焦点，Enter 由链接自己处理 */
function moveFocus(step) {
  const cards = Array.from(deckEl.value?.querySelectorAll('.card') || [])
  if (!cards.length) return
  const current = cards.indexOf(document.activeElement)
  const next =
    current === -1
      ? step > 0
        ? 0
        : cards.length - 1
      : Math.min(Math.max(current + step, 0), cards.length - 1)
  cards[next]?.focus()
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
  } else if (key === 'Home') {
    event.preventDefault()
    moveFocus(-999)
  } else if (key === 'End') {
    event.preventDefault()
    moveFocus(999)
  }
}
</script>

<template>
  <div class="deck-root">
    <div v-if="apps.length" ref="deckEl" class="deck" @keydown="onKeydown">
      <div v-for="(app, i) in apps" :key="`${app.id}-${deal}`" class="deck__item" :style="{ '--i': i }">
        <DeckCard :app="app" :index="i" :is-last="i === apps.length - 1" />
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
  max-width: 520px;
  margin-inline: auto;
  padding-inline: clamp(18px, 5vw, 28px);
  --card-rw: 3;
  --card-rh: 4;
}

.deck {
  display: flex;
  flex-direction: column;
}

/* 上下滑动时，牌一张接一张地压上来，只在顶部留一窄条 */
.deck__item {
  position: sticky;
  top: calc(88px + var(--i, 0) * 20px);
  z-index: calc(var(--i, 0) + 1);
  margin-bottom: 48vh;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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

@media (min-width: 900px) {
  .deck-root {
    max-width: 720px;
    padding-inline: 24px;
    --card-rw: 16;
    --card-rh: 9;
  }
  .deck__item {
    top: calc(112px + var(--i, 0) * 26px);
    margin-bottom: 44vh;
  }
}
</style>

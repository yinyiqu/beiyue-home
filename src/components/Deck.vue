<script setup>
import { ref } from 'vue'
import DeckCard from './DeckCard.vue'
import ColophonCard from './ColophonCard.vue'

defineProps({
  apps: { type: Array, default: () => [] },
  deal: { type: Number, default: 0 },
  showColophon: { type: Boolean, default: true }
})
const emit = defineEmits(['clear'])

const deckEl = ref(null)

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
        <DeckCard :app="app" :index="i" />
      </div>

      <!-- 说明牌：搜索时收起，免得挡住结果 -->
      <div v-if="showColophon" :key="`colophon-${deal}`" class="deck__item" :style="{ '--i': apps.length }">
        <ColophonCard :count="apps.length" />
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
  max-width: 500px;
  margin-inline: auto;
  padding-inline: clamp(18px, 5vw, 28px);
  /* 卡片比例与「露出比例」统一在这里定义 */
  --card-rw: 9;
  --card-rh: 16;
  --band: 0.2;
}

.deck {
  display: flex;
  flex-direction: column;
  min-width: 288px;
}

/* 后面的牌层级更高，压住前一张的下沿，只留出顶部一条 */
.deck__item {
  position: relative;
  z-index: calc(var(--i, 0) + 1);
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

/* ── 宽屏：16:9 横牌 ─────────────────────────────────────
   左侧留 15% 作为「抽出车道」，卡片宽 85%；
   抽出量 17.65% 卡宽 = 15% 容器宽，正好填满车道，不越界。 */
@media (min-width: 900px) {
  .deck-root {
    --card-rw: 16;
    --card-rh: 9;
    --band: 0.3;
    max-width: 1120px;
    padding-inline: clamp(24px, 4vw, 40px);
  }
  .deck {
    /* 左右各留 8% 作为抽出车道：牌堆整体居中，
       悬停时向左抽出 8% 容器宽（= 9.52% 卡宽），正好填满车道 */
    padding-inline: 8%;
    min-width: 620px;
  }
}
</style>

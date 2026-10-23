<script setup>
import DeckCard from './DeckCard.vue'

defineProps({
  apps: { type: Array, default: () => [] },
  /** 洗牌计数：变化时整套牌重挂载，发牌动画重播 */
  deal: { type: Number, default: 0 }
})
const emit = defineEmits(['clear'])
</script>

<template>
  <div class="deck-root">
    <div v-if="apps.length" class="deck">
      <div
        v-for="(app, i) in apps"
        :key="`${app.id}-${deal}`"
        class="deck__item"
        :style="{ '--i': i }"
      >
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
  /* 竖屏：单列竖卡，几乎吃满可用宽度 */
  max-width: 520px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
  /* 卡片比例在这里统一定义，卡片只消费不定义 */
  --card-ratio-w: 9;
  --card-ratio-h: 16;
}

.deck {
  display: flex;
  flex-direction: column;
}

/* 越靠后的牌层级越高：它压住上一张的下沿，
   于是每张牌都只被下一张遮住一点点，像一叠码好的牌。 */
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

/* ── 横版（≥720px）：16:9 横卡 ─────────────────────────────
   左侧留出 1/6 容器宽作为「抽出车道」，卡宽占 5/6。
   卡片抽出量 = 20% 卡宽 = (5/6) ÷ 5 = 1/6 容器宽，恰好填满车道。 */
@media (min-width: 720px) {
  .deck-root {
    max-width: 860px;
    padding-inline: 24px;
    --card-ratio-w: 16;
    --card-ratio-h: 9;
  }

  .deck {
    /* 左侧留出 1/6 容器宽作为「抽出车道」，卡宽占 5/6；
       卡片抽出量 = 20% 卡宽 = 1/6 容器宽，正好填满这条车道 */
    padding-left: 16.6667%;
  }
}
</style>

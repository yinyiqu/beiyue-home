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
/** 后面最多露出几条卡头 */
const MAX_BEHIND = 3
/** 每往上一层缩一点，像牌被捏紧 */
const SCALE_STEP = 0.042
let headCache = 0

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

/** 头部条的像素高度，从 CSS 变量读一次就缓存，resize 时重取 */
function readHead() {
  if (!headCache) {
    const raw = getComputedStyle(deckEl.value).getPropertyValue('--head-h')
    headCache = parseFloat(raw) || 92
  }
  return headCache
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

  // 露头位置：第 d 层的顶边落在第 d-1 层之上「一个头部条」的位置，
  // 因为每一层都在缩小，露出的高度也随缩放略减，累积起来正好齐平。
  const head = readHead()
  const behind = Math.min(Math.max(count.value - 1, 0), MAX_BEHIND)
  const ys = [0]
  for (let k = 1; k <= behind; k++) {
    ys[k] = ys[k - 1] - head * (1 - k * SCALE_STEP)
  }
  const items = Array.from(stageEl.value?.querySelectorAll('.deck__item') || [])

  // 牌堆还没吸顶时，上方那截空间不属于它：舞台高度收到视口剩余部分
  const gap = Math.max(0, section.getBoundingClientRect().top)
  const stageH = Math.max(vh * 0.5, vh - gap)
  if (stageEl.value) stageEl.value.style.height = `${Math.round(stageH)}px`

  // 整摞（含露出的头）视觉居中：露几条头就往下补半个高度，随滚动连续变化
  const liveBehind = Math.min(Math.max(count.value - 1 - p, 0), behind)
  const lift = (liveBehind * head) / 2 - gap / 2
  // 但不能把卡头顶进工具栏：留一条安全距离
  const cardH = items[0]?.offsetHeight || vh * 0.5
  const itemTop = gap + (stageH - cardH) / 2
  const shift = Math.max(lift, gap + 10 - itemTop + liveBehind * head)

  items.forEach((el, i) => {
    const offset = i - p // 0 在最前；正数叠在后面；负数已经翻过去
    let transform = ''
    let opacity = 1
    let z = 30

    if (offset >= 0) {
      // 后面的牌：向上错开一个头部条，只露头；越往后越小
      const d = Math.min(offset, behind)
      const lo = Math.floor(d)
      const hi = Math.min(lo + 1, behind)
      const y = ys[lo] + (ys[hi] - ys[lo]) * (d - lo) + shift
      const scale = 1 - d * SCALE_STEP
      transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
      opacity = offset > behind + 0.02 ? 0 : 1
      z = 30 - Math.round(d)
    } else {
      // 当前这张被翻走：向上飞出、淡出，把位置让给下一张
      const t = Math.min(1, -offset)
      const ease = t * t * (3 - 2 * t)
      transform =
        `translate3d(0, ${shift.toFixed(2)}px, 0)` +
        ` translate3d(0, ${(-ease * 172).toFixed(2)}%, 0)` +
        ` rotate(${(-ease * 3).toFixed(2)}deg) scale(${(1 + ease * 0.01).toFixed(4)})`
      // 整张不透明地抽走，只在最后一段消失：半透明会让上下两张的文字糊在一起
      opacity = ease > 0.82 ? clamp(1 - (ease - 0.82) * 4.6, 0, 1) : 1
      z = 50
    }

    el.style.transform = transform
    el.style.opacity = String(opacity)
    el.style.zIndex = String(z)
    el.classList.toggle('is-active', Math.abs(offset) < 0.5)
  })
}

/** 键盘 Tab 到后面的牌时，也先把它抽上来 */
function onItemFocus(index) {
  if (index === Math.round(progress.value)) return
  scrollToIndex(index)
}

/** 点后面那张卡的头部：先把它抽到最前面，再点一次才打开 */
function onItemClick(event, index) {
  if (index === Math.round(progress.value)) return
  event.preventDefault()
  event.stopPropagation()
  scrollToIndex(index)
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(frame)
}

function onResize() {
  headCache = 0
  onScroll()
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
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
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
          @click.capture="onItemClick($event, i)"
          @focusin="onItemFocus(i)"
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
  /* 露头的那一条：卡片折叠时露出的高度 */
  --head-h: 72px;
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
  /* 顶部中心为原点：缩小的时候卡头位置稳住，只往两侧收 */
  transform-origin: 50% 0;
  will-change: transform, opacity;
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
    /* 留出底部页码点的位置，也让整摞在工具栏下方更透气；
       矮屏再按可用高度收一次，保证整摞不会顶出屏幕 */
    --card-w: min(calc(100vw - 56px), 480px, calc((100vh - 300px) * 3 / 4));
  }
}

@media (min-width: 900px) {
  .deck-root {
    --card-rw: 16;
    --card-rh: 9;
    --head-h: 96px;
    /* 宽屏用满 760，矮一点的窗口按高度收，整摞始终装得下 */
    --card-w: min(100%, 760px, calc((100vh - 384px) * 16 / 9));
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck__item {
    transition: none;
  }
}
</style>

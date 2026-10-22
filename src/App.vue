<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BackgroundFX from './components/BackgroundFX.vue'
import NavBar from './components/NavBar.vue'
import DeckIntro from './components/DeckIntro.vue'
import Deck from './components/Deck.vue'
import SiteFooter from './components/SiteFooter.vue'
import ToastHost from './components/ToastHost.vue'
import { apps as sourceApps } from './data/site.js'

/** 当前牌序：洗牌只动这份数组，原始数据保持不动 */
const deck = ref([...sourceApps])
const query = ref('')
const deal = ref(0)
const intro = ref(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return deck.value
  return deck.value.filter((app) =>
    [app.name, app.en, app.tag, app.desc].join(' ').toLowerCase().includes(q)
  )
})

function shuffle() {
  const next = [...deck.value]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  deck.value = next
  // key 变化 → 整叠牌重新发一次，动画重播
  deal.value += 1
  query.value = ''
}

/** 全局快捷键：/ 聚焦搜索，Esc 清空 */
function onKeydown(event) {
  const el = event.target
  const typing =
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el?.isContentEditable

  if (event.key === '/' && !typing) {
    event.preventDefault()
    intro.value?.focus()
  } else if (event.key === 'Escape' && !typing && query.value) {
    query.value = ''
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <a class="skip" href="#deck">跳到牌堆</a>

  <BackgroundFX />
  <NavBar />

  <main id="top" class="main">
    <div class="shell">
      <DeckIntro
        ref="intro"
        v-model="query"
        :count="filtered.length"
        :total="deck.length"
        @shuffle="shuffle"
      />
      <Deck
        id="deck"
        :apps="filtered"
        :deal="deal"
        :show-colophon="!query.trim()"
        @clear="query = ''"
      />
    </div>
  </main>

  <SiteFooter />
  <ToastHost />
</template>

<style scoped>
.skip {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 999;
  padding: 10px 16px;
  background: var(--surface-solid);
  border-radius: 0 0 var(--radius-md) 0;
}
.skip:focus {
  left: 0;
}

.main {
  position: relative;
  z-index: var(--z-content);
  padding-top: 104px;
}

.shell {
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 40px);
}

@media (min-width: 760px) {
  .main {
    padding-top: 124px;
  }
}
</style>

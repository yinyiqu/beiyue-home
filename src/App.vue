<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BackgroundFX from './components/BackgroundFX.vue'
import NavBar from './components/NavBar.vue'
import DeckIntro from './components/DeckIntro.vue'
import Deck from './components/Deck.vue'
import SiteFooter from './components/SiteFooter.vue'
import ToastHost from './components/ToastHost.vue'
import { apps as sourceApps } from './data/site.js'

const query = ref('')
const intro = ref(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return sourceApps
  return sourceApps.filter((app) =>
    [app.name, app.en, app.tag, app.desc].join(' ').toLowerCase().includes(q)
  )
})

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
      <DeckIntro ref="intro" v-model="query" />
      <Deck id="deck" :apps="filtered" @clear="query = ''" />
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
  padding-top: 92px;
  padding-bottom: clamp(24px, 5vw, 48px);
}

.shell {
  /* 宽度由牌堆自己控制（竖屏 520 / 横版 860），这里只做打包 */
  width: 100%;
}

@media (min-width: 760px) {
  .main {
    padding-top: 108px;
  }
}
</style>

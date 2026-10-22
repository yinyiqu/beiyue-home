<script setup>
import { ref } from 'vue'
import { site } from '../data/site.js'

const props = defineProps({
  count: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'shuffle'])

const input = ref(null)
const focused = ref(false)

const clear = () => {
  emit('update:modelValue', '')
  input.value?.focus()
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <section class="intro" aria-labelledby="intro-title">
    <div class="intro__copy">
      <p class="intro__eyebrow">{{ site.eyebrow }}</p>
      <h1 id="intro-title" class="intro__title">
        {{ site.tagline }}<br />
        <em>{{ site.taglineStrong }}</em>
      </h1>
      <p class="intro__hint">
        {{ site.hint }}
        <span class="intro__count">{{ count }}<span v-if="count !== total"> / {{ total }}</span> 张</span>
      </p>
    </div>

    <div class="intro__tools">
      <label class="search" :class="{ 'is-focused': focused }">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" stroke-linecap="round" />
        </svg>
        <span class="visually-hidden">搜索卡片</span>
        <input
          ref="input"
          type="search"
          :value="props.modelValue"
          placeholder="找一张牌"
          autocomplete="off"
          spellcheck="false"
          @input="emit('update:modelValue', $event.target.value)"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.esc.prevent="clear"
        />
        <button v-if="modelValue" class="search__clear" type="button" aria-label="清空搜索" @click="clear">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <kbd v-else class="search__kbd" aria-hidden="true">/</kbd>
      </label>

      <button class="shuffle" type="button" @click="emit('shuffle')">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 7h3.5l9 10H20" />
          <path d="M4 17h3.5l9-10H20" />
          <path d="m17.5 4.5 2.5 2.5-2.5 2.5M17.5 14.5 20 17l-2.5 2.5" />
        </svg>
        <span class="shuffle__label">洗牌</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(20px, 4vw, 48px);
  padding-bottom: clamp(24px, 3.4vw, 40px);
}

.intro__copy {
  min-width: 0;
}

.intro__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 14px;
}

.intro__title {
  font-size: clamp(1.6rem, 3.1vw, 2.45rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.intro__title em {
  font-style: normal;
  background: var(--accent-grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.intro__hint {
  margin-top: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--text-3);
}

.intro__count {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  color: var(--text-2);
}

.intro__tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 208px;
  height: 38px;
  padding-inline: 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color var(--dur-base) var(--ease-out),
    background var(--dur-base) var(--ease-out), width var(--dur-base) var(--ease-out);
}
.search:hover {
  border-color: var(--line-strong);
}
.search.is-focused {
  border-color: color-mix(in oklab, var(--accent) 55%, transparent);
  background: var(--surface-strong);
  color: var(--text-2);
}

.search input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 0.82rem;
  color: var(--text);
}
.search input::placeholder {
  color: var(--text-3);
}
.search input::-webkit-search-cancel-button {
  display: none;
}

.search__kbd {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1;
  padding: 3px 5px;
  border-radius: 5px;
  border: 1px solid var(--line);
  color: var(--text-3);
}

.search__clear {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: var(--text-3);
  transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.search__clear:hover {
  color: var(--text);
  background: var(--line);
}

.shuffle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding-inline: 15px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-2);
  font-size: 0.8rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform var(--dur-fast) var(--ease-spring), color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}
.shuffle:hover {
  transform: translateY(-1px);
  color: var(--text);
  border-color: var(--line-strong);
}
.shuffle:active {
  transform: translateY(0) scale(0.97);
}
.shuffle svg {
  transition: transform var(--dur-base) var(--ease-spring);
}
.shuffle:hover svg {
  transform: rotate(18deg);
}

@media (max-width: 760px) {
  .intro {
    flex-direction: column;
    align-items: stretch;
    gap: 22px;
  }
  .intro__tools {
    justify-content: space-between;
  }
  .search {
    flex: 1 1 auto;
    width: auto;
  }
}

@media (max-width: 380px) {
  .shuffle {
    padding-inline: 12px;
  }
  .shuffle__label {
    display: none;
  }
}
</style>

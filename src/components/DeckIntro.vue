<script setup>
import { ref } from 'vue'

const props = defineProps({
  count: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
const focused = ref(false)

const clear = () => {
  emit('update:modelValue', '')
  input.value?.focus()
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="bar">
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
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 860px;
  margin-inline: auto;
  /* 与 deck-root 完全一致的内边距，搜索框左缘与容器对齐 */
  padding: 0 clamp(16px, 4vw, 32px) clamp(16px, 2.2vw, 24px);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 168px;
  height: 36px;
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

@media (min-width: 720px) {
  .bar {
    padding-inline: 24px;
  }
}

@media (max-width: 719.98px) {
  .search {
    width: 156px;
  }
}
</style>

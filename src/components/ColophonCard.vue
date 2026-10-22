<script setup>
import { computed } from 'vue'
import { site } from '../data/site.js'

const props = defineProps({
  count: { type: Number, default: 0 }
})

const specs = computed(() => [
  { label: 'cards', value: `${String(props.count).padStart(2, '0')} 张` },
  { label: 'updated', value: '不定期' },
  { label: 'built', value: 'Vue 3 + Vite' }
])
</script>

<template>
  <section class="card card--colophon" :style="{ '--hue': 36 }" aria-labelledby="colophon-title">
    <div class="card__face">
      <span class="card__frame" aria-hidden="true" />
      <span class="card__series" aria-hidden="true">∞</span>

      <div class="card__corner">
        <div class="card__text">
          <h2 id="colophon-title" class="card__name">{{ site.about.title }}</h2>
          <span class="card__meta">{{ site.about.meta }}</span>
        </div>
        <span class="card__icon" aria-hidden="true">{{ site.about.glyph }}</span>
      </div>

      <div class="card__about">
        <p v-for="(line, i) in site.about.paragraphs" :key="i">{{ line }}</p>

        <dl class="card__specs">
          <div v-for="item in specs" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="card__about-links">
          <a v-if="site.github" :href="site.github" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a v-if="site.email" :href="`mailto:${site.email}`">写封邮件</a>
        </div>
      </div>

      <span class="card__end" aria-hidden="true">
        <span class="card__end-rule" />
        end of deck
      </span>
    </div>
  </section>
</template>

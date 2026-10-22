<script setup>
import { computed } from 'vue'
import { site } from '../data/site.js'

const year = computed(() => new Date().getFullYear())
const startYear = site.since
const range = computed(() =>
  year.value > startYear ? `${startYear}–${year.value}` : String(startYear)
)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__left">
        <span class="footer__dot" aria-hidden="true" />
        © {{ range }} {{ site.author }}
        <span class="footer__sep" aria-hidden="true">/</span>
        <span class="footer__note">{{ site.footerNote }}</span>
      </p>

      <nav class="footer__links" aria-label="更多链接">
        <a v-if="site.github" :href="site.github" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a v-if="site.email" :href="`mailto:${site.email}`">邮件</a>
        <a href="#top">回到顶部 ↑</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: clamp(48px, 8vw, 88px) clamp(20px, 4vw, 40px) 40px;
}

.footer__inner {
  max-width: 1000px;
  margin-inline: auto;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.74rem;
  color: var(--text-3);
}

.footer__left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px 1px color-mix(in oklab, var(--accent) 60%, transparent);
}

.footer__sep {
  opacity: 0.5;
}

.footer__note {
  color: var(--text-3);
}

.footer__links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.footer__links a {
  color: var(--text-2);
  transition: color var(--dur-fast) var(--ease-out);
}
.footer__links a:hover {
  color: var(--accent);
}
</style>

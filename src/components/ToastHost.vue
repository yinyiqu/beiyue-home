<script setup>
import { useToast } from '../composables/useToast.js'

const { message } = useToast()
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-atomic="true">
    <Transition name="toast">
      <p v-if="message" :key="message" class="toast">{{ message }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  left: 50%;
  bottom: max(26px, env(safe-area-inset-bottom));
  z-index: var(--z-toast);
  transform: translateX(-50%);
  pointer-events: none;
  padding-inline: 16px;
}

.toast {
  max-width: min(92vw, 460px);
  padding: 11px 18px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line-strong);
  background: var(--surface-strong);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.9);
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text);
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-spring);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>

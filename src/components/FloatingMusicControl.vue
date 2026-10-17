<script setup lang="ts">
defineProps<{ visible: boolean; playing: boolean; ready: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
  <Transition name="floating-music">
    <aside v-if="visible" class="floating-music" aria-label="婚礼音乐控制">
      <button type="button" :class="{ 'is-playing': playing }" :disabled="!ready" :aria-label="playing ? '暂停婚礼音乐' : '播放婚礼音乐'" :aria-pressed="playing" @click="$emit('toggle')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z" /><path v-if="playing" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /><path v-else d="m16 9 5 6m0-6-5 6" /></svg>
        <span v-if="playing" class="floating-music-bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </aside>
  </Transition>
</template>

<style scoped>
.floating-music { position: fixed; z-index: 80; right: max(18px, env(safe-area-inset-right)); bottom: calc(20px + env(safe-area-inset-bottom)); }
.floating-music button { width: 54px; height: 54px; display: flex; justify-content: center; align-items: center; gap: 3px; border: 1px solid #dfacbd; border-radius: 50%; color: var(--red); background: #fff7f8f5; box-shadow: 0 7px 24px #71313e26; transition: transform .2s, background .2s; }
.floating-music button.is-playing { background: #a72f3c; color: #fff7f8; border-color: #a72f3c; }.floating-music button:hover:not(:disabled) { transform: translateY(-2px); }.floating-music button:active:not(:disabled) { transform: scale(.95); }.floating-music button:disabled { opacity: .5; cursor: default; }
.floating-music svg { width: 23px; height: 23px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.floating-music-bars { height: 15px; display: flex; align-items: center; gap: 2px; }.floating-music-bars i { width: 2px; height: 12px; border-radius: 2px; background: currentColor; animation: music-bar .8s ease-in-out infinite alternate; }.floating-music-bars i:nth-child(2) { height: 7px; animation-delay: -.3s; }.floating-music-bars i:nth-child(3) { height: 10px; animation-delay: -.5s; }
@keyframes music-bar { to { transform: scaleY(.35); } }
.floating-music-enter-active, .floating-music-leave-active { transition: opacity .25s, transform .25s; }.floating-music-enter-from, .floating-music-leave-to { opacity: 0; transform: translateY(12px); }
@media (max-width: 450px) { .floating-music { right: max(12px, env(safe-area-inset-right)); bottom: calc(14px + env(safe-area-inset-bottom)); }.floating-music button { width: 48px; height: 48px; } }
@media (prefers-reduced-motion: reduce) { .floating-music-bars i { animation: none; }.floating-music button, .floating-music-enter-active, .floating-music-leave-active { transition: none; } }
</style>

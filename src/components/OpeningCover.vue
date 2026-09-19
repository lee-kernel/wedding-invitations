<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ArrowIcon from './ArrowIcon.vue';
import CoverFront from './CoverFront.vue';

const props = defineProps<{ reduced: boolean }>();
const emit = defineEmits<{ finish: [] }>();
const ready = ref(false);
const phase = ref<'closed' | 'opening' | 'open'>('closed');
const element = ref<HTMLElement | null>(null);
const continueButton = ref<HTMLButtonElement | null>(null);
let focusAfterOpening = false;
let frame = 0;

function skip() { cancelAnimationFrame(frame); phase.value = 'open'; }
function reset() {
  focusAfterOpening = false; cancelAnimationFrame(frame);
  const node = element.value;
  node?.style.setProperty('--cover-turn', '0'); node?.style.setProperty('--cover-edge', '1'); node?.style.setProperty('--cover-shadow', '0');
  if (node) node.dataset.side = 'front';
  phase.value = 'closed';
}
function open() {
  if (phase.value !== 'closed') return;
  focusAfterOpening = true;
  if (props.reduced) skip(); else phase.value = 'opening';
}
function interrupt(event?: Event) {
  if (event instanceof KeyboardEvent && !['Escape','PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)) return;
  if (phase.value === 'opening') { cancelAnimationFrame(frame); phase.value = 'open'; }
}
watch(phase, async (value) => {
  if (value === 'opening') {
    const node = element.value!; const duration = innerWidth <= 700 ? 1900 : 2400; let start = 0;
    const ease = (n: number) => { const p = Math.min(1, Math.max(0, n)); return p * p * (3 - 2 * p); };
    const paint = (time: number) => {
      start ||= time; const p = props.reduced ? 1 : Math.min(1, (time - start) / duration); const turn = ease((p - .06) / .9); const angle = turn * Math.PI;
      node.style.setProperty('--cover-turn', String(turn)); node.style.setProperty('--cover-edge', String(Math.max(0, Math.cos(angle)))); node.style.setProperty('--cover-shadow', String(Math.sin(angle) * .75)); node.dataset.side = turn < .5 ? 'front' : 'back';
      if (p < 1) frame = requestAnimationFrame(paint); else phase.value = 'open';
    };
    frame = requestAnimationFrame(paint);
  } else if (value === 'open' && focusAfterOpening) { focusAfterOpening = false; await nextTick(); continueButton.value?.focus({ preventScroll: true }); }
});
onMounted(() => { ready.value = true; addEventListener('wheel', interrupt, { passive: true }); addEventListener('touchstart', interrupt, { passive: true }); addEventListener('keydown', interrupt); });
onBeforeUnmount(() => { cancelAnimationFrame(frame); removeEventListener('wheel', interrupt); removeEventListener('touchstart', interrupt); removeEventListener('keydown', interrupt); });
defineExpose({ open, skip, reset });
</script>

<template>
  <section ref="element" class="opening-cover" :data-phase="phase" :data-side="phase === 'open' ? 'back' : 'front'" :aria-busy="phase === 'opening'" aria-label="一纸，余生。婚礼邀请封面">
    <h1 class="sr-only">一纸，余生。汪家喆与朱敏的婚礼邀请</h1>
    <div class="cover-page" :inert="phase !== 'open'" :aria-hidden="phase !== 'open'">
      <div class="cover-inside"><span>一封信的开始</span><p>从此，<br /><em>每一页都有你。</em></p><span>朱敏 &amp; 汪家喆</span></div>
      <button v-if="phase === 'open'" ref="continueButton" class="cover-revisit" @click="$emit('finish')">继续读我们的故事 <ArrowIcon direction="down" /></button>
      <div class="cover-page-shadow" aria-hidden="true" />
    </div>
    <div class="cover-sheet" :inert="phase !== 'closed'">
      <div class="cover-front" :aria-hidden="phase !== 'closed'"><CoverFront :ready="ready" @open="open" /></div><div class="cover-back" aria-hidden="true" />
    </div>
    <button class="skip-opening" :disabled="!ready" @click="skip(); $emit('finish')">直接看照片 <ArrowIcon direction="down" /></button>
  </section>
</template>

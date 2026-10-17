<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const stage = ref<HTMLElement | null>(null);
let dispose: (() => void) | undefined;

onMounted(() => {
  const element = stage.value!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = false;
  function update() {
    frame = 0;
    const bounds = element.getBoundingClientRect();
    const progress = motion.matches ? .5 : Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    const focus = Math.sin(progress * Math.PI);
    element.style.setProperty('--spot-left', `${-24 + progress * 35}deg`);
    element.style.setProperty('--spot-right', `${24 - progress * 35}deg`);
    element.style.setProperty('--spot-glow-x', `${35 + progress * 30}%`);
    element.style.setProperty('--spot-brightness', `${.35 + focus * .65}`);
  }
  function schedule() {
    if (visible && !frame) frame = requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  });
  const resize = new ResizeObserver(schedule);
  observer.observe(element);
  resize.observe(element);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  update();
  dispose = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    motion.removeEventListener('change', schedule);
  };
});
onBeforeUnmount(() => dispose?.());
</script>

<template>
  <div ref="stage" class="spotlight-stage">
    <div class="spotlight-light" aria-hidden="true"><span class="spotlight-beam beam-left" /><span class="spotlight-beam beam-right" /><span class="spotlight-pool" /></div>
    <slot />
  </div>
</template>

<style scoped>
.spotlight-stage { --spot-left: -7deg; --spot-right: 7deg; --spot-glow-x: 50%; --spot-brightness: .7; position: relative; isolation: isolate; overflow: hidden; width: min(100%, 760px); margin-inline: auto; }
.spotlight-light { position: absolute; z-index: -1; inset: 0; overflow: hidden; pointer-events: none; opacity: var(--spot-brightness); background: radial-gradient(ellipse at 50% 70%, #fcebf24d, transparent 72%); }
.spotlight-beam { position: absolute; top: -6%; width: 70%; height: 104%; transform-origin: 50% 0; clip-path: polygon(48% 0, 52% 0, 100% 100%, 0 100%); mask-image: linear-gradient(#0000, #000 12%, #000 65%, #0000); filter: blur(10px); }
.beam-left { left: -9%; background: linear-gradient(180deg, #fff3d733, #ffe9bb66 55%, #fff5df00); transform: rotate(var(--spot-left)); }
.beam-right { right: -9%; background: linear-gradient(180deg, #ffe9f333, #f7d3e66b 55%, #ffedf400); transform: rotate(var(--spot-right)); }
.spotlight-pool { position: absolute; inset: 48% 4% 0; background: radial-gradient(ellipse at var(--spot-glow-x) 50%, #f9dfeb70, #fff1dc33 38%, transparent 70%); filter: blur(12px); }
@media (prefers-reduced-motion: reduce) { .spotlight-stage { --spot-left: -7deg !important; --spot-right: 7deg !important; --spot-glow-x: 50% !important; --spot-brightness: .65 !important; } }
</style>

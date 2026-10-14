<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Adapted from MrDevashish-777/royal-wedding-invitation:
// src/components/FloatingCherryBlossoms.tsx
const props = defineProps<{ burstOrigin?: { x: number; y: number } }>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let dispose: (() => void) | undefined;

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palette = [
    'rgba(255, 183, 197, 0.75)', 'rgba(255, 192, 203, 0.70)',
    'rgba(254, 205, 211, 0.75)', 'rgba(253, 164, 175, 0.65)',
    'rgba(255, 240, 245, 0.85)', 'rgba(212, 175, 55, 0.35)',
  ];
  let width = 0;
  let height = 0;
  let frame = 0;
  let previousTime: number | undefined;
  const createPetal = () => ({
    x: props.burstOrigin?.x ?? Math.random() * width,
    y: props.burstOrigin?.y ?? Math.random() * height,
    size: Math.random() * 8 + 8,
    speedY: props.burstOrigin ? -Math.random() * 10 - 7 : Math.random() + 0.6,
    speedX: props.burstOrigin ? (Math.random() - 0.5) * 22 : Math.random() * 0.8 - 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * (props.burstOrigin ? 0.18 : 0.02),
    flip: Math.random() * Math.PI,
    flipSpeed: Math.random() * 0.03 + 0.01,
    color: palette[Math.floor(Math.random() * palette.length)],
  });
  let petals: ReturnType<typeof createPetal>[] = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(width * ratio);
    canvas!.height = Math.round(height * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    petals = Array.from({ length: props.burstOrigin ? 70 : width < 768 ? 18 : 32 }, createPetal);
  }

  function animate(timestamp: number) {
    const step = previousTime === undefined ? 0 : Math.min(timestamp - previousTime, 50) / (1000 / 60);
    previousTime = timestamp;
    ctx!.clearRect(0, 0, width, height);
    for (const p of petals) {
      if (props.burstOrigin) {
        p.speedY += 0.20 * step;
        p.speedX *= Math.pow(0.99, step);
      }
      p.y += p.speedY * step;
      p.x += (p.speedX + Math.sin(p.y * 0.008) * 0.5) * step;
      p.rotation += p.rotationSpeed * step;
      p.flip += p.flipSpeed * step;
      if (!props.burstOrigin && p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (!props.burstOrigin && p.x > width + 20) p.x = -20;
      if (!props.burstOrigin && p.x < -20) p.x = width + 20;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.scale(1, Math.sin(p.flip));
      ctx!.fillStyle = p.color;
      ctx!.beginPath();
      ctx!.moveTo(0, -p.size);
      ctx!.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 0.7, p.size * 0.3, 0, p.size);
      ctx!.bezierCurveTo(-p.size * 0.7, p.size * 0.3, -p.size * 0.6, -p.size * 0.8, 0, -p.size);
      ctx!.closePath();
      ctx!.fill();
      ctx!.restore();
    }
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    previousTime = undefined;
    ctx!.clearRect(0, 0, width, height);
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(animate);
  }

  resize();
  syncAnimation();
  window.addEventListener('resize', resize);
  motion.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  dispose = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    motion.removeEventListener('change', syncAnimation);
    document.removeEventListener('visibilitychange', syncAnimation);
  };
});

onBeforeUnmount(() => dispose?.());
</script>

<template>
  <canvas ref="canvasRef" class="floating-cherry-blossoms" aria-hidden="true" />
</template>

<style scoped>
.floating-cherry-blossoms {
  position: fixed;
  inset: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}
</style>

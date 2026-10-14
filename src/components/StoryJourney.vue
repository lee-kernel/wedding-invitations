<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { photographs } from '@/data/wedding';

// Scroll-driven sticky stage inspired by deepeshmi26/wedding-website's JourneyTrail.
const root = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const route = ref<SVGPathElement | null>(null);
const progress = ref(0);
const offset = ref(0);
const trackHeight = ref(1600);
const car = ref({ x: 90, y: 100, angle: 0 });
const reduced = ref(false);
const stations = [
  { x: 90, y: 100 }, { x: 510, y: 550 },
  { x: 90, y: 1000 }, { x: 510, y: 1450 },
];
const road = 'M90 100 C90 300 510 220 510 550 S90 720 90 1000 S510 1120 510 1450';
let cleanup: (() => void) | undefined;

onMounted(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function update() {
    frame = 0;
    if (!root.value || !viewport.value || !route.value || reduced.value) return;
    const bounds = root.value.getBoundingClientRect();
    const distance = bounds.height - window.innerHeight;
    progress.value = Math.max(0, Math.min(1, -bounds.top / Math.max(1, distance)));
    const length = route.value.getTotalLength();
    const at = progress.value * length;
    const point = route.value.getPointAtLength(at);
    const before = route.value.getPointAtLength(Math.max(0, at - 1));
    const after = route.value.getPointAtLength(Math.min(length, at + 1));
    car.value = { x: point.x, y: point.y, angle: Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90 };
    const scale = viewport.value.clientWidth / 600;
    trackHeight.value = 1600 * scale;
    offset.value = Math.max(0, Math.min(trackHeight.value - viewport.value.clientHeight, point.y * scale - viewport.value.clientHeight * 0.4));
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function syncMotion() {
    reduced.value = motion.matches;
    schedule();
  }
  const observer = new ResizeObserver(schedule);
  observer.observe(root.value!);
  observer.observe(viewport.value!);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', syncMotion);
  syncMotion();
  cleanup = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    motion.removeEventListener('change', syncMotion);
  };
});
onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <section ref="root" class="story-journey" :class="{ 'journey-static': reduced }" aria-label="沿着幸福的轨迹，回顾我们的四段故事">
    <div class="journey-stage">
      <header class="journey-heading"><span>OUR LITTLE JOURNEY</span><h3>把日子，开往幸福。</h3><p>往下滑动，陪我们走过每一站 <span aria-hidden="true">↓</span></p></header>
      <div ref="viewport" class="journey-window">
        <div class="journey-track" :style="{ height: `${trackHeight}px`, transform: `translate3d(0, ${-offset}px, 0)` }">
          <svg class="journey-map" viewBox="0 0 600 1600" aria-hidden="true">
            <path ref="route" :d="road" fill="none" stroke="#e7c1cd" stroke-width="3" stroke-dasharray="5 12" stroke-linecap="round" />
            <path :d="road" fill="none" stroke="#a72f3c" stroke-width="3" pathLength="1" stroke-dasharray="1" :stroke-dashoffset="1 - progress" stroke-linecap="round" />
            <circle v-for="station in stations" :key="station.y" :cx="station.x" :cy="station.y" r="9" fill="#fff7f8" stroke="#bb758c" stroke-width="3" />
            <g :transform="`translate(${car.x}, ${car.y}) rotate(${car.angle})`">
              <ellipse cy="6" rx="27" ry="39" fill="#b747731a" />
              <rect x="-24" y="-38" width="8" height="17" rx="3" fill="#71313e" /><rect x="16" y="-38" width="8" height="17" rx="3" fill="#71313e" />
              <rect x="-24" y="20" width="8" height="17" rx="3" fill="#71313e" /><rect x="16" y="20" width="8" height="17" rx="3" fill="#71313e" />
              <rect x="-21" y="-43" width="42" height="86" rx="15" fill="#f0a2bd" stroke="#92364f" stroke-width="2" />
              <path d="M-16-20Q0-30 16-20L13-7H-13ZM-13 20H13L16 30Q0 36-16 30Z" fill="#fff7f8" stroke="#b66c86" stroke-width="1.5" />
              <rect x="-13" y="-5" width="26" height="24" rx="6" fill="#ffdae8" />
              <path d="M0-34C-15-47-17-26 0-29C17-26 15-47 0-34Z" fill="#a72f3c" /><circle cy="-33" r="3" fill="#ed82ad" />
              <path d="M-13-39H-8M8-39H13" stroke="#fff9d9" stroke-width="4" stroke-linecap="round" />
            </g>
          </svg>
          <ol class="journey-stories">
            <li v-for="(photo, index) in photographs" :key="photo.index" :class="{ 'station-right': index % 2 === 1 }" :style="{ top: `${stations[index].y / 16}%` }">
              <span>{{ photo.index }} / OUR STORY</span><h4>{{ photo.label }}</h4><p>{{ photo.caption.replace('\n', '') }}</p>
            </li>
          </ol>
        </div>
      </div>
      <footer class="journey-footer"><span>{{ String(Math.min(4, Math.floor(progress * 4) + 1)).padStart(2, '0') }} / 04</span><span>{{ progress > .98 ? '下一站，是我们的婚礼 ♡' : '和你一起，慢慢走' }}</span></footer>
    </div>
  </section>
</template>

<style scoped>
.story-journey { position: relative; height: 400svh; margin-top: 100px; background: linear-gradient(160deg, #fff, #fff7f8); border-block: 1px solid var(--line); }
.journey-stage { position: sticky; top: 0; height: 100vh; height: 100svh; display: flex; flex-direction: column; max-width: 760px; margin: auto; overflow: hidden; }
.journey-heading { flex: none; position: relative; z-index: 1; padding: clamp(24px, 5svh, 48px) 24px 22px; background: linear-gradient(#fffafb 85%, #fffafb00); }
.journey-heading > span { color: var(--red); font-size: 10px; letter-spacing: .22em; }
.journey-heading h3 { margin-top: 14px; font: 400 clamp(28px, 4vw, 42px)/1.3 var(--serif); }
.journey-heading p { margin-top: 12px; color: var(--muted-ink); font-size: 12px; letter-spacing: .08em; }
.journey-window { flex: 1; min-height: 0; position: relative; overflow: hidden; mask-image: linear-gradient(transparent, #000 5%, #000 93%, transparent); }
.journey-track { position: relative; will-change: transform; }
.journey-map { position: absolute; inset: 0; width: 100%; height: 100%; }
.journey-stories { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; }
.journey-stories li { position: absolute; left: 24%; width: 60%; transform: translateY(-30%); }
.journey-stories li.station-right { left: 12%; }
.journey-stories span { color: var(--red); font: 10px var(--sans); letter-spacing: .12em; }
.journey-stories h4 { margin: 15px 0 12px; font: 400 clamp(22px, 3vw, 32px)/1.4 var(--serif); }
.journey-stories p { max-width: 330px; font-size: clamp(13px, 1.8vw, 16px); line-height: 1.9; color: var(--muted-ink); }
.journey-footer { flex: none; display: flex; justify-content: space-between; gap: 16px; padding: 18px 24px; color: #a27582; font-size: 11px; letter-spacing: .08em; border-top: 1px solid #e8dadd88; }
.journey-static { height: auto; }.journey-static .journey-stage { position: relative; height: auto; overflow: visible; }.journey-static .journey-window { overflow: visible; mask-image: none; }.journey-static .journey-track { height: auto !important; transform: none !important; }.journey-static .journey-map, .journey-static .journey-heading p, .journey-static .journey-footer { display: none; }.journey-static .journey-stories { position: relative; padding: 0 24px 24px; }.journey-static .journey-stories li { position: static; width: auto; transform: none; padding: 24px 0; border-top: 1px solid var(--line); }
@media (max-width: 700px) { .story-journey { margin-top: 64px; }.journey-stories h4 { margin-block: 10px 8px; } }
@media (max-height: 500px) { .journey-heading { padding: 12px 24px; }.journey-heading h3 { margin-top: 6px; font-size: 24px; }.journey-heading p { display: none; }.journey-footer { padding-block: 10px; } }
</style>

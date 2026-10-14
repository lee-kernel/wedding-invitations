<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { imageSlots } from '@/data/wedding';
import PhotoSlot from '@/components/PhotoSlot.vue';
import WechatConversation from '@/components/WechatConversation.vue';

const emit = defineEmits<{ preview: [index: number] }>();
const photos = [
  { ...imageSlots.wide, caption: '把喜欢，留在每一帧里。', previewIndex: 4 },
  { ...imageSlots.close, caption: '镜头再近一点，幸福也是。', previewIndex: 5 },
  { ...imageSlots.portrait, caption: '最好的风景，是身旁的你。', previewIndex: 0 },
  { ...imageSlots.focus, caption: '往后的照片，都想和你一起。', previewIndex: 3 },
];
const messages = [
  { from: 'bride', text: '相册选好了吗？要选最好看的。' },
  { from: 'groom', text: '选好了，每一张都有你。' },
  { from: 'bride', text: '我是说，我们俩都好看的。' },
  { from: 'groom', text: '那就都留下，慢慢看。' },
  { from: 'bride', text: '记得把这份幸福也分享给大家 ♡' },
  { from: 'groom', text: '往下滑，看看我们的珍藏。' },
];
const viewport = ref<HTMLElement | null>(null);
const selected = ref(0);
let cleanup: (() => void) | undefined;
let suppressClick = false;

function goTo(index: number) {
  const container = viewport.value;
  const slide = container?.children[index] as HTMLElement | undefined;
  if (!container || !slide) return;
  const left = slide.offsetLeft - container.clientWidth / 2 + slide.offsetWidth / 2;
  container.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

function syncSelected() {
  const container = viewport.value;
  if (!container) return;
  const center = container.scrollLeft + container.clientWidth / 2;
  let nearest = 0;
  let distance = Infinity;
  Array.from(container.children).forEach((child, index) => {
    const slide = child as HTMLElement;
    const delta = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
    if (delta < distance) { distance = delta; nearest = index; }
  });
  selected.value = nearest;
}

function onKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  goTo(Math.max(0, Math.min(photos.length - 1, selected.value + (event.key === 'ArrowRight' ? 1 : -1))));
}

function onClick(event: MouseEvent) {
  if (!suppressClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressClick = false;
}

onMounted(() => {
  const container = viewport.value!;
  let startX = 0;
  let startScroll = 0;
  let pointer: number | undefined;
  function down(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    suppressClick = false;
    pointer = event.pointerId;
    startX = event.clientX;
    startScroll = container.scrollLeft;
  }
  function move(event: PointerEvent) {
    if (pointer !== event.pointerId) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 6 && !suppressClick) return;
    suppressClick = true;
    container.setPointerCapture(event.pointerId);
    container.classList.add('is-dragging');
    container.scrollLeft = startScroll - delta;
    event.preventDefault();
  }
  function up(event: PointerEvent) {
    if (pointer !== event.pointerId) return;
    pointer = undefined;
    if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
    container.classList.remove('is-dragging');
    if (suppressClick) { syncSelected(); goTo(selected.value); }
  }
  const observer = new ResizeObserver(syncSelected);
  observer.observe(container);
  container.addEventListener('pointerdown', down);
  container.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  syncSelected();
  cleanup = () => {
    observer.disconnect();
    container.removeEventListener('pointerdown', down);
    container.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
  };
});
onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <section class="story-album" aria-labelledby="album-title">
    <header class="album-heading">
      <p class="section-mark">OUR PHOTO DIARY</p>
      <h3 id="album-title">关于幸福的证据，<br /><em>我们存了好多。</em></h3>
      <p>有认真看镜头的瞬间，也有忍不住笑场的日常。<br />挑挑选选，最后还是舍不得删掉和你有关的每一张。</p>
    </header>

    <WechatConversation :messages="messages" />

    <div class="album-carousel">
      <p class="album-instruction">左右滑动，翻翻我们的相册 <svg class="album-swipe-icon" viewBox="0 0 24 16" aria-hidden="true" focusable="false"><path d="M2 8h20M7 3 2 8l5 5m10-10 5 5-5 5" /></svg></p>
      <div ref="viewport" class="album-viewport" role="region" aria-roledescription="轮播相册" aria-label="婚礼照片，使用左右方向键切换" tabindex="0" @scroll.passive="syncSelected" @keydown="onKey" @click.capture="onClick">
        <article v-for="(photo, index) in photos" :key="photo.src" class="album-slide" :class="{ 'is-selected': selected === index }" :aria-label="`第 ${index + 1} 张，共 ${photos.length} 张`">
          <PhotoSlot :src="photo.src" :label="photo.label" :alt="photo.alt" ratio="4 / 5" previewable @preview="emit('preview', photo.previewIndex)" />
          <p class="album-caption"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ photo.caption }}</p>
        </article>
      </div>
      <div class="album-controls"><p aria-live="polite">{{ String(selected + 1).padStart(2, '0') }} <span>/ {{ String(photos.length).padStart(2, '0') }}</span></p><i aria-hidden="true" /><button type="button" aria-label="上一张照片" :disabled="selected === 0" @click="goTo(selected - 1)">←</button><button type="button" aria-label="下一张照片" :disabled="selected === photos.length - 1" @click="goTo(selected + 1)">→</button></div>
    </div>
  </section>
</template>

<style scoped>
.story-album { margin-top: clamp(64px, 9vw, 112px); padding: clamp(36px, 6vw, 72px) clamp(16px, 4vw, 48px); background: linear-gradient(150deg, #fffafb, #fff5f7); border: 1px solid #f1dfe4; }
.album-heading { max-width: 680px; }
.album-heading h3 { margin-top: 22px; font: 400 clamp(30px, 4.8vw, 56px)/1.35 var(--serif); }
.album-heading h3 em { color: var(--red); font-style: normal; }
.album-heading > p:last-child { margin-top: 24px; color: var(--muted-ink); font-size: clamp(13px, 1.8vw, 16px); line-height: 2; }
.album-carousel { margin-top: 38px; }.album-instruction { margin-bottom: 18px; color: #a27582; font-size: 11px; letter-spacing: .08em; }.album-swipe-icon { display: inline-block; width: 22px; height: 16px; margin-left: 8px; vertical-align: middle; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.album-viewport { position: relative; display: flex; gap: 20px; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; padding: 14px 10% 24px; scrollbar-width: thin; scrollbar-color: #e7bccb transparent; cursor: grab; }.album-viewport.is-dragging { cursor: grabbing; scroll-snap-type: none; user-select: none; }
.album-slide { flex: 0 0 80%; min-width: 0; scroll-snap-align: center; padding: 10px 10px 20px; align-self: flex-start; background: #fff; box-shadow: 0 10px 24px #71313e12; opacity: .65; transform: scale(.97); transition: opacity .3s, transform .3s; }.album-slide.is-selected { opacity: 1; transform: scale(1); }
.album-caption { display: flex; gap: 12px; padding: 18px 5px 0; color: #915668; font: clamp(13px, 1.8vw, 18px)/1.6 var(--serif); }.album-caption span { color: #c99baa; font: 11px/2 var(--sans); }
.album-controls { display: flex; align-items: center; gap: 12px; margin-top: 22px; color: var(--red); }.album-controls p { font: 15px var(--numerals); }.album-controls p span { color: #b797a2; }.album-controls i { flex: 1; height: 1px; margin-inline: 8px; background: #e8ccd5; }.album-controls button { width: 42px; height: 42px; border: 1px solid #dbacbc; border-radius: 50%; background: transparent; color: var(--red); font-size: 20px; }.album-controls button:hover:not(:disabled) { background: #fae9ec; }.album-controls button:disabled { opacity: .3; cursor: default; }
@media (min-width: 900px) { .album-slide { flex-basis: 56%; }.album-viewport { padding-inline: 22%; } }
@media (max-width: 450px) { .story-album { padding-inline: 12px; }.album-viewport { gap: 12px; }.album-slide { padding: 7px 7px 14px; } }
@media (prefers-reduced-motion: reduce) { .album-slide { transition: none; } }
</style>

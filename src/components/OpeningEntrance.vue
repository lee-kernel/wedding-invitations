<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import KittyAccent from '@/components/KittyAccent.vue';
import FloatingCherryBlossoms from '@/components/FloatingCherryBlossoms.vue';
import { wedding } from '@/data/wedding';

// Adapted from royal-wedding-invitation/src/components/OpeningEntrance.tsx.
const emit = defineEmits<{ opening: []; opened: [] }>();
const opening = ref(false);
const showPetals = ref(false);
const burstOrigin = ref<{ x: number; y: number }>();
const seal = ref<HTMLButtonElement | null>(null);
let timer = 0;
let completed = false;
let previousOverflow = '';
let previousBodyOverflow = '';
let previousFocus: HTMLElement | null = null;

onMounted(() => {
  previousOverflow = document.documentElement.style.overflow;
  previousBodyOverflow = document.body.style.overflow;
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  seal.value?.focus({ preventScroll: true });
});

function cycleFocus(event: KeyboardEvent) {
  const container = event.currentTarget as HTMLElement;
  const direct = container.querySelector<HTMLButtonElement>('.entrance-direct');
  (event.target === seal.value ? direct : seal.value)?.focus();
}

function finishOpening() {
  if (completed || !opening.value) return;
  completed = true;
  window.clearTimeout(timer);
  emit('opened');
}

function onCurtainEnd(event: TransitionEvent) {
  if (event.target === event.currentTarget && event.propertyName === 'transform') finishOpening();
}

function open(directly = false) {
  if (opening.value) return;
  const bounds = seal.value!.getBoundingClientRect();
  burstOrigin.value = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  opening.value = true;
  emit('opening');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  showPetals.value = !directly && !reduceMotion;
  // Transition completion owns the handoff; timeout only covers interrupted transitions.
  timer = window.setTimeout(finishOpening, directly || reduceMotion ? 0 : 1100);
}

onBeforeUnmount(() => {
  window.clearTimeout(timer);
  document.documentElement.style.overflow = previousOverflow;
  document.body.style.overflow = previousBodyOverflow;
  previousFocus?.focus({ preventScroll: true });
});
</script>

<template>
  <div class="opening-entrance" :class="{ 'is-opening': opening }" role="dialog" aria-modal="true" aria-labelledby="entrance-title" @keydown.tab.prevent="cycleFocus">
    <FloatingCherryBlossoms v-if="showPetals" :burst-origin="burstOrigin" class="entrance-petals" />
    <div class="entrance-flap entrance-flap-top" aria-hidden="true" @transitionend="onCurtainEnd" />
    <div class="entrance-flap entrance-flap-bottom" aria-hidden="true" />
    <div class="entrance-card">
      <KittyAccent class="entrance-bow" variant="bow" />
      <header class="entrance-heading"><span aria-hidden="true">囍</span><p>一封写给你的幸福邀请</p><i /></header>
      <p class="entrance-eyebrow">A LETTER OF LOVE</p>
      <h1 id="entrance-title"><span>{{ wedding.groom }}</span><em>&amp;</em><span>{{ wedding.bride }}</span></h1>
      <p class="entrance-date">{{ wedding.dateLong }} · {{ wedding.day }}</p>
      <p class="entrance-message">一封请柬，一份欢喜，静候你的到来。</p>
      <button ref="seal" class="entrance-seal" type="button" :aria-disabled="opening" aria-label="开启婚礼请柬并播放音乐" @click="open()"><KittyAccent class="seal-bow" variant="bow" /><strong>乔 &amp; 嘉</strong><span>开启请柬</span></button>
      <p class="entrance-hint">轻触印章 · 花瓣为你而落</p>
      <button class="entrance-direct" type="button" :aria-disabled="opening" @click="open(true)">直接进入请柬</button>
    </div>
  </div>
</template>

<style scoped>
.opening-entrance { position: fixed; inset: 0; z-index: 3000; display: grid; place-items: center; padding: 24px 16px; overflow: auto; color: var(--ink); background: transparent; isolation: isolate; }
.opening-entrance::before { content: ''; position: absolute; z-index: 1; inset: 18px; transition: opacity .35s ease; border: 1px solid #edcbd355; background: radial-gradient(circle, #edcbd34d 1px, transparent 1.5px) 0 0 / 22px 22px; pointer-events: none; }
.entrance-card { position: relative; z-index: 2; width: min(100%, 560px); margin: auto; padding: clamp(28px, 5vh, 48px) 24px 28px; display: flex; flex-direction: column; align-items: center; border: 1px solid #edcbd3; border-radius: 12px; background: linear-gradient(155deg, #fff, #fffafb); box-shadow: 0 22px 70px #9e50651a, inset 0 0 0 8px #fff, inset 0 0 0 9px #fae9ec; text-align: center; transition: transform .7s ease, opacity .7s ease, filter .7s ease; }
.entrance-bow { position: absolute; top: -22px; right: 22px; width: 70px; transform: rotate(12deg); filter: drop-shadow(0 5px 8px #b7477322); }
.seal-bow { width: 38px; margin-top: -7px; }
.entrance-petals { z-index: 5; }
.entrance-card::after { content: 'WITH LOVE & A LITTLE BOW'; margin-top: 14px; color: #bd929e; font-size: 8px; letter-spacing: .2em; }
.entrance-heading > span { display: block; font: 42px/1.2 var(--hand); color: var(--red); }
.entrance-heading p { margin: 12px 0 18px; font-size: 12px; letter-spacing: .28em; }
.entrance-heading i { display: block; width: 160px; height: 1px; margin: auto; background: linear-gradient(90deg, transparent, #df9eb0, transparent); }
.entrance-eyebrow { margin: 26px 0 18px; font: 12px/1.5 Georgia, serif; letter-spacing: .24em; color: #ba7e8d; }
.entrance-card h1 { display: flex; flex-direction: column; align-items: center; margin: 0; font: 700 clamp(30px, 7vw, 46px)/1.25 var(--hand); letter-spacing: .12em; color: var(--red); }
.entrance-card h1 em { font: italic 36px/1.5 Georgia, serif; letter-spacing: 0; }
.entrance-date { margin: 22px 0 0; font-size: 13px; letter-spacing: .12em; }
.entrance-message { margin: 12px 0 0; font-size: 12px; color: var(--muted-ink); line-height: 1.8; }
.entrance-seal { flex: none; position: relative; width: 128px; height: 128px; margin: 32px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 4px solid #fff4f7; border-radius: 50%; color: var(--red-deep); background: linear-gradient(135deg, #ffe4ee, #f1afc7 65%, #e58bae); box-shadow: 0 0 0 7px #fae9ec, 0 12px 30px #b7477326, inset 0 4px 10px #fff9; cursor: pointer; transition: transform .25s; animation: seal-float 2.8s ease-in-out infinite; }
.entrance-seal::before { content: ''; position: absolute; inset: 7px; border: 1px dashed #b7477355; border-radius: 50%; }
.entrance-seal strong { font: 700 22px/1.2 'Kaiti SC', KaiTi, serif; }.entrance-seal span { font-size: 11px; letter-spacing: .12em; }
.entrance-seal:hover { animation-play-state: paused; transform: scale(1.05); }.entrance-seal:active { animation: none; transform: scale(.95); }
.entrance-seal:focus-visible, .entrance-direct:focus-visible { outline: 3px solid #a72f3c; outline-offset: 8px; }
.entrance-hint { margin: 26px 0 20px; font-size: 12px; letter-spacing: .16em; }
.entrance-direct { padding: 10px 14px; border: 0; background: transparent; color: var(--muted-ink); font-size: 12px; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }
.entrance-flap { position: fixed; left: 0; right: 0; height: calc(50% + 1px); z-index: 0; background: linear-gradient(135deg, #fff7f8, #fae9ec); opacity: 1; transition: transform .9s cubic-bezier(.22, 1, .36, 1); will-change: transform; pointer-events: none; }
.entrance-flap-top { top: 0; box-shadow: 0 5px 24px #b7477312; border-bottom: 1px solid #edcbd3; }.entrance-flap-bottom { bottom: 0; box-shadow: 0 -5px 24px #b7477312; border-top: 1px solid #edcbd3; }
.is-opening::before { opacity: 0; }.is-opening .entrance-card { transition-duration: .3s; transform: scale(.94); opacity: 0; filter: blur(4px); }.is-opening .entrance-flap { opacity: 1; }.is-opening .entrance-flap-top { transform: translateY(-100%); }.is-opening .entrance-flap-bottom { transform: translateY(100%); }
@media (max-height: 740px) { .opening-entrance { padding-block: 14px; }.entrance-card { padding-block: 22px 18px; }.entrance-heading > span { font-size: 32px; }.entrance-heading p { margin: 8px 0 12px; }.entrance-eyebrow { margin: 18px 0 12px; }.entrance-card h1 { font-size: 30px; }.entrance-card h1 em { font-size: 26px; }.entrance-date { margin-top: 14px; }.entrance-seal { width: 104px; height: 104px; margin-top: 24px; }.entrance-hint { margin: 22px 0 12px; } }
@keyframes seal-float {
  0%, 100% { translate: 0 0; box-shadow: 0 0 0 7px #fae9ec, 0 12px 30px #b7477326, inset 0 4px 10px #fff9; }
  50% { translate: 0 -5px; box-shadow: 0 0 0 11px #fae9ec66, 0 16px 38px #b7477340, inset 0 4px 10px #fff9; }
}
.is-opening .entrance-seal { animation: none; }
@media (prefers-reduced-motion: reduce) { .opening-entrance, .entrance-card, .entrance-flap, .entrance-seal { transition: none; animation: none; } }
</style>

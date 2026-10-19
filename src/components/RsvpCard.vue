<script setup lang="ts">
import { wedding, copy } from '@/data/wedding';

// Leave empty until the Tencent questionnaire is ready.
const questionnaireUrl = (() => {
  try {
    const url = new URL(wedding.rsvpUrl);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
})();
</script>

<template>
  <article class="rsvp-card" aria-labelledby="rsvp-title">
    <div class="rsvp-content">
      <p class="rsvp-eyebrow">A LITTLE NOTE FOR YOU</p>
      <h3 id="rsvp-title">{{ copy.rsvpTitle[0] }}<br />{{ copy.rsvpTitle[1] }}</h3>
      <p class="rsvp-copy">{{ copy.rsvpBody[0] }}<br />{{ copy.rsvpBody[1] }}<br />{{ copy.rsvpBody[2] }}</p>
      <p class="rsvp-names">{{ wedding.groom }} <span>&amp;</span> {{ wedding.bride }}</p>
      <a v-if="questionnaireUrl" class="rsvp-button" :href="questionnaireUrl" target="_blank" rel="noopener noreferrer" aria-label="填写婚礼出席回执，打开问卷"><svg viewBox="0 0 24 18" aria-hidden="true"><path d="M3 9h18m-6-6 6 6-6 6" /></svg><span>填写赴约回执</span></a>
      <button v-else class="rsvp-button" type="button" disabled aria-describedby="rsvp-pending"><svg viewBox="0 0 24 18" aria-hidden="true"><path d="M3 9h18m-6-6 6 6-6 6" /></svg><span>赴约回执 · 即将开放</span></button>
      <p class="rsvp-pending" :id="!questionnaireUrl ? 'rsvp-pending' : undefined">{{ questionnaireUrl ? '点击填写，让我们为你留好位置' : '问卷准备中，开放后可在这里填写' }}</p>
      <footer class="rsvp-footer"><div><span>期待与你相见</span><p>{{ wedding.dateLong }}</p><small>{{ wedding.venue }} · {{ wedding.room }}</small></div><div class="rsvp-stamp" aria-hidden="true"><span>WITH LOVE</span><strong>囍</strong><span>{{ wedding.stampDate }}</span></div></footer>
    </div>
  </article>
</template>

<style scoped>
.rsvp-card { position: relative; min-width: 0; display: flex; align-items: center; padding: clamp(30px, 4vw, 48px); border: 1px solid #f1dfe4; border-radius: 20px; background: linear-gradient(155deg, #fffdfd, #fcecf1); box-shadow: 0 18px 42px #71313e12; transform: rotate(-.5deg); }
.rsvp-card::before { content: ''; position: absolute; inset: 12px; border: 1px solid #e7becb; border-radius: 12px; pointer-events: none; }.rsvp-card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: .3; background: radial-gradient(circle, #b67d8f33 .6px, transparent .9px) 0 0 / 17px 17px; }
.rsvp-content { position: relative; z-index: 1; width: 100%; }.rsvp-eyebrow { color: #aa6b80; font-size: 10px; letter-spacing: .18em; }.rsvp-content h3 { margin-top: 24px; color: var(--red-deep); font: 400 clamp(26px, 3vw, 36px)/1.5 var(--serif); }.rsvp-copy { margin-top: 22px; color: #866672; font-size: 14px; line-height: 2; }.rsvp-names { margin-top: 26px; color: #a75d75; font: 19px var(--hand); }.rsvp-names span { margin-inline: 7px; font: italic 16px Georgia, serif; }
.rsvp-button { display: inline-flex; align-items: center; position: relative; isolation: isolate; justify-content: center; gap: 10px; width: auto; max-width: 100%; min-height: 44px; margin-top: 28px; padding: 11px 19px; border: 2px solid var(--red); border-radius: 9px; background: var(--red); color: #fff; box-shadow: 0 7px 18px #a72f3c26; transition: transform .2s, box-shadow .2s; font: 600 13px var(--sans); letter-spacing: .08em; }.rsvp-button svg { width: 23px; height: 18px; padding-right: 8px; box-sizing: content-box; border-right: 1px solid #ffffff55; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }.rsvp-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 24px #a72f3c38; background: var(--red-deep); }.rsvp-button:active:not(:disabled) { transform: scale(.98); }.rsvp-button:disabled { cursor: default; background: #e8c7d2; border-color: #e8c7d2; color: #79495a; box-shadow: none; }.rsvp-pending { margin-top: 13px; color: #94717f; font-size: 11px; line-height: 1.7; text-align: left; }
.rsvp-footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 34px; padding-top: 26px; border-top: 1px dashed #dcb1c0; }.rsvp-footer > div:first-child { min-width: 0; }.rsvp-footer span { color: #a87385; font-size: 10px; letter-spacing: .12em; }.rsvp-footer p { margin-top: 10px; color: #8f4e64; font: 22px/1.5 var(--serif); }.rsvp-footer small { display: block; margin-top: 8px; color: #9d7d88; font-size: 10px; line-height: 1.8; }.rsvp-stamp { flex: none; width: 82px; height: 82px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 3px double #cd8fa580; border-radius: 50%; transform: rotate(12deg); opacity: .65; outline: 1px dashed #cd8fa580; outline-offset: -8px; }.rsvp-stamp strong { color: #b8768e; font: 28px/1 var(--hand); }.rsvp-stamp span { font-size: 7px; letter-spacing: .08em; }
.rsvp-button:not(:disabled)::before,
.rsvp-button:not(:disabled)::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 1px solid #a72f3c;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  animation: rsvp-ripple 3.6s ease-out infinite;
}
.rsvp-button:not(:disabled)::after { animation-delay: 1.8s; }
@keyframes rsvp-ripple {
  0% { inset: -2px; opacity: .28; }
  70%, 100% { inset: -11px; opacity: 0; }
}
@media (max-width: 400px) { .rsvp-card { padding: 32px 26px; }.rsvp-footer p { font-size: 19px; }.rsvp-stamp { width: 66px; height: 66px; }.rsvp-stamp strong { font-size: 23px; } }
@media (prefers-reduced-motion: reduce) { .rsvp-button { transition: none; }.rsvp-button::before, .rsvp-button::after { animation: none !important; } }
</style>

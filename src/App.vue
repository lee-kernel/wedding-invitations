<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { emojiBlast } from 'emoji-blast';
import { imageSlots, music, wedding, copy } from '@/data/wedding';
import PhotoSlot from '@/components/PhotoSlot.vue';
import PhotoLightbox from '@/components/PhotoLightbox.vue';
import MapDirections from '@/components/MapDirections.vue';
import SaveInvitationImage from '@/components/SaveInvitationImage.vue';
import KittyAccent from '@/components/KittyAccent.vue';
import ScrollSpotlights from '@/components/ScrollSpotlights.vue';
import FloatingCherryBlossoms from '@/components/FloatingCherryBlossoms.vue';
import OpeningEntrance from '@/components/OpeningEntrance.vue';
import StoryJourney from '@/components/StoryJourney.vue';
import StoryAlbum from '@/components/StoryAlbum.vue';
import RsvpCard from '@/components/RsvpCard.vue';
import FloatingMusicControl from '@/components/FloatingMusicControl.vue';

const baseUrl = import.meta.env.BASE_URL;
const now = ref(Date.now());
const eventTime = wedding.eventTime;
const kittyScene = `${import.meta.env.BASE_URL}images/invitation/hello-kitty-scene.svg`;
let timer = 0;
const countdown = computed(() => {
  const remaining = Math.max(0, eventTime - now.value);
  return [
    { value: String(Math.floor(remaining / 86_400_000)).padStart(2, '0'), label: '天' },
    { value: String(Math.floor((remaining / 3_600_000) % 24)).padStart(2, '0'), label: '时' },
    { value: String(Math.floor((remaining / 60_000) % 60)).padStart(2, '0'), label: '分' },
    { value: String(Math.floor((remaining / 1_000) % 60)).padStart(2, '0'), label: '秒' },
  ];
});
const calendarDays = wedding.calendarDays;
const audio = ref<HTMLAudioElement | null>(null);
const audioReady = ref(false);
const isPlaying = ref(false);
const hasOpened = ref(false);
const heroCover = ref<HTMLElement | null>(null);
const heroPastViewport = ref(false);
let heroObserver: IntersectionObserver | undefined;
const audioCurrentTime = ref(0);
const audioDuration = ref(0);
const audioProgress = computed(() => audioDuration.value > 0 ? Math.min(100, (audioCurrentTime.value / audioDuration.value) * 100) : 0);
const previewPhotos = [
  { src: imageSlots.portrait.src, alt: imageSlots.portrait.alt },
  { src: imageSlots.storyLeft.src, alt: imageSlots.storyLeft.alt },
  { src: imageSlots.storyRight.src, alt: imageSlots.storyRight.alt },
  { src: imageSlots.focus.src, alt: imageSlots.focus.alt },
  { src: imageSlots.wide.src, alt: imageSlots.wide.alt },
  { src: imageSlots.close.src, alt: imageSlots.close.alt },
];
const previewIndex = ref<number | null>(null);

function openPreview(index: number) {
  previewIndex.value = index;
}

function celebrateGift(event: MouseEvent) {
  const gift = event.currentTarget as HTMLElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bounds = gift.getBoundingClientRect();
  emojiBlast({
    className: 'wedding-emoji-blast',
    emojiCount: reduceMotion ? 6 : () => Math.floor(Math.random() * 7) + 18,
    emojis: ['🎉', '🎁', '💕', '', '✨', '🎀'],
    physics: {
      fontSize: reduceMotion ? { min: 16, max: 21 } : { min: 17, max: 30 },
      gravity: reduceMotion ? 0.4 : 0.28,
      initialVelocities: {
        rotation: reduceMotion ? { min: -2, max: 2 } : { min: -8, max: 8 },
        x: reduceMotion ? { min: -3, max: 3 } : { min: -8, max: 8 },
        y: reduceMotion ? { min: -8, max: -5 } : { min: -17, max: -11 },
      },
      opacityDecay: 100,
      rotation: reduceMotion ? { min: -8, max: 8 } : { min: -35, max: 35 },
      rotationDeceleration: 0.97,
    },
    position: {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height * 0.28,
    },
    process(element) {
      element.setAttribute('aria-hidden', 'true');
    },
    uniqueness: 6,
  });

  if (!reduceMotion) {
    gift.classList.remove('is-opening');
    void gift.offsetWidth;
    gift.classList.add('is-opening');
    window.setTimeout(() => gift.classList.remove('is-opening'), 380);
  }
}

async function tryStartMusic() {
  if (!audio.value) return false;
  if (!audio.value.paused) {
    return true;
  }
  try {
    await audio.value.play();
    return true;
  } catch {
    return false;
  }
}

async function toggleMusic() {
  if (!audio.value || !audioReady.value) return;
  if (audio.value.paused) await tryStartMusic();
  else audio.value.pause();
}
function syncAudioProgress() {
  if (!audio.value) return;
  audioCurrentTime.value = Number.isFinite(audio.value.currentTime) ? audio.value.currentTime : 0;
  audioDuration.value = Number.isFinite(audio.value.duration) ? audio.value.duration : 0;
}

function seekAudio(event: Event) {
  if (!audio.value || !audioDuration.value) return;
  const input = event.currentTarget as HTMLInputElement;
  audio.value.currentTime = Number(input.value);
  syncAudioProgress();
}

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function beginInvitation() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  heroPastViewport.value = false;
  void tryStartMusic();
}

async function finishEntrance() {
  hasOpened.value = true;
  await nextTick();
  // Reset once the entrance has unmounted and released its scroll lock.
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.querySelector<HTMLElement>('#top')?.focus({ preventScroll: true });
}

onMounted(() => {
  if (heroCover.value) {
    heroObserver = new IntersectionObserver(([entry]) => {
      heroPastViewport.value = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    }, { threshold: 0 });
    heroObserver.observe(heroCover.value);
  }
  timer = window.setInterval(() => { now.value = Date.now(); }, 1000);
});

onBeforeUnmount(() => {
  heroObserver?.disconnect();
  window.clearInterval(timer);
  audio.value?.pause();
});
</script>

<template>
  <OpeningEntrance v-if="!hasOpened" @opening="beginInvitation" @opened="finishEntrance" />
  <FloatingCherryBlossoms v-if="hasOpened" />
  <a v-if="hasOpened" class="skip-link" href="#wedding-details">跳到婚礼时间与地点</a>

  <main id="top" tabindex="-1" :inert="!hasOpened" :aria-hidden="!hasOpened">
    <div ref="heroCover" class="hero-cover">
      <KittyAccent class="cover-decoration cover-decoration-left" variant="bow" />
      <KittyAccent class="cover-decoration cover-decoration-right" variant="bow" />
      <section class="hero" aria-labelledby="hero-title">
      <header class="just-married">
        <KittyAccent class="hero-bow hero-bow-left" variant="bow" />
        <KittyAccent class="hero-bow hero-bow-right" variant="bow" />
        <h1 id="hero-title">
          <svg class="title-arc" viewBox="0 0 500 100" aria-hidden="true" focusable="false">
            <defs><path id="title-arc-path" d="M 48 84 Q 250 -14 452 84" /></defs>
            <text><textPath href="#title-arc-path" startOffset="50%" text-anchor="middle">{{ copy.titleEnglish }}</textPath></text>
          </svg>
          <strong>{{ copy.title }}</strong>
        </h1>
        <div class="kids-and-happiness">
          <div class="child-role">
            <PhotoSlot class="child-portrait child-left" :src="imageSlots.childLeft.src" :label="imageSlots.childLeft.label" :alt="imageSlots.childLeft.alt" ratio="1 / 1" />
            <KittyAccent class="child-bow" variant="bow" />
            <small>新郎</small>
          </div>
          <span class="double-happiness" aria-hidden="true">囍</span>
          <div class="child-role">
            <PhotoSlot class="child-portrait child-right" :src="imageSlots.childRight.src" :label="imageSlots.childRight.label" :alt="imageSlots.childRight.alt" ratio="1 / 1" />
            <KittyAccent class="child-bow" variant="bow" />
            <small>新娘</small>
          </div>
        </div>
      </header>
      <PhotoSlot class="hero-artwork" :src="imageSlots.hero.src" :label="imageSlots.hero.label" :alt="imageSlots.hero.alt" ratio="1 / 1" eager />
      <div class="music-card" :data-playing="isPlaying" :data-ready="audioReady" :aria-label="`${music.title}，${music.artist}`">
        <KittyAccent class="music-kitty" variant="peek" />
        <div class="music-copy">
          <div class="music-meta"><div><strong>{{ music.title }}</strong><span class="music-artist">{{ music.artist }}</span></div><span class="music-status">{{ isPlaying ? 'PLAYING' : 'READY' }}</span></div>
          <div class="music-timeline">
            <input type="range" min="0" :max="audioDuration || 0" step="0.1" :value="audioCurrentTime" :disabled="!audioReady" :style="{ '--music-progress': `${audioProgress}%` }" aria-label="音乐播放进度" @input="seekAudio" />
            <div class="music-time" aria-hidden="true"><span>{{ formatAudioTime(audioCurrentTime) }}</span><span>{{ formatAudioTime(audioDuration) }}</span></div>
          </div>
        </div>
        <button class="music-toggle" type="button" :disabled="!audioReady" :aria-label="isPlaying ? '暂停婚礼音乐' : '播放婚礼音乐'" :aria-pressed="isPlaying" @click="toggleMusic">
          <svg class="music-playback-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <g v-if="isPlaying"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></g>
            <path v-else d="M8 4.5a.75.75 0 0 0-1.1.66v13.68a.75.75 0 0 0 1.1.66l11-6.84a.78.78 0 0 0 0-1.32Z" />
          </svg>
        </button>
        <PhotoSlot :src="imageSlots.musicCover.src" :label="imageSlots.musicCover.label" :alt="imageSlots.musicCover.alt" ratio="1 / 1" />
        <audio ref="audio" :src="music.src" preload="auto" loop playsinline @canplay="audioReady = true; syncAudioProgress()" @loadedmetadata="syncAudioProgress" @durationchange="syncAudioProgress" @timeupdate="syncAudioProgress" @error="audioReady = false" @play="isPlaying = true" @pause="isPlaying = false" @ended="isPlaying = false; syncAudioProgress()" />
      </div>
      <div class="hero-opening">
        <p v-for="line in copy.heroLines" :key="line">{{ line }}</p>
      </div>
      <div class="countdown" aria-label="距离婚礼的倒计时"><div v-for="item in countdown" :key="item.label"><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div></div>
    </section>
    </div>

    <ScrollSpotlights>
    <div class="transition-happiness" aria-label="双喜与领证纪念">
      <span>「囍」</span>
      <i aria-hidden="true">HELLO, LOVE</i>
      <div class="wedding-kitty-couple"><img :src="`${baseUrl}images/invitation/kitty-wedding-certificates.png`" alt="新娘 Kitty 手捧花束，与新郎 Kitty 各持一本红色结婚证" loading="lazy" draggable="false" /></div>
      <p class="couple-keepsake-caption">{{ copy.keepsake }}</p>
    </div>
    </ScrollSpotlights>

    <section id="welcome" class="welcome section-shell">
      <p class="section-mark">WELCOME TO OUR WEDDING</p>
      <h2>{{ copy.welcomeTitle[0] }}<br />{{ copy.welcomeTitle[1] }}</h2>
      <p>{{ copy.welcomeBody[0] }}<br />{{ copy.welcomeBody[1] }}</p>
      <div class="kitty-photo-frame">
        <PhotoSlot :src="imageSlots.portrait.src" :label="imageSlots.portrait.label" :alt="imageSlots.portrait.alt" ratio="4 / 5" previewable reveal reveal-direction="up" @preview="openPreview(0)" />
        <KittyAccent variant="bow" />
      </div>
      <p class="names-line">{{ wedding.groom }} <i>&amp;</i> {{ wedding.bride }}</p>
    </section>

    <section id="story" class="story section-shell" aria-labelledby="story-title">
      <div class="story-heading">
        <p class="section-mark">CHEERS TO US</p>
        <h2 id="story-title">{{ copy.storyTitle[0] }}<br /><em>{{ copy.storyTitle[1] }}</em></h2>
        <p>{{ copy.storyBody[0] }}<br />{{ copy.storyBody[1] }}</p>
      </div>
      <div class="story-pair">
        <PhotoSlot :src="imageSlots.storyLeft.src" :label="imageSlots.storyLeft.label" :alt="imageSlots.storyLeft.alt" ratio="3 / 4" previewable reveal reveal-direction="left" @preview="openPreview(1)" />
        <PhotoSlot :src="imageSlots.storyRight.src" :label="imageSlots.storyRight.label" :alt="imageSlots.storyRight.alt" ratio="3 / 4" previewable reveal reveal-direction="right" :reveal-delay="140" @preview="openPreview(2)" />
      </div>
      <blockquote><p>{{ copy.storyQuote[0] }}<br />{{ copy.storyQuote[1] }}</p><span>THANK YOU FOR BEING PART OF OUR STORY.</span></blockquote>
      <div class="story-focus">
        <PhotoSlot :src="imageSlots.focus.src" :label="imageSlots.focus.label" :alt="imageSlots.focus.alt" ratio="4 / 5" previewable reveal reveal-direction="focus" @preview="openPreview(3)" />
        <div><span>OUR STORY</span><h3>{{ copy.storyFocusTitle[0] }}<br />{{ copy.storyFocusTitle[1] }}</h3><p>{{ copy.storyFocusBody[0] }}<br />{{ copy.storyFocusBody[1] }}</p></div>
      </div>
      <StoryJourney />
      <StoryAlbum @preview="openPreview" />
    </section>

    <section id="wedding-details" class="details section-shell" aria-labelledby="details-title">
      <div class="details-heading"><p class="section-mark">WEDDING TIME</p><h2 id="details-title">{{ copy.detailsTitle[0] }}<br /><em>{{ copy.detailsTitle[1] }}</em></h2></div>
      <div class="date-layout date-layout-calendar">
        <div class="calendar-card">
          <KittyAccent class="calendar-kitty" variant="face" />
          <div class="calendar-title"><strong>{{ wedding.month }} <small>/ {{ wedding.dayPadded }}</small></strong><span>— {{ wedding.year }} —</span></div>
          <div class="weekdays" aria-hidden="true"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
          <div class="calendar-grid"><span v-for="blank in wedding.calendarOffset" :key="`blank-${blank}`" aria-hidden="true" /><span v-for="day in calendarDays" :key="day" :class="{ chosen: day === wedding.dayOfMonth }" :aria-current="day === wedding.dayOfMonth ? 'date' : undefined">{{ day }}</span></div>
          <p>{{ wedding.dateLong }} · {{ wedding.day }}<br />{{ wedding.lunar }}</p>
        </div>
      </div>
      <div class="venue-card">
        <div class="venue-copy">
          <p class="section-mark">WEDDING ADDRESS</p><h3>{{ wedding.venue }}</h3><strong>{{ wedding.room }}</strong>
          <dl><div><dt>{{ wedding.welcome }}</dt><dd>{{ copy.welcomeLabel }}</dd></div><div><dt>{{ wedding.ceremony }}</dt><dd>{{ copy.ceremonyLabel }}</dd></div></dl>
          <div class="actions"><SaveInvitationImage /><MapDirections /></div>
        </div>
        <PhotoSlot :src="imageSlots.venue.src" :label="imageSlots.venue.label" :alt="imageSlots.venue.alt" ratio="5 / 3" />
      </div>
      <div class="details-rsvp"><RsvpCard /></div>
    </section>

    <section id="kitty-farewell" class="kitty-farewell" aria-label="Hello Kitty 婚礼感谢场景">
      <div class="kitty-farewell-art">
        <button class="kitty-gift kitty-gift-left" type="button" aria-label="打开左侧礼物，撒下祝福" aria-describedby="gift-hint" @click.stop="celebrateGift"><i /></button>
        <img :src="kittyScene" alt="完整造型的 Hello Kitty" loading="lazy" draggable="false" />
        <button class="kitty-gift kitty-gift-right" type="button" aria-label="打开右侧礼物，撒下祝福" aria-describedby="gift-hint" @click.stop="celebrateGift"><i /></button>
        <KittyAccent variant="bow" />
      </div>
      <div id="gift-hint" class="gift-hint"><span aria-hidden="true" />点击礼物盒，为新人送祝福<span aria-hidden="true" /></div>
      <p>{{ copy.farewell }}</p>
      <span lang="en">Thank you for being part of our story.</span>
    </section>

    <footer class="footer"><p>{{ copy.footer }}</p><strong>{{ wedding.groom }} <i>&amp;</i> {{ wedding.bride }}</strong><span>{{ wedding.date }} · {{ copy.footerDate }}</span><small>WITH LOVE &amp; A LITTLE BOW</small></footer>
  </main>
  <FloatingMusicControl :visible="hasOpened && heroPastViewport" :playing="isPlaying" :ready="audioReady" @toggle="toggleMusic" />
  <PhotoLightbox v-model="previewIndex" :photos="previewPhotos" />
</template>

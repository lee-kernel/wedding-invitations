<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { imageSlots, music, photographs, wedding } from '@/data/wedding';
import PhotoSlot from '@/components/PhotoSlot.vue';
import PhotoLightbox from '@/components/PhotoLightbox.vue';
import MapDirections from '@/components/MapDirections.vue';
import SaveInvitationImage from '@/components/SaveInvitationImage.vue';

const now = ref(Date.now());
const eventTime = new Date('2026-10-03T17:58:00+08:00').getTime();
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
const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
const audio = ref<HTMLAudioElement | null>(null);
const audioReady = ref(false);
const isPlaying = ref(false);
const showMusicUnlock = ref(false);
const audioCurrentTime = ref(0);
const audioDuration = ref(0);
const audioProgress = computed(() => audioDuration.value > 0 ? Math.min(100, (audioCurrentTime.value / audioDuration.value) * 100) : 0);
let autoScrollFrame = 0;
let autoScrollDelay = 0;
let lastScrollTime = 0;
let autoScrollCancelled = false;
let autoScrollStarted = false;
const autoScrollSpeed = 34;
const previewPhotos = [
  { src: imageSlots.portrait.src, alt: imageSlots.portrait.alt },
  { src: imageSlots.storyLeft.src, alt: imageSlots.storyLeft.alt },
  { src: imageSlots.storyRight.src, alt: imageSlots.storyRight.alt },
  { src: imageSlots.focus.src, alt: imageSlots.focus.alt },
  { src: imageSlots.wide.src, alt: imageSlots.wide.alt },
  { src: imageSlots.close.src, alt: imageSlots.close.alt },
  { src: imageSlots.date.src, alt: imageSlots.date.alt },
];
const previewIndex = ref<number | null>(null);

function openPreview(index: number) {
  stopAutoScroll();
  previewIndex.value = index;
}

async function tryStartMusic() {
  if (!audio.value) return false;
  if (!audio.value.paused) {
    showMusicUnlock.value = false;
    return true;
  }
  try {
    await audio.value.play();
    showMusicUnlock.value = false;
    return true;
  } catch {
    showMusicUnlock.value = true;
    return false;
  }
}

async function toggleMusic() {
  if (!audio.value || !audioReady.value) return;
  if (audio.value.paused) await audio.value.play();
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

function stopAutoScroll() {
  autoScrollCancelled = true;
  autoScrollStarted = false;
  window.clearTimeout(autoScrollDelay);
  window.cancelAnimationFrame(autoScrollFrame);
  document.documentElement.classList.remove('auto-scrolling');
}

function scrollPage(timestamp: number) {
  if (autoScrollCancelled) return;
  const elapsed = Math.min(timestamp - lastScrollTime, 50);
  lastScrollTime = timestamp;
  window.scrollBy(0, autoScrollSpeed * elapsed / 1000);
  const reachedBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (!reachedBottom) autoScrollFrame = window.requestAnimationFrame(scrollPage);
  else {
    autoScrollStarted = false;
    document.documentElement.classList.remove('auto-scrolling');
  }
}

function startAutoScroll() {
  if (autoScrollCancelled || autoScrollStarted || showMusicUnlock.value) return;
  autoScrollStarted = true;
  document.documentElement.classList.add('auto-scrolling');
  lastScrollTime = performance.now();
  autoScrollFrame = window.requestAnimationFrame(scrollPage);
}

async function handleFirstInteraction() {
  const started = await tryStartMusic();
  if (started) {
    startAutoScroll();
    document.removeEventListener('pointerdown', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  }
}

async function unlockExperience() {
  const started = await tryStartMusic();
  if (started) startAutoScroll();
}

onMounted(() => {
  timer = window.setInterval(() => { now.value = Date.now(); }, 1000);
  void tryStartMusic();
  autoScrollDelay = window.setTimeout(startAutoScroll, 1200);
  document.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
  document.addEventListener('keydown', handleFirstInteraction);
  window.addEventListener('wheel', stopAutoScroll, { passive: true });
  window.addEventListener('touchmove', stopAutoScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
  stopAutoScroll();
  audio.value?.pause();
  document.removeEventListener('pointerdown', handleFirstInteraction);
  document.removeEventListener('keydown', handleFirstInteraction);
  window.removeEventListener('wheel', stopAutoScroll);
  window.removeEventListener('touchmove', stopAutoScroll);
});
</script>

<template>
  <a class="skip-link" href="#wedding-details">跳到婚礼时间与地点</a>

  <Transition name="music-gate">
    <div v-if="showMusicUnlock" class="music-unlock" role="dialog" aria-modal="true" aria-label="开启婚礼邀请">
      <button type="button" @click="unlockExperience"><span aria-hidden="true">囍</span><strong>开启婚礼邀请</strong><small>轻触播放音乐</small></button>
    </div>
  </Transition>

  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <header class="just-married">
        <h1 id="hero-title">
          <svg class="title-arc" viewBox="0 0 500 100" aria-hidden="true" focusable="false">
            <defs><path id="title-arc-path" d="M 48 84 Q 250 -14 452 84" /></defs>
            <text><textPath href="#title-arc-path" startOffset="50%" text-anchor="middle">WE ARE GETTING MARRIED</textPath></text>
          </svg>
          <strong>我们结婚啦！</strong>
        </h1>
        <div class="kids-and-happiness">
          <div class="child-role">
            <PhotoSlot class="child-portrait child-left" :src="imageSlots.childLeft.src" :label="imageSlots.childLeft.label" :alt="imageSlots.childLeft.alt" ratio="1 / 1" />
            <small>新郎</small>
          </div>
          <span class="double-happiness" aria-hidden="true">囍</span>
          <div class="child-role">
            <PhotoSlot class="child-portrait child-right" :src="imageSlots.childRight.src" :label="imageSlots.childRight.label" :alt="imageSlots.childRight.alt" ratio="1 / 1" />
            <small>新娘</small>
          </div>
        </div>
      </header>
      <PhotoSlot class="hero-artwork" :src="imageSlots.hero.src" :label="imageSlots.hero.label" :alt="imageSlots.hero.alt" ratio="1 / 1" eager />
      <div class="music-card" :data-playing="isPlaying" :data-ready="audioReady" :aria-label="`${music.title}，${music.artist}`">
        <div class="music-copy">
          <div class="music-meta"><div><strong>{{ music.title }}</strong><span class="music-artist">{{ music.artist }}</span></div><span class="music-status">{{ isPlaying ? 'PLAYING' : 'READY' }}</span></div>
          <div class="music-timeline">
            <input type="range" min="0" :max="audioDuration || 0" step="0.1" :value="audioCurrentTime" :disabled="!audioReady" :style="{ '--music-progress': `${audioProgress}%` }" aria-label="音乐播放进度" @input="seekAudio" />
            <div class="music-time" aria-hidden="true"><span>{{ formatAudioTime(audioCurrentTime) }}</span><span>{{ formatAudioTime(audioDuration) }}</span></div>
          </div>
        </div>
        <button class="music-toggle" type="button" :disabled="!audioReady" :aria-label="isPlaying ? '暂停婚礼音乐' : '播放婚礼音乐'" @click="toggleMusic">
          <span class="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
        </button>
        <PhotoSlot :src="imageSlots.musicCover.src" :label="imageSlots.musicCover.label" :alt="imageSlots.musicCover.alt" ratio="1 / 1" />
        <audio ref="audio" :src="music.src" preload="auto" autoplay loop playsinline @canplay="audioReady = true; syncAudioProgress()" @loadedmetadata="syncAudioProgress" @durationchange="syncAudioProgress" @timeupdate="syncAudioProgress" @error="audioReady = false" @play="isPlaying = true" @pause="isPlaying = false" @ended="isPlaying = false; syncAudioProgress()" />
      </div>
      <div class="hero-opening">
        <p>嗨～当你看到这封邀请的时候</p>
        <p>我们的婚礼</p>
        <p>已经进入倒计时啦～</p>
      </div>
      <div class="countdown" aria-label="距离婚礼的倒计时"><div v-for="item in countdown" :key="item.label"><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div></div>
    </section>

    <div class="transition-happiness" role="img" aria-label="双喜">「囍」</div>

    <section id="welcome" class="welcome section-shell">
      <p class="section-mark">WELCOME TO OUR WEDDING</p>
      <h2>嘿，当你看到这封邀请，<br />我们的婚礼已经进入倒计时。</h2>
      <p>很开心我们出现在彼此的生命中，<br />也很开心能把这份喜悦，认真地分享给你。</p>
      <PhotoSlot :src="imageSlots.portrait.src" :label="imageSlots.portrait.label" :alt="imageSlots.portrait.alt" ratio="4 / 5" previewable reveal reveal-direction="up" @preview="openPreview(0)" />
      <p class="names-line">张子乔 <i>&amp;</i> 陈美嘉</p>
    </section>

    <section id="story" class="story section-shell" aria-labelledby="story-title">
      <div class="story-heading">
        <p class="section-mark">CHEERS TO US</p>
        <h2 id="story-title">我们有的是以后，<br /><em>以后都是我们。</em></h2>
        <p>世界这么大，两个人相识相爱的概率很小。<br />所以我们想把相处的日常，慢慢写进往后的每一天。</p>
      </div>
      <div class="story-pair">
        <PhotoSlot :src="imageSlots.storyLeft.src" :label="imageSlots.storyLeft.label" :alt="imageSlots.storyLeft.alt" ratio="3 / 4" previewable reveal reveal-direction="left" @preview="openPreview(1)" />
        <PhotoSlot :src="imageSlots.storyRight.src" :label="imageSlots.storyRight.label" :alt="imageSlots.storyRight.alt" ratio="3 / 4" previewable reveal reveal-direction="right" :reveal-delay="140" @preview="openPreview(2)" />
      </div>
      <blockquote><p>“不是所有浪漫都要盛大。<br />和你一起的普通日子，本身就足够珍贵。”</p><span>THANK YOU FOR BEING PART OF OUR STORY.</span></blockquote>
      <div class="story-focus">
        <PhotoSlot :src="imageSlots.focus.src" :label="imageSlots.focus.label" :alt="imageSlots.focus.alt" ratio="4 / 5" previewable reveal reveal-direction="focus" @preview="openPreview(3)" />
        <div><span>OUR STORY</span><h3>敬我们，<br />也敬余生。</h3><p>有些欢喜，想当面说。<br />有些时刻，想与你一起。</p></div>
      </div>
      <div class="story-notes" aria-label="我们的故事章节"><article v-for="photo in photographs" :key="photo.index"><span>{{ photo.index }}</span><h3>{{ photo.label }}</h3><p>{{ photo.caption.replace('\n', '') }}</p></article></div>
      <div class="story-wide">
        <PhotoSlot :src="imageSlots.wide.src" :label="imageSlots.wide.label" :alt="imageSlots.wide.alt" ratio="16 / 9" previewable reveal reveal-direction="left" @preview="openPreview(4)" />
        <PhotoSlot :src="imageSlots.close.src" :label="imageSlots.close.label" :alt="imageSlots.close.alt" ratio="16 / 9" previewable reveal reveal-direction="right" :reveal-delay="120" @preview="openPreview(5)" />
      </div>
    </section>

    <section id="wedding-details" class="details section-shell" aria-labelledby="details-title">
      <div class="details-heading"><p class="section-mark">WEDDING TIME</p><h2 id="details-title">良辰已定，<br /><em>静候卿来。</em></h2></div>
      <div class="date-layout">
        <div class="calendar-card">
          <div class="calendar-title"><strong>10 <small>/ 03</small></strong><span>— 2026 —</span></div>
          <div class="weekdays" aria-hidden="true"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
          <div class="calendar-grid"><span v-for="blank in 3" :key="`blank-${blank}`" aria-hidden="true" /><span v-for="day in calendarDays" :key="day" :class="{ chosen: day === 3 }" :aria-current="day === 3 ? 'date' : undefined">{{ day }}</span></div>
          <p>{{ wedding.dateLong }} · {{ wedding.day }}<br />{{ wedding.lunar }}</p>
        </div>
        <PhotoSlot :src="imageSlots.date.src" :label="imageSlots.date.label" :alt="imageSlots.date.alt" ratio="4 / 5" previewable reveal reveal-direction="right" @preview="openPreview(6)" />
      </div>
      <div class="venue-card">
        <div class="venue-copy">
          <p class="section-mark">WEDDING ADDRESS</p><h3>{{ wedding.venue }}</h3><strong>{{ wedding.room }}</strong>
          <dl><div><dt>{{ wedding.welcome }}</dt><dd>到场相聚</dd></div><div><dt>{{ wedding.ceremony }}</dt><dd>仪式开始</dd></div></dl>
          <div class="actions"><SaveInvitationImage /><MapDirections /></div>
        </div>
        <PhotoSlot :src="imageSlots.venue.src" :label="imageSlots.venue.label" :alt="imageSlots.venue.alt" ratio="5 / 3" />
      </div>
    </section>

    <footer class="footer"><p>有你在，才是圆满。</p><strong>张子乔 <i>&amp;</i> 陈美嘉</strong><span>2026.10.03 · 不见不散</span></footer>
  </main>
  <PhotoLightbox v-model="previewIndex" :photos="previewPhotos" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { imageSlots, photographs, wedding } from '@/data/wedding';
import PhotoSlot from '@/components/PhotoSlot.vue';
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
onMounted(() => { timer = window.setInterval(() => { now.value = Date.now(); }, 1000); });
onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <a class="skip-link" href="#wedding-details">跳到婚礼时间与地点</a>

  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <header class="hero-heading">
        <h1 id="hero-title"><span lang="en">Save The Date</span><i>|</i> 汪家喆&amp;朱敏的<br />婚礼邀请函</h1>
        <div><span># Love never fails</span><span>2026-10-03 {{ wedding.ceremony }}</span></div>
      </header>
      <p class="hero-script"><span>Welcome to our</span><strong>Wedding</strong></p>
      <PhotoSlot class="hero-artwork" :src="imageSlots.hero.src" :label="imageSlots.hero.label" :alt="imageSlots.hero.alt" ratio="1 / 1" eager />
      <div class="music-card" aria-label="婚礼背景音乐素材位置">
        <div class="music-copy"><strong>汪家喆 · 朱敏</strong><span>婚礼背景音乐 · 素材待添加</span></div>
        <div class="sound-bars" aria-hidden="true"><i /><i /><i /><i /></div>
        <PhotoSlot :src="imageSlots.musicCover.src" :label="imageSlots.musicCover.label" :alt="imageSlots.musicCover.alt" ratio="1 / 1" />
      </div>
      <div class="hero-opening">
        <p>嗨～当你看到这封邀请的时候</p>
        <p>我们的婚礼</p>
        <p>已经进入倒计时啦～</p>
      </div>
      <div class="countdown" aria-label="距离婚礼的倒计时"><div v-for="item in countdown" :key="item.label"><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div></div>
    </section>

    <section id="welcome" class="welcome section-shell">
      <p class="section-mark">WELCOME TO OUR WEDDING</p>
      <h2>嘿，当你看到这封邀请，<br />我们的婚礼已经进入倒计时。</h2>
      <p>很开心我们出现在彼此的生命中，<br />也很开心能把这份喜悦，认真地分享给你。</p>
      <PhotoSlot :src="imageSlots.portrait.src" :label="imageSlots.portrait.label" :alt="imageSlots.portrait.alt" ratio="4 / 5" />
      <p class="names-line">汪家喆 <i>&amp;</i> 朱敏</p>
    </section>

    <section id="story" class="story section-shell" aria-labelledby="story-title">
      <div class="story-heading">
        <p class="section-mark">CHEERS TO US</p>
        <h2 id="story-title">我们有的是以后，<br /><em>以后都是我们。</em></h2>
        <p>世界这么大，两个人相识相爱的概率很小。<br />所以我们想把相处的日常，慢慢写进往后的每一天。</p>
      </div>
      <div class="story-pair">
        <PhotoSlot :src="imageSlots.storyLeft.src" :label="imageSlots.storyLeft.label" :alt="imageSlots.storyLeft.alt" ratio="3 / 4" />
        <PhotoSlot :src="imageSlots.storyRight.src" :label="imageSlots.storyRight.label" :alt="imageSlots.storyRight.alt" ratio="3 / 4" />
      </div>
      <blockquote><p>“不是所有浪漫都要盛大。<br />和你一起的普通日子，本身就足够珍贵。”</p><span>THANK YOU FOR BEING PART OF OUR STORY.</span></blockquote>
      <div class="story-focus">
        <PhotoSlot :src="imageSlots.focus.src" :label="imageSlots.focus.label" :alt="imageSlots.focus.alt" ratio="4 / 5" />
        <div><span>OUR STORY</span><h3>敬我们，<br />也敬余生。</h3><p>有些欢喜，想当面说。<br />有些时刻，想与你一起。</p></div>
      </div>
      <div class="story-notes" aria-label="我们的故事章节"><article v-for="photo in photographs" :key="photo.index"><span>{{ photo.index }}</span><h3>{{ photo.label }}</h3><p>{{ photo.caption.replace('\n', '') }}</p></article></div>
      <div class="story-wide">
        <PhotoSlot :src="imageSlots.wide.src" :label="imageSlots.wide.label" :alt="imageSlots.wide.alt" ratio="16 / 9" />
        <PhotoSlot :src="imageSlots.close.src" :label="imageSlots.close.label" :alt="imageSlots.close.alt" ratio="16 / 9" />
      </div>
    </section>

    <section id="wedding-details" class="details section-shell" aria-labelledby="details-title">
      <div class="details-heading"><p class="section-mark">WEDDING TIME</p><h2 id="details-title">良辰已定，<br /><em>静候卿来。</em></h2></div>
      <div class="date-layout">
        <div class="calendar-card">
          <div class="calendar-title"><strong>10 <small>/ 03</small></strong><span>— 2026 —</span></div>
          <div class="weekdays" aria-hidden="true"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
          <div class="calendar-grid"><span v-for="blank in 3" :key="`blank-${blank}`" aria-hidden="true" /><span v-for="day in calendarDays" :key="day" :class="{ chosen: day === 3 }">{{ day }}</span></div>
          <p>{{ wedding.dateLong }} · {{ wedding.day }}<br />{{ wedding.lunar }}</p>
        </div>
        <PhotoSlot :src="imageSlots.date.src" :label="imageSlots.date.label" :alt="imageSlots.date.alt" ratio="4 / 5" />
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

    <footer class="footer"><p>有你在，才是圆满。</p><strong>汪家喆 <i>&amp;</i> 朱敏</strong><span>2026.10.03 · 不见不散</span></footer>
  </main>
</template>

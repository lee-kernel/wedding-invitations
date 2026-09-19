<script setup lang="ts">
import { wedding } from '@/data/wedding';
import ArrowIcon from './ArrowIcon.vue'; import MapDirections from './MapDirections.vue'; import SaveInvitationImage from './SaveInvitationImage.vue';
defineProps<{ canReturn: boolean }>(); defineEmits<{ return: [] }>();
</script>

<template>
  <section id="invitation" class="invitation" aria-labelledby="invitation-title" tabindex="-1" data-journey-stop="invitation">
    <div class="invitation-top"><span>我们的婚礼</span><span>04 / 赴约</span></div>
    <div class="invitation-main">
      <div class="invitation-heading"><span class="eyebrow">良辰已定 · 静候卿来</span><h2 id="invitation-title">有你在，<br />才是<span>圆满。</span></h2><p>我们要结婚了。<br />想把这一天，留给生命中重要的你。<br />带着轻松的心情来吧，一起吃饭、说笑，<br class="desktop-break" />见证我们人生的新一页。</p><div class="couple-signature">汪家喆 <i>&amp;</i> 朱敏<span>敬邀</span></div></div>
      <div class="invitation-details"><div class="date-display"><span>2026</span><strong aria-label="10月3日"><span>10</span><i aria-hidden="true">.</i><em>03</em></strong><span>{{ wedding.day }} · {{ wedding.lunar }}</span></div>
        <div class="schedule"><div><span>{{ wedding.welcome.slice(0, 3) }}<em>{{ wedding.welcome.slice(3) }}</em></span><p>到场相聚</p></div><i aria-hidden="true" /><div><span>{{ wedding.ceremony.slice(0, 3) }}<em>{{ wedding.ceremony.slice(3) }}</em></span><p>仪式开始</p></div></div>
        <div class="venue"><p>{{ wedding.venue }}</p><span>{{ wedding.room }}</span></div><div class="invite-actions"><SaveInvitationImage /><MapDirections /></div><p class="invitation-feedback">期待与你相见</p>
      </div>
    </div>
    <footer class="site-footer"><a href="#beginning" aria-label="回到请柬开头" :style="{ visibility: canReturn ? 'visible' : 'hidden' }" @click.prevent="$emit('return')">一纸 · 余生 <span aria-hidden="true"><ArrowIcon direction="up" /></span></a><span>汪家喆 &amp; 朱敏</span><span>2026.10.03 · 不见不散</span></footer>
  </section>
</template>

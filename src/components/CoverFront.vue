<script setup lang="ts">
import { wedding } from '@/data/wedding';
import ArrowIcon from './ArrowIcon.vue';
defineProps<{ ready: boolean }>();
defineEmits<{ open: [] }>();
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
</script>

<template>
  <div class="cover-front-content">
    <div class="cover-print" aria-hidden="true">
      <picture>
        <source media="(max-width: 700px) and (orientation: portrait)" :srcset="`${asset('images/together-640.webp')} 640w, ${asset('images/together-1280.webp')} 1280w`" sizes="100vw" />
        <img :src="asset('images/a-long-way-2048.webp')" :srcset="`${asset('images/a-long-way-1280.webp')} 1280w, ${asset('images/a-long-way-2048.webp')} 2048w`" sizes="100vw" alt="" draggable="false" fetchpriority="high" />
      </picture>
      <div class="cover-vignette" />
      <div class="cover-lettering">
        <span class="cover-prefix">朱敏 <i>&amp;</i> 汪家喆</span>
        <div class="cover-title"><span>一纸</span><i>·</i><span>余生</span></div>
        <div class="cover-bottom">
          <div><p>把往后的日子，写成我们。</p><span>朱敏与汪家喆 · 诚挚敬邀</span></div>
          <div class="cover-date"><strong>10.03</strong><span>2026 · {{ wedding.lunar }}</span><span class="cover-location">{{ wedding.venue }}<br />{{ wedding.room }}</span></div>
        </div>
      </div>
    </div>
    <div class="unseal-control">
      <button class="unseal-button" :disabled="!ready" :aria-busy="!ready" aria-label="展信，展开我们的婚礼邀请" @click="$emit('open')"><span>展信</span><i aria-hidden="true"><ArrowIcon /></i></button>
      <span class="unseal-hint">{{ ready ? '轻触展信 · 开启我们的故事' : '正在展平信笺…' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { photographs, letterNotes, wedding } from '@/data/wedding';
import { usePaperFan } from '@/composables/usePaperFan';
import WeddingPhoto from './WeddingPhoto.vue';
import ArrowIcon from './ArrowIcon.vue';

const props = defineProps<{ reduced: boolean }>();
const emit = defineEmits<{ read: [index: number, trigger: HTMLButtonElement, back: boolean] }>();
const fan = ref<HTMLElement | null>(null);
const reducedRef = computed(() => props.reduced);
const settleFan = usePaperFan(fan, reducedRef);
function focusFan(event: FocusEvent) { if ((event.target as HTMLElement).matches(':focus-visible')) settleFan(); }
</script>

<template>
  <section class="companionship" id="companionship" aria-labelledby="companionship-title">
    <div class="chapter-heading"><span class="eyebrow">02 / 相伴</span><h2 id="companionship-title">在你身旁，<br /><em>日子有了回响。</em></h2><p>有些话，写在照片背面。<br />一张一张，慢慢读给你听。</p></div>
    <div class="photo-waterfall">
      <article v-for="(photo, index) in photographs" :id="`photo-${index}`" :key="photo.src" :class="`story story-${photo.paper}`" :data-journey-stop="`photo-${index}`" :aria-labelledby="`photo-title-${index}`" tabindex="-1">
        <div class="story-margin" aria-hidden="true"><span>{{ photo.index }}</span><i /></div>
        <button class="story-photograph" :aria-label="`翻看照片 ${photo.index}：${photo.label}`" @click="emit('read', index, $event.currentTarget as HTMLButtonElement, false)"><WeddingPhoto :index="index" /><span class="photo-paper-tab"><span>{{ photo.carrier }}</span><i aria-hidden="true"><ArrowIcon /></i></span></button>
        <div class="story-caption"><span class="story-number">{{ photo.index }} / {{ photo.carrier }}</span><h3 :id="`photo-title-${index}`">{{ photo.label }}</h3><p>{{ photo.caption.split('\n')[0] }}</p><button class="read-reverse" :aria-label="`读第 ${index + 1} 张照片背面的信`" @click="emit('read', index, $event.currentTarget as HTMLButtonElement, false)">读背面的信 <span aria-hidden="true"><ArrowIcon /></span></button></div>
      </article>
    </div>
    <p class="waterfall-ending">这一页写我们，下一页，想请你也在场。</p>
  </section>
  <section id="heartfelt" class="heartfelt" data-journey-stop="heartfelt" aria-labelledby="heartfelt-title" tabindex="-1">
    <div class="chapter-heading"><span class="eyebrow">03 / 心意</span><h2 id="heartfelt-title">一纸短，<em>情意长。</em></h2></div>
    <div class="heartfelt-spread">
      <div class="heart-invite"><span>良辰已定 · 诚邀亲友</span><strong aria-label="双喜">囍</strong><p>汪家喆 <i>&amp;</i> 朱敏</p><div>2026.10.03<br />{{ wedding.lunar }}</div><a href="#invitation">赴我们的约 <ArrowIcon direction="down-right" /></a></div>
      <div ref="fan" class="heart-letters" @focus.capture="focusFan">
        <button class="heart-letter heart-letter-left" aria-label="放大阅读：一纸短，情意长" @click="settleFan(); emit('read', 0, $event.currentTarget as HTMLButtonElement, true)"><span class="eyebrow">{{ letterNotes[0].label }}</span><p><span v-for="verse in letterNotes[0].caption.split('\n\n')" :key="verse" class="heart-verse">{{ verse }}</span></p><span class="heart-signature">汪家喆 &amp; 朱敏</span><i aria-hidden="true"><ArrowIcon /></i></button>
        <button class="heart-letter heart-letter-right" aria-label="放大阅读：致亲爱的你" @click="settleFan(); emit('read', 3, $event.currentTarget as HTMLButtonElement, true)"><span class="eyebrow">{{ letterNotes[3].label }}</span><p><span v-for="verse in letterNotes[3].caption.split('\n\n')" :key="verse" class="heart-verse">{{ verse }}</span></p><span class="heart-signature">以爱为笺，敬候相见。</span><i aria-hidden="true"><ArrowIcon /></i></button>
      </div>
    </div>
  </section>
</template>

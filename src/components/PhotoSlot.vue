<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type RevealDirection = 'up' | 'left' | 'right' | 'focus';

const props = withDefaults(defineProps<{
  src: string;
  label: string;
  alt: string;
  ratio?: string;
  eager?: boolean;
  previewable?: boolean;
  reveal?: boolean;
  revealDirection?: RevealDirection;
  revealDelay?: number;
}>(), {
  ratio: '4 / 5',
  eager: false,
  previewable: false,
  reveal: false,
  revealDirection: 'up',
  revealDelay: 0,
});

defineEmits<{ preview: [] }>();

const figure = ref<HTMLElement | null>(null);
const loaded = ref(false);
const failed = ref(false);
const intersected = ref(false);
const revealed = ref(false);
let observer: IntersectionObserver | null = null;
let revealFrame = 0;
let revealPending = false;

function scheduleReveal() {
  if (!props.reveal || revealed.value || revealPending || !loaded.value || !intersected.value) return;
  revealPending = true;
  void nextTick(() => {
    revealFrame = window.requestAnimationFrame(() => {
      revealed.value = true;
      revealPending = false;
    });
  });
}

watch([loaded, intersected], scheduleReveal);

onMounted(() => {
  if (!props.reveal) {
    revealed.value = true;
    return;
  }
  if (!('IntersectionObserver' in window)) {
    intersected.value = true;
    return;
  }
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    intersected.value = true;
    observer?.disconnect();
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });
  if (figure.value) observer.observe(figure.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.cancelAnimationFrame(revealFrame);
});
</script>

<template>
  <figure
    ref="figure"
    class="photo-slot"
    :class="{
      'is-previewable': previewable && loaded && !failed,
      'has-reveal': reveal,
      'is-revealed': revealed,
    }"
    :style="{ '--photo-ratio': ratio, '--photo-reveal-delay': `${revealDelay}ms` }"
    :data-loaded="loaded && !failed"
    :data-reveal-direction="reveal ? revealDirection : undefined"
  >
    <div class="photo-placeholder" aria-hidden="true"><span>PHOTO</span><strong>{{ label }}</strong><small>{{ src.replace(/^.*images\//, '/public/images/') }}</small></div>
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" draggable="false" @load="loaded = true" @error="failed = true" />
    <button v-if="previewable" class="photo-preview-trigger" type="button" :disabled="!loaded || failed" :aria-label="`预览：${alt}`" @click="$emit('preview')"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg></span></button>
  </figure>
</template>

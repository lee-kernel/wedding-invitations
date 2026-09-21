<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

type PreviewPhoto = { src: string; alt: string };

const props = defineProps<{ photos: PreviewPhoto[]; modelValue: number | null }>();
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();
const closeButton = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
let touchStartX = 0;

function close() {
  emit('update:modelValue', null);
}

function move(step: number) {
  if (props.modelValue === null || props.photos.length < 2) return;
  emit('update:modelValue', (props.modelValue + step + props.photos.length) % props.photos.length);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close();
  else if (event.key === 'ArrowLeft') move(-1);
  else if (event.key === 'ArrowRight') move(1);
}

function handleTouchStart(event: TouchEvent) {
  touchStartX = event.changedTouches[0]?.clientX ?? 0;
}

function handleTouchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0]?.clientX ?? touchStartX;
  const distance = endX - touchStartX;
  if (Math.abs(distance) >= 48) move(distance > 0 ? -1 : 1);
}

watch(() => props.modelValue, async (value, previous) => {
  if (value !== null && previous === null) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
    await nextTick();
    closeButton.value?.focus({ preventScroll: true });
  } else if (value === null && previous !== null) {
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handleKeydown);
    previousFocus?.focus({ preventScroll: true });
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow;
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="photo-lightbox">
      <div
        v-if="modelValue !== null && photos[modelValue]"
        class="photo-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="婚纱照预览"
        @click.self="close"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
      >
        <button ref="closeButton" class="photo-lightbox-close" type="button" aria-label="关闭照片预览" @click="close">×</button>
        <button v-if="photos.length > 1" class="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="上一张照片" @click="move(-1)">‹</button>
        <figure>
          <img :src="photos[modelValue].src" :alt="photos[modelValue].alt" draggable="false" />
          <figcaption>{{ modelValue + 1 }} / {{ photos.length }} · {{ photos[modelValue].alt }}</figcaption>
        </figure>
        <button v-if="photos.length > 1" class="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="下一张照片" @click="move(1)">›</button>
      </div>
    </Transition>
  </Teleport>
</template>
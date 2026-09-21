<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

type PreviewPhoto = { src: string; alt: string };

const props = defineProps<{ photos: PreviewPhoto[]; modelValue: number | null }>();
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();
const closeButton = ref<HTMLButtonElement | null>(null);
const previewImage = ref<HTMLImageElement | null>(null);
const zoomScale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const imageTransform = computed(() => ({ transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0) scale(${zoomScale.value})` }));
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
let gesture: 'pinch' | 'pan' | null = null;
let initialDistance = 0;
let initialScale = 1;
let initialX = 0;
let initialY = 0;
let initialOffsetX = 0;
let initialOffsetY = 0;

function close() {
  emit('update:modelValue', null);
}

function resetZoom() {
  zoomScale.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
}

function clampPan() {
  if (zoomScale.value <= 1 || !previewImage.value) {
    offsetX.value = 0;
    offsetY.value = 0;
    return;
  }
  const maxX = previewImage.value.clientWidth * (zoomScale.value - 1) / 2;
  const maxY = previewImage.value.clientHeight * (zoomScale.value - 1) / 2;
  offsetX.value = Math.max(-maxX, Math.min(maxX, offsetX.value));
  offsetY.value = Math.max(-maxY, Math.min(maxY, offsetY.value));
}

function setZoom(value: number) {
  zoomScale.value = Math.max(1, Math.min(4, value));
  clampPan();
}

function touchDistance(touches: TouchList) {
  const first = touches[0];
  const second = touches[1];
  if (!first || !second) return 0;
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function startPan(touch: Touch) {
  gesture = 'pan';
  initialX = touch.clientX;
  initialY = touch.clientY;
  initialOffsetX = offsetX.value;
  initialOffsetY = offsetY.value;
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length >= 2) {
    gesture = 'pinch';
    initialDistance = touchDistance(event.touches);
    initialScale = zoomScale.value;
  } else if (event.touches.length === 1 && zoomScale.value > 1) {
    const touch = event.touches[0];
    if (touch) startPan(touch);
  }
}

function handleTouchMove(event: TouchEvent) {
  if (gesture === 'pinch' && event.touches.length >= 2 && initialDistance > 0) {
    setZoom(initialScale * touchDistance(event.touches) / initialDistance);
  } else if (gesture === 'pan' && event.touches.length === 1) {
    const touch = event.touches[0];
    if (!touch) return;
    offsetX.value = initialOffsetX + touch.clientX - initialX;
    offsetY.value = initialOffsetY + touch.clientY - initialY;
    clampPan();
  }
}

function handleTouchEnd(event: TouchEvent) {
  if (event.touches.length === 1 && zoomScale.value > 1) {
    const touch = event.touches[0];
    if (touch) startPan(touch);
  } else if (event.touches.length === 0) {
    gesture = null;
    clampPan();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close();
}

watch(() => props.modelValue, async (value, previous) => {
  resetZoom();
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
      <div v-if="modelValue !== null && photos[modelValue]" class="photo-lightbox" role="dialog" aria-modal="true" aria-label="婚纱照预览" @click.self="close">
        <button ref="closeButton" class="photo-lightbox-close" type="button" aria-label="关闭照片预览" @click="close">×</button>
        <figure>
          <div class="photo-lightbox-stage" @touchstart="handleTouchStart" @touchmove.prevent="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchEnd">
            <img ref="previewImage" :src="photos[modelValue].src" :alt="photos[modelValue].alt" :style="imageTransform" draggable="false" />
          </div>
          <figcaption>{{ photos[modelValue].alt }} · 手机端支持双指缩放</figcaption>
        </figure>
        <div class="photo-lightbox-zoom" aria-label="照片缩放控制">
          <button type="button" :disabled="zoomScale <= 1" aria-label="缩小照片" @click="setZoom(zoomScale - 0.5)">−</button>
          <output aria-live="polite">{{ Math.round(zoomScale * 100) }}%</output>
          <button type="button" :disabled="zoomScale >= 4" aria-label="放大照片" @click="setZoom(zoomScale + 0.5)">+</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ open: boolean; className: string; label: string; finalFocus?: HTMLElement | null }>();
const emit = defineEmits<{ close: [] }>();
const popup = ref<HTMLElement | null>(null);
let previousOverflow = '';

function focusables() {
  return [...(popup.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? [])];
}
function onKey(event: KeyboardEvent) {
  if (!props.open) return;
  if (event.key === 'Escape') emit('close');
  if (event.key !== 'Tab') return;
  const items = focusables();
  if (!items.length) return;
  const first = items[0];
  const last = items.at(-1)!;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
function restore() {
  document.body.style.overflow = previousOverflow;
  props.finalFocus?.focus({ preventScroll: true });
}
watch(() => props.open, async (open) => {
  if (open) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    await nextTick();
    focusables()[0]?.focus({ preventScroll: true });
  } else restore();
});
onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); if (props.open) restore(); });
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <div class="dialog-overlay" data-slot="dialog-overlay" @click="$emit('close')" />
      <section ref="popup" role="dialog" aria-modal="true" :aria-label="label" data-slot="dialog-content" :class="className">
        <slot />
      </section>
    </template>
  </Teleport>
</template>

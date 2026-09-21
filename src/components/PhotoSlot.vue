<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{ src: string; label: string; alt: string; ratio?: string; eager?: boolean; previewable?: boolean }>(), {
  ratio: '4 / 5',
  eager: false,
  previewable: false,
});

defineEmits<{ preview: [] }>();

const loaded = ref(false);
const failed = ref(false);
</script>

<template>
  <figure class="photo-slot" :class="{ 'is-previewable': previewable && loaded && !failed }" :style="{ '--photo-ratio': ratio }" :data-loaded="loaded && !failed">
    <div class="photo-placeholder" aria-hidden="true"><span>PHOTO</span><strong>{{ label }}</strong><small>{{ src.replace(/^.*images\//, '/public/images/') }}</small></div>
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" draggable="false" @load="loaded = true" @error="failed = true" />
    <button v-if="previewable" class="photo-preview-trigger" type="button" :disabled="!loaded || failed" :aria-label="`预览：${alt}`" @click="$emit('preview')"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg></span></button>
  </figure>
</template>

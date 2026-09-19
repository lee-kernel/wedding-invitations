<script setup lang="ts">
import { ref } from 'vue';
withDefaults(defineProps<{ src: string; label: string; alt: string; ratio?: string; eager?: boolean }>(), { ratio: '4 / 5', eager: false });
const loaded = ref(false);
const failed = ref(false);
</script>

<template>
  <figure class="photo-slot" :style="{ '--photo-ratio': ratio }" :data-loaded="loaded && !failed">
    <div class="photo-placeholder" aria-hidden="true"><span>PHOTO</span><strong>{{ label }}</strong><small>{{ src.replace(/^.*images\//, '/public/images/') }}</small></div>
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" draggable="false" @load="loaded = true" @error="failed = true" />
  </figure>
</template>

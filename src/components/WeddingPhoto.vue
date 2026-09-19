<script setup lang="ts">
import { photographs } from '@/data/wedding';
const props = withDefaults(defineProps<{ index: number; eager?: boolean; className?: string }>(), { eager: false, className: '' });
const photo = photographs[props.index];
</script>

<template>
  <img :class="className" draggable="false" :src="`/wedding/images/${photo.src}-640.webp`" :srcset="`/wedding/images/${photo.src}-640.webp 640w, /wedding/images/${photo.src}-1280.webp 1280w`" sizes="(max-width: 700px) 90vw, 54vw" :alt="photo.alt" width="640" height="960" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" :decoding="eager ? 'sync' : 'async'" :style="{ objectPosition: photo.position }" />
</template>

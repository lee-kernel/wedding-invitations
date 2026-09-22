<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'face' | 'bow' | 'peek';
}>(), {
  variant: 'face',
});

const kittyImage = `${import.meta.env.BASE_URL}images/invitation/hello-kitty.svg`;
</script>

<template>
  <svg
    v-if="variant === 'bow'"
    class="kitty-accent kitty-accent--bow"
    viewBox="0 0 88 54"
    aria-hidden="true"
    focusable="false"
  >
    <path class="kitty-fill-red" d="M39 21C29 6 9 5 5 17c-4 13 12 24 31 17 2-1 3-3 3-5v-8Z" />
    <path class="kitty-fill-red" d="M49 21C59 6 79 5 83 17c4 13-12 24-31 17-2-1-3-3-3-5v-8Z" />
    <rect class="kitty-fill-deep" x="35" y="16" width="18" height="21" rx="7" />
    <path class="kitty-line-soft" d="M36 25c-9-7-17-8-23-5m39 5c9-7 17-8 23-5" />
  </svg>

  <img v-else class="kitty-accent" :class="`kitty-accent--${variant}`" :src="kittyImage" alt="" draggable="false" />
</template>

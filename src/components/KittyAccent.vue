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
    viewBox="0 0 100 65"
    aria-hidden="true"
    focusable="false"
  >
    <path class="kitty-bow-lobe" d="M43 31C29 8 8 7 6 24 4 40 22 50 43 40Z" />
    <path class="kitty-bow-lobe" d="M57 31C72 10 94 12 95 30c1 17-19 25-40 12Z" />
    <circle class="kitty-bow-knot" cx="50" cy="35" r="16" />
    <path class="kitty-bow-fold" d="m35 28 7 5m23-5-8 6" />
  </svg>

  <img v-else class="kitty-accent" :class="`kitty-accent--${variant}`" :src="kittyImage" alt="" draggable="false" />
</template>

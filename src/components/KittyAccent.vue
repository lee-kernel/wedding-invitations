<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'face' | 'bow' | 'peek';
}>(), {
  variant: 'face',
});
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

  <svg
    v-else
    class="kitty-accent"
    :class="`kitty-accent--${variant}`"
    viewBox="0 0 190 150"
    aria-hidden="true"
    focusable="false"
  >
    <path class="kitty-fill-white kitty-outline" d="M35 62C27 42 27 21 43 17c11-3 24 4 38 11 14-4 31-5 46-1l28-11c15-5 22 13 20 43 10 13 12 34 7 50-9 27-43 37-86 37s-75-11-84-38c-5-16-3-35 8-48 2-1 7-2 15 2Z" />
    <ellipse class="kitty-fill-ink" cx="67" cy="91" rx="5.5" ry="8.5" />
    <ellipse class="kitty-fill-ink" cx="133" cy="91" rx="5.5" ry="8.5" />
    <ellipse class="kitty-fill-yellow kitty-nose" cx="100" cy="104" rx="9" ry="6.5" />
    <path class="kitty-line" d="M39 88 5 86m35 12L8 103m36 5-27 17m145-37 25-1m-26 12 26 7m-31 4 26 14" />
    <g class="kitty-bow" transform="translate(125 9) rotate(7)">
      <path class="kitty-fill-pink kitty-outline" d="M25 35C7 31 1 18 8 7c8-13 28-2 34 17l-1 17Z" />
      <path class="kitty-fill-pink kitty-outline" d="M53 31c10-15 29-14 33-1 4 14-10 28-29 25L46 44Z" />
      <circle class="kitty-fill-pink kitty-outline" cx="45" cy="37" r="15" />
      <path class="kitty-bow-fold" d="m22 25 12 8m24 3 15-4" />
    </g>
  </svg>
</template>

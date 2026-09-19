<script setup lang="ts">
type Direction = 'up-right' | 'down-right' | 'up' | 'down' | 'left' | 'right';
const props = withDefaults(defineProps<{ direction?: Direction }>(), { direction: 'up-right' });
const paths: Record<Direction, string> = {
  'up-right': 'M5 19 19 5M5 5h14v14', 'down-right': 'M5 5 19 19M5 19h14V5',
  up: 'M12 20V4m-7 7 7-7 7 7', down: 'M12 4v16m-7-7 7 7 7-7',
  left: 'M20 12H4m7-7-7 7 7 7', right: 'M4 12h16m-7-7 7 7-7 7',
};
</script>

<template>
  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path :d="paths[props.direction]" />
  </svg>
</template>

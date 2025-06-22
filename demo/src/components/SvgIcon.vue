// SvgIcon.vue

<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color, fontSize: size + 'px', cursor: cursor }">
    <use :href="iconName"></use>
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps({
    name: {
      type: [String, Number],
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: () => 20,
    },
    cursor: {
      type: String,
      default: 'default',
    },
  });
  const iconName = computed(() => `#${props.name}`);
  const svgClass = computed(() => {
    if (props.name) return `svg-icon ${props.name}`;
    return 'svg-icon';
  });
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }
</style>

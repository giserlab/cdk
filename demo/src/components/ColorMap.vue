<template>
  <div class="color-wrapper">
    <div class="colormap" :style="colormap">
      <div class="color-tip">
        <ul>
          <li v-for="item in quartLabels" :key="`${item}`">{{ `${item} ${unit}` }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { colorByPCT } from '@/util/tool';
  import { computed } from 'vue';

  const props = defineProps({
    unit: {
      type: String,
      default: () => '%',
    },
    colorFunc: {
      type: [Function, null],
      default: () => null,
    },
    quartLabels: {
      type: [Array<Number>, Array<String>],
      default: () => [0, 25, 50, 75, 100],
    },
  });

  let colormap: any = computed(() => {
    let colorGen = props.colorFunc || colorByPCT;
    const minColor = colorGen(0);
    const step1Color = colorGen(25);
    const step2Color = colorGen(50);
    const step3Color = colorGen(75);
    const maxColor = colorGen(100);
    return {
      position: 'relative',
      width: '100%',
      height: '20px',
      'border-radius': '5px',
      'background-image': `linear-gradient(to right, ${minColor.toCssColorString()}, ${step1Color.toCssColorString()}, ${step2Color.toCssColorString()},${step3Color.toCssColorString()}, ${maxColor.toCssColorString()})`,
    };
  });
</script>

<style lang="scss" scoped>
  .color-wrapper {
    margin: 1em 0em 2em;
    .colormap {
      height: 0.5em;
    }
    .color-tip {
      ul {
        position: absolute;
        display: flex;
        font-size: 13px;
        width: 100%;
        justify-content: space-between;
        bottom: -100%;
        list-style: none;
        li {
          font-size: 0.7em;
        }
      }
    }
  }
</style>

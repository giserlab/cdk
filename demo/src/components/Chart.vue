<template>
  <div :id="props.id" :style="chartStyle"></div>
</template>

<script setup lang="ts">
  import { onMounted, computed, watch } from 'vue';
  import * as echarts from 'echarts/core';
  import { GridComponent } from 'echarts/components';
  import { LineChart } from 'echarts/charts';
  import { UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  import { TooltipComponent } from 'echarts/components';
  import { createGuid } from 'cesium';

  echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TooltipComponent]);

  const props = defineProps({
    width: {
      type: String,
      default: () => '15em',
    },

    height: {
      type: String,
      default: () => '15em',
    },

    left: {
      type: [String, null],
      default: () => null,
    },
    bottom: {
      type: [String, null],
      default: () => null,
    },
    option: {
      type: Object,
      default: () => {
        return {
          grid: {
            left: 10 + 'px',
            right: 10 + 'px',
            bottom: 10 + 'px',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['a', 'b'],
            show: true,
            nameLocation: 'middle',
            nameGap: 20,
            axisLabel: {
              rotate: 20,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [10, 50],
              type: 'line',
              showSymbol: true,
            },
          ],
        };
      },
    },

    id: {
      type: String,
      default: () => createGuid(),
    },
  });

  const chartStyle = computed(() => {
    return {
      width: props.width,
      height: props.height,
      margin: '0 auto',
      position: props.bottom && props.left ? 'fixed' : 'none',
      left: props.left || 'auto',
      bottom: props.bottom || 'auto',
      pointerEvents: 'none',
    } as any;
  });

  let chartObj: any;

  function createOrUpdateChart(option: any) {
    if (!chartObj) {
      chartObj = echarts.init(document.getElementById(props.id), null, { locale: 'ZH' });
      chartObj.setOption(option);
      addEventListener('resize', () => {
        setTimeout(() => {
          chartObj.resize();
        }, 1000);
      });
    } else {
      chartObj.setOption(option);
    }
  }

  watch(
    () => props.option,
    val => {
      createOrUpdateChart(val);
    },
    { deep: true }
  );

  onMounted(() => createOrUpdateChart(props.option));
</script>

<style scoped lang="scss"></style>

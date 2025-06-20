<template>
  <div v-loading="state.loading">
    <div class="opts">
      <div class="opt-item">
        <label>间隔</label>
        <ElInputNumber v-model="state.interval" :min="10" :max="2000" :controls="false" />
      </div>
    </div>
    <ColorMap unit="m" :quart-labels="state.breaks" :color-func="detectColor" />
    <div class="btns">
      <button class="btn" @click="onStart">分析</button>
      <button class="btn" @click="onClean">清除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive } from 'vue';
  import { ElNotification } from 'element-plus';
  import { vLoading } from 'element-plus';
  import * as Cesium from 'cesium';
  import { Contour } from '$/contour/src/index';
  import { ElInputNumber } from 'element-plus';
  import ColorMap from '@/components/ColorMap.vue';
  import { DrawType as DT, Drawer } from '$/utils/src';

  const drawer = new Drawer(window.viewer, {
    type: DT.POLYGON,
    clampToGround: false,
    showShape: true,
  });

  const state = reactive({
    tiped: false,
    loading: false,
    interval: 50,
    breaks: [0, 25, 50, 75, 100] as any[],
    lineWidth: 2,
  });

  const viewer = window.viewer;
  const analyser = new Contour(viewer.terrainProvider);
  const primitives: Cesium.PrimitiveCollection = viewer.scene.groundPrimitives.add(new Cesium.PrimitiveCollection());

  const colorFunc = (num: number) => {
    let colorStart = Cesium.Color.WHITE;
    let colorEnd = Cesium.Color.RED;
    if (0 < num && num <= 0.25) {
      colorStart = Cesium.Color.fromCssColorString('#0cf2f4');
      colorEnd = Cesium.Color.fromCssColorString('#77f40c');
    } else if (0.25 < num && num <= 0.5) {
      colorStart = Cesium.Color.fromCssColorString('#77f40c');
      colorEnd = Cesium.Color.fromCssColorString('#f4dc0c');
    } else if (0.5 < num && num <= 0.75) {
      colorStart = Cesium.Color.fromCssColorString('#f4dc0c');
      colorEnd = Cesium.Color.fromCssColorString('#f45a0c');
    } else if (0.75 < num && num <= 1) {
      colorStart = Cesium.Color.fromCssColorString('#f45a0c');
      colorEnd = Cesium.Color.fromCssColorString('#f00');
    }
    return Cesium.Color.lerp(colorStart, colorEnd, num, new Cesium.Color());
  };

  drawer.finishedEvt.addEventListener((positions: Cesium.Cartesian3[]) => {
    if (positions.length >= 3) {
      state.loading = true;
      analyser
        .analyse(positions, state.interval)
        .then(res => {
          const step = (analyser.maxHeight - analyser.minHeight) / 4;
          const minH = analyser.minHeight;
          state.breaks.length = 0;
          for (let i = 0; i <= 4; i++) {
            state.breaks.push((minH + step * i).toFixed(1));
          }
          analyser.visualize(res, state.lineWidth, colorFunc).forEach(item => primitives.add(item));
        })
        .finally(() => {
          state.loading = false;
          drawer.clear();
        });
    }
  });

  function detectColor(val: number) {
    return analyser.coloring(val / 100);
  }

  const onStart = () => {
    if (!state.tiped) {
      ElNotification({ message: '点击鼠标左键绘制分析区域，点击鼠标右键结束绘制并分析。', duration: 5000 });
      state.tiped = true;
    }
    drawer.start();
  };

  const onClean = () => {
    drawer.clear();
    primitives.removeAll();
  };

  onMounted(async () => {});
  onBeforeUnmount(() => {
    onClean();
  });
</script>

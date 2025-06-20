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
  import { onBeforeUnmount, reactive } from 'vue';
  import { ElNotification } from 'element-plus';
  import { vLoading } from 'element-plus';
  import * as Cesium from 'cesium';
  import { Isosurface } from '$/isosurface/src/index';
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

  const detectColor = (t: number) => {
    t = t / 100;
    if (t <= 0.33) {
      return Cesium.Color.lerp(Cesium.Color.BLUE, Cesium.Color.GREEN, t * 3, new Cesium.Color());
    } else if (t <= 0.66) {
      return Cesium.Color.lerp(Cesium.Color.GREEN, Cesium.Color.YELLOW, (t - 0.33) * 3, new Cesium.Color());
    } else {
      return Cesium.Color.lerp(Cesium.Color.YELLOW, Cesium.Color.RED, (t - 0.66) * 3, new Cesium.Color());
    }
  };

  const genColors = (n: number) => {
    const colors: Cesium.Color[] = [];
    const step = 100 / n;
    for (let i = 0; i <= n; i++) {
      colors.push(detectColor(i * step));
    }
    return colors;
  };
  const viewer = window.viewer;
  const analyser = new Isosurface(viewer.terrainProvider, {
    width: 1500,
    colors: genColors(8),
    breakCount: 8,
  });
  const primitives: Cesium.PrimitiveCollection = viewer.scene.groundPrimitives.add(new Cesium.PrimitiveCollection());

  drawer.finishedEvt.addEventListener((positions: any[]) => {
    if (positions.length >= 3) {
      state.loading = true;
      analyser
        .analyse(positions, state.interval)
        .then(e => {
          viewer.entities.add(e);
        })
        .finally(() => {
          state.loading = false;
        });
    }
  });

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
    viewer.entities.removeAll();
  };

  onBeforeUnmount(() => {
    onClean();
  });
</script>

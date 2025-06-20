<template>
  <div v-loading="state.loading">
    <div class="opts">
      <div class="opt-item">
        <label for="">间隔</label>
        <input type="number" v-model="state.size" />
      </div>
    </div>
    <div class="btns">
      <button class="btn" @click="analyse">分析</button>
      <button class="btn" @click="onClean">清除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive } from 'vue';
  import * as Cesium from 'cesium';
  import { Aspect } from '$/aspect/src/index';
  import { vLoading } from 'element-plus';
  import { ElNotification } from 'element-plus';
  import { DrawType as DT, Drawer } from '$/utils/src';

  const state = reactive({
    tiped: false,
    size: 250,
    loading: false,
  });

  const entities: any[] = [];
  const analyser = new Aspect(window.viewer.terrainProvider, state.size);
  const drawer = new Drawer(window.viewer, {
    type: DT.POLYGON,
    clampToGround: true,
    showShape: true,
  });

  drawer.finishedEvt.addEventListener(async (positions: Cesium.Cartesian3[]) => {
    console.log('finish drawing');
    let pts = [...positions, positions[0]];
    if (pts.length >= 3) {
      state.loading = true;
      await analyser
        .analyse(pts)
        .then(res => {
          const { aspects, directions } = res;
          const uniqueAngles = [...new Set(aspects.map(a => Math.abs(Math.ceil(a))))];
          const distinctColors = generateDistinctColors(uniqueAngles.length);
          const colorMap = new Map(uniqueAngles.map((angle, i) => [angle, distinctColors[i]]));

          directions.forEach((item, i) => {
            const angle = Math.abs(Math.ceil(aspects[i]));
            const color = colorMap.get(angle);
            window.viewer.entities.add({
              polyline: {
                clampToGround: true,
                positions: item,
                material: new Cesium.PolylineArrowMaterialProperty(color),
                width: 8,
              },
            });
          });
        })
        .finally(() => {
          state.loading = false;
        });
      drawer.clear();
    }
  });

  const generateDistinctColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360;
      const color = Cesium.Color.fromHsl(hue / 360.0, 0.7, 0.7, 1.0);
      colors.push(color);
    }
    return colors;
  };

  const analyse = () => {
    if (!state.tiped) {
      ElNotification({ message: '点击鼠标左键绘制分析区域，点击右键结束绘制并分析。', duration: 5000 });
      state.tiped = true;
    }
    drawer.start();
  };

  onMounted(() => {
    window.viewer.scene.globe.depthTestAgainstTerrain = true;
  });

  const onClean = () => {
    drawer.clear();
    window.viewer.entities.removeAll();
  };

  onBeforeUnmount(() => {
    onClean();
  });
</script>

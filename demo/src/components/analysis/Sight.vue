<template>
  <div class="btns">
    <button class="btn" @click="analyse">分析</button>
    <button class="btn" @click="onClean">清除</button>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, reactive } from 'vue';
  import { ViewSight } from '$/sight/src';
  import { ElNotification } from 'element-plus';
  import { Cartesian3 } from 'cesium';
  import { DrawType as DT, Drawer } from '$/utils/src';
  const drawer = new Drawer(window.viewer, {
    type: DT.POLYGON,
    clampToGround: false,
    showShape: true,
  });
  const state = reactive({
    tiped: false,
  });

  const analyser = new ViewSight(window.viewer, {});
  console.log(analyser);

  drawer.drawingEvt.addEventListener((positions: Cartesian3[]) => {
    if (positions.length >= 2) {
      analyser.analyse(positions[0], positions[positions.length - 1]);
      drawer.clear();
    }
  });

  const analyse = () => {
    if (!state.tiped) {
      ElNotification({ message: '点击鼠标左键绘制分析区域，点击右键结束绘制并分析。', duration: 5000 });
      state.tiped = true;
    }
    drawer.start();
  };

  const onClean = () => {
    drawer.clear();
    analyser?.clear();
  };

  onBeforeUnmount(() => {
    onClean();
  });
</script>

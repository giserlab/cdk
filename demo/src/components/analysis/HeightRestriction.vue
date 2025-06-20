<template>
  <div v-loading="state.loading">
    <div class="opts">
      <div class="opt-item">
        <label>分析高度</label>
        <el-slider v-model="state.height" :min="10" :max="500" :step="10" />
      </div>
    </div>
    <div class="btns">
      <button class="btn" @click="onStart">分析</button>
      <button class="btn" @click="onClean">清除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive, watch } from 'vue';
  import { ElNotification } from 'element-plus';
  import { vLoading } from 'element-plus';
  import * as Cesium from 'cesium';
  import { HeightResctriction } from '$/height-restriction/src';
  import { ElSlider } from 'element-plus';
  import { debounce } from 'lodash-es';
  import { DrawType as DT, Drawer } from '$/utils/src';

  const drawer = new Drawer(window.viewer, {
    type: DT.POLYGON,
    clampToGround: false,
    showShape: true,
  });

  const state = reactive({
    tiped: false,
    loading: false,
    height: 200,
    baseHeight: 0,
    upColor: 'rgba(243, 86, 25, 0.7)',
    downColor: 'rgba(21, 170, 57, 0.7)',
  });
  const viewer = window.viewer;
  const analyser = new HeightResctriction(viewer, {
    height: state.height,
    baseHeight: state.baseHeight,
    upColor: state.upColor,
    downColor: state.downColor,
    extrudedHeight: 1000,
  });

  drawer.finishedEvt.addEventListener((positions: any[]) => {
    if (positions.length >= 3) {
      analyser.analyse(positions);
    }
  });

  const onStart = () => {
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

  const update = debounce(() => {
    analyser?.changeUpHeight(state.height);
  });
  watch(
    () => state.height,
    () => {
      update();
    }
  );

  onBeforeUnmount(() => {
    onClean();
  });
</script>

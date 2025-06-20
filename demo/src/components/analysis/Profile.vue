<template>
  <div v-loading="state.loading">
    <div class="opts">
      <div class="opt-item">
        <label>分析类型</label>
        <ElRadioGroup v-model="state.type">
          <ElRadio label="terrain" :value="ProfileType.TERRAIN">地形</ElRadio>
          <ElRadio label="model" :value="ProfileType.MODEL">模型</ElRadio>
        </ElRadioGroup>
      </div>
      <div class="opt-item">
        <label>分析间隔</label>
        <el-input-number v-model="state.interval" :min="1" :max="100" :controls="false" />
      </div>
    </div>
    <Chart :option="state.option" v-show="state.chartVisible" width="18em" height="15em" />
    <div class="btns">
      <button class="btn" @click="onStart">分析</button>
      <button class="btn" @click="() => (state.chartVisible = !state.chartVisible)">
        {{ state.chartVisible ? '隐藏' : '显示' }}显示图表
      </button>
      <button class="btn" @click="onClean">清除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as Cesium from 'cesium';
  import { onBeforeUnmount, reactive } from 'vue';
  import { ElNotification, ElRadioGroup, ElRadio, ElInputNumber } from 'element-plus';
  import { vLoading } from 'element-plus';
  import { Profile, ProfileType } from '$/profile/src';
  import Chart from '@/components/Chart.vue';
  import { genOption } from '@/util/chart';
  import { DrawType as DT, Drawer } from '$/utils/src';

  const drawer = new Drawer(window.viewer, {
    type: DT.POLYLINE,
    clampToGround: true,
    showShape: true,
  });

  const state = reactive({
    tiped: false,
    loading: false,
    chartVisible: false,
    type: ProfileType.TERRAIN,
    option: genOption([], []),
    interval: 50,
  });

  const viewer = window.viewer;
  const analyser = new Profile(viewer);
  drawer.finishedEvt.addEventListener(async (positions: any[]) => {
    state.loading = true;
    if (positions.length >= 2) {
      analyser
        .analyse(positions, { type: state.type, interval: state.interval })
        .then(res => {
          const { category, positions } = res;
          const values = positions.map(item => Number(item.height.toFixed(2)));
          const labels = category.map(item => Number(item).toFixed(1));
          state.option = genOption(values, labels);
          state.chartVisible = true;
        })
        .finally(() => (state.loading = false));
    }
  });

  const onStart = () => {
    if (!state.tiped) {
      ElNotification({ message: '点击鼠标左键绘制分析区域，点击右键结束绘制并分析。', duration: 5000 });
      state.tiped = true;
    }

    if (!viewer.terrainProvider) {
      ElNotification({ message: '请先加载地形数据！', type: 'warning' });
      return;
    }
    drawer.start();
  };

  const onClean = () => {
    drawer.clear();
    state.chartVisible = false;
  };

  onBeforeUnmount(() => {
    onClean();
  });
</script>

<template>
  <div v-loading="state.loading">
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
  import { DrawType as DT, Drawer } from '$/utils/src';

  const state = reactive({
    tiped: false,
    loading: false,
  });
  const viewer = window.viewer;
  const drawer = new Drawer(window.viewer, {
    type: DT.POLYGON,
    clampToGround: true,
    showShape: true,
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
  };

  onMounted(async () => {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(
      'https://md-1301600412.cos.ap-nanjing.myqcloud.com/GIS/3dtile/shanghai/tileset.json'
    );
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 3000));
  });
  onBeforeUnmount(() => {
    onClean();
  });
</script>

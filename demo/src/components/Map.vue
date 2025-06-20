<template>
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
  import * as Cesium from 'cesium';
  import { onMounted } from 'vue';
  import { useMap } from '../hooks/useMap';
  import config from '@/config';

  onMounted(() => {
    useMap({
      element: 'cesiumContainer',
      terrain: Cesium.Terrain.fromWorldTerrain(),
      token: config.ionToken || '',
      view: config.view,
    });
  });
</script>

<style scoped lang="scss">
  #cesiumContainer {
    width: 100%;
    height: 100%;
  }
</style>

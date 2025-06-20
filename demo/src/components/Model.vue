<template>
  <ul class="models">
    <li v-for="(item, i) in state.models" :key="i">
      <SvgIcon :name="item.status ? 'check-active' : 'check'" :size="15" @click="modelChange(item)" />
      <SvgIcon name="locate-active" :size="20" @click="zoomToModel(item)" v-show="item.status" />
      <span :class="[item.status ? 'active' : '']" @click="modelChange(item)">{{ item.name }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import * as Cesium from 'cesium';
  import { ModelItem } from '@/types';

  const state = reactive({
    models: [
      {
        name: '上海陆家嘴',
        url: 'https://md-1301600412.cos.ap-nanjing.myqcloud.com/GIS/3dtile/shanghai/tileset.json',
        status: false,
      },
    ],
  });

  const modelMap = new WeakMap();
  async function modelChange(item: ModelItem) {
    try {
      if (item.status) {
        const tileset = modelMap.get(item);
        if (!tileset) return;
        window.viewer.scene.primitives.remove(tileset);
        modelMap.delete(item);
        item.status = false;
      } else {
        const tileset = await Cesium.Cesium3DTileset.fromUrl(item.url);
        window.viewer.scene.primitives.add(tileset);
        window.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 3000));
        item.status = true;
        modelMap.set(item, tileset);
      }
    } catch (error) {
      console.log(`Error loading tileset: ${error}`);
    }
  }

  function zoomToModel(item: ModelItem) {
    const tileset = modelMap.get(item);
    if (!tileset || !item.status) return;
    window.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 3000));
  }
</script>

<style scoped lang="scss">
  .models {
    li {
      margin: 0.5em 0em;
      display: flex;
      align-items: center;
      gap: 1em;
      cursor: pointer;
      span {
        &:hover {
          color: rgb(12, 110, 223);
        }
        &.active {
          color: rgb(12, 110, 223);
        }
      }
    }
    :deep(.svg-icon) {
      &:hover {
        opacity: 0.8;
      }
    }
  }
</style>

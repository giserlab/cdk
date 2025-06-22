<template>
  <div class="container">
    <div class="sidebar"><Siderbar /></div>
    <div class="map-box">
      <Map />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Map from '@/components/Map.vue';
  import Siderbar from './sidebar/index.vue';
</script>

<style scoped lang="scss">
  $--map-width: 90vw;
  .container {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
    padding: 0.5em;
    .sidebar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100vw - $--map-width;
      height: 100%;
      padding: 0.5em;
      overflow-y: scroll;
      background-color: rgb(255, 255, 255);

      @include scroll-style();
    }
    .map-box {
      flex: 1;
      width: $--map-width;
      height: 100%;
    }
  }
</style>

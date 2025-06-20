<template>
  <div v-loading="state.loading">
    <div class="opts">
      <div class="opt-item">
        <label>类型</label>
        <ElRadioGroup v-model="state.type">
          <ElRadio :value="BufferType.POINT">点</ElRadio>
          <ElRadio :value="BufferType.POLYLINE">线</ElRadio>
          <ElRadio :value="BufferType.POLYGON">面</ElRadio>
        </ElRadioGroup>
      </div>
      <div class="opt-item">
        <label>距离</label>
        <el-input-number v-model="state.distance" :min="1" :max="10000" :controls="false" />
      </div>
      <div class="opt-item">
        <label>颜色</label>
        <el-color-picker v-model="state.color" />
      </div>
    </div>
    <div class="btns">
      <button class="btn" @click="onStart">分析</button>
      <button class="btn" @click="onClean">清除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, watch, reactive, computed } from 'vue';
  import { ElNotification, ElRadioGroup, ElRadio, ElInputNumber, ElColorPicker } from 'element-plus';
  import * as Cesium from 'cesium';
  import { Buffer, BufferType } from '$/buffer/src/index';
  import { DrawType as DT, Drawer } from '$/utils/src';

  const state = reactive({
    tiped: false,
    loading: false,
    type: BufferType.POLYLINE,
    distance: 100,
    color: '#0ff',
  });
  const viewer = window.viewer;
  const ds = new Cesium.CustomDataSource();
  viewer.dataSources.add(ds);
  const analyser = new Buffer({ type: BufferType.POLYLINE, distance: state.distance });
  const drawer = new Drawer(window.viewer, {
    type: DT.POLYLINE,
    clampToGround: true,
    showShape: true,
  });

  drawer.drawingEvt.addEventListener((positions: Cesium.Cartesian3[]) => {
    if (state.type !== BufferType.POINT) return;
    const num = positions.length;
    analyser.analyse([positions[num - 1]]).then(resp => {
      ds.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(resp),
          material: Cesium.Color.fromCssColorString(state.color),
        },
      });
    });
  });
  drawer.finishedEvt.addEventListener((positions: Cesium.Cartesian3[]) => {
    if (state.type === BufferType.POINT) return;
    state.loading = true;
    if (state.type == BufferType.POLYGON) {
      positions.push(positions[0]);
    }
    if (positions.length >= 2) {
      analyser
        .analyse(positions)
        .then(resp => {
          ds.entities.add({
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(resp),
              material: Cesium.Color.fromCssColorString(state.color),
            },
          });
        })
        .finally(() => (state.loading = false));
    }
  });

  const activeGeom = computed(() => {
    if (state.type == BufferType.POINT) {
      return DT.POINT;
    } else if (state.type == BufferType.POLYLINE) {
      return DT.POLYLINE;
    } else if (state.type == BufferType.POLYGON) {
      return DT.POLYGON;
    }
  });
  const onStart = () => {
    if (!state.tiped) {
      ElNotification({ message: '点击鼠标左键绘制分析区域，点击右键结束绘制并分析。', duration: 5000 });
      state.tiped = true;
    }
    drawer.start(activeGeom.value);
  };

  const onClean = () => {
    drawer.clear();
    ds.entities.removeAll();
    analyser?.clear();
  };

  watch(
    () => state.type,
    () => {
      analyser.type = state.type;
    }
  );

  watch(
    () => state.distance,
    () => {
      analyser.distance = state.distance;
    }
  );

  // onMounted(async () => {
  //   const tileset = await Cesium.Cesium3DTileset.fromUrl('https://md-1301600412.cos.ap-nanjing.myqcloud.com/GIS/3dtile/shanghai/tileset.json');
  //   viewer.scene.primitives.add(tileset);
  //   viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 3000));
  // });
  onBeforeUnmount(() => {
    onClean();
    viewer.dataSources.remove(ds);
  });
</script>

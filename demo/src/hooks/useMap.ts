import * as Cesium from 'cesium';

export interface InitMapOption {
  element: string;
  token: string;
  terrain: undefined | Cesium.Terrain;
  view?: number[];
}

export async function useMap(option: InitMapOption) {
  Cesium.Ion.defaultAccessToken = option.token;
  let viewer = new Cesium.Viewer(option.element || 'cesiumContainer', {
    // 位置查找工具
    geocoder: false,
    // 视角返回初始位置
    homeButton: false,
    // 选择视角的模式（球体、平铺、斜视平铺）
    sceneModePicker: false,
    // 导航帮助(手势，鼠标)
    navigationHelpButton: false,
    // 左下角仪表盘（动画器件）
    animation: false,
    // 底部时间线
    timeline: false,
    // 点击信息弹窗
    infoBox: false,
    // 全屏
    fullscreenButton: false,
    // VR
    vrButton: false,
    //开启动画
    shouldAnimate: true,
    // 底图点击
    baseLayerPicker: false,
    selectionIndicator: false,
    //@ts-ignore
    terrain: option.terrain,
    targetFrameRate: 160,
    maximumRenderTimeChange: Infinity,
    useDefaultRenderLoop: true,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
      ),
      {}
    ),
  });
  // viewer.scene.primitives.add(await Cesium.Cesium3DTileset.fromIonAssetId(2275207));

  Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
    {}
  )
    .then(terrainProvider => {
      viewer.terrainProvider = terrainProvider;
    })
    .catch(err => {
      console.error(err);
    });
  //  关闭控件显示
  //@ts-ignore
  viewer._cesiumWidget._creditContainer.style.display = 'none';
  const timelineContainer = document.querySelector('.cesium-viewer-timelineContainer');
  const animationContainer = document.querySelector('.cesium-viewer-animationContainer');
  const widgetContainer = document.querySelector('.cesium-widget-credits');
  [timelineContainer, animationContainer, widgetContainer].forEach(item => {
    item?.classList.add('!hidden');
  });
  if (option.view) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(option.view[0], option.view[1], option.view[2]),
    });
  }

  //@ts-ignore
  window.viewer = viewer;
  //@ts-ignore
  window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度测试
}

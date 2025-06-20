import { Aspect } from '../src/index';
import { ArcGISTiledElevationTerrainProvider, Cartesian3 } from 'cesium';

describe('aspect-analysis', () => {
  it('analysis', async () => {
    const terrainProv = await ArcGISTiledElevationTerrainProvider.fromUrl(
      'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
      {}
    );
    const aoi = [
      {
        x: -2770392.4300400484,
        y: 4757745.101836313,
        z: 3209361.6327501847,
      },
      {
        x: -2767991.334175132,
        y: 4762376.206063876,
        z: 3204593.2236846257,
      },
      {
        x: -2770121.9009374874,
        y: 4761659.746366588,
        z: 3203821.984233389,
      },
      {
        x: -2773545.6153182867,
        y: 4756648.58293024,
        z: 3208270.70597818,
      },
    ].map(item => new Cartesian3(item.x, item.y, item.z));
    const cellsize = 100;
    const aspectAnalyser = new Aspect(terrainProv, cellsize);
    const result = await aspectAnalyser.analyse(aoi);
  });
});

import { Cartesian3, JulianDate, ArcGISTiledElevationTerrainProvider } from 'cesium';
import { Cartographic } from 'cesium';
import { Ion } from 'cesium';
import { SpatialComputation } from '../src/spatialComputation';

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4OTBhYzZhZC03NjUxLTRlY2MtYjdmNy1lYmE3YTAyZTMwZWQiLCJpZCI6MjQxMDM5LCJpYXQiOjE3MjYxMzM4MTR9.NZCm8nObenhU1f5xNZQB6_S_rJPqBKFe3CrQ1p9Es5Y';

describe('SpatialComputation', () => {
  test('SpatialComputation-spaceDistance', () => {
    expect(
      SpatialComputation.spaceDistance([Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.1112, 23.2224, 0)])
    ).toBeGreaterThan(-1);
  });

  test('SpatialComputation-surfaceDistance', async () => {
    const terrainProv = await ArcGISTiledElevationTerrainProvider.fromUrl(
      'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
      {}
    );
    const resp = await SpatialComputation.surfaceDistance(
      terrainProv,
      [Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.1112, 23.2224, 0)],
      100
    );
    expect(resp.distance).toBeGreaterThan(0);
  });

  test('SpatialComputation-interpolate', () => {
    expect(
      SpatialComputation.interpolate([Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.1112, 23.2224, 0)], 30)
    ).toBeInstanceOf(Array);
  });

  test('SpatialComputation-surfaceSlope', async () => {
    const terrainProv = await ArcGISTiledElevationTerrainProvider.fromUrl(
      'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
      {}
    );
    const resp = await SpatialComputation.surfaceSlope(
      terrainProv,
      [Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.1112, 23.2224, 0)],
      100
    );
    expect(resp.category.length).toBeGreaterThan(0);
  });

  test('SpatialComputation-angle', () => {
    expect(
      SpatialComputation.angle(
        Cartesian3.fromDegrees(110.11145, 23.2223, 0),
        Cartesian3.fromDegrees(110.11145, 23.2223, 0),
        Cartesian3.fromDegrees(110.1312, 23.224, 0)
      )
    ).toBeGreaterThanOrEqual(0);
  });

  test('SpatialComputation-bearing', () => {
    expect(
      SpatialComputation.bearing(Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.11145, 23.2223, 0))
    ).toBeGreaterThanOrEqual(0);
  });

  test('SpatialComputation-geodesicDistanceByCartesians', () => {
    expect(
      SpatialComputation.geodesicDistanceByCartesians([Cartesian3.fromDegrees(110.11145, 23.2223, 0), Cartesian3.fromDegrees(110.11145, 23.2223, 0)])
    ).toBeGreaterThanOrEqual(0);
  });

  test('SpatialComputation-geodeticDistanceByCartographics', () => {
    expect(
      SpatialComputation.geodeticDistanceByCartographics([
        Cartographic.fromDegrees(110.11145, 23.2223, 0),
        Cartographic.fromDegrees(110.11145, 23.2223, 0),
      ])
    ).toBeGreaterThanOrEqual(0);
  });

  test('SpatialComputation-getSunPost', () => {
    expect(SpatialComputation.getSunPos(JulianDate.now())).toBeInstanceOf(Cartesian3);
  });
});

import * as Cesium from 'cesium';
import { bbox, squareGrid, polygon, booleanWithin, featureCollection, centroid } from '@turf/turf';

/**
 * @description 坡向分析结果
 */
export type AspectResult = {
  /**
   * @description 坡向集合，单位：度
   * @type {number[]}
   * @memberof AspectResult
   */
  aspects: number[];
  /**
   * @description 坡向方向坐标集合
   * @type {Cesium.Cartesian3[]}
   * @memberof AspectResult
   */
  directions: Cesium.Cartesian3[][];
};

/**
 * @description 坡向分析
 * @export
 * @class AspectAnalysis
 */
export class Aspect {
  /**
   * @description 格网尺寸，单位：米
   * @type {number}
   * @memberof AspectAnalysis
   */
  size: number = 250;
  /**
   * @description 地形提供者
   * @type {Cesium.TerrainProvider}
   * @memberof AspectAnalysis
   */
  terrainProvider: Cesium.TerrainProvider;

  constructor(terrainProvider: Cesium.TerrainProvider, size: number = 100) {
    this.terrainProvider = terrainProvider;
    this.size = size;
  }

  private computeMidpoint(cartographic1: Cesium.Cartographic, cartographic2: Cesium.Cartographic): Cesium.Cartesian3 {
    const lon = (cartographic1.longitude + cartographic2.longitude) / 2;
    const lat = (cartographic1.latitude + cartographic2.latitude) / 2;
    const carto = new Cesium.Cartographic(lon, lat);
    return Cesium.Cartographic.toCartesian(carto);
  }

  private computeAspect(cells: Cesium.Cartesian3[]): Promise<AspectResult> {
    return new Promise((resolve, reject) => {
      const cartos = cells.map(item => Cesium.Cartographic.fromCartesian(item));
      let promise = Cesium.sampleTerrainMostDetailed(this.terrainProvider, cartos);
      promise
        .then(samplePos => {
          const directions: Cesium.Cartesian3[][] = [];
          const recAspect: number[] = [];
          const cellCount = samplePos.length / 9;
          for (let i = 0; i < cellCount; i++) {
            const cell = samplePos.slice(i * 9, (i + 1) * 9);
            let highest = cell[0];
            const centroid = cell[cell.length - 1];
            let start, end;
            for (let i = 1; i < cell.length - 1; i++) {
              if (cell[i].height > highest.height) {
                highest = cell[i];
              }
            }
            if (centroid.height > highest.height) {
              start = centroid;
              end = highest;
            } else {
              start = highest;
              end = centroid;
            }
            const angle = this.calculateAzimuth(start, end);
            recAspect.push(Math.floor(angle));
            directions.push([Cesium.Cartographic.toCartesian(start), Cesium.Cartographic.toCartesian(end)]);
          }
          resolve({ aspects: recAspect, directions });
        })
        .catch(err => reject(err));
    });
  }

  private calculateAzimuth(point1: Cesium.Cartographic, point2: Cesium.Cartographic): number {
    const lon1 = point1.longitude;
    const lat1 = point1.latitude;
    const lon2 = point2.longitude;
    const lat2 = point2.latitude;
    const dLon = lon2 - lon1;
    const x = Math.sin(dLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let azimuth = Math.atan2(x, y);
    azimuth = Cesium.Math.toDegrees(azimuth);
    if (azimuth < 0) {
      azimuth += 360;
    }
    return -azimuth;
  }

  /**
   * @description 执行分析
   * @param positions  区域坐标点集合
   * @returns
   */
  async analyse(positions: Cesium.Cartesian3[], size?): Promise<AspectResult> {
    return new Promise((resolve, reject) => {
      try {
        let cartos = positions.map(p => Cesium.Cartographic.fromCartesian(p));
        const flatCartos = cartos.map(c => [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)]);
        const AOICoord = [[...flatCartos, flatCartos[0]]];
        let AOI = polygon(AOICoord);
        let box = bbox(AOI);
        let cellSide = this.size;
        let cellPosisitons: Cesium.Cartesian3[] = [];
        let grid = squareGrid(box, cellSide, { units: 'meters' });
        const filteredGrid = featureCollection(
          grid.features.filter(feature => {
            return booleanWithin(feature, AOI);
          })
        );

        filteredGrid.features.forEach(feat => {
          const coord = feat.geometry.coordinates[0];
          const center = centroid(feat).geometry.coordinates;
          const centroidCarte = Cesium.Cartesian3.fromDegrees(center[0], center[1]);
          let featCarte = [];
          for (let i = 0; i < coord.length - 1; i++) {
            featCarte.push(Cesium.Cartesian3.fromDegrees(coord[i][0], coord[i][1]));
          }
          const rect = Cesium.Rectangle.fromCartesianArray(featCarte);
          const northwest = Cesium.Rectangle.northwest(rect);
          const northeast = Cesium.Rectangle.northeast(rect);
          const southeast = Cesium.Rectangle.southeast(rect);
          const southwest = Cesium.Rectangle.southwest(rect);
          // 北边中点
          const northMidpoint = this.computeMidpoint(northwest, northeast);
          // 东边中点
          const eastMidpoint = this.computeMidpoint(northeast, southeast);
          // 南边中点
          const southMidpoint = this.computeMidpoint(southeast, southwest);
          // 西边中点
          const westMidpoint = this.computeMidpoint(southwest, northwest);
          cellPosisitons.push(...featCarte, northMidpoint, eastMidpoint, southMidpoint, westMidpoint, centroidCarte);
        });
        this.computeAspect(cellPosisitons)
          .then(res => {
            resolve(res);
            console.log('坡向分析完成');
          })
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }
}
export default Aspect;

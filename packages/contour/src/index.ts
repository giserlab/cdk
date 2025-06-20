import * as Cesium from 'cesium';
import { bbox } from '@turf/turf';
import { pointGrid } from '@turf/turf';
import { isolines } from '@turf/turf';
import { polygon, lineString } from '@turf/turf';

export type ContourLine = {
  /**
   * @description 等高线等级
   */
  grade: number;
  /**
   * @description 等高线多条线坐标集合
   */
  positions: Cesium.Cartesian3[][];
};

export type ContourResult = {
  /**
   * @description 等高线集合
   */
  lines: ContourLine[];
};

export class Contour {
  /**
   * @description 地形提供者
   * @private
   * @type {Cesium.TerrainProvider}
   * @memberof Contour
   */
  private _terrainProvider: Cesium.TerrainProvider;
  /**
   * @description 等高线间隔
   * @type {number}
   * @memberof Contour
   */
  interval: number = 50;
  /**
   * @description 等高线断点集合
   * @type {number[]}
   * @memberof Contour
   */
  breaks: number[] = [];
  /**
   * @description 最低高度
   * @type {number}
   * @memberof Contour
   */
  minHeight: number = 0;
  /**
   * @description 最高高度
   * @type {number}
   * @memberof Contour
   */
  maxHeight: number = 0;
  constructor(terrainProvider: Cesium.TerrainProvider) {
    this._terrainProvider = terrainProvider;
  }

  /**
   * @description 等高线等级数量（基于断点）
   * @readonly
   * @memberof Contour
   */
  get gradeCount() {
    return this.breaks.length;
  }

  /**
   * 执行分析
   * @param positions 分析区域坐标点
   * @param interval 间隔
   * @returns
   */
  async analyse(positions: Cesium.Cartesian3[], interval: number | null = null): Promise<ContourResult> {
    try {
      if (typeof interval === 'number') this.interval = interval;
      if (positions.length < 3) throw new Error('positions.length < 3');
      this.clear();

      return new Promise((resolve, reject) => {
        let cartos = positions.map(p => Cesium.Cartographic.fromCartesian(p));
        const flatCartos = cartos.map(c => [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)]);
        const coord = [[...flatCartos, flatCartos[0]]];
        let aoi = polygon(coord);
        let box = bbox(aoi);
        let cellWidth = 30;
        let cellPosisitons: Cesium.Cartographic[] = [];
        let grid = pointGrid(box, cellWidth, { units: 'meters' });
        if (!grid) reject(new Error('grid is null'));
        grid.features.forEach(feat => {
          const coords = feat.geometry.coordinates;
          cellPosisitons.push(Cesium.Cartographic.fromDegrees(coords[0], coords[1], 0));
        });

        Cesium.sampleTerrainMostDetailed(this._terrainProvider, cellPosisitons)
          .then(updatedPositions => {
            const heightCollection: number[] = [];
            for (let i = 0; i < updatedPositions.length; i++) {
              //@ts-ignore
              grid.features[i].properties['height'] = updatedPositions[i].height;
              heightCollection.push(updatedPositions[i].height);
            }

            heightCollection.sort((a, b) => a - b);
            this.minHeight = heightCollection[0];
            this.maxHeight = heightCollection[heightCollection.length - 1];

            for (let i = 0; i <= (this.maxHeight - this.minHeight) / this.interval; i++) {
              this.breaks.push(this.minHeight + i * this.interval);
            }

            let lines = isolines(grid, this.breaks, { zProperty: 'height' });
            let lineFeatures = lines.features;
            const contourLines: ContourLine[] = [];
            lineFeatures.forEach(feat => {
              //@ts-ignore
              const height = feat.properties.height;
              const linesCoords = feat.geometry.coordinates;
              const linesCartes: Cesium.Cartesian3[][] = [];
              linesCoords.forEach(lcd => {
                linesCartes.push(lcd.map(cd => Cesium.Cartesian3.fromDegrees(cd[0], cd[1], height)));
              });
              contourLines.push({
                grade: height,
                positions: linesCartes,
              });
            });
            resolve({ lines: contourLines });
          })
          .catch(err => reject(err));
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @param t 比例因子
   * @param startColor 色带开始颜色
   * @param endColor 色带结束颜色
   * @returns
   */
  coloring(
    t: number,
    startColor: Cesium.Color = Cesium.Color.fromCssColorString('#0e6bf4'),
    endColor: Cesium.Color = Cesium.Color.fromCssColorString('#fb5106')
  ) {
    return Cesium.Color.lerp(startColor, endColor, t, new Cesium.Color());
  }

  /**
   * 处理等高线结果，返回等高线图元集合
   * @param result 分析结果
   * @param colorFunc 颜色回调函数
   * @param lineWidth 等高线宽度
   * @returns
   */
  visualize(result: ContourResult, lineWidth = 2, colorFunc: Function | null = null): Cesium.GroundPolylinePrimitive[] {
    const primitives: Cesium.GroundPolylinePrimitive[] = [];
    const { lines } = result;
    lines.forEach(line => {
      const { positions, grade } = line;
      const t = (grade - this.minHeight) / (this.maxHeight - this.minHeight); // 插值比例
      const instances: Cesium.GeometryInstance[] = [];
      positions.forEach(ps => {
        const instance = new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: ps,
            width: lineWidth,
          }),
        });
        instances.push(instance);
      });
      const color = colorFunc ? colorFunc(t) : this.coloring(t);
      primitives.push(
        new Cesium.GroundPolylinePrimitive({
          geometryInstances: instances,
          appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
              fabric: {
                type: 'Color',
                uniforms: {
                  color: color,
                },
              },
            }),
          }),
        })
      );
    });
    return primitives;
  }

  /**
   * 清理
   */
  clear() {
    this.breaks.length = 0;
    this.minHeight = 0;
    this.maxHeight = 0;
  }
}

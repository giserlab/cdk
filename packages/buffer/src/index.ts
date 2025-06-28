import { polygon, lineString, point } from '@turf/helpers';
import { buffer } from '@turf/buffer';
import * as Cesium from 'cesium';

/**
 * @description 缓冲区类型
 * @export
 * @enum {number}
 */
export enum BufferType {
  POINT = 'point',
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
}
/**
 * @description 缓冲区配置
 * @export
 * @interface BufferOptions
 */
export interface BufferOptions {
  /**
   * @description 缓冲区距离
   * @type {number}
   */
  distance?: number;
  /**
   * @description 缓冲区类型
   * @type {BufferType}
   */
  type?: BufferType;
}

/**
 * @description 缓冲区分析
 * @export
 * @class Buffer
 * @example
 * const positions: Cesium.Cartesian3[] = [...];
 * const analyser = new Buffer({ type: BufferType.POLYLINE, distance: 500 });
 * analyser
 * .analyse(positions)
 * .then(resp => {
 *   ds.entities.add({
 *     polygon: {
 *       hierarchy: new Cesium.PolygonHierarchy(resp),
 *       material: Cesium.Color.fromCssColorString(state.color),
 *     },
 *   });
 * });
 */
export class Buffer {
  /**
   * @description 缓冲区距离
   * @type {number}
   * @memberof Buffer
   */
  distance: number = 100; // 单位 m
  /**
   * @description 缓冲区类型
   * @type {BufferType}
   * @memberof Buffer
   */
  type: BufferType = BufferType.POLYGON;
  constructor(options?: BufferOptions) {
    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * @description 设置缓冲区配置
   * @param {BufferOptions} options
   * @memberof Buffer
   */
  setOptions(options: BufferOptions) {
    if (options) {
      this.distance = options.distance || this.distance;
      this.type = options.type || this.type;
    }
  }

  /**
   * @description 缓冲区分析
   * @param {Cesium.Cartesian3[]} positions
   * @returns {*}  {(Promise<Cesium.Cartesian3[] | undefined>)}
   * @memberof Buffer
   */
  analyse(positions: Cesium.Cartesian3[]): Promise<Cesium.Cartesian3[] | undefined> {
    return new Promise((resolve, reject) => {
      if (this.type == BufferType.POINT) {
        const bufferCarte3s: Cesium.Cartesian3[] = [];
        positions.forEach((pos: Cesium.Cartesian3) => {
          const carto = Cesium.Cartographic.fromCartesian(pos);
          let pt = point([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
          let buffered = buffer(pt, this.distance, { units: 'meters' });
          const bufferPos = buffered?.geometry.coordinates[0];
          const bufferCarte3 = bufferPos?.map((item: any) => {
            return Cesium.Cartesian3.fromDegrees(item[0], item[1]);
          });
          if (bufferCarte3) bufferCarte3s.push(...bufferCarte3);
        });
        resolve(bufferCarte3s);
      } else {
        let bufferFeat: any;
        if (this.type === BufferType.POLYLINE) {
          const posCarto = positions.map(item => Cesium.Cartographic.fromCartesian(item));
          let line = lineString(posCarto.map(item => [Cesium.Math.toDegrees(item.longitude), Cesium.Math.toDegrees(item.latitude)]));
          bufferFeat = buffer(line, this.distance, { units: 'meters' });
        } else if (this.type === BufferType.POLYGON) {
          const posCarto = positions.map(item => Cesium.Cartographic.fromCartesian(item));
          let polygonFeat = polygon([posCarto.map(item => [Cesium.Math.toDegrees(item.longitude), Cesium.Math.toDegrees(item.latitude)])]);
          bufferFeat = buffer(polygonFeat, this.distance, { units: 'meters' });
        } else {
          reject('不支持的类型');
        }
        const bufferPos = bufferFeat?.geometry.coordinates[0];
        const bufferCarte3 = bufferPos?.map((item: any) => {
          return Cesium.Cartesian3.fromDegrees(item[0], item[1]);
        });
        resolve(bufferCarte3);
      }
    });
  }

  /**
   * @description 清除缓冲区
   * @memberof Buffer
   */
  clear() {}
}

export default Buffer;

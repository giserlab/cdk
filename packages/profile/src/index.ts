import * as Cesium from 'cesium';
import { SpatialComputation, SurfaceDistanceResult } from '../../utils/src';

export enum ProfileType {
  /**
   * @description 针对地形剖面
   */
  TERRAIN = 'terrain',
  /**
   * @description 针对模型剖面
   */
  MODEL = 'model',
}

/**
 * @description 剖面分析选项
 * @export
 * @interface ProfileOptions
 */
export interface ProfileOptions {
  /**
   * @description 采样间隔
   * @type {number}
   * @memberof ProfileOptions
   */
  interval?: number;

  /**
   * @description 剖面类型
   * @type {ProfileType}
   * @memberof ProfileOptions
   */
  type?: ProfileType;
}

/**
 * @description 剖面分析类，支持地形和模型
 * @export
 * @class Profile
 * @example
 * const positions: Cartesian3[] = [...];
 * const analyser = new Profile(viewer);
 * analyser.analyse(positions, { type: state.type, interval: state.interval }).then(res => {
 *   const { category, positions } = res;
 * })
 */
export class Profile {
  private _terrainProvider: Cesium.TerrainProvider;
  private _viewer: Cesium.Viewer;
  /**
   * @description 采样间隔
   */
  interval: number = 50;
  /**
   * @description 剖面类型
   * @type {ProfileType}
   * @memberof Profile
   */
  type: ProfileType;

  constructor(viewer: Cesium.Viewer, options?: ProfileOptions) {
    this._viewer = viewer;
    this._terrainProvider = viewer.terrainProvider;
    this.type = ProfileType.TERRAIN;
    if (options) this.setOptions(options);
  }

  /**
   * @description 设置选项
   * @private
   * @param {ProfileOptions} option
   * @memberof Profile
   */
  private setOptions(option: ProfileOptions) {
    this.interval = option.interval ? option.interval : this.interval;
    this.type = option.type ? option.type : this.type;
  }

  /**
   * @description 通过模型采样高度
   * @private
   * @param {Cesium.Cartesian3[]} positions
   * @returns {*}  {Promise<SurfaceDistanceResult>}
   * @memberof Profile
   */
  private sampleHeightThroughModel(positions: Cesium.Cartesian3[]): Promise<SurfaceDistanceResult> {
    return new Promise((resolve, reject) => {
      try {
        const interPts = SpatialComputation.interpolate(positions, this.interval).map(p => Cesium.Cartographic.toCartesian(p));
        var cartographics: any[] = [];
        let distCatogry: number[] = [];
        let totalDist = 0;
        const viewer = this._viewer;
        const scene = viewer.scene;
        interPts.forEach((p: Cesium.Cartesian3) => {
          const cCarto = Cesium.Cartographic.fromCartesian(p);
          const height = scene.sampleHeight(cCarto);
          cCarto.height = height;
          cartographics.push(cCarto);
        });
        for (let i = 0; i < cartographics.length - 1; i++) {
          const startPT = cartographics[i];
          const endPT = cartographics[i + 1];
          const dist = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromRadians(startPT.longitude, startPT.latitude, startPT.height),
            Cesium.Cartesian3.fromRadians(endPT.longitude, endPT.latitude, endPT.height)
          );
          distCatogry.push(dist);
          totalDist += dist;
        }
        resolve({
          distance: totalDist,
          category: distCatogry,
          positions: cartographics,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description 剖面分析
   * @param {Cesium.Cartesian3[]} positions
   * @param {ProfileOptions} [option]
   * @returns {Promise<SurfaceDistanceResult>}
   * @memberof Profile
   */
  async analyse(positions: Cesium.Cartesian3[], option?: ProfileOptions) {
    if (option) this.setOptions(option);
    if (this.type === ProfileType.TERRAIN) {
      return SpatialComputation.surfaceDistance(this._terrainProvider, positions, this.interval);
    } else if (this.type === ProfileType.MODEL) {
      return this.sampleHeightThroughModel(positions);
    } else {
      return Promise.reject('未知剖面类型');
    }
  }
}

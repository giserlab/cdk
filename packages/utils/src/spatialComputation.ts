import { Cartesian3, JulianDate } from 'cesium';
import { Cartographic } from 'cesium';
import { EllipsoidGeodesic } from 'cesium';
import { sampleTerrainMostDetailed } from 'cesium';
import { TerrainProvider } from 'cesium';
import { Math as CMath } from 'cesium';
import { Transforms } from 'cesium';
import { Viewer } from 'cesium';
import { Matrix3 } from 'cesium';
import { Simon1994PlanetaryPositions } from 'cesium';

/**
 * @description 表面距离测量结果
 * @export
 * @type SurfaceDistanceResult
 */
export type SurfaceDistanceResult = {
  /**
   * @description 总距离
   */
  distance: number;
  /**
   * @description 采样点间距离集合
   * @type {(String[] | number[])}
   * @memberof SurfaceDistanceResult
   */
  category: String[] | number[];
  /**
   * @description 采样点集合
   * @type {Cartographic[]}
   * @memberof SurfaceDistanceResult
   */
  positions: Cartographic[];
};

/**
 * @description 表面坡度测量结果
 * @export
 * @type SurfaceSlopeResult
 */
export type SurfaceSlopeResult = {
  /**
   * @description 总距离
   */
  distance: number;
  /**
   * @description 采样点间距离集合
   * @type {(String[] | number[])}
   * @memberof SurfaceDistanceResult
   */
  category: String[] | number[];
  /**
   * @description 采样点间坡度集合
   * @type {(String[] | number[])}
   * @memberof SurfaceDistanceResult
   */
  slopes: number[];
  /**
   * @description 采样点集合
   * @type {(String[] | number[])}
   * @memberof SurfaceDistanceResult
   */
  positions: Cartographic[];
};

export class SpatialComputation {
  /**
   * @description 计算空间距离
   * @export
   * @param {Array<Cartesian3>} positions
   * @return {Promise}
   */
  static spaceDistance(positions: Cartesian3[]): number {
    try {
      let totalDist = 0;
      const ptLength = positions.length;
      for (let i = 0; i < ptLength - 1; i++) {
        const dist = Cartesian3.distance(positions[i], positions[i + 1]);
        totalDist += dist;
      }
      return totalDist;
    } catch (e) {
      return -1;
    }
  }
  /**
   * 根据固定间隔计算插值点
   * @param positions 点位
   * @param interval 间隔
   * @returns Cartographic
   */
  static interpolate(positions: Cartesian3[], interval: number): Cartographic[] {
    let interPositions: Cartographic[] = [];
    for (let i = 0; i < positions.length - 1; i++) {
      let startPosition = positions[i];
      let endPosition = positions[i + 1];
      let linearDistance = Cartesian3.distance(startPosition, endPosition); //高度采样
      const count = Math.floor(linearDistance / interval);
      let startCartographic = Cartographic.fromCartesian(startPosition);
      let endCartographic = Cartographic.fromCartesian(endPosition);
      interPositions.push(startCartographic);
      for (let i = 1; i < count; i++) {
        let cart = Cartesian3.lerp(startPosition, endPosition, i / count, new Cartesian3());
        interPositions.push(Cartographic.fromCartesian(cart));
      }
      interPositions.push(endCartographic);
    }
    return interPositions;
  }

  /**
   *
   * @param terrainProvider 地形提供
   * @param pts 坐标点
   * @param interval 间隔
   * @returns
   */
  static surfaceDistance(terrainProvider: TerrainProvider, pts: Cartesian3[], interval: number = 50): Promise<SurfaceDistanceResult> {
    return new Promise((resolve, reject) => {
      let positions = SpatialComputation.interpolate(pts, interval);
      let promise = sampleTerrainMostDetailed(terrainProvider, positions);
      let distance = 0;
      promise
        .then(updatedPositions => {
          let distCatogry: String[] = [];
          for (let i = 0; i < updatedPositions.length; i++) {
            if (i == updatedPositions.length - 1) continue;
            const dist = Cartesian3.distance(
              Cartesian3.fromRadians(updatedPositions[i].longitude, updatedPositions[i].latitude, updatedPositions[i].height),
              Cartesian3.fromRadians(updatedPositions[i + 1].longitude, updatedPositions[i + 1].latitude, updatedPositions[i + 1].height)
            );
            distance += dist;
            distCatogry.push(dist.toFixed(0));
          }
          resolve({ category: distCatogry, positions: updatedPositions, distance: distance });
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * @description 计算表面线段坡度
   */
  static surfaceSlope(terrainProvider: TerrainProvider, pts: Cartesian3[], interval: number = 50): Promise<SurfaceSlopeResult> {
    return new Promise((resolve, reject) => {
      let positions = SpatialComputation.interpolate(pts, interval);
      let promise = sampleTerrainMostDetailed(terrainProvider, positions);
      promise
        .then(updatedPositions => {
          let distCatogry: string[] = [];
          let slopeArr: number[] = [];
          let surfaceDistance = 0;
          for (let i = 0; i < updatedPositions.length - 1; i++) {
            const startPT = updatedPositions[i];
            const endPT = updatedPositions[i + 1];
            const dist = Cartesian3.distance(
              Cartesian3.fromRadians(startPT.longitude, startPT.latitude, startPT.height),
              Cartesian3.fromRadians(endPT.longitude, endPT.latitude, endPT.height)
            );
            distCatogry.push(surfaceDistance.toFixed(0));
            const deltHeight = startPT.height > endPT.height ? startPT.height - endPT.height : endPT.height - startPT.height;
            // 计算坡度
            const slope = deltHeight / dist;
            // 计算坡度角度（以度为单位）
            const slopeAngleRadians = Math.atan(slope);
            const slopeDeg = CMath.toDegrees(slopeAngleRadians);
            surfaceDistance += dist;
            if (Number.isNaN(slopeDeg)) continue;
            slopeArr.push(slopeDeg);
          }
          resolve({
            distance: surfaceDistance,
            category: distCatogry,
            positions: updatedPositions,
            slopes: slopeArr,
          });
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * @description 计算角度
   * @param {Cartesian3} p1
   * @param {Cartesian3} p2
   * @param {Cartesian3} p3
   * @return {Number}
   */
  static angle(p1: Cartesian3, p2: Cartesian3, p3: Cartesian3): number {
    let bearing21 = SpatialComputation.bearing(p2, p1);
    let bearing23 = SpatialComputation.bearing(p2, p3);
    let angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  /**
   * @description 计算方向
   * @param {Cartesian3} from
   * @param {Cartesian3} to
   * @return {Number}
   */
  static bearing(from: Cartesian3, to: Cartesian3): number {
    let radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
    let degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
    let fromPt = Cartographic.fromCartesian(from);
    let toPt = Cartographic.fromCartesian(to);

    let lon1 = CMath.toDegrees(fromPt.longitude) * radiansPerDegree;
    let lat1 = CMath.toDegrees(fromPt.latitude) * radiansPerDegree;
    let lon2 = CMath.toDegrees(toPt.longitude) * radiansPerDegree;
    let lat2 = CMath.toDegrees(toPt.latitude) * radiansPerDegree;

    let angle = -Math.atan2(
      Math.sin(lon1 - lon2) * Math.cos(lat2),
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
    );
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian; //角度
    return angle;
  }

  /**
   * @description 计算基于水准面距离
   */
  static geodesicDistanceByCartesians(positions: Cartesian3[]): number {
    let totalLength = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      let point1 = positions[i];
      let point2 = positions[i + 1];
      let point1cartographic = Cartographic.fromCartesian(point1);
      let point2cartographic = Cartographic.fromCartesian(point2);
      let geodesic = new EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      totalLength += s;
    }

    return totalLength;
  }

  /**
   * @description 计算基于水准面距离
   */
  static geodeticDistanceByCartographics(positions: Cartographic[]): number {
    let totalLength = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      let point1 = positions[i];
      let point2 = positions[i + 1];
      let geodesic = new EllipsoidGeodesic();
      geodesic.setEndPoints(point1, point2);
      let s = geodesic.surfaceDistance;
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point2.height, 2));
      totalLength += s;
    }
    return totalLength;
  }

  /**
   * 获取太阳世界坐标位置
   * @param viewer
   * @returns
   */
  static getSunPos(currentTime: JulianDate): Cartesian3 {
    const icrfToFixed = new Matrix3();

    Transforms.computeTemeToPseudoFixedMatrix(currentTime, icrfToFixed);
    let sunPos = Simon1994PlanetaryPositions.computeSunPositionInEarthInertialFrame(currentTime);
    Matrix3.multiplyByVector(icrfToFixed, sunPos, sunPos);

    return sunPos;
  }
}

export default SpatialComputation;

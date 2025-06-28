import { Cartesian3, Ray, Viewer, Entity, Color, createGuid, PolylineArrowMaterialProperty } from 'cesium';

export interface ViewSightOptions {
  visibleColor?: string;
  invisibleColor?: string;
  barrierColor?: string;
}
/**
 * @description 视线分析
 * @export
 * @class ViewSight
 * @example
 * const positions: Cartesian3[] = [...];
 * const analyser = new ViewSight(window.viewer, {});
 * analyser.analyse(positions[0], positions[positions.length - 1]);
 */
export class ViewSight {
  viewer: Viewer;
  visibleColor: string;
  invisibleColor: string;
  barrierColor: string;
  entities: Entity[];
  /**
   *
   * @param {Viewer} viewer
   * @param {{ startColor?: string, endColor?: string }} params
   */
  constructor(viewer: Viewer, options: ViewSightOptions) {
    this.viewer = viewer;
    this.visibleColor = options.visibleColor || '#51df3d';
    this.invisibleColor = options.invisibleColor || '#df2914';
    this.barrierColor = options.barrierColor || '#3d59df';
    this.entities = [];
  }

  /**
   *
   * @param {Cartesian3} start
   * @param {Cartesian3} end
   */
  analyse(start: Cartesian3, end: Cartesian3) {
    const scene: any = this.viewer.scene;
    const ray = new Ray(start, Cartesian3.subtract(end, start, new Cartesian3()));
    let result = scene.pickFromRay(ray);
    console.log(result);
    if (result) {
      const { position } = result;
      const visibleLine = this.viewer.entities.add({
        id: createGuid(),
        polyline: {
          positions: [start, position],
          width: 8,
          material: new PolylineArrowMaterialProperty(Color.fromCssColorString(this.visibleColor)),
        },
      });
      this.entities.push(visibleLine);
      const barrier = this.viewer.entities.add({
        id: createGuid(),
        position: position,
        point: {
          pixelSize: 10,
          color: Color.fromCssColorString(this.barrierColor),
        },
      });
      this.entities.push(barrier);
      const invisibleLine = this.viewer.entities.add({
        id: createGuid(),
        polyline: {
          positions: [position, end],
          width: 8,
          material: new PolylineArrowMaterialProperty(Color.fromCssColorString(this.invisibleColor)),
        },
      });
      this.entities.push(invisibleLine);
    } else {
      const visibleLine = this.viewer.entities.add({
        id: createGuid(),
        polyline: {
          positions: [start, end],
          width: 8,
          material: new PolylineArrowMaterialProperty(Color.fromCssColorString(this.visibleColor)),
        },
      });
      this.entities.push(visibleLine);
    }
  }

  clear() {
    while (this.entities.length > 0) {
      const e = this.entities.pop();
      if (e) this.viewer.entities.remove(e);
    }
  }
}

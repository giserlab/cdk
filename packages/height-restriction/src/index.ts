import * as Cesium from 'cesium';

/**
 * @description 限高分析参数
 * @export
 * @interface HeightResctrictionOptions
 */
export interface HeightResctrictionOptions {
  /**
   * @description 限高高度,默认10
   * @type {number}
   * @memberof HeightResctrictionOptions
   */
  height?: number;
  /**
   * @description 限高基准高度,默认10
   * @type {number}
   * @memberof HeightResctrictionOptions
   */
  baseHeight?: number;
  /**
   * @description 限高上部颜色,默认rgba(239, 78, 43, 0.7)
   * @type {string}
   * @memberof HeightResctrictionOptions
   */
  upColor?: string;
  /**
   * @description 限高下部颜色,默认rgba(21, 170, 57, 0.7)
   * @type {string}
   * @memberof HeightResctrictionOptions
   */
  downColor?: string;
  /**
   * @description 限高上部高度,默认1000
   * @type {number}
   * @memberof HeightResctrictionOptions
   */
  extrudedHeight?: number;
}

/**
 * @description 限高分析
 * @export
 * @class HeightResctriction
 */
export class HeightResctriction {
  private upPrimitive: Cesium.ClassificationPrimitive | null;
  private panelEntity: Cesium.Entity | null;
  private downEntity: Cesium.Entity | null;
  viewer: Cesium.Viewer;
  height: number = 10;
  baseHeight: number = 10;
  upColor: string = 'rgba(239, 78, 43, 0.7)';
  downColor: string = 'rgba(21, 170, 57, 0.7)';
  positions: Array<Cesium.Cartesian3> = [];
  extrudedHeight: number = 1000;

  constructor(viewer: Cesium.Viewer, option?: HeightResctrictionOptions) {
    this.viewer = viewer;
    this.positions = [];
    this.upPrimitive = null;
    this.panelEntity = null;
    this.downEntity = null;
    if (option) this.setOption(option);
  }

  private setOption(option: HeightResctrictionOptions) {
    this.height = option.height || this.height;
    this.baseHeight = option.baseHeight || this.baseHeight;
    this.extrudedHeight = option.extrudedHeight || this.extrudedHeight;
    this.upColor = option.upColor || this.upColor;
    this.downColor = option.downColor || this.downColor;
  }

  cartesian3ToCartographic() {
    let cartos = this.positions.map(cart3 => {
      let carto = Cesium.Cartographic.fromCartesian(cart3);
      carto.height = this.height;
      return carto;
    });
    return cartos.map(item => {
      return Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(item.longitude), Cesium.Math.toDegrees(item.latitude), item.height);
    });
  }

  private _drawDownEntity() {
    this.downEntity = this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this.cartesian3ToCartographic());
        }, false),
        material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(this.downColor)),
        perPositionHeight: false,
        outline: true,
        outlineColor: Cesium.Color.YELLOW.withAlpha(0.7),
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      },
    });
  }

  private _drawFloatingEntity() {
    this.panelEntity = this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this.cartesian3ToCartographic());
        }, false),
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.3)),
        perPositionHeight: true,
        outline: true,
        outlineWidth: 4,
        outlineColor: Cesium.Color.YELLOW.withAlpha(1),
      },
    });
  }

  private _drawUpPrimitive() {
    let upGeometry = new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(this.positions),
        height: 0,
        extrudedHeight: this.extrudedHeight,
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(this.upColor)),
      },
    });
    if (!this.upPrimitive) {
      this.upPrimitive = this.viewer.scene.primitives.add(
        new Cesium.ClassificationPrimitive({
          geometryInstances: upGeometry,
          releaseGeometryInstances: false,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        })
      );
    }
  }

  /**
   * @description 改变限高高度
   * @param {number} height
   * @returns {*}
   * @memberof HeightResctriction
   */
  changeUpHeight(height: number): any {
    if (!this.upPrimitive) return;
    this.height = height;
    // @ts-ignore
    let cartographic = Cesium.Cartographic.fromCartesian(this.upPrimitive._primitive._boundingSpheres[0].center); // 弧度
    let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, this.baseHeight);
    let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, this.baseHeight + height);
    let trans = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    // @ts-ignore
    this.upPrimitive._primitive.modelMatrix = Cesium.Matrix4.fromTranslation(trans);
  }

  /**
   * @description 执行分析
   * @param {Array<Cesium.Cartesian3>} positions
   * @memberof HeightResctriction
   */
  analyse(positions: Array<Cesium.Cartesian3>) {
    this.positions.length = 0;
    this.positions.push(...positions);
    this._drawUpPrimitive();
    this._drawDownEntity();
    this._drawFloatingEntity();
    setTimeout(() => {
      this.changeUpHeight(this.height);
    }, 1500);
  }

  /**
   * @description 清除分析
   * @memberof HeightResctriction
   */
  clear() {
    this.positions.length = 0;
    if (this.panelEntity) this.viewer.entities.remove(this.panelEntity);
    if (this.downEntity) this.viewer.entities.remove(this.downEntity);
    this.viewer.scene.primitives.remove(this.upPrimitive);
    this.upPrimitive = null;
    this.panelEntity = null;
    this.downEntity = null;
  }
}

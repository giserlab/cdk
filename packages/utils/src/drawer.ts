import * as Cesium from 'cesium';

const getCatesian3FromPX = (viewer: Cesium.Viewer, px: Cesium.Cartesian2) => {
  if (!px) return;
  const picks = viewer.scene.drillPick(px);
  let cartesian = null;
  let isOn3dtiles = false,
    isOnTerrain = false;
  for (let i in picks) {
    let pick = picks[i];

    if (
      (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
      (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
      (pick && pick.primitive instanceof Cesium.Model)
    ) {
      isOn3dtiles = true;
    }
    if (isOn3dtiles) {
      viewer.scene.pick(px);
      cartesian = viewer.scene.pickPosition(px);
      if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        if (cartographic.height < 0) cartographic.height = 0;
        let lon = Cesium.Math.toDegrees(cartographic.longitude),
          lat = Cesium.Math.toDegrees(cartographic.latitude),
          height = cartographic.height;
        cartesian = Cesium.Cartesian3.fromDegrees(lon, lat, height);
      }
    }
  }
  let boolTerrain = viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
  if (!isOn3dtiles && !boolTerrain) {
    var ray = viewer.scene.camera.getPickRay(px);
    if (!ray) return null;
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    isOnTerrain = true;
  }
  if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
    cartesian = viewer.scene.camera.pickEllipsoid(px, viewer.scene.globe.ellipsoid);
  }
  if (cartesian) {
    return cartesian;
  }
  return false;
};

export enum DrawType {
  POINT = 'point',
  POLYLINE = 'poyline',
  POLYGON = 'polygon',
}

export interface DrawOptions {
  type?: DrawType;
  showShape?: boolean;
  clampToGround?: boolean;
}

export class Drawer {
  private _positions: Cesium.Cartesian3[];
  private _lcc: number;
  private _handler: Cesium.ScreenSpaceEventHandler;
  private _drawType: DrawType;
  private _floatingEnitity: Cesium.Entity | undefined;
  private _pointEntities: Cesium.Entity[];
  private _active: boolean;
  private _timer: any;
  private _dbClickST: number = 0;
  lineColor: Cesium.Color = Cesium.Color.YELLOW;
  lineWidth: number = 6;
  polygoneColor: Cesium.Color = Cesium.Color.YELLOW.withAlpha(0.6);
  cesiumDivEleID: string = 'cesiumContainer';
  showShape: boolean;
  clampToGround: boolean;
  finishedEvt: Cesium.Event;
  drawingEvt: Cesium.Event;
  viewer: Cesium.Viewer;
  constructor(viewer: Cesium.Viewer, options: DrawOptions) {
    this.viewer = viewer;
    this._positions = [];
    this._lcc = 0; // left click count
    this._handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this._drawType = options.type || DrawType.POINT;
    this._floatingEnitity = undefined;
    this._pointEntities = [];
    this._active = false;
    this.showShape = options.showShape == false ? false : true;
    this.clampToGround = options.clampToGround != null ? options.clampToGround : true;
    this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.finishedEvt = new Cesium.Event();
    this.drawingEvt = new Cesium.Event();
  }

  private leftClickHandler(e: any) {
    const pos = getCatesian3FromPX(this.viewer, e.position);
    if (pos) {
      if (this._lcc < this._positions.length) {
        // 取出最后一个绘制的点
        this._positions.pop();
      }
      this._positions.push(pos);
      this._lcc++;
      this.drawingEvt.raiseEvent(this._positions);
      if (this.showShape) {
        const entity = this.viewer.entities.add({
          id: Cesium.createGuid(),
          position: pos,
          point: {
            color: Cesium.Color.RED,
            pixelSize: 10,
            outlineWidth: this.lineWidth,
            outlineColor: Cesium.Color.fromCssColorString('#3dc8df'),
          },
        });
        this._pointEntities.push(entity);
      }
      if (!this._floatingEnitity && this.showShape) {
        if (this._drawType === DrawType.POLYLINE && !this._floatingEnitity) {
          let entity = this.viewer.entities.add({
            id: Cesium.createGuid(),
            polyline: {
              positions: new Cesium.CallbackProperty(() => this._positions, false),
              clampToGround: this.clampToGround,
              width: this.lineWidth,
              material: new Cesium.PolylineGlowMaterialProperty({
                color: this.lineColor,
                glowPower: 0.6,
              }),
            },
          });
          this._floatingEnitity = entity;
        } else if (this._drawType === DrawType.POLYGON && !this._floatingEnitity) {
          let entity = this.viewer.entities.add({
            id: Cesium.createGuid(),
            polygon: {
              hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(this._positions), false),
              material: this.polygoneColor,
              perPositionHeight: !this.clampToGround,
            },
            polyline: {
              // 线段要闭合
              positions: new Cesium.CallbackProperty(() => [...this._positions, this._positions[0]], false),
              clampToGround: this.clampToGround,
              width: this.lineWidth,
              material: new Cesium.PolylineGlowMaterialProperty({
                color: this.lineColor,
                glowPower: 0.6,
              }),
            },
          });
          this._floatingEnitity = entity;
        } else {
        }
      }
    }
  }

  private leftClick(e: any) {
    const now = new Date().getTime();
    const diff = now - this._dbClickST;
    this._dbClickST = now;
    // 第一次点击
    if (diff > 500) {
      // 不是双击，延迟执行
      if (this._timer) clearTimeout(this._timer);
      this._timer = setTimeout(() => this.leftClickHandler(e), 500);
    } else {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    }
  }

  private mouseMove(e: any) {
    const pos = getCatesian3FromPX(this.viewer, e.endPosition);
    if (pos) {
      if (this._positions.length > this._lcc) {
        this._positions.pop();
      }
      this._positions.push(pos);
      this.drawingEvt.raiseEvent(this._positions);
    }
  }

  private rightClick(e: any) {
    this.stop();
    this.finishedEvt.raiseEvent(this._positions);
  }

  private leftDoubleClick(e: any) {
    // 将动态的多余点去除
    for (let i = 0; i < this._positions.length - this._lcc; i++) {
      this._positions.pop();
    }
    this._positions.pop();
    const p = this._pointEntities.pop();
    if (p) this.viewer.entities.remove(p);
    this._lcc--;

    this.drawingEvt.raiseEvent(this._positions);
  }

  private bindEvt() {
    this._handler.setInputAction(this.leftClickHandler.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // this._handler.setInputAction(this.leftDoubleClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this._handler.setInputAction(this.mouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._handler.setInputAction(this.rightClick.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  private unbindEvt() {
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  start(drawType?: DrawType) {
    this._drawType = typeof drawType === 'undefined' ? this._drawType : drawType;
    this._active = true;
    this.setCursorStyle(true);
    this.bindEvt();
  }

  stop() {
    this.unbindEvt();
    this._active = false;
    this.setCursorStyle(false);
  }

  clear() {
    this._positions.length = 0;
    this._lcc = 0;
    if (this._floatingEnitity) {
      this.viewer.entities.remove(this._floatingEnitity);
      this._floatingEnitity = undefined;
    }
    while (this._pointEntities.length >= 1) {
      let e = this._pointEntities.pop();
      if (e) this.viewer.entities.remove(e);
    }
  }

  updateDrawOption(option: DrawOptions) {
    if (typeof option.type === 'string') this._drawType = option.type;
    if (typeof option.clampToGround === 'boolean') this.clampToGround = option.clampToGround;
    if (typeof option.showShape === 'boolean') this.showShape = option.showShape;
  }

  private setCursorStyle(flag: boolean) {
    try {
      let map = document.getElementById(this.cesiumDivEleID);
      if (map) map.style.cursor = flag === true ? 'crosshair' : 'default';
    } catch {
      console.error('未匹配到地图元素！');
    }
  }
}

export default Drawer;

**cdk v0.2.0**

***

# cdk v0.2.0

## Enumerations

### BufferType

#### Description

缓冲区类型

#### Export

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="point"></a> `POINT` | `"point"` |
| <a id="polygon"></a> `POLYGON` | `"polygon"` |
| <a id="polyline"></a> `POLYLINE` | `"polyline"` |

***

### DrawType

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="point-1"></a> `POINT` | `"point"` |
| <a id="polygon-1"></a> `POLYGON` | `"polygon"` |
| <a id="polyline-1"></a> `POLYLINE` | `"poyline"` |

***

### MeasureType

#### Description

测量类型

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="area"></a> `AREA` | `1` |
| <a id="bareaing"></a> `BAREAING` | `3` |
| <a id="distance"></a> `DISTANCE` | `0` |
| <a id="height"></a> `HEIGHT` | `2` |

***

### ProfileType

#### Enumeration Members

| Enumeration Member | Value | Description |
| ------ | ------ | ------ |
| <a id="model"></a> `MODEL` | `"model"` | **Description** 针对模型剖面 |
| <a id="terrain"></a> `TERRAIN` | `"terrain"` | **Description** 针对地形剖面 |

## Classes

### Aspect

#### Description

坡向分析

#### Export

AspectAnalysis

#### Constructors

##### new Aspect()

```ts
new Aspect(terrainProvider, size): Aspect
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `terrainProvider` | `TerrainProvider` | `undefined` |
| `size` | `number` | `100` |

###### Returns

[`Aspect`](README.md#aspect)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="size"></a> `size` | `number` | `250` | **Description** 格网尺寸，单位：米 **Memberof** AspectAnalysis |
| <a id="terrainprovider"></a> `terrainProvider` | `TerrainProvider` | `undefined` | **Description** 地形提供者 **Memberof** AspectAnalysis |

#### Methods

##### analyse()

```ts
analyse(positions, size?): Promise<AspectResult>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] | 区域坐标点集合 |
| `size`? | `any` | - |

###### Returns

`Promise`\<[`AspectResult`](README.md#aspectresult)\>

###### Description

执行分析

***

### Buffer

#### Description

缓冲区分析

#### Export

Buffer

#### Constructors

##### new Buffer()

```ts
new Buffer(options?): Buffer
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`BufferOptions`](README.md#bufferoptions) |

###### Returns

[`Buffer`](README.md#buffer)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="distance-1"></a> `distance` | `number` | `100` | **Description** 缓冲区距离 **Memberof** Buffer |
| <a id="type"></a> `type` | [`BufferType`](README.md#buffertype) | `BufferType.POLYGON` | **Description** 缓冲区类型 **Memberof** Buffer |

#### Methods

##### analyse()

```ts
analyse(positions): Promise<Cartesian3[]>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`Cartesian3`[]\>

{(Promise<Cesium.Cartesian3[] | undefined>)}

###### Description

缓冲区分析

###### Memberof

Buffer

##### clear()

```ts
clear(): void
```

###### Returns

`void`

###### Description

清除缓冲区

###### Memberof

Buffer

##### setOptions()

```ts
setOptions(options): void
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`BufferOptions`](README.md#bufferoptions) |  |

###### Returns

`void`

###### Description

设置缓冲区配置

###### Memberof

Buffer

***

### Contour

#### Constructors

##### new Contour()

```ts
new Contour(terrainProvider): Contour
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `terrainProvider` | `TerrainProvider` |

###### Returns

[`Contour`](README.md#contour)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="breaks"></a> `breaks` | `number`[] | `[]` | **Description** 等高线断点集合 **Memberof** Contour |
| <a id="interval"></a> `interval` | `number` | `50` | **Description** 等高线间隔 **Memberof** Contour |
| <a id="maxheight"></a> `maxHeight` | `number` | `0` | **Description** 最高高度 **Memberof** Contour |
| <a id="minheight"></a> `minHeight` | `number` | `0` | **Description** 最低高度 **Memberof** Contour |

#### Accessors

##### gradeCount

###### Get Signature

```ts
get gradeCount(): number
```

###### Description

等高线等级数量（基于断点）

###### Memberof

Contour

###### Returns

`number`

#### Methods

##### analyse()

```ts
analyse(positions, interval): Promise<ContourResult>
```

执行分析

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `positions` | `Cartesian3`[] | `undefined` | 分析区域坐标点 |
| `interval` | `number` | `null` | 间隔 |

###### Returns

`Promise`\<[`ContourResult`](README.md#contourresult)\>

##### clear()

```ts
clear(): void
```

清理

###### Returns

`void`

##### coloring()

```ts
coloring(
   t, 
   startColor, 
   endColor): Color
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `t` | `number` | 比例因子 |
| `startColor` | `Color` | 色带开始颜色 |
| `endColor` | `Color` | 色带结束颜色 |

###### Returns

`Color`

##### visualize()

```ts
visualize(
   result, 
   lineWidth, 
   colorFunc): GroundPolylinePrimitive[]
```

处理等高线结果，返回等高线图元集合

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `result` | [`ContourResult`](README.md#contourresult) | `undefined` | 分析结果 |
| `lineWidth` | `number` | `2` | 等高线宽度 |
| `colorFunc` | `Function` | `null` | 颜色回调函数 |

###### Returns

`GroundPolylinePrimitive`[]

***

### Drawer

#### Constructors

##### new Drawer()

```ts
new Drawer(viewer, options): Drawer
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `viewer` | `Viewer` |
| `options` | [`DrawOptions`](README.md#drawoptions) |

###### Returns

[`Drawer`](README.md#drawer)

#### Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| <a id="cesiumdiveleid"></a> `cesiumDivEleID` | `string` | `'cesiumContainer'` |
| <a id="clamptoground"></a> `clampToGround` | `boolean` | `undefined` |
| <a id="drawingevt"></a> `drawingEvt` | `Event`\<(...`args`) => `void`\> | `undefined` |
| <a id="finishedevt"></a> `finishedEvt` | `Event`\<(...`args`) => `void`\> | `undefined` |
| <a id="linecolor"></a> `lineColor` | `Color` | `Cesium.Color.YELLOW` |
| <a id="linewidth"></a> `lineWidth` | `number` | `6` |
| <a id="polygonecolor"></a> `polygoneColor` | `Color` | `undefined` |
| <a id="showshape"></a> `showShape` | `boolean` | `undefined` |
| <a id="viewer"></a> `viewer` | `Viewer` | `undefined` |

#### Methods

##### clear()

```ts
clear(): void
```

###### Returns

`void`

##### start()

```ts
start(drawType?): void
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `drawType`? | [`DrawType`](README.md#drawtype) |

###### Returns

`void`

##### stop()

```ts
stop(): void
```

###### Returns

`void`

##### updateDrawOption()

```ts
updateDrawOption(option): void
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `option` | [`DrawOptions`](README.md#drawoptions) |

###### Returns

`void`

***

### HeightResctriction

#### Description

限高分析

#### Export

HeightResctriction

#### Constructors

##### new HeightResctriction()

```ts
new HeightResctriction(viewer, option?): HeightResctriction
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `viewer` | `Viewer` |
| `option`? | [`HeightResctrictionOptions`](README.md#heightresctrictionoptions) |

###### Returns

[`HeightResctriction`](README.md#heightresctriction)

#### Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| <a id="baseheight"></a> `baseHeight` | `number` | `10` |
| <a id="downcolor"></a> `downColor` | `string` | `'rgba(21, 170, 57, 0.7)'` |
| <a id="extrudedheight"></a> `extrudedHeight` | `number` | `1000` |
| <a id="height-1"></a> `height` | `number` | `10` |
| <a id="positions"></a> `positions` | `Cartesian3`[] | `[]` |
| <a id="upcolor"></a> `upColor` | `string` | `'rgba(239, 78, 43, 0.7)'` |
| <a id="viewer-1"></a> `viewer` | `Viewer` | `undefined` |

#### Methods

##### analyse()

```ts
analyse(positions): void
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`void`

###### Description

执行分析

###### Memberof

HeightResctriction

##### cartesian3ToCartographic()

```ts
cartesian3ToCartographic(): Cartesian3[]
```

###### Returns

`Cartesian3`[]

##### changeUpHeight()

```ts
changeUpHeight(height): any
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `height` | `number` |  |

###### Returns

`any`

###### Description

改变限高高度

###### Memberof

HeightResctriction

##### clear()

```ts
clear(): void
```

###### Returns

`void`

###### Description

清除分析

###### Memberof

HeightResctriction

***

### Measure

#### Description

测量

#### Constructors

##### new Measure()

```ts
new Measure(option?): Measure
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `option`? | [`MeasureOptions`](README.md#measureoptions) |

###### Returns

[`Measure`](README.md#measure)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="isspatial"></a> `isSpatial` | `boolean` | `true` | **Description** 是否空间模式 **Memberof** Measure |
| <a id="measuretype-1"></a> `measureType` | [`MeasureType`](README.md#measuretype) | `MeasureType.DISTANCE` | **Description** 测量类型 **Memberof** Measure |

#### Methods

##### analyse()

```ts
analyse(positions, terrainProvider?): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |
| `terrainProvider`? | `TerrainProvider` |  |

###### Returns

`Promise`\<`number`\>

###### Description

统一分析方法

##### clear()

```ts
clear(): void
```

###### Returns

`void`

##### horizontalAngle()

```ts
horizontalAngle(positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

方位角计算

##### spatialArea()

```ts
spatialArea(positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

空间面积

##### spatialDistance()

```ts
spatialDistance(positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

空间距离

##### spatialHeight()

```ts
spatialHeight(positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

空间/贴地高度

##### surfaceArea()

```ts
surfaceArea(terrainProvider, positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `terrainProvider` | `TerrainProvider` | - |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

表面面积

##### surfaceDistance()

```ts
surfaceDistance(terrainProvider, positions): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `terrainProvider` | `TerrainProvider` | - |
| `positions` | `Cartesian3`[] |  |

###### Returns

`Promise`\<`number`\>

###### Description

贴地表面距离

##### updateOptions()

```ts
updateOptions(option): void
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `option` | [`MeasureOptions`](README.md#measureoptions) |  |

###### Returns

`void`

###### Description

更新选项

***

### Profile

#### Description

剖面分析类，支持地形和模型

#### Export

Profile

#### Constructors

##### new Profile()

```ts
new Profile(viewer, options?): Profile
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `viewer` | `Viewer` |
| `options`? | [`ProfileOptions`](README.md#profileoptions) |

###### Returns

[`Profile`](README.md#profile)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="interval-1"></a> `interval` | `number` | `50` | **Description** 采样间隔 |
| <a id="type-1"></a> `type` | [`ProfileType`](README.md#profiletype) | `undefined` | **Description** 剖面类型 **Memberof** Profile |

#### Methods

##### analyse()

```ts
analyse(positions, option?): Promise<SurfaceDistanceResult>
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |
| `option`? | [`ProfileOptions`](README.md#profileoptions) |  |

###### Returns

`Promise`\<[`SurfaceDistanceResult`](README.md#surfacedistanceresult)\>

###### Description

剖面分析

###### Memberof

Profile

***

### SpatialComputation

#### Constructors

##### new SpatialComputation()

```ts
new SpatialComputation(): SpatialComputation
```

###### Returns

[`SpatialComputation`](README.md#spatialcomputation)

#### Methods

##### angle()

```ts
static angle(
   p1, 
   p2, 
   p3): number
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `p1` | `Cartesian3` |  |
| `p2` | `Cartesian3` |  |
| `p3` | `Cartesian3` |  |

###### Returns

`number`

###### Description

计算角度

##### bearing()

```ts
static bearing(from, to): number
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | `Cartesian3` |  |
| `to` | `Cartesian3` |  |

###### Returns

`number`

###### Description

计算方向

##### geodesicDistanceByCartesians()

```ts
static geodesicDistanceByCartesians(positions): number
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `positions` | `Cartesian3`[] |

###### Returns

`number`

###### Description

计算基于水准面距离

##### geodeticDistanceByCartographics()

```ts
static geodeticDistanceByCartographics(positions): number
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `positions` | `Cartographic`[] |

###### Returns

`number`

###### Description

计算基于水准面距离

##### getSunPos()

```ts
static getSunPos(currentTime): Cartesian3
```

获取太阳世界坐标位置

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `currentTime` | `JulianDate` |

###### Returns

`Cartesian3`

##### interpolate()

```ts
static interpolate(positions, interval): Cartographic[]
```

根据固定间隔计算插值点

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] | 点位 |
| `interval` | `number` | 间隔 |

###### Returns

`Cartographic`[]

Cartographic

##### spaceDistance()

```ts
static spaceDistance(positions): number
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `positions` | `Cartesian3`[] |  |

###### Returns

`number`

###### Description

计算空间距离

###### Export

##### surfaceDistance()

```ts
static surfaceDistance(
   terrainProvider, 
   pts, 
interval): Promise<SurfaceDistanceResult>
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `terrainProvider` | `TerrainProvider` | `undefined` | 地形提供 |
| `pts` | `Cartesian3`[] | `undefined` | 坐标点 |
| `interval` | `number` | `50` | 间隔 |

###### Returns

`Promise`\<[`SurfaceDistanceResult`](README.md#surfacedistanceresult)\>

##### surfaceSlope()

```ts
static surfaceSlope(
   terrainProvider, 
   pts, 
interval): Promise<SurfaceSlopeResult>
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `terrainProvider` | `TerrainProvider` | `undefined` |
| `pts` | `Cartesian3`[] | `undefined` |
| `interval` | `number` | `50` |

###### Returns

`Promise`\<[`SurfaceSlopeResult`](README.md#surfacesloperesult)\>

###### Description

计算表面线段坡度

## Interfaces

### BufferOptions

#### Description

缓冲区配置

#### Export

BufferOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="distance-2"></a> `distance?` | `number` | **Description** 缓冲区距离 |
| <a id="type-2"></a> `type?` | [`BufferType`](README.md#buffertype) | **Description** 缓冲区类型 |

***

### DrawOptions

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="clamptoground-1"></a> `clampToGround?` | `boolean` |
| <a id="showshape-1"></a> `showShape?` | `boolean` |
| <a id="type-3"></a> `type?` | [`DrawType`](README.md#drawtype) |

***

### HeightResctrictionOptions

#### Description

限高分析参数

#### Export

HeightResctrictionOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="baseheight-1"></a> `baseHeight?` | `number` | **Description** 限高基准高度,默认10 **Memberof** HeightResctrictionOptions |
| <a id="downcolor-1"></a> `downColor?` | `string` | **Description** 限高下部颜色,默认rgba(21, 170, 57, 0.7) **Memberof** HeightResctrictionOptions |
| <a id="extrudedheight-1"></a> `extrudedHeight?` | `number` | **Description** 限高上部高度,默认1000 **Memberof** HeightResctrictionOptions |
| <a id="height-2"></a> `height?` | `number` | **Description** 限高高度,默认10 **Memberof** HeightResctrictionOptions |
| <a id="upcolor-1"></a> `upColor?` | `string` | **Description** 限高上部颜色,默认rgba(239, 78, 43, 0.7) **Memberof** HeightResctrictionOptions |

***

### MeasureOptions

#### Description

测量选项

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="isspatial-1"></a> `isSpatial?` | `boolean` |
| <a id="type-4"></a> `type?` | [`MeasureType`](README.md#measuretype) |

***

### ProfileOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="interval-2"></a> `interval?` | `number` | **Description** 采样间隔 **Memberof** ProfileOptions |
| <a id="type-5"></a> `type?` | [`ProfileType`](README.md#profiletype) | **Description** 剖面类型 **Memberof** ProfileOptions |

## Type Aliases

### AspectResult

```ts
type AspectResult = {
  aspects: number[];
  directions: Cesium.Cartesian3[][];
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| <a id="aspects"></a> `aspects` | `number`[] | **Description** 坡向集合，单位：度 **Memberof** AspectResult |
| <a id="directions"></a> `directions` | `Cesium.Cartesian3`[][] | **Description** 坡向方向坐标集合 **Memberof** AspectResult |

#### Description

坡向分析结果

***

### ContourLine

```ts
type ContourLine = {
  grade: number;
  positions: Cesium.Cartesian3[][];
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| <a id="grade"></a> `grade` | `number` | **Description** 等高线等级 |
| <a id="positions-1"></a> `positions` | `Cesium.Cartesian3`[][] | **Description** 等高线多条线坐标集合 |

***

### ContourResult

```ts
type ContourResult = {
  lines: ContourLine[];
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| <a id="lines"></a> `lines` | [`ContourLine`](README.md#contourline)[] | **Description** 等高线集合 |

***

### SurfaceDistanceResult

```ts
type SurfaceDistanceResult = {
  category: String[] | number[];
  distance: number;
  positions: Cartographic[];
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| <a id="category"></a> `category` | `String`[] \| `number`[] | **Description** 采样点间距离集合 **Memberof** SurfaceDistanceResult |
| <a id="distance-3"></a> `distance` | `number` | **Description** 总距离 |
| <a id="positions-2"></a> `positions` | `Cartographic`[] | **Description** 采样点集合 **Memberof** SurfaceDistanceResult |

#### Description

表面距离测量结果

#### Export

***

### SurfaceSlopeResult

```ts
type SurfaceSlopeResult = {
  category: String[] | number[];
  distance: number;
  positions: Cartographic[];
  slopes: number[];
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| <a id="category-1"></a> `category` | `String`[] \| `number`[] | **Description** 采样点间距离集合 **Memberof** SurfaceDistanceResult |
| <a id="distance-4"></a> `distance` | `number` | **Description** 总距离 |
| <a id="positions-3"></a> `positions` | `Cartographic`[] | **Description** 采样点集合 **Memberof** SurfaceDistanceResult |
| <a id="slopes"></a> `slopes` | `number`[] | **Description** 采样点间坡度集合 **Memberof** SurfaceDistanceResult |

#### Description

表面坡度测量结果

#### Export

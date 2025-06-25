
<p align="center">
<img src="./demo/public/favicon.ico" alt="CDK" style="width:60px;margin: 0px auto" /></p>

<p align="center" style="font-weight:bolder;">CDK</p>

[English](./README.md)

基于Cesium的地理空间分析包，支持快速实现复杂的地理信息分析与可视化需求并轻松集成到现有项目中。



## 使用

通过`npm`/`pnpm`安装

```bash
npm i @giserlab/cdk
# 或者
pnpm i @giserlab/cdk
```

运行示例

```bash
# 克隆仓库
git clone https://github.com/giserlab/cdk.git
cd cdk
# 安装依赖
pnpm i -w
cd demo 
pnpm i --ignore-workspace
# 运行
pnpm run dev
```



[API文档](https://giserlab.github.io/docs/cdk/index.html)



- [x] 坡向分析

- [x] 缓冲区分析

- [x] 控高分析

- [x] 等值面分析

- [x] 等高线分析

- [x] 通视分析

- [x] 剖面线分析

- [ ] 视域分析



## 截图

部分截图

![aspect](./screenshots/aspect.png)

<p align="center">坡向分析</p>      



![isosurface](./screenshots/isosurface.png)

<p align="center">等值面 </p>    



![contour](./screenshots/contour.png)

<p align="center">等高线 </p>  



![height-restriction](./screenshots/height-restriction.png)  

<p align="center">控高检测 </p>



  

  

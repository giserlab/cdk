
<p align="center">
<img src="./demo/public/favicon.ico" alt="blblcd" style="width:60px;margin: 0px auto" /></p>

<p align="center" style="font-weight:bolder;">CDK</p>

[中文](./README_zh.md)



CDK (Cesium Development Kit)

A powerful geospatial analysis toolkit developed based on Cesium. It offers comprehensive analytical functions, enabling you to efficiently meet complex geospatial data analysis and visualization needs.



## Features

**✓** Built on the Cesium, it delivers diverse spatial analysis capabilities to meet professional GIS requirements.

**✓** Features a clean API for seamless integration into existing Cesium projects, enabling rapid functional expansion.



## Usage

Install via `npm`/`pnpm`

```bash
npm install @giserlab/cdk
# or
pnpm i @giserlab/cdk
```



Run demo 

```bash
# clone repo
git clone https://github.com/giserlab/cdk.git
cd cdk
# install dependencies
pnpm i -w
cd demo 
pnpm i --ignore-workspace
# run
pnpm run dev
```





[API Documentation](https://giserlab.github.io/docs/cdk/index.html)



- [x] Aspect

- [x] Buffer
- [x] Height restriction detect
- [x] Isosurface
- [x] Contour line
- [x] Line-of-sight
- [x] Cross-section
- [ ] Viewshed



## Screenshots

![aspect](./screenshots/aspect.png)

<p align="center">aspect </p>



![isosurface](./screenshots/isosurface.png)

<p align="center">Isosurface </p>



![contour](./screenshots/contour.png)

<p align="center">contour </p>



![height-restriction](./screenshots/height-restriction.png)  

<p align="center">height restriction </p>



  

  

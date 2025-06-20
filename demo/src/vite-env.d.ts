import { Viewer } from 'cesium';

/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * Window 的类型提示
   */
  interface Window {
    viewer: Viewer;
  }
}
declare module '*.vue' {
  import { ComponentOptions } from 'vue';
  const componentOptions: ComponentOptions;
  export default componentOptions;
}

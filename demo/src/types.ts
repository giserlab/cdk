import { Component } from 'vue';
import { Cesium3DTileStyle } from 'cesium';

export enum ModelFromType {
  URL = 0,
  ION = 1,
}
export interface ModelItem {
  name: string;
  status: boolean;
  url: string;
  from?: ModelFromType;
  offset?: string;
  style?: Cesium3DTileStyle;
  ionId?: number;
}

export interface MenuItem {
  name: string;
  icon: string;
  comp?: Component;
  width?: number | string;
  height?: number | string;
  subs?: MenuItem[];
}

import * as Cesium from 'cesium';

export const colorByPCT = (step: number) => {
  const [minPCT, maxPCT] = [0, 100];
  if (step < minPCT) {
    return Cesium.Color.WHITE;
  }
  if (step == minPCT) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - step / maxPCT), 1, 0.5, 1);
  } else if (minPCT < step && step < 25) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - step / maxPCT), 1, 0.5, 0.7);
  } else if (step == 25) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - (minPCT + step) / maxPCT), 1, 0.5, 0.7);
  } else if (25 < step && step < 50) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - step / maxPCT), 1, 0.5, 0.7);
  } else if (step == 50) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - (minPCT + step) / maxPCT), 1, 0.5, 0.7);
  } else if (50 < step && step < 75) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - (minPCT + step) / maxPCT), 1, 0.5, 0.7);
  } else if (step == 75) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - (minPCT + step) / maxPCT), 1, 0.5, 0.7);
  } else if (75 < step && step < maxPCT) {
    return Cesium.Color.fromHsl(Math.abs(2 / 3 - (minPCT + step) / maxPCT), 1, 0.5, 0.7);
  } else if (step == maxPCT) {
    return Cesium.Color.fromHsl(Math.abs(3 / 3 - maxPCT / maxPCT), 1, 0.5, 1);
  } else {
    return Cesium.Color.fromHsl(Math.abs(3 / 3 - maxPCT / maxPCT), 1, 0.5, 1);
  }
};

export function randomColor() {
  return Cesium.Color.fromRandom();
}

export function genOption(values: number[], labels: string[] | number[] | Number[] | String[]) {
  return {
    grid: {
      left: 10 + 'px',
      right: 10 + 'px',
      bottom: 10 + 'px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      show: true,
      nameLocation: 'middle',
      nameGap: 20,
      axisLabel: {
        rotate: 20,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: values,
        type: 'line',
        showSymbol: false,
        min: 0,
        max: 1.0,
      },
    ],
  };
}

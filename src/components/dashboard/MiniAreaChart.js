// components/MiniAreaChart.js
import React from "react";
import Chart from "react-apexcharts";

const MiniAreaChart = ({ seriesData, color }) => {
  const options = {
    chart: {
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: [color],
    tooltip: {
      enabled: false,
    },
  };

  const series = [{ data: seriesData }];

  return <Chart options={options} series={series} type="area" height={60} />;
};

export default MiniAreaChart;

// EarningReports.jsx
import React, { useEffect, useState } from "react";
import "./style.css";
import { Card, CardBody } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardMonthWise } from "../../redux/slice/dashboard/dashboardAsyncThunk";
import { fetchFigurine } from "../../redux/slice/figurine/figurineAsyncThunk";
import { useMediaQuery } from "react-responsive"; 

const ActivationReport = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const { dashboardMonthWise } = useSelector((state) => state.dashboards);
  const { figurineData } = useSelector((state) => state.figurines);

  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  // Fetch initial data (all figurines)
  useEffect(() => {
    dispatch(fetchDashboardMonthWise()); 
    dispatch(fetchFigurine());
  }, [dispatch]);

  const handleBarClick = (event, chartContext, config) => {
    setActiveIndex(config.dataPointIndex);
  };



  const months = Object.keys(dashboardMonthWise?.monthly || {});
  const sales = Object.values(dashboardMonthWise?.monthly || {});

  // Responsive chart height
  const chartHeight = isMobile ? 250 : isTablet ? 300 : 350;

  const series = [
    {
      name: "Activation Reports",
      data: sales,
    },
  ];

  const options = {
    chart: {
      height: chartHeight,
      type: "bar",
      events: {
        dataPointSelection: handleBarClick,
      },
      toolbar: {
        show: false, // This will hide the toolbar with download icon
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: isMobile ? "20px" : "30px", // Adjust column width for mobile
        distributed: true,
        dataLabels: {
          position: "top",
          style: {
            fontSize: isMobile ? "10px" : "12px", // Adjust font size for mobile
          },
        },
      },
    },
    colors: months.map((_, index) =>
      index === activeIndex ? "#7367f0" : "#e3e1fc"
    ),
    states: {
      normal: {
        filter: { type: "none" },
      },
      hover: {
        filter: { type: "none" },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: "none" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: isMobile ? "10px" : "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: months,
    },
    grid: {
      show: false,
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (val) {
          return val;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
      gridLines: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <Card className="dashboard-card shadow-sm">
      <CardBody id="chart">
        <div
          className={`d-flex ${
            isMobile
              ? "flex-column"
              : "align-items-start justify-content-between"
          }`}
        >
          <div>
            <h5 className="mb-1">Activation Reports</h5>
            <p className={`text-muted ${isMobile ? "small mb-3" : "mb-4"}`}>
              Yearly Activation Overview
            </p>
          </div>
          <div
            className={isMobile ? "w-100" : "ms-auto"}
            style={{
              minWidth: isMobile ? "100%" : "200px",
              maxWidth: isMobile ? "100%" : "200px",
            }}
          >
          </div>
        </div>

        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={chartHeight}
        />
      </CardBody>
      <div id="html-dist"></div>
    </Card>
  );
};

export default ActivationReport;

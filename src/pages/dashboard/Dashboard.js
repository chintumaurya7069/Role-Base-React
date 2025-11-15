// import React from "react";
// import MiniAreaChart from "../../components/dashboard/MiniAreaChart";
// import Chart from "react-apexcharts";
// import { IconChartBarPopular, IconCurrencyDollar } from "@tabler/icons-react";
// import EarningReports from "../../components/dashboard/EarningReports";
// import SalesByCountries from "../../components/dashboard/SalesByCountries";
// import LastTransaction from "../../components/dashboard/LastTransaction";

// const DashboardStats = () => {
//   const chartOptions = {
//     chart: {
//       type: "bar",
//       stacked: true,
//       toolbar: { show: false },
//       sparkline: { enabled: true },
//       width: 20,
//       height: 78,
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 3,
//         borderRadiusApplication: "around",
//         horizontal: false,
//         columnWidth: "28%",
//         endingShape: "rounded",
//         barSpacing: 50,
//       },
//     },
//     colors: ["#7367F0", "#28C76F"],
//     dataLabels: { enabled: false },
//     stroke: {
//       show: true,
//       width: 1,
//       colors: ["#fff"],
//     },
//     xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
//     yaxis: { show: false },
//     fill: {
//       opacity: 0.85,
//     },
//     tooltip: { enabled: false },
//     grid: { show: false },
//     legend: { show: false },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           chart: { height: 100 },
//         },
//       },
//     ],
//   };

//   const chartSeries = [
//     {
//       name: "Product A",
//       data: [10, 8, 22, 10, 8],
//     },
//     {
//       name: "Product B",
//       data: [-9, -12, -10, -8, -9],
//     },
//   ];

//   return (
//     <>
//       {/* <div className="d-flex flex-wrap"> */}
//       <div className="row">
//         <div className="col-xxl-8">
//           {/* Sales Last Year */}
//           <div className="row">
//             <div className="col-xl-3 col-md-4 col-6 mb-4">
//               <div className="card">
//                 <div className="card-header pb-0">
//                   <h5 className="card-title mb-0">Sales</h5>
//                   <small className="text-muted">Last Year</small>
//                 </div>
//                 <div className="px-3 pt-2" style={{ minHeight: "78px" }}>
//                   <MiniAreaChart
//                     seriesData={[60, 30, 20, 120, 35, 50]}
//                     color="#2BC871"
//                   />
//                 </div>
//                 <div className="card-body pt-0">
//                   <div className="d-flex justify-content-between align-items-center mt-3 gap-3">
//                     <h4 className="mb-0">175k</h4>
//                     <small className="text-danger">-16.2%</small>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Sessions Last Month */}
//             <div className="col-xl-3 col-md-4 col-6 mb-4">
//               <div className="card">
//                 <div className="card-header pb-0">
//                   <h5 className="card-title mb-0">Sessions</h5>
//                   <small className="text-muted">Last Month</small>
//                 </div>
//                 <div className="card-body" style={{ minHeight: "78px" }}>
//                   <Chart
//                     options={chartOptions}
//                     series={chartSeries}
//                     type="bar"
//                     height={78}
//                   />
//                   <div className="d-flex justify-content-between align-items-center mt-3 gap-3">
//                     <h4 className="mb-0">45.1k</h4>
//                     <small className="text-success">+12.6%</small>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Total Profit */}
//             <div className="col-xl-3 col-md-4 col-6 mb-4">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="badge p-2 bg-label-danger mb-2 rounded">
//                     <IconCurrencyDollar stroke={2} />
//                   </div>
//                   <h5 className="card-title mb-1 pt-2">Total Profit</h5>
//                   <small className="text-muted">Last week</small>
//                   <p className="mb-2 mt-1">1.28k</p>
//                   <div className="pt-1">
//                     <span className="badge bg-label-danger">-12.2%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Total Sales */}
//             <div className="col-xl-3 col-md-4 col-6 mb-4">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="badge p-2 bg-label-info mb-2 rounded">
//                     <IconChartBarPopular stroke={2} />
//                   </div>
//                   <h5 className="card-title mb-1 pt-2">Total Sales</h5>
//                   <small className="text-muted">Last week</small>
//                   <p className="mb-2 mt-1">$4,673</p>
//                   <div className="pt-1">
//                     <span className="badge bg-label-info">+25.2%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <EarningReports />
//         </div>
//         <SalesByCountries />
//       </div>

//       <LastTransaction />

//       {/* </div> */}
//     </>
//   );
// };

// export default DashboardStats;

import "./style.css";
import { Card, Row, Col, CardHeader } from "react-bootstrap";
import TopCustomers from "../../components/dashboard/TopCustomers";
import ActivationReport from "../../components/dashboard/ActivationReports";
import SalesByStates from "../../components/dashboard/SalesByStates";
import { IconChartBarPopular, IconCurrencyDollar } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearError } from "../../redux/slice/dashboard/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardMonthWise, error } = useSelector(
    (state) => state.dashboards
  );
  useEffect(() => {
    if (
      error === "Invalid token" ||
      error === "Access denied. No token provided"
    ) {
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        dispatch(clearError());
        navigate("/login");
      }, 1000);
    }
  }, [error]);

  // Safely extract dynamic data or use fallback values
  const activeUINThisWeek = dashboardMonthWise?.summary?.activeUINThisWeek ?? 0;
  const activeUINLastWeek = dashboardMonthWise?.summary?.activeUINLastWeek ?? 0;
  const activeUINThisMonth =
    dashboardMonthWise?.summary?.activeUINThisMonth ?? 0;
  const activeUINLastMonth =
    dashboardMonthWise?.summary?.activeUINLastMonth ?? 0;
  const stats = [
    {
      title: "Fig Activated",
      subtitle: "This Week",
      symbolColor: "bg-label-danger",
      value: activeUINThisWeek,
      symbolColor: "bg-label-danger",
      icon: <IconCurrencyDollar stroke={2} />,
    },
    {
      title: "Fig Activated",
      subtitle: "Last Week",
      symbolColor: "bg-label-info",
      value: activeUINLastWeek,
      symbolColor: "bg-label-info",
      icon: <IconChartBarPopular stroke={2} />,
    },
    {
      title: "Fig Activated",
      subtitle: "This Month",
      symbolColor: "bg-label-danger",
      value: activeUINThisMonth,
      symbolColor: "bg-label-danger",
      icon: <IconCurrencyDollar stroke={2} />,
    },
    {
      title: "Fig Activated",
      subtitle: "Last Month",
      symbolColor: "bg-label-info",
      value: activeUINLastMonth,
      symbolColor: "bg-label-info",
      icon: <IconChartBarPopular stroke={2} />,
    },
  ];

  return (
    <div className="container-fluid dashboard p-0 mt-5 mt-lg-0">
      <Row>
        {/* Left side (Stat cards + bar chart) */}
        <Col xxl={8} className="h-100">
          <Row className="mb-2 align-items-stretch">
            {stats.map((item, i) => (
              <Col md={3} xs={6} key={i}>
                <Card className="dashboard-card shadow-sm mb-3">
                  <CardHeader className="card-header pb-0">
                    <div
                      className={`badge ${item.symbolColor} p-2 mb-3 rounded`}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        fontSize: "1.125rem",
                        marginBottom: 1,
                        fontWeight: "600",
                      }}
                    >
                      {item.title}
                    </div>
                    <div className="small text-muted">{item.subtitle}</div>
                  </CardHeader>
                  <Card.Body>
                    <div
                      className="stat-value my-2 "
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      {item.value}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <ActivationReport />
        </Col>

        {/* Right side (Sales by Countries) */}
        <Col xxl={4}>
          <SalesByStates />
        </Col>
      </Row>
      {/* <TopCustomers /> */}
    </div>
  );
};
export default Dashboard;

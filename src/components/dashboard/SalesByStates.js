// import { IconDotsVertical } from "@tabler/icons-react";
// import React from "react";

// const SalesByCountries = () => {
//   return (
//     <div className="col-xxl-4 col-md-4">
//       <div className="card h-100">
//         <div className="card-header d-flex justify-content-between">
//           <div className="card-title mb-0">
//             <h5 className="mb-1">Sales by Countries</h5>
//             <p className="card-subtitle">Monthly Sales Overview</p>
//           </div>
//           <div className="dropdown">
//             <button
//               className="btn btn-text-secondary btn-icon rounded-pill text-body-secondary border-0 me-n1 waves-effect"
//               type="button"
//               id="salesByCountry"
//               data-bs-toggle="dropdown"
//               aria-haspopup="true"
//               aria-expanded="false"
//             >
//               <IconDotsVertical stroke={2} />
//             </button>
//             <div
//               className="dropdown-menu dropdown-menu-end"
//               aria-labelledby="salesByCountry"
//               style={{}}
//             >
//               <a
//                 className="dropdown-item waves-effect"
//                 href="javascript:void(0);"
//               >
//                 Download
//               </a>
//               <a
//                 className="dropdown-item waves-effect"
//                 href="javascript:void(0);"
//               >
//                 Refresh
//               </a>
//               <a
//                 className="dropdown-item waves-effect"
//                 href="javascript:void(0);"
//               >
//                 Share
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="card-body">
//           <ul className="p-0 m-0">
//             <li className="d-flex align-items-center mb-4">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-us rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$8,567k</h6>
//                   </div>
//                   <small className="text-body">United states</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-up" />
//                     25.8%
//                   </p>
//                 </div>
//               </div>
//             </li>
//             <li className="d-flex align-items-center mb-4">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-br rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$2,415k</h6>
//                   </div>
//                   <small className="text-body">Brazil</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-danger fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-down" />
//                     6.2%
//                   </p>
//                 </div>
//               </div>
//             </li>
//             <li className="d-flex align-items-center mb-4">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-in rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$865k</h6>
//                   </div>
//                   <small className="text-body">India</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-up" />
//                     12.4%
//                   </p>
//                 </div>
//               </div>
//             </li>
//             <li className="d-flex align-items-center mb-4">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-au rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$745k</h6>
//                   </div>
//                   <small className="text-body">Australia</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-danger fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-down" />
//                     11.9%
//                   </p>
//                 </div>
//               </div>
//             </li>
//             <li className="d-flex align-items-center mb-4">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-fr rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$45</h6>
//                   </div>
//                   <small className="text-body">France</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-up" />
//                     16.2%
//                   </p>
//                 </div>
//               </div>
//             </li>
//             <li className="d-flex align-items-center">
//               <div className="avatar flex-shrink-0 me-4">
//                 <i className="fis fi fi-cn rounded-circle fs-2" />
//               </div>
//               <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
//                 <div className="me-2">
//                   <div className="d-flex align-items-center">
//                     <h6 className="mb-0 me-1">$12k</h6>
//                   </div>
//                   <small className="text-body">China</small>
//                 </div>
//                 <div className="user-progress">
//                   <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
//                     <i className="icon-base ti ti-chevron-up" />
//                     14.8%
//                   </p>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesByCountries;

import "./style.css";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDashboardMonthWise } from "../../redux/slice/dashboard/dashboardAsyncThunk";
import "./style.css";
import Pagination from "../table/pagination/Pagination";
import { Field, Form, Formik } from "formik";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";

const SalesByCountries = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null);
  const itemsPerPage = 12; // Fixed to 10 items per page
  const { figurineData } = useSelector((state) => state.figurines);
  const { dashboardMonthWise } = useSelector((state) => state.dashboards);

  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const salesByState = dashboardMonthWise?.summary?.activeUINByLocation || [];
  const filteredData = salesByState; // Assuming no additional filtering needed

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Only show pagination if there are more than 10 items
  const showPagination = filteredData.length > itemsPerPage;
  const handleFigurineChange = (figId) => {
    dispatch(fetchDashboardMonthWise(figId));
    setActiveIndex(null);
  };

  const options = figurineData?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #7367f0" : "1px solid #ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.1rem rgba(184, 179, 240, 0.25)"
        : "none",
      "&:hover": {
        border: "1px solid #7367f0",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#7367f0" : "white",
      color: state.isFocused ? "white" : "black",
    }),
  };
  return (
    <Card
      className="dashboard-card shadow-sm h-100 sales-by-states-card"
      style={{ overflow: "hidden" }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="mb-1">Sales by States</h5>
            <p className="text-muted mb-4">
              Activated for current Year by States
            </p>
          </div>
          <div>
            <Formik initialValues={{ figurineId: "" }} onSubmit={() => {}}>
              {({ values, setFieldValue }) => (
                <Form>
                  <Select
                    options={options}
                    value={options.find(
                      (opt) => opt.value === values.figurineId
                    )}
                    onChange={(selectedOption) => {
                      const selectedId = selectedOption?.value || "";
                      setFieldValue("figurineId", selectedId);
                      handleFigurineChange(selectedId);
                    }}
                    styles={customStyles}
                    isClearable
                    placeholder="Select Figurine"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {currentItems?.map((state, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <small style={{ fontSize: "1rem" }}>{state.location}</small>
              </div>
              <div className="text-end">
                <small style={{ fontSize: "1rem" }}>{state.count}</small>
              </div>
            </div>
          </div>
        ))}
      </Card.Body>

      {/* Show pagination only when needed (from 2nd page) */}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
        />
      )}
    </Card>
  );
};

export default SalesByCountries;

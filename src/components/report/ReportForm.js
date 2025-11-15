// import React, { useEffect } from "react";
// import { Formik, Field, ErrorMessage } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { MultiSelect } from "primereact/multiselect";
// import { Calendar } from "primereact/calendar";
// import * as Yup from "yup";
// import { addDays } from "date-fns";
// import { format } from "date-fns";
// import {
//   fetchLocation,
//   insertReport,
//   FilterReportDetails,
// } from "../../redux/slice/report/reportAsyncThunk";

// import { fetchFigurineDropDowns } from "../../redux/slice/figurine/figurineAsyncThunk";
// import { fetchVendorDropDowns } from "../../redux/slice/vendor/vendorAsyncThunk";
// import NestedTable from "../table/NestedTable";
// import DataTable from "../table/DataTable";
// import { clearError } from "../../redux/slice/report/reportSlice";
// import { fetchGenreData } from "../../redux/slice/genre/genreAsyncThunk";
// import { clearFilterData } from "../../redux/slice/report/reportSlice";

// const ReportForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { figurineData, loading, error } = useSelector(
//     (state) => state.figurines
//   );

//   const { filterData } = useSelector((state) => state.reports);
//   let genre = [];
//   if (Array.isArray(filterData?.genres)) {
//     genre = filterData.genres.map((item) => item.name);
//   }

//   const [submittedDates, setSubmittedDates] = React.useState({
//     start: null,
//     end: null,
//   });

//   const { reportData } = useSelector((state) => state.reports);

//   useEffect(() => {
//     // dispatch(fetchLocation());
//     // dispatch(fetchGenreData());
//     // dispatch(fetchFigurineDropDowns());
//     // dispatch(fetchVendorDropDowns());
//     dispatch(
//       FilterReportDetails({
//         figIds: [],
//         genres: [],
//         location: [],
//       })
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Auth error check:", error); // debug this
//     if (
//       error === "Invalid token" ||
//       error === "Access denied. No token provided"
//     ) {
//       setTimeout(() => {
//         localStorage.removeItem("auth_token");
//         dispatch(clearError());
//         navigate("/login");
//       }, 1000);
//     }
//   }, [error]);

//   let transformedLocations = [];
//   if (Array.isArray(filterData?.locations)) {
//     transformedLocations = filterData.locations.map((loc) => ({
//       label: loc,
//       value: loc,
//     }));
//   }

//   const handleSubmit = (values, { resetForm, setSubmitting }) => {
//     const formattedStart = format(new Date(values.start_date), "dd/MM/yyyy");
//     const formattedEnd = format(new Date(values.end_date), "dd/MM/yyyy");

//     setSubmittedDates({
//       start: formattedStart,
//       end: formattedEnd,
//     });

//     const payload = {
//       ...values,
//       start_date: format(new Date(values.start_date), "yyyy-MM-dd"),
//       end_date: format(new Date(values.end_date), "yyyy-MM-dd"),
//     };

//     dispatch(insertReport(payload));
//     setSubmitting(false);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     try {
//       const date = new Date(dateString);

//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();

//       let hours = date.getHours();
//       const ampm = hours >= 12 ? "PM" : "AM";
//       hours = hours % 12;
//       hours = hours ? hours : 12;
//       const minutes = String(date.getMinutes()).padStart(2, "0");
//       //   const seconds = String(date.getSeconds()).padStart(2, "0");

//       return `${day}/${month}/${year} ${hours}:${minutes}:${ampm}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "-";
//     }
//   };
//   const columns = [
//     {
//       field: "#",
//       header: "#",
//       searchable: true,
//     },
//     {
//       field: "firstName",
//       header: "First Name",
//       searchable: true,
//       className: "text-nowrap",
//     },
//     {
//       field: "lastName",
//       header: "Last Name",
//       searchable: true,
//     },
//     {
//       field: "location",
//       header: "Location",
//       searchable: true,
//     },
//     {
//       field: "phoneNo",
//       header: "Phone Number",
//       searchable: true,
//     },
//     {
//       field: "email",
//       header: "Email",
//       searchable: true,
//     },
//     {
//       field: "createdOn",
//       header: "Created Date & Time",
//       searchable: true,
//       body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
//     },
//   ];

//   const collapseColumns = [
//     { field: "#", header: "#", width: 10, isIndex: true },
//     { field: "UIN", header: "UIN", searchable: true },
//     { field: "currentStatus", header: "Status", is: true },
//   ];

//   const arrayOfObjects = Array.isArray(reportData)
//     ? reportData.map((item, index) => ({
//         "#": index + 1,
//         ...item,
//         uinDetails: item.uinDetails || [],
//       }))
//     : [];

//   const dynamicTitle =
//     submittedDates.start && submittedDates.end
//       ? `Report (${submittedDates.start} to ${submittedDates.end})`
//       : "Report";

//   return (
//     <>
//       <div className="card mt-5 mt-lg-0 mb-lg-4">
//         <h5 className="card-header">Report</h5>
//         <Formik
//           initialValues={{
//             start_date: "",
//             end_date: "",
//             figIds: [],
//             genre: [],
//             purchaseCount: "",
//             location: [],
//           }}
//           validationSchema={Yup.object().shape({
//             start_date: Yup.date().required("Start date is required"),
//             end_date: Yup.date()
//               .required("End date is required")
//               .test(
//                 "is-after-start",
//                 "End date must be at least 1 day after Start date",
//                 function (value) {
//                   const { start_date } = this.parent;
//                   return (
//                     start_date &&
//                     value &&
//                     new Date(value) >= addDays(new Date(start_date), 1)
//                   );
//                 }
//               ),
//           })}
//           onSubmit={handleSubmit}
//         >
//           {({ values, handleSubmit, setFieldValue, resetForm }) => (
//             <form className="card-body" onSubmit={handleSubmit}>
//               <div className="row g-3">
//                 {/* Start Date */}
//                 <div className="col-md-4">
//                   <label className="form-label" htmlFor="start_date">
//                     Start Date
//                   </label>
//                   <Calendar
//                     id="start_date"
//                     name="start_date"
//                     value={
//                       values.start_date ? new Date(values.start_date) : null
//                     }
//                     onChange={(e) => {
//                       const newStart = e.value;
//                       setFieldValue("start_date", newStart);

//                       // Clear end_date if it's no longer valid
//                       if (
//                         values.end_date &&
//                         new Date(values.end_date) <
//                           addDays(new Date(newStart), 1)
//                       ) {
//                         setFieldValue("end_date", "");
//                       }
//                     }}
//                     readOnlyInput
//                     placeholder="Select Start Date"
//                     className="w-100"
//                     dateFormat="dd-mm-yy"
//                   />
//                   <ErrorMessage
//                     name="start_date"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>

//                 {/* End Date */}
//                 <div className="col-md-4">
//                   <label className="form-label" htmlFor="end_date">
//                     End Date
//                   </label>
//                   <Calendar
//                     id="end_date"
//                     name="end_date"
//                     value={values.end_date ? new Date(values.end_date) : null}
//                     onChange={(e) => setFieldValue("end_date", e.value)}
//                     readOnlyInput
//                     placeholder="Select End Date"
//                     className="w-100"
//                     dateFormat="dd-mm-yy"
//                     minDate={
//                       values.start_date
//                         ? addDays(new Date(values.start_date), 1)
//                         : null
//                     }
//                   />
//                   <ErrorMessage
//                     name="end_date"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>

//                 {/* FIG Dropdown */}
//                 <div className="col-md-4">
//                   <label className="form-label" htmlFor="figIds">
//                     Select FIG
//                   </label>
//                   <div className="w-100 flex justify-content-center">
//                     <MultiSelect
//                       id="figIds"
//                       name="figIds"
//                       value={values.figIds}
//                       onChange={(e) => {
//                         const selectedFigId = e.value;
//                         setFieldValue("figIds", selectedFigId);
//                         setFieldValue("subGenre", "");

//                         if (selectedFigId.length) {
//                           dispatch(
//                             FilterReportDetails({
//                               figIds: selectedFigId,
//                               genre: values.genre || [],
//                             })
//                           );
//                         } else {
//                           dispatch(clearFilterData());
//                         }
//                       }}
//                       options={figurineData}
//                       display="chip"
//                       placeholder="Select FIG"
//                       className="w-100"
//                     />
//                   </div>
//                   <ErrorMessage
//                     name="figIds"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>

//                 {/* Length of Character Input */}
//                 <div className="col-md-4">
//                   <label htmlFor="genre" className="form-label">
//                     Select Genre
//                   </label>
//                   <div className="w-100 flex justify-content-center">
//                     <MultiSelect
//                       value={values.genre}
//                       onChange={(e) => {
//                         const selectedGenres = e.value;
//                         setFieldValue("genre", selectedGenres);

//                         if (selectedGenres.length) {
//                           dispatch(
//                             FilterReportDetails({
//                               figIds: values.figIds || [],
//                               genre: selectedGenres,
//                             })
//                           );
//                         } else {
//                           dispatch(clearFilterData());
//                         }
//                       }}
//                       options={genre}
//                       id="genre"
//                       name="genre"
//                       display="chip"
//                       placeholder="Select Genre"
//                       maxSelectedLabels={5}
//                       className="w-100"
//                     />
//                   </div>
//                   <ErrorMessage
//                     name="genre"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>

//                 {/* Count Input */}
//                 <div className="col-md-4">
//                   <label htmlFor="purchaseCount" className="form-label">
//                     No of Purchase
//                   </label>
//                   <Field
//                     type="number"
//                     className="form-control"
//                     id="purchaseCount"
//                     name="purchaseCount"
//                     placeholder="Enter count"
//                   />
//                   <ErrorMessage
//                     name="purchaseCount"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div className="col-md-4">
//                   <label htmlFor="location" className="form-label">
//                     Location
//                   </label>
//                   <div className="w-100 flex justify-content-center">
//                     <MultiSelect
//                       value={values.location}
//                       onChange={(e) => setFieldValue("location", e.value)}
//                       options={transformedLocations}
//                       optionLabel="label"
//                       display="chip"
//                       placeholder="Select Location"
//                       maxSelectedLabels={5}
//                       className="w-100"
//                     />
//                   </div>
//                   <ErrorMessage
//                     name="location"
//                     component="div"
//                     className="text-danger small"
//                   />
//                 </div>
//               </div>

//               <div className="pt-4 d-flex justify-content-end">
//                 <button
//                   type="submit"
//                   className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
//                   disabled={loading}
//                 >
//                   Submit
//                   {loading ? <Spinner className="ms-1" /> : ""}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-label-secondary waves-effect"
//                   onClick={() => {
//                     resetForm();
//                   }}
//                 >
//                   Reset
//                 </button>
//               </div>
//             </form>
//           )}
//         </Formik>
//       </div>

//       {arrayOfObjects.every((item) => item.uinDetails.length === 0) ? (
//         <DataTable
//           title={dynamicTitle}
//           columns={columns}
//           data={arrayOfObjects}
//           topHide={false}
//           searchable={false}
//           actions={false}
//           addButton={true}
//           exportButton={true}
//           currentModule="Report"
//         />
//       ) : (
//         <NestedTable
//           title={dynamicTitle}
//           columns={columns}
//           collapseColumns={collapseColumns}
//           collapseKey="uinDetails"
//           data={arrayOfObjects}
//           topHide={false}
//           searchable={false}
//           actions={false}
//           addButton={true}
//           exportButton={true}
//           currentModule="Report"
//         />
//       )}
//     </>
//   );
// };

// export default ReportForm;

import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import * as Yup from "yup";
import { addDays } from "date-fns";
import { format } from "date-fns";
import {
  fetchLocation,
  insertReport,
  FilterReportDetails,
} from "../../redux/slice/report/reportAsyncThunk";
import { fetchFigurineDropDowns } from "../../redux/slice/figurine/figurineAsyncThunk";
import { fetchVendorDropDowns } from "../../redux/slice/vendor/vendorAsyncThunk";
import NestedTable from "../table/NestedTable";
import DataTable from "../table/DataTable";
import { clearError } from "../../redux/slice/report/reportSlice";
import { fetchGenreData } from "../../redux/slice/genre/genreAsyncThunk";
import { clearFilterData } from "../../redux/slice/report/reportSlice";
import { Country, State, City } from "country-state-city";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { months } from "./const";

const ReportForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { figurineData, loading, error } = useSelector(
    (state) => state.figurines
  );

  const { filterData } = useSelector((state) => state.reports);
  let genre = [];
  if (Array.isArray(filterData?.genres)) {
    genre = filterData.genres.map((item) => item.name);
  }

  const [submittedDates, setSubmittedDates] = React.useState({
    start: null,
    end: null,
  });
  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];
  const { reportData } = useSelector((state) => state.reports);

  useEffect(() => {
    // dispatch(fetchLocation());
    // dispatch(fetchGenreData());
    dispatch(fetchFigurineDropDowns());
    // dispatch(fetchVendorDropDowns());
    dispatch(
      FilterReportDetails({
        figIds: [],
        genres: [],
        // location: [],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log("Auth error check:", error); // debug this
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

  let transformedLocations = [];
  if (Array.isArray(filterData?.locations)) {
    transformedLocations = filterData.locations.map((loc) => ({
      label: loc,
      value: loc,
    }));
  }

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const formattedStart = format(new Date(values.start_date), "dd/MM/yyyy");
    const formattedEnd = format(new Date(values.end_date), "dd/MM/yyyy");

    setSubmittedDates({
      start: formattedStart,
      end: formattedEnd,
    });

    // const payload = {
    //   ...values,
    //   start_date: format(new Date(values.start_date), "yyyy-MM-dd"),
    //   end_date: format(new Date(values.end_date), "yyyy-MM-dd"),
    // };

    // Get full names for country and state
    const countryObj = Country.getCountryByCode(values.country);
    const stateObj = State.getStateByCodeAndCountry(
      values.state,
      values.country
    );

    const submissionData = {
      ...values,
      start_date: format(new Date(values.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(values.end_date), "yyyy-MM-dd"),
      country: countryObj?.name || values.country,
      state: stateObj?.name || values.state,
      // city is already using the name
    };

    dispatch(insertReport(submissionData));
    setSubmitting(false);
  };

  const formatDateAndTime = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      //   const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${ampm}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year} `;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };
  const columns = [
    {
      field: "#",
      header: "#",
      searchable: true,
    },
    {
      field: "firstName",
      header: "First Name",
      searchable: true,
      className: "text-nowrap",
    },
    {
      field: "lastName",
      header: "Last Name",
      searchable: true,
    },
    {
      field: "country",
      header: "Country",
      searchable: true,
    },
    {
      field: "state",
      header: "State",
      searchable: true,
    },
    {
      field: "city",
      header: "City",
      searchable: true,
    },
    {
      field: "DOB",
      header: "Date Of Birth",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.DOB)}</span>,
    },
    {
      field: "phoneNo",
      header: "Phone Number",
      searchable: true,
    },
    {
      field: "email",
      header: "Email",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Created Date & Time",
      searchable: true,
      body: (rowData) => <span>{formatDateAndTime(rowData.createdOn)}</span>,
    },
  ];

  const collapseColumns = [
    { field: "#", header: "#", width: 10, isIndex: true },
    { field: "UIN", header: "UIN", searchable: true },
    { field: "currentStatus", header: "Status", is: true },
  ];

  const arrayOfObjects = Array.isArray(reportData)
    ? reportData.map((item, index) => ({
        "#": index + 1,
        ...item,
        uinDetails: item.uinDetails || [],
      }))
    : [];

  const dynamicTitle =
    submittedDates.start && submittedDates.end
      ? `Customer Insights (${submittedDates.start} to ${submittedDates.end})`
      : "Customer Insights";

  return (
    <>
      <div className="card mt-5 mt-lg-0 mb-lg-4">
        <h5 className="card-header">Customer Insights</h5>
        <Formik
          initialValues={{
            start_date: "",
            end_date: "",
            figIds: [],
            genre: [],
            purchaseCount: "",
            // location: [],
            birth: "",
            country: "",
            state: "",
            city: "",
          }}
          validationSchema={Yup.object().shape({
            start_date: Yup.date().required("Start date is required"),
            end_date: Yup.date()
              .required("End date is required")
              .test(
                "is-after-start",
                "End date must be at least 1 day after Start date",
                function (value) {
                  const { start_date } = this.parent;
                  return (
                    start_date &&
                    value &&
                    new Date(value) >= addDays(new Date(start_date), 1)
                  );
                }
              ),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, handleSubmit, setFieldValue, resetForm }) => (
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Start Date */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="start_date">
                    Start Date
                  </label>
                  <Calendar
                    id="start_date"
                    name="start_date"
                    value={
                      values.start_date ? new Date(values.start_date) : null
                    }
                    onChange={(e) => {
                      const newStart = e.value;
                      setFieldValue("start_date", newStart);

                      // Clear end_date if it's no longer valid
                      if (
                        values.end_date &&
                        new Date(values.end_date) <
                          addDays(new Date(newStart), 1)
                      ) {
                        setFieldValue("end_date", "");
                      }
                    }}
                    readOnlyInput
                    placeholder="Select Start Date"
                    className="w-100"
                    dateFormat="dd-mm-yy"
                  />
                  <ErrorMessage
                    name="start_date"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* End Date */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="end_date">
                    End Date
                  </label>
                  <Calendar
                    id="end_date"
                    name="end_date"
                    value={values.end_date ? new Date(values.end_date) : null}
                    onChange={(e) => setFieldValue("end_date", e.value)}
                    readOnlyInput
                    placeholder="Select End Date"
                    className="w-100"
                    dateFormat="dd-mm-yy"
                    minDate={
                      values.start_date
                        ? addDays(new Date(values.start_date), 1)
                        : null
                    }
                  />
                  <ErrorMessage
                    name="end_date"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* FIG Dropdown */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="figIds">
                    Select FIG
                  </label>
                  <div className="w-100 flex justify-content-center">
                    <MultiSelect
                      id="figIds"
                      name="figIds"
                      value={values.figIds}
                      onChange={(e) => {
                        const selectedFigId = e.value;
                        setFieldValue("figIds", selectedFigId);
                        // setFieldValue("subGenre", "");

                        if (selectedFigId.length) {
                          dispatch(
                            FilterReportDetails({
                              figIds: selectedFigId,
                              genre: values.genre || [],
                            })
                          );
                        } else {
                          dispatch(clearFilterData());
                        }
                      }}
                      options={figurineData}
                      display="chip"
                      placeholder="Select FIG"
                      className="w-100"
                    />
                  </div>
                  <ErrorMessage
                    name="figIds"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Length of Character Input */}
                <div className="col-md-4">
                  <label htmlFor="genre" className="form-label">
                    Select Genre
                  </label>
                  <div className="w-100 flex justify-content-center">
                    <MultiSelect
                      value={values.genre}
                      onChange={(e) => {
                        const selectedGenres = e.value;
                        setFieldValue("genre", selectedGenres);

                        if (selectedGenres.length) {
                          dispatch(
                            FilterReportDetails({
                              figIds: values.figIds || [],
                              genre: selectedGenres,
                            })
                          );
                        } else {
                          dispatch(clearFilterData());
                        }
                      }}
                      options={genre}
                      id="genre"
                      name="genre"
                      display="chip"
                      placeholder="Select Genre"
                      maxSelectedLabels={5}
                      className="w-100"
                    />
                  </div>
                  <ErrorMessage
                    name="genre"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Count Input */}
                <div className="col-md-4">
                  <label htmlFor="purchaseCount" className="form-label">
                    No of Purchase
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    id="purchaseCount"
                    name="purchaseCount"
                    placeholder="Enter count"
                  />
                  <ErrorMessage
                    name="purchaseCount"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">Birth</label>
                  <PrimeDropdown
                    name="birth"
                    value={values.birth}
                    options={months}
                    optionLabel="label"
                    onChange={(e) => setFieldValue("birth", e.value)}
                    placeholder="Select Birth Month"
                    className="w-100"
                  />
                  <ErrorMessage
                    name="birth"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <div className="row my-3">
                {/* Country */}
                <div className="col-4">
                  <label className="form-label" htmlFor="country">
                    Country
                  </label>
                  <PrimeDropdown
                    id="country"
                    name="country"
                    value={values.country}
                    onChange={(e) => {
                      setFieldValue("country", e.value);
                      setSelectedCountry(e.value);
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                      setSelectedState("");
                      setSelectedCity("");
                    }}
                    options={countries.map((country) => ({
                      label: country.name,
                      value: country.isoCode,
                    }))}
                    placeholder="Select Country"
                    className="w-100"
                  />
                </div>

                {/* State */}
                <div className="col-4">
                  <label className="form-label" htmlFor="state">
                    State
                  </label>
                  <PrimeDropdown
                    id="state"
                    name="state"
                    value={values.state}
                    onChange={(e) => {
                      setFieldValue("state", e.value);
                      setSelectedState(e.value);
                      setFieldValue("city", ""); // Reset city when state changes
                      setSelectedCity("");
                    }}
                    options={states.map((state) => ({
                      label: state.name,
                      value: state.isoCode,
                    }))}
                    placeholder="Select State"
                    disabled={!selectedCountry}
                    className="w-100"
                    panelClassName="customer-dropdown-custom"
                  />
                </div>

                {/* City */}
                <div className="col-4">
                  <label className="form-label" htmlFor="city">
                    City
                  </label>
                  <PrimeDropdown
                    id="city"
                    name="city"
                    value={values.city}
                    onChange={(e) => {
                      setFieldValue("city", e.value);
                      setSelectedCity(e.value);
                    }}
                    options={cities.map((city) => ({
                      label: city.name,
                      value: city.name,
                    }))}
                    placeholder="Select City"
                    disabled={!selectedState}
                    className="w-100"
                    panelClassName="customer-dropdown-custom"
                  />
                </div>
              </div>

              <div className="pt-4 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-sm-3 me-1 waves-effect waves-light"
                  disabled={loading}
                >
                  Submit
                  {loading ? <Spinner className="ms-1" /> : ""}
                </button>
                <button
                  type="button"
                  className="btn btn-label-secondary waves-effect"
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>

      {arrayOfObjects.every((item) => item.uinDetails.length === 0) ? (
        <DataTable
          title={dynamicTitle}
          columns={columns}
          data={arrayOfObjects}
          topHide={false}
          searchable={false}
          actions={false}
          addButton={true}
          exportButton={true}
          currentModule="Customer Insights"
        />
      ) : (
        <NestedTable
          title={dynamicTitle}
          columns={columns}
          collapseColumns={collapseColumns}
          collapseKey="uinDetails"
          data={arrayOfObjects}
          topHide={false}
          searchable={false}
          actions={false}
          addButton={true}
          exportButton={true}
          currentModule="Customer Insights"
        />
      )}
    </>
  );
};

export default ReportForm;

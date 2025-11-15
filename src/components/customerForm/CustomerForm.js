import { Modal, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as Yup from "yup";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchFigurineDropDowns } from "../../redux/slice/figurine/figurineAsyncThunk";
import {
  editCustomer,
  fetchByIdCustomer,
  insertCustomer,
} from "../../redux/slice/customer/customerAsyncThunk";
import { fetchUinGenerationDetails } from "../../redux/slice/uinGeneration/uinGenerationAsyncThunk";
import { isFormEmpty } from "../../redux/slice/customer/customerSlice";
import { Calendar } from "primereact/calendar";
import { Country, State, City } from "country-state-city";
import "./customerForm.css";

const getValidationSchema = () =>
  Yup.object({
    // figId: Yup.string().required("FIG is required"),
    // uinDetailId: Yup.string().required("UinId is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .length(10, "Must be 10 digits")
      .required("Phone number is required"),
    location: Yup.string(),
  });

const CustomerForm = ({
  show,
  handleClose,
  data,
  loading,
  selectedFullRecord,
  isNestedEdit = false,
}) => {
  const { figurineData } = useSelector((state) => state.figurines);
  const { uinGenerationDetails } = useSelector((state) => state.uinGeneration);
  const { singleCustomerData } = useSelector((state) => state.customers);
  const [selectedFigId, setSelectedFigId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const dispatch = useDispatch();
  const id = selectedFullRecord?._id || "";
  // Get all countries, states, and cities
  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];
  useEffect(() => {
    if (id && !isNestedEdit) {
      // Only fetch if it's a main table edit
      dispatch(fetchByIdCustomer(id));
    }
  }, [id, dispatch, isNestedEdit]);
  const initialValues = {
    figId: isNestedEdit ? "" : undefined,
    uinDetailId: isNestedEdit ? "" : undefined,
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    location: "",
    DOB: null,
    country: "",
    state: "",
    city: "",
  };

  // Effect to set initial country/state/city values when singleCustomerData loads
  useEffect(() => {
    if (singleCustomerData?.country) {
      // Find country by name and set its ISO code
      const countryObj = countries.find(
        (c) => c.name === singleCustomerData.country
      );
      if (countryObj) {
        setSelectedCountry(countryObj.isoCode);

        // Find state by name and set its ISO code
        if (singleCustomerData?.state) {
          const statesForCountry = State.getStatesOfCountry(countryObj.isoCode);
          const stateObj = statesForCountry.find(
            (s) => s.name === singleCustomerData.state
          );
          if (stateObj) {
            setSelectedState(stateObj.isoCode);
          }
        }

        // Set city directly
        if (singleCustomerData?.city) {
          setSelectedCity(singleCustomerData.city);
        }
      }
    }
  }, [singleCustomerData, countries]);
  useEffect(() => {
    dispatch(fetchFigurineDropDowns());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchByIdCustomer(id));
    } else {
      isFormEmpty();
    }
  }, [id, dispatch]);

  const FigId = singleCustomerData?.figuringdata?.[0]?.figId;

  useEffect(() => {
    if (selectedFigId || FigId) {
      dispatch(fetchUinGenerationDetails(selectedFigId || FigId));
    }
  }, [selectedFigId || FigId, dispatch]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Get full names for country and state
      const countryObj = Country.getCountryByCode(values.country);
      const stateObj = State.getStateByCodeAndCountry(
        values.state,
        values.country
      );

      const submissionData = {
        ...values,
        country: countryObj?.name || values.country,
        state: stateObj?.name || values.state,
        // city is already using the name
      };
      if (id) {
        await dispatch(editCustomer(submissionData));
        resetForm();
        handleClose();
        selectedFigId(null);
      } else {
        await dispatch(insertCustomer(submissionData));
      }
      resetForm();
      handleClose();
    } catch (error) {
    }
  };

  const [width, setWidth] = useState(560);

  useLayoutEffect(() => {
    const handleResize = () => {
      const element = document.getElementById("asd");
      if (element) {
        setWidth(element.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const uinId = singleCustomerData?.figuringdata?.map((item) => item.uin);
  return (
    <Modal
      id="asd"
      show={show}
      onHide={handleClose}
      centered
      style={{ minHeight: "650px" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isNestedEdit
            ? "Edit UIN Details"
            : data
            ? "Edit Customer"
            : "Add Customer"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={
            id
              ? {
                  ...singleCustomerData,
                  ...(isNestedEdit && {
                    figId: FigId,
                    uin: uinId,
                  }),
                  country: selectedCountry,
                  state: selectedState,
                  city: selectedCity,
                }
              : initialValues
          }
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => {
            return (
              <FormikForm>
                {/* FIG Dropdown */}
                {(isNestedEdit || !id) && (
                  <>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="figId">
                        FIG
                      </label>
                      <PrimeDropdown
                        id="figId"
                        name="figId"
                        value={values.figId}
                        onChange={(e) => {
                          setFieldValue("figId", e.value);
                          setSelectedFigId(e.value);
                        }}
                        options={figurineData}
                        placeholder="Select FIG"
                        className="w-100"
                      />
                      <ErrorMessage
                        name="figId"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="uinDetailId">
                        UIN ID
                      </label>
                      <PrimeDropdown
                        id="uinDetailId"
                        name="uinDetailId"
                        value={values.uinDetailId}
                        onChange={(e) => setFieldValue("uinDetailId", e.value)}
                        options={uinGenerationDetails}
                        placeholder="Select UIN"
                        className="w-100"
                      />
                      <ErrorMessage
                        name="uinDetailId"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                  </>
                )}
                {!isNestedEdit && (
                  <>
                    <div className="row">
                      {/* First Name */}
                      <div className="col-6 mb-3">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <Field
                          name="firstName"
                          className={`form-control ${
                            touched.firstName && errors.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="John"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="col-6 mb-3">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <Field
                          name="lastName"
                          className={`form-control ${
                            touched.lastName && errors.lastName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Doe"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      {/* Email */}
                      <div className="col-6 mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className={`form-control ${
                            touched.email && errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="john.doe@example.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="col-6 mb-3">
                        <label htmlFor="phoneNo" className="form-label">
                          Phone Number
                        </label>
                        <Field
                          name="phoneNo"
                          className={`form-control ${
                            touched.phoneNo && errors.phoneNo
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="658 799 8941"
                        />
                        <ErrorMessage
                          name="phoneNo"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* D.O.B */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="DOB">
                          DOB
                        </label>
                        <Calendar
                          id="DOB"
                          name="DOB"
                          value={values.DOB ? new Date(values.DOB) : null}
                          onChange={(e) => setFieldValue("DOB", e.value)}
                          placeholder="Select Your Date Of Birth"
                          className="w-100 "
                          dateFormat="dd-mm-yy"
                          appendTo={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          showButtonBar
                          maxDate={new Date()}
                          panelClassName="customer-dob-custom"
                        />
                        <ErrorMessage
                          name="DOB"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      {/* Country */}
                      <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="row">
                      {/* State */}
                      <div className="col-md-6 mb-3">
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
                      <div className="col-md-6 mb-3">
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
                  </>
                )}
                {/* Buttons */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary ms-2"
                    disabled={loading}
                  >
                    {data ? "Update" : "Submit"}
                    {loading && <Spinner className="ms-2" size="sm" />}
                  </button>
                </div>
              </FormikForm>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CustomerForm;
//At from here i make changes

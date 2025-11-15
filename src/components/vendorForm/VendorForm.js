import { Modal, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  editVendor,
  insertVendor,
} from "../../redux/slice/vendor/vendorAsyncThunk";
import { MultiSelect } from "primereact/multiselect";
import { fetchFigurineDropDowns } from "../../redux/slice/figurine/figurineAsyncThunk";

const getValidationSchema = (isEditMode) => {
  return Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    location: Yup.string().required("Location is required"),
    companyName: Yup.string().required("Company name is required"),
    phoneNumber: Yup.string(),
    manufactureBy: Yup.array(),
    vendorAddress: Yup.string(),
    bankDetails: Yup.object().shape({
      accountHolderName: Yup.string(),
      bankName: Yup.string(),
      accountNumber: Yup.string(),
      ifscOrSwiftCode: Yup.string(),
    }),
  });
};

const VendorForm = ({ show, handleClose, data, loading }) => {
  const dispatch = useDispatch();
  const { figurineData } = useSelector((state) => state.figurines);
  const initialValues = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    location: data?.location || "",
    companyName: data?.companyName || "",
    phoneNumber: data?.phoneNumber || "",
    manufactureBy: data?.manufactureBy?.map((item) => item._id) || [],
    vendorAddress: data?.vendorAddress || "",
    bankDetails: {
      accountHolderName: data?.bankDetails?.accountHolderName || "",
      bankName: data?.bankDetails?.bankName || "",
      accountNumber: data?.bankDetails?.accountNumber || "",
      ifscOrSwiftCode: data?.bankDetails?.ifscOrSwiftCode || "",
    },
  };

  const handleSubmit = async (values) => {
    const { confirmPassword, ...userData } = values;
    if (data) {
      const finalData = { ...userData, id: data._id };
      await dispatch(editVendor(finalData));
    } else {
      await dispatch(insertVendor(userData));
    }
    handleClose();
  };

  useEffect(() => {
    dispatch(fetchFigurineDropDowns());
  }, [dispatch]);

  return (
    <Modal className="vendor-modal" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit Vendor" : "Add Vendor"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!data)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <FormikForm>
              <div className="d-flex gap-3">
                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="companyName">
                    Company Name
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    className={`form-control ${
                      touched.companyName && errors.companyName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="company Name "
                  />
                  <ErrorMessage
                    name="companyName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="email">
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
              </div>
              <div className="d-flex gap-3">
                <div className="mb-3 w-100 ">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    className={`form-control ${
                      touched.firstName && errors.firstName ? "is-invalid" : ""
                    }`}
                    placeholder="John"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    className={`form-control ${
                      touched.lastName && errors.lastName ? "is-invalid" : ""
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
              <div className="d-flex gap-3">
                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="location">
                    Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    className={`form-control ${
                      touched.location && errors.location ? "is-invalid" : ""
                    }`}
                    placeholder="location"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber"
                    className={`form-control ${
                      touched.phoneNumber && errors.phoneNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="658 799 8942"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="d-flex gap-3">
                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="vendorAddress">
                    Vendor Address
                  </label>
                  <Field
                    type="text"
                    name="vendorAddress"
                    className={`form-control ${
                      touched.vendorAddress && errors.vendorAddress
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="vendor Address"
                  />
                  <ErrorMessage
                    name="vendorAddress"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="mb-3 w-100">
                  <label htmlFor="manufactureBy" className="form-label">
                    Manufacture By
                  </label>
                  <div className="w-100 flex justify-content-center">
                    <MultiSelect
                      value={values.manufactureBy}
                      onChange={(e) => setFieldValue("manufactureBy", e.value)}
                      options={figurineData}
                      optionLabel="label"
                      optionValue="value"
                      display="chip"
                      placeholder="Select Manufacture"
                      maxSelectedLabels={5}
                      className="w-100"
                      panelClassName="manufactureBy-multiSelect-panel"
                    />
                  </div>
                  <ErrorMessage
                    name="manufactureBy"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>
              {/* // new added */}

              <div className="d-flex gap-3">
                <div className="mb-3 w-100">
                  <label
                    className="form-label"
                    htmlFor="bankDetails.accountHolderName"
                  >
                    Account Holder Name
                  </label>
                  <Field
                    type="text"
                    name="bankDetails.accountHolderName"
                    className={`form-control ${
                      touched.bankDetails?.accountHolderName &&
                      errors.bankDetails?.accountHolderName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Account Holder Name"
                  />
                  <ErrorMessage
                    name="bankDetails.accountHolderName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label" htmlFor="bankDetails.bankName">
                    Bank Name
                  </label>
                  <Field
                    type="text"
                    name="bankDetails.bankName"
                    className={`form-control ${
                      touched.bankDetails?.bankName &&
                      errors.bankDetails?.bankName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Bank Name"
                  />
                  <ErrorMessage
                    name="bankDetails.bankName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="mb-3 w-100">
                  <label
                    className="form-label"
                    htmlFor="bankDetails.accountNumber"
                  >
                    Account Number
                  </label>
                  <Field
                    type="text"
                    name="bankDetails.accountNumber"
                    className={`form-control ${
                      touched.bankDetails?.accountNumber &&
                      errors.bankDetails?.accountNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="2721 1110 2004 2003"
                  />
                  <ErrorMessage
                    name="bankDetails.accountNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="mb-3 w-100">
                  <label
                    className="form-label"
                    htmlFor="bankDetails.ifscOrSwiftCode"
                  >
                    IFSC or Swift Code
                  </label>
                  <Field
                    type="text"
                    name="bankDetails.ifscOrSwiftCode"
                    className={`form-control ${
                      touched.bankDetails?.ifscOrSwiftCode &&
                      errors.bankDetails?.ifscOrSwiftCode
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="SBIN0002711"
                  />
                  <ErrorMessage
                    name="bankDetails.ifscOrSwiftCode"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>

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

                  {loading ? <Spinner className="ms-1" /> : ""}
                </button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default VendorForm;

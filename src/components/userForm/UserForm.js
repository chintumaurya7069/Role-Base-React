import { Modal, Button, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { editUser, insertUser } from "../../redux/slice/user/userAsyncThunk";
import { fetchRoles } from "../../redux/slice/roles/roleAsyncThunk";
import { fetchDepartments } from "../../redux/slice/department/departmentAsyncThunk";

const getValidationSchema = (isEditMode) => {
  return Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    number: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be at least 10 digits")
      .max(10, "Must be at least 10 digits"),
    role: Yup.mixed().required("Role is required"),
    ...(isEditMode
      ? {}
      : {
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
        }),
  });
};

const UserForm = ({ show, handleClose, data, loading }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.roles);
  const { department } = useSelector((state) => state.department);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const initialValues = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    number: data?.number || "",
    role: data?.role?._id || null,
    department: data?.department?._id || null,
    ...(data
      ? {}
      : {
          password: "",
          confirmPassword: "",
        }),
  };

  const handleSubmit = async (values) => {
    const { confirmPassword, ...userData } = values;
    if (data) {
      const finalData = { ...userData, id: data._id };
      await dispatch(editUser(finalData));
    } else {
      await dispatch(insertUser(userData));
    }
    handleClose();
  };

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit User" : "Add User"}</Modal.Title>
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
              <div className="row">
                <div className="col-6 mb-3">
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

                <div className="col-6 mb-3">
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

              <div className="row">
                <div className="col-6 mb-3">
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
                  <div className="form-text">
                    You can use letters, numbers & periods
                  </div>
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label" htmlFor="number">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="number"
                    className={`form-control ${
                      touched.number && errors.number ? "is-invalid" : ""
                    }`}
                    placeholder="658 799 8941"
                  />
                  <ErrorMessage
                    name="number"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="role">
                  Role
                </label>
                <PrimeDropdown
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.value)}
                  options={role}
                  placeholder="Select Role"
                  className={`w-100 ${
                    touched.role && errors.role ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="role"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="department">
                  Department
                </label>
                <PrimeDropdown
                  id="department"
                  name="department"
                  value={values.department}
                  onChange={(e) => setFieldValue("department", e.value)}
                  // options={department.map((department) => ({
                  //   label: department.name,
                  //   value: department.id,
                  // }))}
                  options={department}
                  placeholder="Select Department"
                  className={`w-100 ${
                    touched.role && errors.role ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="department"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              {!data && (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <div className="input-group">
                      <Field
                        type={showPass ? "text" : "password"}
                        name="password"
                        className={`form-control ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter Password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <i
                          className={`fas ${
                            showPass ? "fa-eye-slash" : "fa-eye"
                          }`}
                        />
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                    <div className="form-text">
                      Must be at least 8 characters
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <Field
                        type={showConfirmPass ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm Password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                      >
                        <i
                          className={`fas ${
                            showConfirmPass ? "fa-eye-slash" : "fa-eye"
                          }`}
                        />
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </>
              )}
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

export default UserForm;

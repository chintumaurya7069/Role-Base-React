import { Modal, Button, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { editRole, insertRole } from "../../redux/slice/roles/roleAsyncThunk";
import { fetchRefreshApi } from "../../redux/slice/refreshAPi/refreshApiAsyncThunk";

const getValidationSchema = (isEditMode) => {
  return Yup.object({
    name: Yup.string().required("Name is required"),
    permissions: Yup.array().required(),
  });
};

const RoleFormModal = ({ show, handleClose, data, loading }) => {
  const dispatch = useDispatch();
  const modules = [
    "Dashboard",
    "User",
    "Vendor",
    "Customers",
    "Figurine",
    "UIN Generator",
    "Customer Insights",
    "Role",
    "Genre",
    "AgeGroup",
    "Department",
  ];
  const actions = ["create", "view", "edit", "delete"];

  // Convert the incoming permissions array to the form's initial structure
  const getInitialPermissions = () => {
    if (data?.permissions) {
      return modules.map((module) => {
        const modulePermissions =
          data.permissions.find((p) => p.module === module) || {};
        return {
          module,
          create: modulePermissions.create || false,
          view: modulePermissions.view || false,
          edit: modulePermissions.edit || false,
          delete: modulePermissions.delete || false,
        };
      });
    }
    return modules.map((module) => ({
      module,
      create: false,
      view: false,
      edit: false,
      delete: false,
    }));
  };

  const initialValues = {
    name: data?.name || "",
    permissions: getInitialPermissions(),
  };

  const roleId = localStorage.getItem("role_id");

  const handleSubmit = async (values) => {
    if (data) {
      const finalData = { ...values, id: data._id };
      await dispatch(editRole(finalData));
      dispatch(fetchRefreshApi(roleId));
    } else {
      await dispatch(insertRole(values));
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit Role" : "Add Role"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!data)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
            <FormikForm>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className={`form-control ${
                    touched.name && errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Role name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="permissions-wrapper">
                {values.permissions.map((modulePerm, index) => (
                  <div
                    key={modulePerm.module}
                    className={`module-row px-2 ${
                      modulePerm.module === "User" ? "highlight" : ""
                    }`}
                  >
                    <strong className="module-row-part py-2">
                      {modulePerm.module}
                    </strong>
                    <div className="d-flex actions-row-part py-2 ps-3">
                      {actions.map((action) => (
                        <div key={action} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${modulePerm.module}_${action}`}
                            checked={modulePerm[action]}
                            disabled={
                              action !== "view" && modulePerm.view === false
                            }
                            onChange={(e) => {
                              const updatedPermissions = [
                                ...values.permissions,
                              ];
                              updatedPermissions[index] = {
                                ...updatedPermissions[index],
                                [action]: e.target.checked,
                              };
                              setFieldValue("permissions", updatedPermissions);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`${modulePerm.module}_${action}`}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="me-2"
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {data ? "Update" : "Submit"}
                  {loading && <Spinner className="ms-1" />}
                </button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RoleFormModal;

import { Modal, Button, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  editDepartment,
  insertDepartment,
} from "../../redux/slice/department/departmentAsyncThunk";

const getValidationSchema = (isEditMode) => {
  return Yup.object({
    name: Yup.string().required("Name is required"),
  });
};

const DepartmentForm = ({ show, handleClose, data, loading }) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: data?.name || "",
  };

  const handleSubmit = async (values) => {
    if (data) {
      const finalData = { ...values, id: data._id };
      await dispatch(editDepartment(finalData));
    } else {
      await dispatch(insertDepartment(values));
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit Department" : "Add Department"}</Modal.Title>
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
                  placeholder="Department name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
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

export default DepartmentForm;

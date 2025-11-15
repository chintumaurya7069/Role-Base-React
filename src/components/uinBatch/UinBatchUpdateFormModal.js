import { Modal, Spinner } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { status } from "./const";
import { useDispatch } from "react-redux";
import { editUinGeneration } from "../../redux/slice/uinGeneration/uinGenerationAsyncThunk";

function UinBatchUpdateFormModal(props) {
  const {
    handleClose,
    handleConfirmation,
    title,
    data,
    loading,
    selectedFullRecord,
    ...modalProps
  } = props;

  const dispatch = useDispatch();
  const mainId = selectedFullRecord?._id;
  const subId = data?.id;

  const getStatusIdFromName = (statusName) => {
    const foundStatus = status.find((s) => s.status === statusName);
    return foundStatus ? foundStatus.id : "";
  };

  const validationSchema = Yup.object({
    uin: Yup.string().required("UIN is required"),
    currentStatus: Yup.string().required("currentStatus is required"),
  });

  const handleSubmit = async (values, actions) => {
    const currentStatus = values?.currentStatus;
    await dispatch(
      editUinGeneration({ mainId, subId, body: { currentStatus } })
    );
    handleClose();
  };

  return (
    <Modal
      {...modalProps}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Update UIN</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <Formik
            initialValues={{
              uin: data?.UIN || "",
              currentStatus: data?.currentStatus || "",
            }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, handleSubmit, setFieldValue }) => (
              <form className="card-body" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="uin" className="form-label fw-bold">
                      UIN
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="uin"
                      name="uin"
                      placeholder="Enter UIN"
                      readOnly
                    />
                    <ErrorMessage
                      name="uin"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" htmlFor="currentStatus">
                      Status
                    </label>
                    <PrimeDropdown
                      id="currentStatus"
                      name="currentStatus"
                      value={values.currentStatus}
                      onChange={(e) => setFieldValue("currentStatus", e.value)}
                      options={status.map((s) => ({
                        label: s.currentStatus,
                        value: s.currentStatus,
                      }))}
                      placeholder="Select Status"
                      className="w-100"
                    />
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    Submit
                    {loading ? <Spinner className="ms-1" /> : ""}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UinBatchUpdateFormModal;

import { useState } from "react";
import { Modal, Spinner, Form } from "react-bootstrap";

function ConformModal(props) {
  const {
    onHide,
    description,
    handleConfirmation,
    title,
    deleteLoading,
    showDeleteReason = false,
  } = props;
  const [deleteReason, setDeleteReason] = useState("");

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      {...props}
      backdrop={deleteLoading ? "static" : true}
      keyboard={!deleteLoading}
      size="md"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">{description}</p>

        {/* Conditionally render delete reason input */}
        {showDeleteReason && (
          <Form.Group controlId="deleteReason">
            <Form.Label>Delete Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason for deletion"
              required
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleConfirmation(deleteReason)}
          disabled={deleteLoading || (showDeleteReason && !deleteReason.trim())}
        >
          Yes
          {deleteLoading && (
            <Spinner className="ms-1" animation="border" size="sm" />
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default ConformModal;

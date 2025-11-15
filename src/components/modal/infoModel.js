import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./info-model.css";
const ModifiedByTooltip = ({ item, children }) => {
  if (!item?.modifiedBy) return children;
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
  const renderTooltip = (props) => (
    <Tooltip
      id="modified-by-tooltip"
      {...props}
      className="custom-tooltip" // Added custom class
    >
      <div className="p-2">
        <h6 className="mb-2">Last Modified</h6>
        <div className="ps-2">
          <div>
            <strong>By:</strong> {item.modifiedBy.firstName}{" "}
            {item.modifiedBy.lastName}
          </div>
          {item.modifiedOn && (
            <div>
              <strong>On:</strong> {formatDate(item.modifiedOn)}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom" // Changed from 'top' to 'bottom'
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default ModifiedByTooltip;

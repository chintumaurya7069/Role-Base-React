import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Dropdown,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DotsVertical, Pencil } from "tabler-icons-react";
import Pagination from "./pagination/Pagination";
import ConformModal from "../modal/ConformModal";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useDispatch, useSelector } from "react-redux";
import { IconInfoSmall, IconTrash } from "@tabler/icons-react";
import { fetchDataById } from "../../redux/slice/uinGeneration/uinGenerationAsyncThunk";
import ModifiedByModal from "../modal/infoModel";
import ModifiedByTooltip from "../modal/infoModel";

const stickyColumnStyles = {
  position: "sticky",
  right: -10,
  background: "white",
  BorderBottom: "none",
  zIndex: 1,
};

const HeaderStickyColumnStyles = {
  position: "sticky",
  right: 0,
  background: "#7367f0",
  zIndex: 1,
};

const NestedTable = React.forwardRef((props, ref) => {
  const {
    columns,
    data,
    collapseColumns,
    collapseKey,
    deleteData,
    category,
    title,
    loading,
    deleteLoading,
    addButtonText = "Add New",
    searchPlaceholder = "Search...",
    mainLoader,
    itemsPerPage = 50,
    searchable,
    topHide,
    actions = true,
    infoButtonIcon,
    rowActions = [],
    onRowClick,
    FormComponent,
    addButton,
    buttons,
    exportButton,
    isShow = false,
    canEdit,
    currentModule,
    actionsDropdown,
    hideActions = false,
    hideNestedActions = false,
    disableRowActions = false,
    hidePagination = false,
    currentPage: propCurrentPage = 1,
    onPageChange,
    expandedRows: propExpandedRows = [],
    onToggleRow,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedFullRecord, setSelectedFullRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nestedPagination, setNestedPagination] = useState({});
  const [nestedItemsPerPage] = useState(10); // Fixed at 10 items per page
  const [internalExpandedRows, setInternalExpandedRows] = useState([]);

  const [hoverModalShow, setHoverModalShow] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const expandedRows = onToggleRow ? propExpandedRows : internalExpandedRows;
  const setExpandedRows = onToggleRow ? onToggleRow : setInternalExpandedRows;
  const [formProps, setFormProps] = useState({
    isNestedEdit: false, // Add this to track edit type
    // ... other existing form props
  });
  const dispatch = useDispatch();

  const getNestedPagination = (parentId) => {
    return nestedPagination[parentId] || { currentPage: 1 };
  };
  const updateNestedPagination = (parentId, newPage) => {
    setNestedPagination((prev) => ({
      ...prev,
      [parentId]: { currentPage: newPage },
    }));
  };

  const { userRoleData } = useSelector((state) => state.userRole);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const sortedItems = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase();
        const bValue = b[sortConfig.key]?.toString().toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const indexOfLastItem = propCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const navigate = useNavigate();
  const exportTableRef = useRef(null);
  const defaultRowActions = [
    {
      label: "Delete",
      action: (item) => {
        setSelectedId(item._id);
        setShowModal(true);
      },
      className: "text-danger",
    },
    {
      label: "View",
      action: (item) => {},
    },
  ];

  const allRowActions = [...defaultRowActions, ...rowActions];

  const renderCellContent = (item, column, index) => {
    if (column.isIndex) {
      return index + 1; // show 1-based index
    }

    if (column.body) {
      return column.body(item);
    }

    if (column.render) {
      return column.render(item);
    }

    if (column.field.includes(".")) {
      const fields = column.field.split(".");
      let value = item;
      for (const field of fields) {
        value = value?.[field];
        if (!value) break;
      }
      return value || "";
    }

    return item[column.field] || "";
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  const toggleRow = async (rowId, item) => {
    setSelectedFullRecord(item);
    setExpandedRows((prev) => {
      // If the row is already expanded, close it
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      }
      // Otherwise, close all other rows and open this one
      updateNestedPagination(rowId, 1);
      return [rowId];
    });

    if (currentModule === "UIN Generator") {
      setSubloading(true);
      await dispatch(fetchDataById(rowId));
      setSubloading(false);
    }
  };
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(sortedItems);
    } else {
      const filtered = sortedItems.filter((item) => {
        // Check main item fields
        const mainItemMatch = columns.some((column) => {
          if (column.searchable !== false && item[column.field]) {
            return item[column.field]
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        });

        // Check nested item fields if collapseKey exists
        let nestedMatch = false;
        if (collapseKey && item[collapseKey]) {
          if (Array.isArray(item[collapseKey])) {
            // Handle array case
            nestedMatch = item[collapseKey].some((nestedItem) => {
              return collapseColumns.some((column) => {
                if (column.searchable !== false && nestedItem[column.field]) {
                  return nestedItem[column.field]
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
                return false;
              });
            });
          } else {
            // Handle object case
            nestedMatch = collapseColumns.some((column) => {
              if (
                column.searchable !== false &&
                item[collapseKey][column.field]
              ) {
                return item[collapseKey][column.field]
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              }
              return false;
            });
          }
        }

        return mainItemMatch || nestedMatch;
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, sortedItems, columns, collapseColumns, collapseKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const handleAddData = () => {
    navigate("form");
  };

  const handleEditData = (item) => {
    navigate(`form/${item._id}`);
    setSelectedRecord(item);
  };

  const filterData = userRoleData?.permissions?.find(
    (el) => el.module === currentModule
  );

  const { create, delete: isDelete, edit } = filterData || {};

  return (
    <>
      <div className="card overflow-hidden mt-5 mt-lg-0">
        <div className="card-datatable table-responsive pt-0">
          <div className="dt-container dt-bootstrap5 dt-empty-footer">
            {!topHide && (
              <div className="row card-header flex-column flex-md-row border-bottom mx-0 px-3">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                  {category === "uin" ? (
                    <h2 className="card-title mb-0 text-md-start text-center pb-md-0 pb-6">
                      {title}
                    </h2>
                  ) : (
                    <h5 className="m-0">{title}</h5>
                  )}
                </div>

                {addButton && (
                  <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
                    <div className="dt-buttons gap-3 d-flex">
                      {exportButton && (
                        <ButtonGroup className="">
                          <DownloadTableExcel
                            filename={title}
                            sheet="users"
                            currentTableRef={exportTableRef.current}
                          >
                            <Button
                              variant="primary"
                              className="create-new btn btn-label-primary waves-effect waves-light"
                            >
                              <span className="d-flex align-items-center gap-2">
                                <i className="ti ti-file-export"></i>
                                <span className="d-none d-sm-inline-block">
                                  Export
                                </span>
                              </span>
                            </Button>
                          </DownloadTableExcel>
                        </ButtonGroup>
                      )}
                      {buttons && (
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            className="create-new create-new-btn"
                            onClick={() => {
                              if (isShow) {
                                handleAddData();
                              } else {
                                setSelectedRecord(null);
                                setSelectedFullRecord(null);
                                setShowForm(true);
                              }
                            }}
                          >
                            <span className="d-flex align-items-center gap-2">
                              <i className="ti ti-plus"></i>
                              <span className="d-none d-sm-inline-block">
                                {addButtonText}
                              </span>
                            </span>
                          </Button>
                        </ButtonGroup>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {searchable && (
              <div className="row mx-0 px-3 py-2 my-0 justify-content-between border-bottom">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
                  <div className="dt-search mt-0 mt-md-6 mb-6 d-flex align-items-center">
                    <Form.Label
                      htmlFor="dt-search-0"
                      className="text-xl fw-semibold"
                      style={{ fontSize: "18px" }}
                    >
                      Search:
                    </Form.Label>
                    <Form.Control
                      type="search"
                      className="form-control ms-4"
                      id="dt-search-0"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="justify-content-between dt-layout-table">
              <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                <Table
                  hover
                  className="datatables-basic table dataTable dtr-column table-striped table-primary-color"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      {columns?.map((column) => (
                        <th
                          key={column.field}
                          className={`sortable-header ${
                            column.className || ""
                          }`}
                        >
                          {column.header}
                        </th>
                      ))}
                      {!hideActions && actions && (
                        <th
                          className="text-end pe-5"
                          style={HeaderStickyColumnStyles}
                        >
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {mainLoader ? (
                      <tr>
                        <td
                          colSpan={
                            columns.length + (!hideActions && actions ? 1 : 0)
                          }
                          className="text-center py-4"
                        >
                          <Spinner />
                        </td>
                      </tr>
                    ) : currentItems?.length > 0 ? (
                      currentItems?.map((item) => (
                        <React.Fragment key={item._id}>
                          <tr
                            onClick={() => onRowClick && onRowClick(item)}
                            style={{
                              cursor: onRowClick ? "pointer" : "default",
                            }}
                          >
                            {columns?.map((column) => (
                              <td
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRow(item._id, item);
                                }}
                                className="cursor-pointer"
                                key={`${item._id}-${column.field}`}
                              >
                                {renderCellContent(item, column)}
                              </td>
                            ))}
                            {!hideActions && actions && (
                              <td
                                className="d-flex justify-content-end align-items-center gap-2 pe-5"
                                style={stickyColumnStyles}
                              >
                                {item.isActive ? (
                                  !disableRowActions && (
                                    <>
                                      <Button
                                        variant="text-secondary"
                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-delete"
                                        onClick={() => {
                                          setSelectedId(item._id);
                                          setShowModal(true);
                                        }}
                                        disabled={disableRowActions}
                                      >
                                        {!disableRowActions && <IconTrash />}
                                      </Button>
                                      {/* New Conditional Button */}
                                      <Button
                                        variant="text-primary"
                                        className="btn btn-icon btn-text-primary rounded-pill waves-effect item-edit"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isShow) {
                                            handleEditData(item);
                                          } else {
                                            setSelectedRecord(item); // Pass the main item, not item[collapseKey]
                                            setSelectedFullRecord(item); // Also set the full record
                                            setFormProps({
                                              isNestedEdit: false, // Explicitly set to false for main table edit
                                            });
                                            setShowForm(true);
                                          }
                                        }}
                                      >
                                        <Pencil />
                                      </Button>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <ModifiedByModal
                                      show={hoverModalShow}
                                      onHide={() => setHoverModalShow(false)}
                                      item={hoveredItem}
                                    />
                                    {infoButtonIcon && (
                                      <ModifiedByTooltip item={item}>
                                        <span>
                                          <IconInfoSmall
                                            className="btn btn-icon btn-text-primary rounded-pill waves-effect"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </span>
                                      </ModifiedByTooltip>
                                    )}
                                    <span className="badge bg-danger">
                                      Deleted
                                    </span>
                                  </>
                                )}

                                {actions && (
                                  <div
                                    className="border-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRow(item._id, item);
                                    }}
                                  >
                                    {expandedRows.includes(item._id) ? (
                                      <i className="ti ti-chevron-up text-primary"></i>
                                    ) : (
                                      <i className="ti ti-chevron-down text-primary"></i>
                                    )}
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>

                          {collapseColumns && (
                            <tr className="collapse-row">
                              <td
                                colSpan={
                                  columns.length +
                                  (!hideActions && actions ? 1 : 0)
                                }
                                className={`${
                                  (expandedRows?.includes(item._id) ||
                                    expandedRows?.includes(
                                      `loading-${item._id}`
                                    )) &&
                                  "border-bottom"
                                }`}
                                style={{
                                  padding: 0,
                                  border: "none",
                                  width: "100%",
                                }}
                              >
                                <Collapse
                                  in={
                                    expandedRows.includes(item._id) ||
                                    expandedRows.includes(`loading-${item._id}`)
                                  }
                                  className="mt-0 ms-auto"
                                >
                                  <div
                                    id={`collapse-content-${item._id}`}
                                    className="collapse-content"
                                    style={{
                                      padding: "10px 0 10px 60px",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <Table
                                      bordered
                                      hover
                                      className="datatables-basic table dataTable dtr-column table-striped table-primary-color nested-table"
                                    >
                                      <thead>
                                        <tr>
                                          {collapseColumns?.map((column) => (
                                            <th
                                              key={column.field}
                                              className={column.className || ""}
                                            >
                                              {column.header}
                                            </th>
                                          ))}
                                          {actions &&
                                            (filterData?.edit ||
                                              filterData?.delete) && (
                                              <th className="text-end pe-5">
                                                Actions
                                              </th>
                                            )}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {subloading ? (
                                          <tr>
                                            <td
                                              colSpan={
                                                collapseColumns.length +
                                                (!hideNestedActions && actions
                                                  ? 1
                                                  : 0)
                                              }
                                              className="text-center py-4"
                                            >
                                              <Spinner animation="border" />
                                            </td>
                                          </tr>
                                        ) : item[collapseKey] ? (
                                          Array.isArray(item[collapseKey]) ? (
                                            item[collapseKey].length > 0 ? (
                                              item[collapseKey]
                                                .slice(
                                                  (getNestedPagination(item._id)
                                                    .currentPage -
                                                    1) *
                                                    nestedItemsPerPage,
                                                  getNestedPagination(item._id)
                                                    .currentPage *
                                                    nestedItemsPerPage
                                                )
                                                .map((nestedItem, ind) => (
                                                  <tr
                                                    key={nestedItem?._id}
                                                    onClick={() =>
                                                      onRowClick &&
                                                      onRowClick(nestedItem)
                                                    }
                                                    style={{
                                                      cursor: onRowClick
                                                        ? "pointer"
                                                        : "default",
                                                    }}
                                                  >
                                                    {collapseColumns?.map(
                                                      (column, colIndex) => (
                                                        <td
                                                          key={`${nestedItem._id}-${column.field}`}
                                                        >
                                                          {column.isIndex
                                                            ? ind + 1
                                                            : renderCellContent(
                                                                nestedItem,
                                                                column,
                                                                ind
                                                              )}
                                                        </td>
                                                      )
                                                    )}
                                                    {!hideNestedActions &&
                                                      actions && (
                                                        <td className="pe-5">
                                                          <div className="d-flex justify-content-end gap-2">
                                                            {!disableRowActions &&
                                                              (filterData?.edit ||
                                                                !userRoleData?.permissions) &&
                                                              (item.isActive ? (
                                                                <Button
                                                                  variant="text-secondary"
                                                                  className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                                                  onClick={(
                                                                    e
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                    if (
                                                                      isShow
                                                                    ) {
                                                                      handleEditData(
                                                                        nestedItem
                                                                      );
                                                                    } else {
                                                                      setSelectedRecord(
                                                                        nestedItem
                                                                      );
                                                                      setShowForm(
                                                                        true
                                                                      );
                                                                      setFormProps(
                                                                        (
                                                                          prev
                                                                        ) => ({
                                                                          ...prev,
                                                                          isNestedEdit: true,
                                                                        })
                                                                      ); // Nested edit
                                                                    }
                                                                  }}
                                                                  disabled={
                                                                    disableRowActions
                                                                  }
                                                                >
                                                                  {!disableRowActions && (
                                                                    <Pencil />
                                                                  )}
                                                                </Button>
                                                              ) : (
                                                                <span className="badge bg-danger">
                                                                  Deleted
                                                                </span>
                                                              ))}

                                                            {actionsDropdown &&
                                                              !disableRowActions && (
                                                                <Dropdown>
                                                                  <Dropdown.Toggle
                                                                    variant="text-secondary"
                                                                    className="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow"
                                                                    disabled={
                                                                      disableRowActions
                                                                    }
                                                                  >
                                                                    {disableRowActions ? null : (
                                                                      <DotsVertical />
                                                                    )}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu className="dropdown-menu-end m-0">
                                                                    {allRowActions?.map(
                                                                      (
                                                                        action,
                                                                        index
                                                                      ) => (
                                                                        <React.Fragment
                                                                          key={
                                                                            index
                                                                          }
                                                                        >
                                                                          {action.separator && (
                                                                            <div className="dropdown-divider"></div>
                                                                          )}
                                                                          <Dropdown.Item
                                                                            className={`dropdown-item ${
                                                                              action.className ||
                                                                              ""
                                                                            }`}
                                                                            onClick={(
                                                                              e
                                                                            ) => {
                                                                              e.stopPropagation();
                                                                              action.action(
                                                                                nestedItem
                                                                              );
                                                                            }}
                                                                            disabled={
                                                                              disableRowActions
                                                                            }
                                                                          >
                                                                            {action.icon && (
                                                                              <span className="me-2">
                                                                                {
                                                                                  action.icon
                                                                                }
                                                                              </span>
                                                                            )}
                                                                            {
                                                                              action.label
                                                                            }
                                                                          </Dropdown.Item>
                                                                        </React.Fragment>
                                                                      )
                                                                    )}
                                                                  </Dropdown.Menu>
                                                                </Dropdown>
                                                              )}
                                                          </div>
                                                        </td>
                                                      )}
                                                  </tr>
                                                ))
                                            ) : (
                                              <tr>
                                                <td
                                                  colSpan={
                                                    collapseColumns.length +
                                                    (actions ? 1 : 0)
                                                  }
                                                  className="text-center py-4"
                                                >
                                                  No nested records found
                                                </td>
                                              </tr>
                                            )
                                          ) : (
                                            <tr
                                              key={item[collapseKey]._id}
                                              onClick={() =>
                                                onRowClick &&
                                                onRowClick(item[collapseKey])
                                              }
                                              style={{
                                                cursor: onRowClick
                                                  ? "pointer"
                                                  : "default",
                                              }}
                                            >
                                              {collapseColumns?.map(
                                                (column) => (
                                                  <td
                                                    key={`${item[collapseKey]._id}-${column.field}`}
                                                  >
                                                    {renderCellContent(
                                                      item[collapseKey],
                                                      column
                                                    )}
                                                  </td>
                                                )
                                              )}

                                              {actions && (
                                                <td className="pe-5">
                                                  <div className="d-flex justify-content-end gap-2">
                                                    <Button
                                                      variant="text-secondary"
                                                      className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isShow) {
                                                          handleEditData(
                                                            item[collapseKey]
                                                          );
                                                        } else {
                                                          setSelectedRecord(
                                                            item[collapseKey]
                                                          );
                                                          setShowForm(true);
                                                        }
                                                      }}
                                                    >
                                                      <Pencil />
                                                    </Button>
                                                    <Dropdown>
                                                      <Dropdown.Toggle
                                                        variant="text-secondary"
                                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow"
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      >
                                                        <DotsVertical />
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu className="dropdown-menu-end m-0">
                                                        {allRowActions?.map(
                                                          (action, index) => (
                                                            <React.Fragment
                                                              key={index}
                                                            >
                                                              {action.separator && (
                                                                <div className="dropdown-divider"></div>
                                                              )}
                                                              <Dropdown.Item
                                                                className={`dropdown-item ${
                                                                  action.className ||
                                                                  ""
                                                                }`}
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation();
                                                                  action.action(
                                                                    item[
                                                                      collapseKey
                                                                    ]
                                                                  );
                                                                }}
                                                              >
                                                                {action.icon && (
                                                                  <span className="me-2">
                                                                    {
                                                                      action.icon
                                                                    }
                                                                  </span>
                                                                )}
                                                                {action.label}
                                                              </Dropdown.Item>
                                                            </React.Fragment>
                                                          )
                                                        )}
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </div>
                                                </td>
                                              )}
                                            </tr>
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan={
                                                collapseColumns.length +
                                                (actions ? 1 : 0)
                                              }
                                              className="text-center py-4"
                                            >
                                              No nested data available
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </Table>
                                    {item[collapseKey] &&
                                      Array.isArray(item[collapseKey]) &&
                                      item[collapseKey].length >
                                        nestedItemsPerPage && (
                                        <div className="d-flex justify-content-center mt-3">
                                          <Pagination
                                            currentPage={
                                              getNestedPagination(item._id)
                                                .currentPage
                                            }
                                            totalPages={Math.ceil(
                                              item[collapseKey].length /
                                                nestedItemsPerPage
                                            )}
                                            onPageChange={(page) =>
                                              updateNestedPagination(
                                                item._id,
                                                page
                                              )
                                            }
                                            itemsPerPage={nestedItemsPerPage}
                                            totalItems={
                                              item[collapseKey].length
                                            }
                                            indexOfFirstItem={
                                              (getNestedPagination(item._id)
                                                .currentPage -
                                                1) *
                                              nestedItemsPerPage
                                            }
                                            indexOfLastItem={
                                              getNestedPagination(item._id)
                                                .currentPage *
                                              nestedItemsPerPage
                                            }
                                          />
                                        </div>
                                      )}
                                  </div>
                                </Collapse>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            columns.length + (!hideActions && actions ? 1 : 0)
                          }
                          className="text-center py-4"
                        >
                          No Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            <div style={{ display: "none" }}>
              <Table ref={exportTableRef}>
                <thead>
                  <tr>
                    {columns?.map((column) => (
                      <th key={column.field}>{column.header}</th>
                    ))}
                    {collapseColumns?.map((column, index) => (
                      <th
                        key={`nested-${column.field}`}
                      >{`Nested ${column.header}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.flatMap((item) => {
                    const baseRow = (
                      <tr key={item._id}>
                        {columns?.map((column) => (
                          <td key={`${item._id}-${column.field}`}>
                            {renderCellContent(item, column)}
                          </td>
                        ))}
                        {collapseColumns?.map((column) => (
                          <td key={`empty-${item._id}-${column.field}`}></td>
                        ))}
                      </tr>
                    );

                    if (!item[collapseKey]) return [baseRow];

                    const nestedRows = Array.isArray(item[collapseKey])
                      ? item[collapseKey].map((nestedItem, index) => {
                          return (
                            <tr
                              key={`nested-${
                                nestedItem._id || `${item._id}-${index}`
                              }`}
                            >
                              {columns?.map((column) => (
                                <td
                                  key={`empty-${nestedItem._id || item._id}-${
                                    column.field
                                  }-${index}`}
                                ></td>
                              ))}
                              {collapseColumns?.map((column) => (
                                <td
                                  key={`nested-${nestedItem._id || item._id}-${
                                    column.field
                                  }-${index}`}
                                >
                                  {renderCellContent(nestedItem, column, index)}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      : [
                          <tr
                            key={`nested-${item[collapseKey]._id || item._id}`}
                          >
                            {columns?.map((column) => (
                              <td
                                key={`empty-${
                                  item[collapseKey]._id || item._id
                                }-${column.field}`}
                              ></td>
                            ))}
                            {collapseColumns?.map((column) => (
                              <td
                                key={`nested-${
                                  item[collapseKey]._id || item._id
                                }-${column.field}`}
                              >
                                {renderCellContent(item[collapseKey], column)}
                              </td>
                            ))}
                          </tr>,
                        ];

                    return [baseRow, ...nestedRows];
                  })}
                </tbody>
              </Table>
            </div>

            {!hidePagination && filteredData?.length > 0 && (
              <Pagination
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                currentPage={propCurrentPage}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>

        {FormComponent && (
          <FormComponent
            show={showForm}
            handleClose={() => {
              setShowForm(false);
              setSelectedRecord(null);
            }}
            selectedFullRecord={selectedFullRecord}
            data={selectedRecord}
            loading={loading}
            {...formProps}
          />
        )}

        {showModal && (
          <ConformModal
            show={showModal}
            title={"Confirm Delete"}
            description={"Are you sure you want to delete this record?"}
            onHide={() => {
              setShowModal(false);
            }}
            handleConfirmation={async (deleteReason) => {
              await deleteData(selectedId, deleteReason);
              setShowModal(false);
            }}
            deleteLoading={deleteLoading}
            showDeleteReason={currentModule === "UIN Generator"} // Only show for UIN
          />
        )}
      </div>
    </>
  );
});
export default React.memo(NestedTable);

//At from here i make changes

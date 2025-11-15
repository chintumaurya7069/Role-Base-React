import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, Form, Button, ButtonGroup, Spinner } from "react-bootstrap";
import { Pencil } from "tabler-icons-react";
import Pagination from "./pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { DownloadTableExcel } from "react-export-table-to-excel";
import ConformModal from "../modal/ConformModal";
import { IconTrash } from "@tabler/icons-react";
import { useSelector } from "react-redux";

// Add this CSS to your styles
const stickyColumnStyles = {
  position: "sticky",
  right: -10,
  background: "white",
  zIndex: 1,
  boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
};

const HeaderStickyColumnStyles = {
  position: "sticky",
  right: 0,
  background: "#7367f0",
  zIndex: 1,
  boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
};

const DataTable = ({
  title,
  columns,
  data,
  deleteData,
  category,
  loading,
  mainLoader,
  deleteLoading,
  itemsPerPage = 50,
  searchable = true,
  addButton = true,
  addButtonText = "Add New",
  searchPlaceholder = "Search...",
  actions = true,
  onRowClick,
  FormComponent,
  isShow = false,
  formProps = {},
  pageSize,
  exportButton,
  buttons,
  currentModule,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { userRoleData } = useSelector((state) => state.userRole);

  const filterData = userRoleData?.permissions?.find(
    (el) => el.module === currentModule
  );

  const { create, delete: isDelete, edit } = filterData || {};

  const tableRef = useRef(null);
  const exportTableRef = useRef(null);

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

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(sortedItems);
    } else {
      const filtered = sortedItems.filter((item) => {
        return columns.some((column) => {
          if (column.searchable !== false && item[column.field]) {
            return item[column.field]
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, sortedItems, columns]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const renderCellContent = (item, column) => {
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
        value = value[field];
        if (!value) break;
      }
      return value || "";
    }
    return item[column.field] || "";
  };

  const navigate = useNavigate();

  const handleAddData = () => {
    navigate("form");
  };

  const handleEditData = (item) => {
    navigate(`form/${item._id}`);
    setSelectedRecord(item);
  };

  return (
    <div className="card mt-5 mt-lg-0">
      <div className="card-datatable table-responsive pt-0">
        <div className="dt-container dt-bootstrap5 dt-empty-footer">
          <div className="row card-header flex-column flex-md-row border-bottom mx-0 px-3">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
              {category === "uin " ? (
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
                  {(filterData?.create ||
                    !userRoleData?.permissions?.some(
                      (el) => el.module === currentModule
                    )) &&
                    buttons && (
                      <ButtonGroup>
                        <Button
                          variant="primary"
                          className="create-new create-new-btn"
                          onClick={() => {
                            if (isShow) {
                              handleAddData();
                            } else {
                              setSelectedRecord(null);
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
                ref={tableRef}
                className="datatables-basic table dataTable dtr-column table-striped table-primary-color"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    {columns?.map((column) => (
                      <th
                        key={column.field}
                        className={`sortable-header ${column.className || ""}`}
                        onClick={() => {
                          const isAsc =
                            sortConfig.key === column.field &&
                            sortConfig.direction === "asc";
                          setSortConfig({
                            key: column.field,
                            direction: isAsc ? "desc" : "asc",
                          });
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {column.header}
                        {sortConfig.key === column.field && (
                          <span className="ms-2">
                            {sortConfig.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    ))}
                    {actions &&
                      (filterData?.edit ||
                        filterData?.delete ||
                        !userRoleData?.permissions?.some(
                          (el) => el.module === currentModule
                        )) && (
                        <th
                          className="text-end pe-5"
                          style={HeaderStickyColumnStyles}
                        >
                          Actions
                        </th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {mainLoader ? (
                    <tr>
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
                        className="text-center py-4"
                      >
                        <Spinner />
                      </td>
                    </tr>
                  ) : currentItems?.length > 0 ? (
                    currentItems?.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => onRowClick && onRowClick(item)}
                        style={{ cursor: onRowClick ? "pointer" : "default" }}
                      >
                        {columns?.map((column) => (
                          <td key={`${item.id}-${column.field}`}>
                            {renderCellContent(item, column)}
                          </td>
                        ))}
                        {actions &&
                          (filterData?.edit ||
                            filterData?.delete ||
                            !userRoleData?.permissions?.some(
                              (el) => el.module === currentModule
                            )) && (
                            <td className="pe-5" style={stickyColumnStyles}>
                              <div className="d-flex justify-content-end gap-2">
                                {Object.keys(item).includes(
                                  "isActive"
                                ) ? item?.isActive ? (
                                  <>
                                    {(filterData?.edit ||
                                      !userRoleData?.permissions?.some(
                                        (el) => el.module === currentModule
                                      )) && (
                                      <Button
                                        variant="text-secondary"
                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                        onClick={() => {
                                          if (isShow) {
                                            handleEditData(item);
                                          } else {
                                            setSelectedRecord(item);
                                            setShowForm(true);
                                          }
                                        }}
                                      >
                                        <Pencil />
                                      </Button>
                                    )}

                                    {(filterData?.delete ||
                                      !userRoleData?.permissions?.some(
                                        (el) => el.module === currentModule
                                      )) && (
                                      <Button
                                        variant="text-secondary"
                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                        onClick={() => {
                                          setSelectedId(item._id);
                                          setShowModal(true);
                                        }}
                                      >
                                        <IconTrash />
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <span className="badge bg-danger">
                                    Deleted
                                  </span>
                                ) : (
                                  <>
                                    {(filterData?.edit ||
                                      !userRoleData?.permissions?.some(
                                        (el) => el.module === currentModule
                                      )) && (
                                      <Button
                                        variant="text-secondary"
                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                        onClick={() => {
                                          if (isShow) {
                                            handleEditData(item);
                                          } else {
                                            setSelectedRecord(item);
                                            setShowForm(true);
                                          }
                                        }}
                                      >
                                        <Pencil />
                                      </Button>
                                    )}

                                    {(filterData?.delete ||
                                      !userRoleData?.permissions?.some(
                                        (el) => el.module === currentModule
                                      )) && (
                                      <Button
                                        variant="text-secondary"
                                        className="btn btn-icon btn-text-secondary rounded-pill waves-effect item-edit"
                                        onClick={() => {
                                          setSelectedId(item._id);
                                          setShowModal(true);
                                        }}
                                      >
                                        <IconTrash />
                                      </Button>
                                    )}
                                  </>
                                )}
                                
                              </div>
                            </td>
                          )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
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
                    <th key={column.field} className={column.className || ""}>
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item) => (
                  <tr key={item.id}>
                    {columns?.map((column) => (
                      <td key={`${item.id}-${column.field}`}>
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredData?.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
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
          handleConfirmation={async () => {
            await deleteData(selectedId);
            setShowModal(false);
          }}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default DataTable;

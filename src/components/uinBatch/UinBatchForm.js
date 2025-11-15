import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage, Form, FieldArray } from "formik";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import UinBatchUpdateFormModal from "../../components/uinBatch/UinBatchUpdateFormModal";
import { validationSchema } from "./const";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataById,
  fetchUinGenerationById,
  fetchUinGenerationData,
  insertUinGeneration,
  removeUinGeneration,
  fetchFigIdByVendor,
} from "../../redux/slice/uinGeneration/uinGenerationAsyncThunk";
import { fetchFigurineDropDowns } from "../../redux/slice/figurine/figurineAsyncThunk";
import { fetchVendorDropDowns } from "../../redux/slice/vendor/vendorAsyncThunk";
import { Spinner } from "react-bootstrap";
import { clearError } from "../../redux/slice/uinGeneration/uinGenerationSlice";
import { useNavigate } from "react-router-dom";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconProgressCheck,
  IconProgressX,
} from "@tabler/icons-react";
import ConformModal from "../modal/ConformModal";
import NestedTable from "../table/NestedTable";

const UinBatchForm = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nestedTableRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isApproveId, setIsApproveId] = useState("");
  const [subloading, setSubloading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [filteredFigurines, setFilteredFigurines] = useState([]);
  const [figLoading, setFigLoading] = useState(false);
  const { uinGeneration, mainLoader, loading, deleteLoading, error } =
    useSelector((state) => state.uinGeneration);
  const { vendorData } = useSelector((state) => state.vendors);
  const { figurineData } = useSelector((state) => state.figurines);
  const { uinGenerationDataById } = useSelector((state) => state.uinGeneration);

  const [tableCurrentPage, setTableCurrentPage] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchUinGenerationById(id));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchUinGenerationData());
    dispatch(fetchFigurineDropDowns());
    dispatch(fetchVendorDropDowns());
  }, [dispatch]);

  useEffect(() => {
    if (
      error === "Invalid token" ||
      error === "Access denied. No token provided"
    ) {
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        dispatch(clearError());
        navigate("/login");
      }, 1000);
    }
  }, [error]);

  const roleId = localStorage.getItem("role_id");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // console.log("Submitting values:", values);
      await dispatch(insertUinGeneration(values));

      // Only reset if submission was successful
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const columns = [
    { field: "#", header: "#", width: 70 },
    { field: "vendorName", header: "Vendor name ", searchable: true },
    { field: "figuringName", header: " Figuring name", searchable: true },
    {
      field: "count",
      header: "Generated/Requested",
      searchable: true,
      render: (rowData) => {
        const generated = rowData.generatedCount ?? rowData.generatedCount ?? 0;
        const activated = rowData.activatedCount ?? rowData.activatedCount ?? 0;
        const requested = rowData.requestedCount ?? rowData.requestedCount ?? 0;
        return `${generated + activated} / ${requested}`;
      },
    },
    {
      field: "createdOn",
      header: "Created Date",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
    { field: "available", header: "Available", searchable: true },
  ];
  if (roleId === "680724439263c0366dce867d") {
    columns.push({
      field: "access",
      header: "Access",
      searchable: true,
      render: (rowData) => {
        // Only render icons if NOT approved
        if (rowData.isApprove === true) return null;

        return (
          <>
            <IconProgressCheck
              style={{ color: "green", cursor: "pointer" }}
              className="me-2"
              stroke={2}
              onClick={async (e) => {
                e.stopPropagation(); // Prevent event bubbling
                e.preventDefault(); // Prevent default behavior
                setShowModalConfirm(true);
                setIsApproveId(rowData._id);
              }}
            />

            <IconProgressX
              style={{ color: "red", cursor: "pointer" }}
              stroke={2}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                e.preventDefault(); // Prevent default behavior
                setSelectedId(rowData._id);
                setShowModal(true);
              }}
            />
          </>
        );
      },
    });
  }

  const newCollapseCustomerData = [
    { field: "#", header: "#", width: 10, isIndex: true },
    { field: "UIN", header: "UIN", searchable: true },
    { field: "currentStatus", header: "Status", is: true },
  ];

  const uinData = uinGeneration?.map((uin, index) => {
    const vendor =
      typeof uin.vendorId === "string"
        ? vendorData.find((v) => v.value === uin.vendorId)
        : uin.vendorId;

    const figurine =
      typeof uin.figId === "string"
        ? figurineData.find((f) => f.value === uin.figId)
        : uin.figId;

    // Find detailed data for this UIN
    const detailedData = uinGenerationDataById?.data;
    return {
      "#": index + 1,
      vendorName: vendor
        ? vendor.firstName
          ? `${vendor.firstName} ${vendor.lastName}`
          : vendor.label
        : "-",
      figuringName: figurine ? figurine.name || figurine.label : "-",
      ...uin,
      generatedCount: uin.generatedCount || 0, // Ensure these exist
      requestedCount: uin.requestedCount || 0, // Ensure these exist
      uinDetails: Array.isArray(detailedData?.uinDetails)
        ? detailedData.uinDetails.map((detail, idx) => ({
            "#": idx + 1,
            id: detail._id,
            UIN: detail.UIN || "-",
            currentStatus: detail.currentStatus || "-",
          }))
        : [],
    };
  });

  return (
    <>
      <div className="card mt-5 mt-lg-0 mb-lg-4">
        <h5 className="card-header">UIN Generation</h5>
        <Formik
          initialValues={{
            vendorId: "",
            figures: [
              {
                figId: "",
                count: 5,
                lengthOfCharacter: 9,
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit} // Make sure this is correctly referenced
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, resetForm, errors }) => {
            return (
              <Form onSubmit={handleSubmit} className="card-body">
                <div className="col-md-12 mb-4">
                  <label className="form-label">Vendor</label>
                  <PrimeDropdown
                    name="vendorId"
                    value={values.vendorId}
                    onChange={async (e) => {
                      setFieldValue("vendorId", e.value);
                      setFieldValue("figures", [
                        { figId: "", count: 5, lengthOfCharacter: 9 },
                      ]); // Reset figures when vendor changes

                      if (e.value) {
                        try {
                          const response = await dispatch(
                            fetchFigIdByVendor(e.value)
                          );
                          if (
                            response.payload?.status &&
                            response.payload?.data
                          ) {
                            // Transform the API response to match your dropdown format
                            const figs = response.payload.data.map((fig) => ({
                              value: fig._id, // This will be used as the value
                              label: fig.name, // This will be displayed in the dropdown
                              prefix: fig.prefix, // Store additional data if needed
                            }));
                            setFilteredFigurines(figs);
                          }
                        } catch (error) {
                          console.error(
                            "Error fetching FIGs by vendor:",
                            error
                          );
                          setFilteredFigurines([]);
                        }
                      } else {
                        setFilteredFigurines([]);
                      }
                    }}
                    options={vendorData}
                    optionLabel="label"
                    placeholder="Select Vendor"
                    className="w-100"
                  />
                  <ErrorMessage
                    name="vendorId"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <FieldArray name="figures">
                  {({ push, remove }) => (
                    <>
                      {values.figures.map((batch, index) => (
                        <div className="row g-3 mb-4" key={index}>
                          <div className="col-12 col-md-4">
                            <label className="form-label">FIG</label>
                            <PrimeDropdown
                              name={`figures[${index}].figId`}
                              value={batch.figId}
                              onChange={(e) =>
                                setFieldValue(
                                  `figures[${index}].figId`,
                                  e.value
                                )
                              }
                              options={values.vendorId ? filteredFigurines : []}
                              optionLabel="label"
                              placeholder={
                                values.vendorId
                                  ? "Select FIG"
                                  : "Select Vendor first"
                              }
                              className="w-100"
                              disabled={!values.vendorId || figLoading}
                              loading={figLoading}
                              emptyMessage={
                                figLoading
                                  ? "Loading..."
                                  : values.vendorId
                                  ? "No FIGs available for this vendor"
                                  : "Please select a vendor first"
                              }
                            />
                            <ErrorMessage
                              name={`figures[${index}].figId`}
                              component="div"
                              className="text-danger small"
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <label className="form-label">Count</label>
                            <Field
                              type="number"
                              name={`figures[${index}].count`}
                              className="form-control"
                              placeholder="Enter count"
                            />
                            <ErrorMessage
                              name={`figures[${index}].count`}
                              component="div"
                              className="text-danger small"
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <div className="row">
                              {/* Length of UIN Input */}
                              <div className="col-11 col-md-11">
                                <label className="form-label">
                                  Length of UIN
                                </label>
                                <Field
                                  type="number"
                                  name={`figures[${index}].lengthOfCharacter`}
                                  className="form-control"
                                  placeholder="Enter length"
                                />
                                <ErrorMessage
                                  name={`figures[${index}].lengthOfCharacter`}
                                  component="div"
                                  className="text-danger small"
                                />
                              </div>

                              {/* Action Button Column (Add or Remove) */}
                              <div className="col-1 col-md-1 d-flex align-items-center justify-content-end pt-3">
                                {index === 0 ? (
                                  <button
                                    className="border border-none text-success bg-transparent p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      push({
                                        figId: "",
                                        count: 5,
                                        lengthOfCharacter: 9,
                                      });
                                    }}
                                  >
                                    <IconCirclePlus stroke={2} />
                                  </button>
                                ) : (
                                  <button
                                    className="border border-none text-danger bg-transparent p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      remove(index);
                                    }}
                                  >
                                    <IconCircleMinus stroke={2} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 d-flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary me-sm-3 me-1"
                          disabled={loading}
                        >
                          Submit {loading && <Spinner className="ms-1" />}
                        </button>
                        <button
                          type="button"
                          className="btn btn-label-secondary"
                          onClick={() => resetForm()}
                        >
                          Reset
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </Form>
            );
          }}
        </Formik>
      </div>
      {uinData && (
        <NestedTable
          ref={nestedTableRef}
          columns={columns}
          currentPage={tableCurrentPage}
          onPageChange={setTableCurrentPage}
          collapseColumns={newCollapseCustomerData}
          collapseKey={"uinDetails"}
          data={uinData}
          deleteData={async (id, deleteReason) => {
            await dispatch(removeUinGeneration({ id, deleteReason }));
          }}
          FormComponent={UinBatchUpdateFormModal}
          loading={loading}
          mainLoader={mainLoader}
          deleteLoading={deleteLoading}
          topHide={true}
          actionsDropdown={false}
          currentModule="UIN Generator"
          expandedRows={expandedRows}
          onToggleRow={setExpandedRows}
          infoButtonIcon={true}
          // addButton={false}
        />
      )}
      {/* )} */}

      <ConformModal
        show={showModal}
        title={"Confirm Reject"}
        description={"Are you sure you want to reject UIN?"}
        onHide={() => {
          setShowModal(false);
        }}
        handleConfirmation={async () => {
          console.log("");
        }}
        deleteLoading={deleteLoading}
      />
      <ConformModal
        show={showModalConfirm}
        title={"Confirm Accept"}
        description={"Are you sure you want to Generate UIN?"}
        onHide={() => {
          setShowModalConfirm(false);
        }}
        handleConfirmation={async () => {
          try {
            // 1. First approve/fetch the main record
            const response = await dispatch(
              fetchUinGenerationById(isApproveId)
            );
            console.log("Fetched successfully", response);

            // 2. Then fetch the nested UIN details
            setSubloading(true);
            await dispatch(fetchDataById(isApproveId));
            setSubloading(false);

            // 3. Expand the row to show the nested data
            setExpandedRows([isApproveId]);

            setShowModalConfirm(false);
          } catch (error) {
            console.error("Approval failed:", error);
            setSubloading(false);
            setShowModalConfirm(false);
          }
        }}
        deleteLoading={deleteLoading}
      />
    </>
  );
};

export default UinBatchForm;

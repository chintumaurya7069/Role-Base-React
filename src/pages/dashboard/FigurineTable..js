import React, { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ApproveFiguring,
  fetchFigurine,
  removeFigurine,
} from "../../redux/slice/figurine/figurineAsyncThunk";
import { clearError } from "../../redux/slice/figurine/figurineSlice";
import { IconProgressCheck, IconProgressX } from "@tabler/icons-react";
import ConformModal from "../../components/modal/ConformModal";

const Figurine = () => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [isApproveId, setIsApproveId] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const dispatch = useDispatch();
  const { figurineData, error, loading, mainLoader, deleteLoading } =
    useSelector((state) => state.figurines);
  // console.log("🚀 ~ Figurine ~ figurineData:", figurineData);

  const getApi = async () => {
    const res = await dispatch(fetchFigurine());
  };
  const roleId = localStorage.getItem("role_id");

  useEffect(() => {
    getApi();
  }, []);

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

  const columns = [
    {
      field: "#",
      header: "#",
      searchable: true,
    },
    {
      field: "name",
      header: "Product Name",
      searchable: true,
      className: "text-nowrap",
    },
    {
      field: "ipOwner",
      header: "IP Owner",
      searchable: true,
    },
    {
      field: "EANCode",
      header: "EAN Code",
      searchable: true,
    },
    {
      field: "NFCRefID",
      header: "NFC Reference ID",
      searchable: true,
      className: "text-nowrap",
    },
    {
      field: "genre",
      header: "Genre",
      searchable: true,
    },
    {
      field: "ageGroup",
      header: "Age Group",
      searchable: true,
    },
    {
      field: "SKU",
      header: "SKU",
      searchable: true,
    },
    {
      field: "totalUINs",
      header: " Total UIN",
      searchable: true,
      body: (item) => (
        <span className="d-flex justify-content-center">
          {item.totalUINs || "-"}
        </span>
      ),
    },
    {
      field: "activeUINs",
      header: " Active UIN",
      searchable: true,
      body: (item) => (
        <span className="d-flex justify-content-center">
          {item.activeUINs || "-"}
        </span>
      ),
    },
    {
      field: "label1",
      header: " Label 1",
      searchable: true,
    },
    {
      field: "label2",
      header: " Label 2",
      searchable: true,
    },
    {
      field: "description",
      header: "Description",
      searchable: true,
      body: (item) => (
        <span title={item.description || ""}>
          {item.description && item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </span>
      ),
    },
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
                e.stopPropagation(); 
                e.preventDefault();
                setShowModalConfirm(true);
                setIsApproveId(rowData._id);
              }}
            />

            <IconProgressX
              style={{ color: "red", cursor: "pointer" }}
              stroke={2}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedId(rowData._id);
                setShowModal(true);
              }}
            />
          </>
        );
      },
    });
  }

  const dataArray = Array.isArray(figurineData) ? figurineData : [figurineData];

  const filteredData = dataArray.map((item, index) => ({
    "#": index + 1,
    ...item,
    genre: Array.isArray(item.genre)
      ? item.genre.map((g) => g.name).join(", ")
      : item.genre?.name || item.genre,
    ageGroup: Array.isArray(item.ageGroup)
      ? item.ageGroup.map((a) => a.name).join(", ")
      : item.ageGroup?.name || item.ageGroup,
  }));
  return (
    <div>
      <DataTable
        title="Figurine"
        columns={columns}
        data={filteredData}
        deleteData={async (id) => {
          if (id) {
            await dispatch(removeFigurine(id));
          } else {
            console.log("Delete failed: ID is undefined");
          }
        }}
        isShow={true}
        view={true}
        loading={loading}
        exportButton={true}
        buttons={true}
        mainLoader={mainLoader}
        deleteLoading={deleteLoading}
        addButtonText="Add Figurine"
        currentModule="Figurine"
        isDownload={true}
        onToggleRow={setExpandedRows}
      />
      <ConformModal
        show={showModal}
        title={"Confirm Reject"}
        description={"Are you sure you want to reject Figuring?"}
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
        description={"Are you sure you want to Accept Figuring?"}
        onHide={() => {
          setShowModalConfirm(false);
        }}
        handleConfirmation={async () => {
          try {
            setSubloading(true);
            await dispatch(ApproveFiguring(isApproveId)).unwrap();
            // Refresh the data after approval
            await dispatch(fetchFigurine());
            setShowModalConfirm(false);
          } catch (error) {
            console.error("Approval failed:", error);
          } finally {
            setSubloading(false);
          }
        }}
        deleteLoading={subloading}
      />
    </div>
  );
};

export default Figurine;

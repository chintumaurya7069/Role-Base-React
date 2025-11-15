import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchAgeGroupData, removeAgeGroup } from "../../redux/slice/ageGroup/ageGroupAsyncThunk";
import AgeGroupForm from "../../components/ageGroup/AgeGroupForm";
import { clearError } from "../../redux/slice/ageGroup/ageGroupSlice";


const AgeGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ageGroup, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.ageGroups
  );

  useEffect(() => {
    dispatch(fetchAgeGroupData());
  }, [dispatch]);

  useEffect(() => {
    if (
      error === "Invalid token" ||
      error === "Access denied. No token provided"
    ) {
      toast.error(error);
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        dispatch(clearError());
        navigate("/login");
      }, 1000);
    } else if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      //   const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${amPm}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const columns = [
    {
      field: "#",
      header: "#",
      searchable: true,
    },
    {
      field: "name",
      header: "AgeGroup Name",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Created Date & Time",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];
  const NewAgeGroup = Array.isArray(ageGroup)
    ? ageGroup.map((ageGroup, index) => ({
        "#": index + 1,
        ...ageGroup,
      }))
    : [];

  return (
    <DataTable
      title="AgeGroups"
      columns={columns}
      data={NewAgeGroup || []}
      deleteData={async (id) => {
        try {
          await dispatch(removeAgeGroup(id));
        } catch (error) {
          console.error("Failed to delete ageGroup:", error);
        }
      }}
      FormComponent={AgeGroupForm}
      loading={loading}
      exportButton={true}
      buttons={true}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      addButtonText="Add AgeGroup"
      currentModule="AgeGroup"
    />
  );
};

export default AgeGroup;

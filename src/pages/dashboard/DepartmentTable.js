import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  fetchDepartmentData,
  removeDepartment,
} from "../../redux/slice/department/departmentAsyncThunk";
import DepartmentForm from "../../components/departmentForm/DepartmentForm";
import { clearError } from "../../redux/slice/department/departmentSlice";

const DepartmentTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { department, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.department
  );

  useEffect(() => {
    dispatch(fetchDepartmentData());
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
      header: "Department Name",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Created Date & Time",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];
  const newDepartment = Array.isArray(department)
    ? department.map((department, index) => ({
        "#": index + 1,
        ...department,
      }))
    : [];

  return (
    <DataTable
      title="Departments"
      columns={columns}
      data={newDepartment || []}
      deleteData={async (id) => {
        try {
          await dispatch(removeDepartment(id));
        } catch (error) {
          console.error("Failed to delete department:", error);
        }
      }}
      FormComponent={DepartmentForm}
      loading={loading}
      exportButton={true}
      buttons={true}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      addButtonText="Add Department"
      currentModule="Department"
    />
  );
};

export default DepartmentTable;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import { clearError } from "../../redux/slice/roles/roleSlice";
import { useNavigate } from "react-router-dom";
import RoleForm from "../../components/roleForm/RoleForm";
import {
  fetchRoleData,
  removeRole,
} from "../../redux/slice/roles/roleAsyncThunk";

const RoleTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.roles
  );

  useEffect(() => {
    dispatch(fetchRoleData());
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      //   const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${ampm}`;
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
      header: "Role Name",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Created Date & Time",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];
  const newrole = Array.isArray(role)
    ? role.map((role, index) => ({
        "#": index + 1,
        ...role,
      }))
    : [];

  return (
    <DataTable
      title="Roles"
      columns={columns}
      data={newrole || []}
      deleteData={(id) => dispatch(removeRole(id))}
      FormComponent={RoleForm}
      loading={loading}
      exportButton={true}
      buttons={true}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      addButtonText="Add Role"
      currentModule="Role"
    />
  );
};

export default RoleTable;

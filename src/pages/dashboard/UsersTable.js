import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, removeUser } from "../../redux/slice/user/userAsyncThunk";
import { Badge } from "react-bootstrap";
import DataTable from "../../components/table/DataTable";
import UserForm from "../../components/userForm/UserForm";
import { useNavigate } from "react-router-dom";
import { clearError } from "../../redux/slice/user/userSlice";
import { department } from "../../components/userForm/const";

const UsersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUser());
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
      field: "firstName",
      header: "First Name",
      searchable: true,
    },
    {
      field: "lastName",
      header: "Last Name",
      searchable: true,
    },
    {
      field: "email",
      header: "Email",
      searchable: true,
    },
    {
      field: "number",
      header: "Phone",
      searchable: true,
    },
    {
      field: "role.name",
      header: "Role",
      render: (item) => {
        switch (item?.role?.name) {
          case "Admin":
            return <Badge bg="primary">Admin</Badge>;
          case "Manager":
            return <Badge bg="warning">Manager</Badge>;
          default:
            return <Badge bg="secondary">{item?.role?.name}</Badge>;
        }
      },
    },
    {
      field: "department",
      header: "Department",
      render: (item) => <Badge bg="secondary">{item?.department?.name}</Badge>,
    },
  ];

  const newUserData = userData.map((user, index) => ({
    "#": index + 1,
    department,
    ...user,
  }));

  return (
    <DataTable
      title="Users"
      columns={columns}
      data={newUserData}
      deleteData={async (id) => {
        await dispatch(removeUser(id));
      }}
      FormComponent={UserForm}
      loading={loading}
      mainLoader={mainLoader}
      exportButton={true}
      buttons={true}
      deleteLoading={deleteLoading}
      addButtonText="Add User"
      currentModule="User"
      // rowActions={rowActions}
    />
  );
};

export default UsersTable;

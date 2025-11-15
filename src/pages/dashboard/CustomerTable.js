import React, { useEffect, useState } from "react";
import CustomerForm from "../../components/customerForm/CustomerForm";
import NestedTable from "../../components/table/NestedTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomer,
  removeCustomer,
} from "../../redux/slice/customer/customerAsyncThunk";
import { useNavigate } from "react-router-dom";
import { clearError } from "../../redux/slice/customer/customerSlice";

const CustomerTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tableCurrentPage, setTableCurrentPage] = useState(1);

  const { customerData, error, loading, mainLoader, deleteLoading } =
    useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomer());
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
      }, [1000]);
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
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      //   const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year}`;
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
      field: "gender",
      header: "Gender",
      searchable: true,
    },
    {
      field: "email",
      header: "Email",
      searchable: true,
    },
    {
      field: "phoneNo",
      header: "Phone Number",
      searchable: true,
    },
    {
      field: "noOfFigurine",
      header: "No. of Figurine",
      searchable: true,
      body: (rowData) => (
        <span>
          {Array.isArray(rowData.figuringdata)
            ? rowData.figuringdata.length
            : 0}
        </span>
      ),
    },
    {
      field: "country",
      header: "Country",
      searchable: true,
    },
    {
      field: "state",
      header: "State",
      searchable: true,
    },
    {
      field: "city",
      header: "City",
      searchable: true,
    },
    {
      field: "ageGroup",
      header: "Age Group",
      searchable: true,
    },
    {
      field: "genre",
      header: "Genre",
      searchable: true,
    },
  ];

  const collapseColumns = [
    {
      field: "#",
      header: "#",
      isIndex: true,
    },
    {
      field: "figName",
      header: "Fig Name",
      searchable: true,
    },
    {
      field: "uin",
      header: "UIN ID",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Date",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];

  const newCustomerData = customerData.map((item, index) => {
    const figuringData =
      Array.isArray(item?.figuringdata) && item.figuringdata.length > 0
        ? item.figuringdata[0]
        : {};

    return {
      "#": index + 1,
      ...item,
      genre:
        Array.isArray(figuringData.figGenre) && figuringData.figGenre.length > 0
          ? figuringData.figGenre.map((item) => item.name).join(", ")
          : "No Genre Available",

      ageGroup:
        Array.isArray(figuringData.figAgeGroup) &&
        figuringData.figAgeGroup.length > 0
          ? figuringData.figAgeGroup.map((item) => item.name).join(", ")
          : "No Group Available",
    };
  });

  return (
    <NestedTable
      title="Customer"
      columns={columns}
      data={newCustomerData}
      currentPage={tableCurrentPage}
      onPageChange={setTableCurrentPage}
      collapseColumns={collapseColumns}
      addButton={true}
      canEdit={true}
      exportButton={true}
      buttons={true}
      searchable={true}
      deleteData={async (id) => {
        await dispatch(removeCustomer(id));
      }}
      FormComponent={CustomerForm}
      loading={loading}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      topHide={false}
      addButtonText="Add Customer"
      currentModule="Customers"
      collapseKey={"figuringdata"}
    />
  );
};

export default CustomerTable;
//At from here i make changes

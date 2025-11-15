import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import {
  fetchVendor,
  removeVendor,
} from "../../redux/slice/vendor/vendorAsyncThunk";
import VendorForm from "../../components/vendorForm/VendorForm";
import { clearError } from "../../redux/slice/vendor/vendorSlice";
import { useNavigate } from "react-router-dom";

const VendorTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorData, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.vendors
  );

  useEffect(() => {
    dispatch(fetchVendor());
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
      }, [1000]);
    }
  }, [error]);

  const columns = [
    {
      field: "#",
      header: "#",
      searchable: true,
    },
    {
      field: "companyName",
      header: "Company Name",
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
      field: "location",
      header: "Location",
      searchable: true,
    },
  ];

  const newVendorData = vendorData.map((vendor, index) => ({
    "#": index + 1,
    ...vendor,
  }));

  return (
    <DataTable
      title="Vendors"
      columns={columns}
      data={newVendorData}
      deleteData={async (id) => await dispatch(removeVendor(id))}
      FormComponent={VendorForm}
      loading={loading}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      exportButton={true}
      buttons={true}
      addButtonText="Add Vendor"
      currentModule="Vendor"
    />
  );
};

export default VendorTable;

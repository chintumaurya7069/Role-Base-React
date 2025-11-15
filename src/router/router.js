import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/authentication/login/Login.js";
import AdminLayout from "./Adminlayout.js";
import UsersTable from "../pages/dashboard/UsersTable.js";
import VendorTable from "../pages/dashboard/VendorTable.js";
import CustomerTable from "../pages/dashboard/CustomerTable.js";
import RoleTable from "../pages/dashboard/RoleTable.js";
import UinBatch from "../pages/dashboard/UinBatch.js";
import UinBatchForm from "../components/uinBatch/UinBatchForm.js";
import DepartmentTable from "../pages/dashboard/DepartmentTable.js";
import FigurineForm from "../components/figurineForm/FigurineForm.js";
import Figurine from "../pages/dashboard/FigurineTable..js";
import Dashboard from "../pages/dashboard/Dashboard.js";
import Report from "../pages/dashboard/Report.js";
import Genre from "../pages/dashboard/Genre.js";
import AgeGroup from "../pages/dashboard/AgeGroup.js";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "user",
        element: <UsersTable />,
      },
      {
        path: "vendor",
        element: <VendorTable />,
      },
      {
        path: "customer-insights",
        element: <Report />,
      },
      {
        path: "setting",
        element: <Outlet />,
        children: [
          {
            path: "role",
            element: <RoleTable />,
          },
          {
            path: "department",
            element: <DepartmentTable />,
          },
          {
            path: "genre",
            element: <Genre />,
          },
          {
            path: "ageGroup",
            element: <AgeGroup />,
          },
        ],
      },
      {
        path: "Figurine",
        children: [
          {
            path: "",
            element: <Figurine />,
          },
          {
            path: "form",
            element: <FigurineForm />,
          },
          {
            path: "form/:id",
            element: <FigurineForm />,
          },
        ],
      },
      {
        path: "uinGenerator",
        children: [
          {
            path: "",
            element: <UinBatch />,
          },
          {
            path: "form",
            element: <UinBatchForm />,
          },
        ],
      },
      {
        path: "customers",
        element: <CustomerTable />,
      },
      // {
      //   path: "uinGeneration",
      //   element: <UinBatch />,
      // },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

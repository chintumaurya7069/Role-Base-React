// src/hoc/withAuth.js
import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = localStorage.getItem("auth_token");

    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };
};

export default withAuth;

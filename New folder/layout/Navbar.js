import React from "react";
import { NavLink } from "react-router-dom";
import SvgLogo from "./SvgLogo";

const Navbar = ({ setToggle }) => {
  return (
    <div
      className="d-xl-none layout-navbar container-fuild navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <NavLink to={"/"} className="app-brand-link text-black">
        <span className="app-brand-logo demo">
          <SvgLogo />
        </span>
      </NavLink>
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none ">
        <div
          onClick={() => setToggle(true)}
          className="nav-item nav-link px-0 me-xl-4"
        >
          <i className="ti ti-menu-2 ti-sm" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

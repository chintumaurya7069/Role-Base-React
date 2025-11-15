import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidemenu from "../../layout/Sidemenu";

const Setting = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [isHovered, setIsHovered] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const authToken = localStorage.getItem("auth_token");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, []);

  return (
    <div
      className={`light-style layout-navbar-fixed layout-compact layout-menu-fixed ${
        toggle && "layout-menu-expanded"
      } ${isFixed && "layout-menu-collapsed"} ${
        isFixed && isHovered && "layout-menu-hover"
      }`}
    >
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container justify-content-center">
          <Sidemenu
            setToggle={setToggle}
            setIsHovered={setIsHovered}
            setIsFixed={setIsFixed}
          />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-fluid flex-grow-1 container-p-y ">
                <Outlet />
              </div>
            </div>
            {/* <Navbar setToggle={setToggle} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;

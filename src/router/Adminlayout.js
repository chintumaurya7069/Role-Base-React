import React, { useEffect, useState } from "react";
import Sidemenu from "../layout/Sidemenu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import withAuth from "../middleware/withAuth";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { fetchRefreshApi } from "../redux/slice/refreshAPi/refreshApiAsyncThunk";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { userRoleData, loading } = useSelector((state) => state.userRole);
  const roleId = localStorage.getItem("role_id");
  const [toggle, setToggle] = useState(true);
  const [isHovered, setIsHovered] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const authToken = localStorage.getItem("auth_token");

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); // Bootstrap's lg breakpoint
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Permission check
  useEffect(() => {
    if (!userRoleData?.permissions) return;
    const normalizedPath = pathname.toLowerCase().replace(/[^a-z]/g, "");
    const matchedPermission = userRoleData.permissions.find((permission) => {
      const normalizedModule = permission.module
        ?.toLowerCase()
        ?.replace(/[^a-z]/g, "");
      return normalizedPath.includes(normalizedModule);
    });
    if (!matchedPermission || matchedPermission.view !== true) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [pathname, userRoleData, navigate]);

  // Auth check
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      dispatch(fetchRefreshApi(roleId));
    }
  }, [authToken, dispatch, navigate, roleId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );
  }

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
            userRoleData={userRoleData}
          />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-fluid flex-grow-1 container-p-y">
                {/* Mobile Toggle Button inside content */}
                <div className="px-0">
                  {isMobile && !toggle && (
                    <div
                      className="d-lg-none mb-3"
                      onClick={() => setToggle(true)}
                      style={{
                        position: "fixed",
                        zIndex: 1001,
                        top: "15px",
                        left: "15px",
                        right: "15px",
                        width: "auto",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "inline-block",
                        backgroundColor: "white",
                        padding: 5,
                        borderRadius: "4px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <i
                        className="ti ti-align-justified"
                        style={{ fontSize: "1.5rem" }}
                      />
                    </div>
                  )}
                </div>

                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminLayout);

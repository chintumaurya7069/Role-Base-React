import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SvgLogo from "./SvgLogo";
import { routes } from "./routes";

const Sidemenu = ({ setToggle, setIsHovered, setIsFixed, userRoleData }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isRouteActive = (route) => {
    if (pathname?.includes(route.path)) return true;
    if (route.children) {
      return route.children.some((child) => pathname?.includes(child.path));
    }
    return false;
  };

  const handleDropdownToggle = (index, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Function to check if user has permission for a route
  const hasPermission = (route) => {
    if (!userRoleData?.permissions) return false;

    // If route has a permissionKey, check if it exists in user's permissions
    if (route.permissionKey) {
      return userRoleData.permissions.some(
        (perm) => perm.module === route.permissionKey && perm.view === true
      );
    }

    // Default to showing the route if no permissionKey is specified
    return true;
  };

  // Filter routes based on permissions
  const filteredRoutes = routes.filter((route) => {
    // If route has children, check if any child is allowed
    if (route.children) {
      const filteredChildren = route.children.filter(hasPermission);
      return filteredChildren.length > 0;
    }
    return hasPermission(route);
  });

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      <div className="app-brand demo">
        <NavLink to={"/admin/client"} className="app-brand-link">
          {/* <span className="app-brand-logo demo">
            <SvgLogo />
          </span> */}
        </NavLink>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsFixed((prev) => !prev);
          }}
          className="layout-menu-toggle menu-link text-large ms-auto"
        >
          <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle" />
          <i
            className="ti ti-x d-block d-xl-none ti-sm align-middle"
            onClick={(e) => {
              e.stopPropagation();
              setToggle(false);
            }}
          />
        </div>
      </div>
      <div className="menu-inner-shadow" />
      <ul className="menu-inner py-1 overflow-hidden">
        {filteredRoutes?.map((item, i) => {
          if (item.type === "dropdown") {
            // Filter dropdown children as well
            const filteredChildren = item.children?.filter(hasPermission);

            if (filteredChildren?.length === 0) return null;

            return (
              <li
                key={i}
                className={`menu-item menu-dropdown ${
                  isRouteActive(item) ? "active" : ""
                } ${openDropdown === i ? "open" : ""}`}
              >
                <div
                  className="menu-link menu-toggle cursor-pointer"
                  onClick={(e) => handleDropdownToggle(i, e)}
                >
                  <i className={`menu-icon tf-icons ti ${item.icon}`} />
                  <div data-i18n={item.name}>{item.name}</div>
                </div>
                <ul
                  className="menu-sub ps-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredChildren?.map((child, j) => (
                    <li
                      key={j}
                      className={`menu-item ${
                        pathname?.includes(child.path) ? "active" : ""
                      }`}
                    >
                      <NavLink
                        to={child.path}
                        className="menu-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToggle(false);
                        }}
                      >
                        <i className={`menu-icon tf-icons ti ${child.icon}`} />
                        <div data-i18n={child.name}>{child.name}</div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li
              key={i}
              className={`menu-item ${
                pathname?.includes(item.path) ? "active" : ""
              }`}
            >
              <NavLink
                to={item.path}
                className="menu-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setToggle(false);
                  setOpenDropdown(null);
                }}
              >
                <i className={`menu-icon tf-icons ti ${item.icon}`} />
                <div data-i18n={item.name}>{item.name}</div>
              </NavLink>
            </li>
          );
        })}
        <li className="menu-item mt-auto">
          <NavLink
            onClick={(e) => {
              e.stopPropagation();
              localStorage.clear();
              setToggle(false);
              navigate("/login");
            }}
            className="menu-link"
          >
            <i className="menu-icon ti ti-logout"></i>
            <div data-i18n="Calendar">Logout</div>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidemenu;

export const routes = [
  {
    icon: "ti-chart-histogram",
    name: "Dashboard",
    path: "/admin/dashboard",
    permissionKey: "Dashboard",
  },
  {
    icon: "ti-user",
    name: "Users",
    path: "/admin/user",
    permissionKey: "User",
  },
  {
    icon: "ti ti-users",
    name: "Vendors",
    path: "/admin/vendor",
    permissionKey: "Vendor",
  },
  {
    icon: "ti ti-users-group",
    name: "Customers",
    path: "/admin/customers",
    permissionKey: "Customers",
  },
  // { icon: "ti ti-playlist", name: "Figurine", path: "/admin/playlist" },
  {
    icon: "ti ti-playlist",
    name: "Figurine",
    path: "/admin/Figurine",
    permissionKey: "Figurine",
  },
  {
    icon: "ti ti-brand-mailgun",
    name: "UIN Generator",
    path: "/admin/uinGenerator",
    permissionKey: "UIN Generator",
  },
  {
    icon: "ti ti-report-search",
    name: "Customer Insights",
    path: "/admin/customer-insights",
    permissionKey: "Customer Insights",
  },
  {
    icon: "ti ti-settings",
    name: "Settings",
    type: "dropdown",
    children: [
      {
        icon: "ti ti-users",
        name: "Roles",
        path: "/admin/setting/role",
        permissionKey: "Role",
      },
      {
        icon: "ti ti-building-skyscraper",
        name: "Department",
        path: "/admin/setting/department",
        permissionKey: "Department",
      },
      {
        icon: "ti ti-packages",
        name: "Genre",
        path: "/admin/setting/genre",
        permissionKey: "Genre",
      },
      {
        icon: "ti ti-category",
        name: "AgeGroup",
        path: "/admin/setting/ageGroup",
        permissionKey: "AgeGroup",
      },
    ],
  },
];

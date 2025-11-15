// import { IconDotsVertical } from "@tabler/icons-react";
// import { Card, Table, Badge, Dropdown } from "react-bootstrap";
// const transactions = [
//   {
//     cardType: "VISA",
//     logo: (
//       <img
//         style={{ width: 80 }}
//         className="me-4"
//         src={require("../../assets/img/icons/payments/visa-img.png")}
//         alt="American Express"
//       />
//     ),
//     lastDigits: "4230",
//     method: "Credit",
//     date: "17 Mar 2022",
//     status: "Verified",
//     trend: "+$1,678",
//   },
//   {
//     cardType: "MasterCard",
//     logo: (
//       <img
//         style={{ width: 80 }}
//         className="me-4"
//         src={require("../../assets/img/icons/payments/master-card-img.png")}
//         alt="American Express"
//       />
//     ),
//     lastDigits: "5578",
//     method: "Credit",
//     date: "12 Feb 2022",
//     status: "Rejected",
//     trend: "-$839",
//   },
//   {
//     cardType: "American Express",
//     logo: (
//       <img
//         style={{ width: 80 }}
//         className="me-4"
//         src={require("../../assets/img/icons/payments/american-express-img.png")}
//         alt="American Express"
//       />
//     ),
//     lastDigits: "4567",
//     method: "ATM",
//     date: "28 Feb 2022",
//     status: "Verified",
//     trend: "+$435",
//   },
//   {
//     cardType: "VISA",
//     logo: (
//       <img
//         style={{ width: 80 }}
//         className="me-4"
//         src={require("../../assets/img/icons/payments/visa-img.png")}
//         alt="American Express"
//       />
//     ),
//     lastDigits: "5699",
//     method: "Credit",
//     date: "8 Jan 2022",
//     status: "Pending",
//     trend: "+$2,345",
//   },
//   {
//     cardType: "VISA",
//     logo: (
//       <img
//         className="me-4"
//         style={{ width: 80 }}
//         src={require("../../assets/img/icons/payments/visa-img.png")}
//         alt="American Express"
//       />
//     ),
//     lastDigits: "5699",
//     method: "Credit",
//     date: "8 Jan 2022",
//     status: "Rejected",
//     trend: "-$234",
//   },
// ];

// const getStatusVariant = (status) => {
//   switch (status) {
//     case "Verified":
//       return "label-success";
//     case "Rejected":
//       return "label-danger";
//     case "Pending":
//       return "label-secondary";
//     default:
//       return "light";
//   }
// };

// const LastTransactionTable = () => {
//   return (
//     <Card className="shadow-sm border-0 mt-4">
//       <Card.Body className="p-0">
//         <Card.Title className="d-flex justify-content-between m-3">
//           <h5 className="m-0" style={{ lineHeight: "1.5rem" }}>
//             Last Transaction
//           </h5>
//           <div>
//             <Dropdown>
//               <Dropdown.Toggle
//                 variant="text-secondary"
//                 className="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow"
//               >
//                 <IconDotsVertical />
//               </Dropdown.Toggle>
//               <Dropdown.Menu className="dropdown-menu-end m-0 me-2">
//                 {["Download", "Refresh", "Share"].map((item) => {
//                   return (
//                     <Dropdown.Item
//                       className={`dropdown-item `}
//                       onClick={() => {}}
//                     >
//                       {item}
//                     </Dropdown.Item>
//                   );
//                 })}
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         </Card.Title>
//         <Table
//           responsive
//           hover
//           className="align-middle table table-borderless border-top"
//         >
//           <thead className="border-bottom">
//             <tr>
//               <th>CARD</th>
//               <th>DATE</th>
//               <th>STATUS</th>
//               <th>TREND</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((tx, idx) => (
//               <tr key={idx} className="">
//                 <td className="">
//                   <div className="d-flex align-items-center">
//                     {tx.logo}
//                     <div>
//                       <div>*{tx.lastDigits}</div>
//                       <small className="text-muted">{tx.method}</small>
//                     </div>
//                   </div>
//                 </td>
//                 <td>
//                   <div>Sent</div>
//                   <small className="text-muted">{tx.date}</small>
//                 </td>
//                 <td>
//                   <Badge bg={getStatusVariant(tx.status)}>{tx.status}</Badge>
//                 </td>
//                 <td>{tx.trend}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card.Body>
//     </Card>
//   );
// };

// export default LastTransactionTable;

import React, { useEffect } from "react";
import NestedTable from "../table/NestedTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopCustomer } from "../../redux/slice/dashboard/dashboardAsyncThunk";

const TopCustomers = () => {
  const dispatch = useDispatch();

  const { dashboardTopCustomers, loading, mainLoader, deleteLoading } =
    useSelector((state) => state.dashboards);

  useEffect(() => {
    dispatch(fetchTopCustomer());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

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
      field: "location",
      header: "Location",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Date",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];

  const newDashboardTopCustomers = dashboardTopCustomers.map((item, index) => {
    const figuringData =
      Array.isArray(item?.figuringdata) && item.figuringdata.length > 0
        ? item.figuringdata[0]
        : {};

    return {
      "#": index + 1,
      ...item,
      genre:
        Array.isArray(figuringData.figGenre) && figuringData.figGenre.length > 0
          ? figuringData.figGenre.join(", ")
          : figuringData.figGenre || "No Genre Available",
      ageGroup:
        Array.isArray(figuringData.figAgeGroup) &&
        figuringData.figAgeGroup.length > 0
          ? figuringData.figAgeGroup.join(", ")
          : figuringData.figAgeGroup || "No Group Available",
    };
  });

  return (
    <div className="mt-4">
      <NestedTable
        title="Top Customer"
        columns={columns}
        data={newDashboardTopCustomers}
        collapseColumns={collapseColumns}
        addButton={false}
        searchable={false}
        actions={false} // 👈 Hide Edit/Delete in Parent Row
        hideNestedActions={true} // 👈 Hide Edit/Delete in Nested Rows
        loading={loading}
        mainLoader={mainLoader}
        deleteLoading={deleteLoading}
        topHide={false}
        currentModule="Dashboard"
        collapseKey={"figuringdata"}
        hidePagination={true}
      />
    </div>
  );
};

export default TopCustomers;

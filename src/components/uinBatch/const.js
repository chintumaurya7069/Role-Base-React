import * as Yup from "yup";

export const newColumns = [
  {
    field: "vendorId",
    header: "Vendor ID",
    searchable: true,
    className: "text-nowrap",
  },
  {
    field: "figId",
    header: "FIG ID",
    searchable: true,
  },
  {
    field: "count",
    header: "Count",
    searchable: true,
  },
  {
    field: "uinLength",
    header: "Length of UIN",
    searchable: true,
  },
];

export const newInnerColumns = [
  { field: "#", header: "#", width: 70 },
  { field: "UIN", header: "UIN", searchable: true },
  { field: "status", header: "Status", searchable: true },
];

// Formik validation schema
export const validationSchema = Yup.object().shape({
  vendorId: Yup.string().required("Vendor is required"),
  figures: Yup.array()
    .of(
      Yup.object().shape({
        figId: Yup.string().required("FIG is required"),
        count: Yup.number()
          .required("Count is required")
          .min(1, "Count must be at least 1"),
        lengthOfCharacter: Yup.number()
          .required("Length is required")
          .min(1, "Length must be at least 1"),
      })
    )
    .min(1, "At least one batch is required"),
});

export const status = [
  { id: "65f12345abcde6789f345678", currentStatus: "Activated" },
  { id: "65f12345abcde6789f345679", currentStatus: "Available" },
  { id: "65f12345abcde6789f345680", currentStatus: "Defect" },
  { id: "65f12345abcde6789f345681", currentStatus: "Consumer Complaint" },
  { id: "65f12345abcde6789f345682", currentStatus: "Duplicate" },
  { id: "65f12345abcde6789f345682", currentStatus: "Generated" },

];

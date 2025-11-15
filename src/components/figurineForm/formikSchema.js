import * as Yup from "yup";

export const initialValues = {
  name: "",
  ipOwn: "",
  ipOwner: "",
  EANCode: "",
  ipDuration: null,
  genre: "",
  ageGroup: "",
  NFCRefID: "",
  figurineDescriptiveTagging: "",
  SKU: "",
  prefix: "",
  media: "",
  tracks: "",
  description: "",
  playlist: [
    {
      sampleAudio: null, // Initialize as null
      folderName: "",
      noOfTracks: 1,
      DefaultVersion: 1,
      audioFileUrl: "",
      audioFiles: [{ id: Date.now(), file: null, url: "" }],
    },
  ],
};

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  ipOwn: Yup.string().required("IP Own is required"),
  ipOwner: Yup.string().required("IP Owner is required"),
  prefix: Yup.string().required("Prefix is required"),
  ipDuration: Yup.array()
    .of(Yup.date().required("Start and end dates are required"))
    .length(2, "Must have exactly 2 dates (start and end)")
    .required("IP Duration is required"),

  // genre: Yup.array()
  //   .min(1, "Please select at least one genre")
  //   .required("Genre is required"),

  // ageGroup: Yup.array()
  //   .min(1, "Please select at least one age group")
  //   .required("Age group is required"),

  SKU: Yup.string().required("SKU Code is required"),
  // description: Yup.string().required("Description is required"),
  // playlist: Yup.array().of(
  //   Yup.object().shape({
  //     folderName: Yup.string().required("Folder Name is Required"),
  //     sampleAudio: Yup.string().required("Sample audio is required"),
  //     DefaultVersion: Yup.string().required("Required"),
  //     noOfTracks: Yup.number().required("Required").positive().integer(),
  //     audioFiles: Yup.array()
  //       .min(1, "At least one audio file is required")
  //       .test(
  //         "file-or-url",
  //         "Audio file is required (either upload or provide URL)",
  //         (value) => {
  //           if (!value || value.length === 0) return false;
  //           return value.some((fileObj) => fileObj?.file || fileObj?.fileUrl);
  //         }
  //       ),
  //   })
  // ),
});

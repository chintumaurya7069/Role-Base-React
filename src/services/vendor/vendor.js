import toast from "react-hot-toast";
import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";

export const getVendorDropDown = async () => {
  try {
    const data = await axiosInstanceAuth.get("/vendor/all");

    return data;
  } catch (error) {
    return error.response;
  }
};

export const getVendor = async (body) => {
  try {
    const response = await axiosInstanceAuth.get("/vendor/all", body);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};
export const AddVendor = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/vendor/add", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateVendor = async (body) => {
  try {
    const response = await axiosInstanceAuth.put(`/vendor/${body.id}`, body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const deleteVendor = async (vendorId) => {
  try {
    const response = await axiosInstanceAuth.delete(`/vendor/${vendorId}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

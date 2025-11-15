import toast from "react-hot-toast";
import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";


export const addReport = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/reports/filter-reports", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getLocation = async (body) => {
  try {
    const response = await axiosInstanceAuth.get("/reports/locations", body);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const filterReport = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/reports/filter", body);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
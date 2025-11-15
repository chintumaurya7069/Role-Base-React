//services
import toast from "react-hot-toast";
import axiosInstanceAuthFormData from "../../apiInstances/axiosInstanceAuthFormData";


export const getMonthWiseUIN = async (figId = "") => {
  try {
    const url = figId 
      ? `/dashboard/figurine-stats?figId=${figId}`
      : "/dashboard/figurine-stats";
    const response = await axiosInstanceAuthFormData.get(url);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const getTopCustomer = async (body) => {
  try {
    const response = await axiosInstanceAuthFormData.get(
      "/dashboard/top-customer",
      body
    );
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};
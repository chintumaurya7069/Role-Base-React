import toast from "react-hot-toast";
import axiosInstanceAuthFormData from "../../apiInstances/axiosInstanceAuthFormData";


export const getRefreshApi = async (id) => {
  try {
    const response = await axiosInstanceAuthFormData.get(`role/${id}`);
    return response.data;
    
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

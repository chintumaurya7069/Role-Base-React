import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";
import toast from "react-hot-toast";

export const getUinGenerationDetails = async (id) => {
  try {
    const data = await axiosInstanceAuth.get(`customer/uin-details/${id}`);
    return data;
  } catch (error) {
    return error.response;
  }
};

export const getUinGenerationData = async () => {
  try {
    const response = await axiosInstanceAuth.get("/uin/all");

    return response?.data;
  } catch (error) {
    return error.response;
  }
};
export const getUinGenerationById = async (id) => {
  try {
    const data = await axiosInstanceAuth.post(`/uin/generated-uin/${id}`);
    return data;
  } catch (error) {
    return error.response;
  }
};

export const getUinDataById = async (id) => {
  try {
    const data = await axiosInstanceAuth.get(`/uin/${id}`);
    return data;
  } catch (error) {
    return error.response;
  }
};

export const AddUinGeneration = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/uin/request-uin", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateUinGeneration = async (mainId, subId, body) => {
  try {
    const response = await axiosInstanceAuth.put(
      `/uin/update-status/${mainId}/${subId}`,
      body
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const deleteUinGeneration = async (UinGenerationId, deleteReason) => {
  try {
    const response = await axiosInstanceAuth.delete(`/uin/${UinGenerationId}`, {
      data: {
        deleteReason: deleteReason.trim(), // Trim whitespace from reason
      },
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const filterFig = async (id) => {
  try {
    const data = await axiosInstanceAuth.get(`/uin/vendors/${id}`);
    return data;
  } catch (error) {
    return error.response;
  }
};

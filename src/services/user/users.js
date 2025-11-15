import toast from "react-hot-toast";
import axiosInstanceAuthFormData from "../../apiInstances/axiosInstanceAuthFormData";
import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";

export const AddUser = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/users/add", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getUser = async (body) => {
  try {
    const response = await axiosInstanceAuthFormData.get("/users/all", body);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};
export const updateUser = async (body) => {
  try {
    const response = await axiosInstanceAuthFormData.put(
      `/users/${body.id}`,
      body
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstanceAuth.delete(`/users/${userId}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

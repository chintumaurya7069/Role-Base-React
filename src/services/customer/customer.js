import toast from "react-hot-toast";
import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";

export const getCustomerDropDown = async (id) => {
  try {
    const response = await axiosInstanceAuth.get(`/customer/uin-details/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const getByIdCustomer = async (id) => {
  try {
    const response = await axiosInstanceAuth.get(`/customer/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const getCustomer = async () => {
  try {
    const response = await axiosInstanceAuth.get("/customer/all");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const AddCustomer = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/customer/add", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateCustomer = async (body) => {
  try {
    const response = await axiosInstanceAuth.put(`/customer/${body._id}`, body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await axiosInstanceAuth.delete(`/customer/${customerId}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

import axios from "axios";
import axiosInstance from "../../apiInstances/axiosInstance";
import axiosInstanceAuth from '../../apiInstances/axiosInstanceAuth';
import toast from "react-hot-toast";

export const getDepartments = async () => {
  try {
    const data = await axiosInstanceAuth.get("/department/all");

    return data;
  } catch (error) {
    return error.response;
  }
};

  export const getDepartmentData = async () => {
    try {
      const response = await axiosInstanceAuth.get("/department/all");

      return response?.data;
    } catch (error) {
      return error.response;
    }
  };

  export const AddDepartment = async (body) => {
    try {
      const response = await axiosInstanceAuth.post("/department/add", body);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  };

  export const updateDepartment = async (body) => {
    try {
      const response = await axiosInstanceAuth.put(
        `/department/${body.id}`,
        body
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

  export const deleteDepartment = async (departmentId) => {
    try {
      const response = await axiosInstanceAuth.delete(
        `/department/${departmentId}`
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

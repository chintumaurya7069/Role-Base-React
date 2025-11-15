import axios from "axios";
import axiosInstance from "../../apiInstances/axiosInstance";
import axiosInstanceAuth from '../../apiInstances/axiosInstanceAuth';
import toast from "react-hot-toast";

export const getRoles = async () => {
    try {
      const data = await axiosInstanceAuth.get(
        '/role/all'
      );
  
      return data;
    } catch (error) {
      return error.response;
    }
  };

  export const getRoleData = async () => {
    try {
      const response = await axiosInstanceAuth.get("/role/all");

      return response?.data;
    } catch (error) {
      return error.response;
    }
  };

  export const AddRole = async (body) => {
    try {
      const response = await axiosInstanceAuth.post("/role/add", body);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  };

  export const updateRole = async (body) => {
    try {
      const response = await axiosInstanceAuth.put(`/role/${body.id}`, body);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

  export const deleteRole = async (roleId) => {
    try {
      const response = await axiosInstanceAuth.delete(`/role/${roleId}`);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

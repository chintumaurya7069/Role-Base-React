import axiosInstanceAuth from '../../apiInstances/axiosInstanceAuth';
import toast from "react-hot-toast";

export const getAgeGroup = async () => {
  try {
    const data = await axiosInstanceAuth.get("/agegroup/all");

    return data;
  } catch (error) {
    return error.response;
  }
};

  export const getAgeGroupData = async () => {
    try {
      const response = await axiosInstanceAuth.get("/agegroup/all");

      return response?.data;
    } catch (error) {
      return error.response;
    }
  };

  export const addAgeGroup = async (body) => {
    try {
      const response = await axiosInstanceAuth.post("/agegroup/add", body);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  };

  export const updateAgeGroup = async (body) => {
    try {
      const response = await axiosInstanceAuth.put(
        `/agegroup/${body.id}`,
        body
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

  export const DeleteAgeGroup = async (ageGroupId) => {
    try {
      const response = await axiosInstanceAuth.delete(
        `/agegroup/${ageGroupId}`
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

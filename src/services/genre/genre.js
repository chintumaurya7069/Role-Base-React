import axiosInstanceAuth from '../../apiInstances/axiosInstanceAuth';
import toast from "react-hot-toast";

export const getGenre = async () => {
  try {
    const data = await axiosInstanceAuth.get("/genre/all");

    return data;
  } catch (error) {
    return error.response;
  }
};

  export const getGenreData = async () => {
    try {
      const response = await axiosInstanceAuth.get("/genre/all");

      return response?.data;
    } catch (error) {
      return error.response;
    }
  };

  export const addGenre = async (body) => {
    try {
      const response = await axiosInstanceAuth.post("/genre/add", body);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  };

  export const updateGenre = async (body) => {
    try {
      const response = await axiosInstanceAuth.put(
        `/genre/${body.id}`,
        body
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

  export const deleteGenre = async (genreId) => {
    try {
      const response = await axiosInstanceAuth.delete(
        `/genre/${genreId}`
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error.response;
    }
  };

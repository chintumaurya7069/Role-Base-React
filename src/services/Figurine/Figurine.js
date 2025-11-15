import toast from "react-hot-toast";
import axiosInstanceAuth from "../../apiInstances/axiosInstanceAuth";

export const getFigurineDropDown = async () => {
  try {
    const data = await axiosInstanceAuth.get("/figurine/all");

    return data;
  } catch (error) {
    return error.response;
  }
};

export const getByIdFigurine = async (id) => {
  try {
    const response = await axiosInstanceAuth.get(`/figurine/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const getFigurine = async () => {
  try {
    const response = await axiosInstanceAuth.get("/figurine/all");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};
export const AddFigurine = async (body) => {
  try {
    const response = await axiosInstanceAuth.post("/figurine/add", body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateFigurine = async (id, body) => {
  try {
    const response = await axiosInstanceAuth.put(`/figurine/${id}`, body);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

export const deleteFigurine = async (figurineId) => {
  try {
    const response = await axiosInstanceAuth.delete(`/figurine/${figurineId}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response;
  }
};

// export const ApproveFig = async (id) => {
//   try {
//     const response = await axiosInstanceAuth.post("/figurine/approve", id);
//     toast.success(response.data.message);
//     return response.data;
//   } catch (error) {
//     throw error.response;
//   }
// };

export const ApproveFig = async (id) => {
  try {
    const response = await axiosInstanceAuth.post(`/figurine/approve/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// delete figurine playlist api

// export const deleteFigurinePlaylist = async (figurineId, playlistId) => {
//   try {
//     const response = await axiosInstanceAuth.delete(
//       `figurine/${figurineId}/playlist/${playlistId}`
//     );
//     toast.success(response.data.message);
//     return response.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     return error.response;
//   }
// };

// export const deleteFigurinePlaylistDetail = async (
//   figurineId,
//   playlistId,
//   detailId
// ) => {
//   try {
//     const response = await axiosInstanceAuth.delete(
//       `figurine/${figurineId}/playlist/${playlistId}/detail/${detailId}`
//     );
//     toast.success(response.data.message);
//     return response.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     return error.response;
//   }
// };

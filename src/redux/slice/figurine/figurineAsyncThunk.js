import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddFigurine,
  ApproveFig,
  deleteFigurine,
  getByIdFigurine,
  getFigurine,
  getFigurineDropDown,
  updateFigurine,
} from "../../../services/Figurine/Figurine";

export const fetchFigurineDropDowns = createAsyncThunk(
  "get-figurineDropDowns",
  async (_, thunkAPI) => {
    const { data } = await getFigurineDropDown();
    return data.data.map((i) => ({
      value: i._id,
      label: i.name,
    }));
  }
);

export const fetchByIdFigurine = createAsyncThunk(
  "fetch-fetchByIdFigurine",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getByIdFigurine(id);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFigurine = createAsyncThunk(
  "fetch-figurine",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getFigurine();

      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      // console.log("🚀 ~ error.response.data:", error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

export const insertFigurine = createAsyncThunk(
  "add-figurine",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddFigurine(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editFigurine = createAsyncThunk(
  "update-figurine",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateFigurine(id, formData);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFigurine = createAsyncThunk(
  "users/remove-figurine",
  async (figurineId, { rejectWithValue }) => {
    try {
      const response = await deleteFigurine(figurineId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { figurineId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const ApproveFiguring = createAsyncThunk(
//   "approve-figurine",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await ApproveFig(id);
//       if (response.status === 401) {
//         return rejectWithValue(response.data);
//       }
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.data);
//     }
//   }
// );
// figurineAsyncThunk.js
export const ApproveFiguring = createAsyncThunk(
  "approve-figurine",
  async (id, thunkAPI) => {
    try {
      const { data } = await ApproveFig(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data);
    }
  }
);

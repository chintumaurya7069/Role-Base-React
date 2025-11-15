import { createAsyncThunk } from "@reduxjs/toolkit";
import { addAgeGroup, DeleteAgeGroup, getAgeGroup, getAgeGroupData, updateAgeGroup } from "../../../services/ageGroup/ageGroup";

export const fetchAgeGroups = createAsyncThunk(
  "get-ageGroups",
  async (_, thunkAPI) => {
    const { data } = await getAgeGroup();
    return data.data.map((i) => ({
      value: i._id,
      label: i.name,
    }));
  }
);

export const fetchAgeGroupData = createAsyncThunk(
  "fetch-ageGroup",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getAgeGroupData();
      if (!response.status) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const insertAgeGroup = createAsyncThunk(
  "add-ageGroup",
  async (body, { rejectWithValue }) => {
    try {
      const response = await addAgeGroup(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editAgeGroup = createAsyncThunk(
  "update-ageGroup",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateAgeGroup(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeAgeGroup = createAsyncThunk(
  "users/removeAgeGroup",
  async (ageGroupId, { rejectWithValue }) => {
    try {
      const response = await DeleteAgeGroup(ageGroupId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { ageGroupId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

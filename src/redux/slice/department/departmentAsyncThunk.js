import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddDepartment, deleteDepartment, getDepartmentData, getDepartments, updateDepartment } from "../../../services/department/departments";

export const fetchDepartments = createAsyncThunk(
  "get-departments",
  async (_, thunkAPI) => {
    const { data } = await getDepartments();
    return data.data.map((i) => ({
      value: i._id,
      label: i.name,
    }));
  }
);

export const fetchDepartmentData = createAsyncThunk(
  "fetch-department",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getDepartmentData();
      if (!response.status) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const insertDepartment = createAsyncThunk(
  "add-department",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddDepartment(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editDepartment = createAsyncThunk(
  "update-department",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateDepartment(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeDepartment = createAsyncThunk(
  "users/removeDepartment",
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await deleteDepartment(departmentId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { departmentId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

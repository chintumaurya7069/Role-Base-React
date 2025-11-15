import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddRole,
  deleteRole,
  getRoleData,
  getRoles,
  updateRole,
} from "../../../services/userRole/roles";

export const fetchRoles = createAsyncThunk("get-roles", async (_, thunkAPI) => {
  const { data } = await getRoles();
  return data.data.map((i) => ({
    value: i._id,
    label: i.name,
  }));
});

export const fetchRoleData = createAsyncThunk(
  "fetch-role",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getRoleData();
      if (!response.status) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const insertRole = createAsyncThunk(
  "add-role",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddRole(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editRole = createAsyncThunk(
  "update-role",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateRole(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeRole = createAsyncThunk(
  "users/removeRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await deleteRole(roleId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { roleId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

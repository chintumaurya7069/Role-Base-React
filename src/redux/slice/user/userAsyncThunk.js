import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddUser,
  getUser,
  updateUser,
  deleteUser,
} from "../../../services/user/users";
export const insertUser = createAsyncThunk(
  "add-user",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddUser(body);
      if(response.status === 401)
        {
          return rejectWithValue(response.data);
        }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "fetch-user",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getUser();
      if(response.status === 401)
      {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);
export const editUser = createAsyncThunk(
  "update-user",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateUser(body);
      if(response.status === 401)
        {
          return rejectWithValue(response.data);
        }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await deleteUser(userId);
      if(response.status === 401)
        {
          return rejectWithValue(response.data);
        }
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRefreshApi } from "../../../services/authentication/refreshApi";

export const fetchRefreshApi = createAsyncThunk(
  "refetch-RefreshApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRefreshApi(id);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Thunk app
import { createAsyncThunk } from "@reduxjs/toolkit";

import { getMonthWiseUIN, getTopCustomer } from "../../../services/dashboard/dashboard";


export const fetchDashboardMonthWise = createAsyncThunk(
  "fetch-dashboardMonthWise",
  async (figId = "", { rejectWithValue }) => {
    try {
      const response = await getMonthWiseUIN(figId);
      if(response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const fetchTopCustomer = createAsyncThunk(
  "fetch-topCustomer",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getTopCustomer();
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
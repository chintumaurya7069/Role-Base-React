import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addReport,
  filterReport,
  getLocation,
} from "../../../services/report/report";

export const insertReport = createAsyncThunk(
  "add-report",
  async (body, { rejectWithValue }) => {
    try {
      const response = await addReport(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const fetchLocation = createAsyncThunk(
  "fetch-location",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getLocation();
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const FilterReportDetails = createAsyncThunk(
  "filter-report",
  async ({ figIds, genre }, { rejectWithValue }) => {
    try {
      const response = await filterReport({ figIds, genre });
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

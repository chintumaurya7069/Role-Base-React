import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLocation,
  FilterReportDetails,
  insertReport,
} from "./reportAsyncThunk";

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reportData: [],
    locationData: [],
    filterData: [],
    error: null,
    loading: false,
    mainLoader: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFilterData: (state) => {
      state.filterData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(insertReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload; // ✅ Replace with latest
      })
      .addCase(insertReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // fetch user
      .addCase(fetchLocation.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.locationData = action.payload;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(FilterReportDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(FilterReportDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.filterData = action.payload;
      })
      .addCase(FilterReportDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});
export const { clearError, clearFilterData } = reportSlice.actions;
export default reportSlice.reducer;

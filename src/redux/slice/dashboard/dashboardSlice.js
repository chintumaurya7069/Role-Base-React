//slice
import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardMonthWise, fetchTopCustomer } from "./dashboardAsyncThunk";

const dashboardSlice = createSlice({
  name: "dashboards",
  initialState: {
    dashboardMonthWise:[],
    dashboardTopCustomers:[],
    error: null,
    loading: false,
    mainLoader: false,
    deleteLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    

       // fetch DashboardMonthWise
      .addCase(fetchDashboardMonthWise.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchDashboardMonthWise.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.dashboardMonthWise = action.payload;
      })
      .addCase(fetchDashboardMonthWise.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

        // fetch Dashboard
      .addCase(fetchTopCustomer.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchTopCustomer.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.dashboardTopCustomers = action.payload;
      })
      .addCase(fetchTopCustomer.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })
     
  },
});
export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

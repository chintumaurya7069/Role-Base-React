import { createSlice } from "@reduxjs/toolkit";
import { fetchRefreshApi } from "./refreshApiAsyncThunk";


const refreshApiSlice = createSlice({
  name: "userRole",
  initialState: {
    userRoleData: [],
    error: null,
    loading: false,
    mainLoader: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefreshApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRefreshApi.fulfilled, (state, action) => {
        state.loading = false;
        state.userRoleData = action.payload;
      })
      .addCase(fetchRefreshApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});
export const { clearError } = refreshApiSlice.actions;
export default refreshApiSlice.reducer;

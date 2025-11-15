import { createSlice } from "@reduxjs/toolkit";
import {
  editVendor,
  fetchVendor,
  fetchVendorDropDowns,
  insertVendor,
  removeVendor,
} from "./vendorAsyncThunk";

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    vendorData: [],
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

      .addCase(fetchVendorDropDowns.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchVendorDropDowns.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.vendorData = action.payload;
      })
      .addCase(fetchVendorDropDowns.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create vendor
      .addCase(insertVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorData = [...state.vendorData, { ...action.payload }];
      })
      .addCase(insertVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchVendor.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchVendor.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.vendorData = action.payload;
      })
      .addCase(fetchVendor.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(editVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(editVendor.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVendor = action.payload;
        state.vendorData = state.vendorData.map((vendor) =>
          vendor._id === updatedVendor._id ? updatedVendor : vendor
        );
      })

      .addCase(editVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(removeVendor.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteLoading = true;
      })

      .addCase(removeVendor.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteLoading = false;
        state.vendorData = state.vendorData.filter(
          (vendors) => vendors._id !== action.payload.vendorId
        );
      })

      .addCase(removeVendor.rejected, (state, action) => {
        state.vendorData = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = vendorSlice.actions;
export default vendorSlice.reducer;

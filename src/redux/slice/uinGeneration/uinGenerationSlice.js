import { createSlice } from "@reduxjs/toolkit";
import {
  editUinGeneration,
  fetchDataById,
  fetchFigIdByVendor,
  fetchUinGenerationById,
  fetchUinGenerationData,
  fetchUinGenerationDetails,
  insertUinGeneration,
  removeUinGeneration,
} from "./uinGenerationAsyncThunk";

const uinGenerationSlice = createSlice({
  name: "uin",
  initialState: {
    uinGeneration: [],
    uinGenerationDetails: [],
    uinGenerationById: [],
    uinGenerationDataById: [],
    uinFetchVendor: [],
    loading: false,
    error: null,
    mainLoader: false,
    deleteLoading: false,
    singleDataLoader: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUinGenerationDetails.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchUinGenerationDetails.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.uinGenerationDetails = action.payload;
      })
      .addCase(fetchUinGenerationDetails.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchUinGenerationById.pending, (state) => {
        state.singleDataLoader = true;
      })
      .addCase(fetchUinGenerationById.fulfilled, (state, action) => {
        state.singleDataLoader = false;
        // Only update the specific item in uinGeneration array
        const updatedIndex = state.uinGeneration.findIndex(
          (item) => item._id === action.payload.data._id
        );
        if (updatedIndex !== -1) {
          state.uinGeneration[updatedIndex] = action.payload.data;
        }
        state.uinGenerationById = action.payload.data;
      })
      .addCase(fetchUinGenerationById.rejected, (state, action) => {
        state.singleDataLoader = false;
        state.error = action.payload?.message || "Failed to fetch UIN details";
      })

      .addCase(fetchDataById.pending, (state) => {
        state.singleDataLoader = true;
      })
      .addCase(fetchDataById.fulfilled, (state, action) => {
        state.singleDataLoader = false;
        state.uinGenerationDataById = action.payload;
      })
      .addCase(fetchDataById.rejected, (state, action) => {
        state.singleDataLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchUinGenerationData.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchUinGenerationData.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.uinGeneration = action.payload;
      })
      .addCase(fetchUinGenerationData.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create department
      .addCase(insertUinGeneration.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertUinGeneration.fulfilled, (state, action) => {
        state.loading = false;
        state.uinGeneration = [...state.uinGeneration, action.payload];
      })
      .addCase(insertUinGeneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(editUinGeneration.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUinGeneration.fulfilled, (state, action) => {
        state.loading = false;
        const { mainId, subId, updatedData, fullUpdatedRecord } =
          action.payload;

        // Option 1: Replace the entire record (simpler)
        state.uinGeneration = state.uinGeneration.map((record) =>
          record._id === mainId ? fullUpdatedRecord : record
        );

        if (state.uinGenerationDataById?.data?._id === mainId) {
          state.uinGenerationDataById = {
            ...state.uinGenerationDataById,
            data: fullUpdatedRecord,
          };
        }
      })
      .addCase(editUinGeneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeUinGeneration.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      .addCase(removeUinGeneration.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteLoading = false;

        // Update the specific item's isActive status and store the delete reason
        const index = state.uinGeneration.findIndex(
          (item) => item._id === action.payload.UinGenerationId
        );

        if (index !== -1) {
          state.uinGeneration[index].isActive = false;
          state.uinGeneration[index].deleteReason = action.payload.deleteReason;
        }
      })
      .addCase(removeUinGeneration.rejected, (state, action) => {
        state.uinGeneration = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      })

      //FetchVendors
      .addCase(fetchFigIdByVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFigIdByVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.uinFetchVendor = action.payload.data; // Adjust based on your API response
      })
      .addCase(fetchFigIdByVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});
export const { clearError } = uinGenerationSlice.actions;
export default uinGenerationSlice.reducer;

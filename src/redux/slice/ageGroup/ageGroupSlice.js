import { createSlice } from "@reduxjs/toolkit";
import {
  editAgeGroup,
  fetchAgeGroupData,
  fetchAgeGroups,
  insertAgeGroup,
  removeAgeGroup,
} from "./ageGroupAsyncThunk";

const ageGroupSlice = createSlice({
  name: "ageGroups",
  initialState: {
    ageGroup: [],
    loading: false,
    error: null,
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
      // Fetch ageGroup
      .addCase(fetchAgeGroups.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchAgeGroups.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.ageGroup = action.payload;
      })
      .addCase(fetchAgeGroups.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchAgeGroupData.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchAgeGroupData.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.ageGroup = action.payload;
      })
      .addCase(fetchAgeGroupData.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create ageGroup
      .addCase(insertAgeGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertAgeGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.ageGroup = [...state.ageGroup, { ...action.payload }];
      })
      .addCase(insertAgeGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(editAgeGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAgeGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAgeGroup = action.payload;
        state.ageGroup = state.ageGroup.map((ageGroup) =>
          ageGroup._id === updatedAgeGroup._id ? updatedAgeGroup : ageGroup
        );
      })
      .addCase(editAgeGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeAgeGroup.pending, (state) => {
        // state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      .addCase(removeAgeGroup.fulfilled, (state, action) => {
        // state.deleteStatus = "succeeded";
        state.ageGroup = state.ageGroup.filter(
          (ageGroup) => ageGroup._id !== action.payload.ageGroupId
        );
        state.deleteLoading = false;
      })
      .addCase(removeAgeGroup.rejected, (state, action) => {
        // state.ageGroup = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = ageGroupSlice.actions;
export default ageGroupSlice.reducer;

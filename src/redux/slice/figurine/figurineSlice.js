import { createSlice } from "@reduxjs/toolkit";
import {
  ApproveFiguring,
  editFigurine,
  fetchByIdFigurine,
  fetchFigurine,
  fetchFigurineDropDowns,
  insertFigurine,
  removeFigurine,
} from "./figurineAsyncThunk";

const figurineSlice = createSlice({
  name: "figurines",
  initialState: {
    figurineData: [],
    singleFigurineData: {},
    approveFigById: [],
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
      // fetch in DropDown
      .addCase(fetchFigurineDropDowns.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchFigurineDropDowns.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.figurineData = action.payload;
      })
      .addCase(fetchFigurineDropDowns.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // fetch By ID

      .addCase(fetchByIdFigurine.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchByIdFigurine.fulfilled, (state, action) => {
        state.loading = false;
        state.singleFigurineData = action.payload;
      })
      .addCase(fetchByIdFigurine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // create
      .addCase(insertFigurine.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertFigurine.fulfilled, (state, action) => {
        state.loading = false;
        state.figurineData = [...state.figurineData, { ...action.payload }];
      })
      .addCase(insertFigurine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // all fetch
      .addCase(fetchFigurine.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchFigurine.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.figurineData = action.payload;
      })
      .addCase(fetchFigurine.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // edit

      .addCase(editFigurine.pending, (state) => {
        state.loading = true;
      })

      .addCase(editFigurine.fulfilled, (state, action) => {
        state.loading = false;
        const updatedFigurine = action.payload;
        if (Array.isArray(state.figurineData)) {
          state.figurineData = state.figurineData.map((figurine) =>
            figurine._id === updatedFigurine._id ? updatedFigurine : figurine
          );
        } else {
          state.figurineData = [updatedFigurine];
        }
      })
      .addCase(editFigurine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // remove

      .addCase(removeFigurine.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteLoading = true;
      })

      .addCase(removeFigurine.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteLoading = false;

        // Update the specific item's isActive status instead of filtering
        const index = state.figurineData.findIndex(
          (item) => item._id === action.payload.figurineId
        );

        if (index !== -1) {
          state.figurineData[index].isActive = false;
        }
      })

      .addCase(removeFigurine.rejected, (state, action) => {
        state.figurineData = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // figurineSlice.js
      .addCase(ApproveFiguring.pending, (state) => {
        state.singleDataLoader = true;
      })
      .addCase(ApproveFiguring.fulfilled, (state, action) => {
        state.singleDataLoader = false;
        // Update the specific item in figurineData
        state.figurineData = state.figurineData.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(ApproveFiguring.rejected, (state, action) => {
        state.singleDataLoader = false;
        state.error = action.payload?.message;
      });
  },
});
export const { clearError } = figurineSlice.actions;
export default figurineSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import {
  editDepartment,
  fetchDepartmentData,
  fetchDepartments,
  insertDepartment,
  removeDepartment,
} from "./departmentAsyncThunk";

const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    department: [],
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
      // Fetch department
      .addCase(fetchDepartments.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.department = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchDepartmentData.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.department = action.payload;
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create department
      .addCase(insertDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = [...state.department, { ...action.payload }];
      })
      .addCase(insertDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(editDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDepartment = action.payload;
        state.department = state.department.map((department) =>
          department._id === updatedDepartment._id
            ? updatedDepartment
            : department
        );
      })
      .addCase(editDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeDepartment.pending, (state) => {
        // state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      .addCase(removeDepartment.fulfilled, (state, action) => {
        // state.deleteStatus = "succeeded";
        state.department = state.department.filter(
          (department) => department._id !== action.payload.departmentId
        );
        state.deleteLoading = false;
      })
      .addCase(removeDepartment.rejected, (state, action) => {
        // state.department = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = departmentSlice.actions;
export default departmentSlice.reducer;

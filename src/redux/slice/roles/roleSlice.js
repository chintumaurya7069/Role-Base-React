import { createSlice } from "@reduxjs/toolkit";
import {
  editRole,
  fetchRoleData,
  fetchRoles,
  insertRole,
  removeRole,
} from "./roleAsyncThunk";

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    role: [],
    loading: false,
    error: null,
    mainLoader: false,
    deleteLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Fetch role
      .addCase(fetchRoles.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.role = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchRoleData.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchRoleData.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.role = action.payload;
      })
      .addCase(fetchRoleData.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create role
      .addCase(insertRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = [...state.role, { ...action.payload }];
      })
      .addCase(insertRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(editRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload;
        state.role = state.role.map((role) =>
          role._id === updatedRole._id ? updatedRole : role
        );
      })
      .addCase(editRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeRole.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.role = state.role.filter(
          (role) => role._id !== action.payload.roleId
        );
        state.deleteLoading = false;
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.role = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = roleSlice.actions;
export default roleSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { editUser, fetchUser, insertUser, removeUser } from "./userAsyncThunk";

const userSlice = createSlice({
  name: "users",
  initialState: {
    userData: [],
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
      // create user
      .addCase(insertUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = [...state.userData, { ...action.payload }];
      })
      .addCase(insertUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // fetch user
      .addCase(fetchUser.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.userData = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // edit user
      .addCase(editUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.userData = state.userData.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // remove user
      .addCase(removeUser.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      // .addCase(removeUser.fulfilled, (state, action) => {
      //   state.deleteStatus = "succeeded";
      //   state.userData = state.userData.filter(
      //     (users) => users._id !== action.payload.userId
      //   );
      //   state.deleteLoading = false;
      // })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteLoading = false;

        // Update the specific item's isActive status instead of filtering
        const index = state.userData.findIndex(
          (item) => item._id === action.payload.userId
        );

        if (index !== -1) {
          state.userData[index].isActive = false;
        }
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.userData = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = userSlice.actions;
export default userSlice.reducer;

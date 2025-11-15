import { createSlice } from "@reduxjs/toolkit";
import {
  editCustomer,
  fetchByIdCustomer,
  fetchCustomer,
  insertCustomer,
  removeCustomer,
} from "./customerAsyncThunk";

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customerData: [],
    singleCustomerData: {},
    error: null,
    loading: false,
    deleteLoading: false,
    mainLoader: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    isFormEmpty: (state) => {
      state.singleCustomerData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch By ID
      .addCase(fetchByIdCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchByIdCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCustomerData = action.payload[0];
      })
      .addCase(fetchByIdCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // create
      .addCase(insertCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = [...state.customerData, ...action.payload];
      })
      .addCase(insertCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // all fetch
      .addCase(fetchCustomer.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.customerData = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // edit

      .addCase(editCustomer.pending, (state) => {
        state.loading = true;
      })
      // .addCase(editCustomer.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const updatedCustomer = action.payload[0];
      //   state.customerData = state.customerData.map((customer) =>
      //     customer._id === updatedCustomer._id ? updatedCustomer : customer
      //   );
      // })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.loading = false;

        // Check the actual response structure
        const updatedCustomer = action.payload.data?.[0] || action.payload[0];

        // Update the customer in the array
        state.customerData = state.customerData.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        );

        // Also update singleCustomerData if it's the currently viewed customer
        if (state.singleCustomerData._id === updatedCustomer._id) {
          state.singleCustomerData = updatedCustomer;
        }
      })

      .addCase(editCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // remove

      .addCase(removeCustomer.pending, (state) => {
        // state.deleteStatus = "loading";
        state.deleteLoading = true;
      })

      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteLoading = false;

        // Update the specific item's isActive status instead of filtering
        const index = state.customerData.findIndex(
          (item) => item._id === action.payload.customerId
        );

        if (index !== -1) {
          state.customerData[index].isActive = false;
        }
      })

      .addCase(removeCustomer.rejected, (state, action) => {
        // state.customerData = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError, isFormEmpty } = customerSlice.actions;
export default customerSlice.reducer;

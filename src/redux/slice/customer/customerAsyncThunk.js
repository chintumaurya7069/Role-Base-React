import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddCustomer,
  deleteCustomer,
  getByIdCustomer,
  getCustomer,
  updateCustomer,
} from "../../../services/customer/customer";

// export const fetchCustomerDropDowns = createAsyncThunk(
//   "get-customerDropDowns",
//   async (id, thunkAPI) => {
//     const { data } = await getCustomerDropDown(id);
//     return data.data.map((i) => ({
//       value: i._id,
//       label: i.name,
//     }));
//   }
// );

export const fetchByIdCustomer = createAsyncThunk(
  "fetch-fetchByIdCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getByIdCustomer(id);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCustomer = createAsyncThunk(
  "fetch-customer",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getCustomer();
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const insertCustomer = createAsyncThunk(
  "add-customer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddCustomer(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editCustomer = createAsyncThunk(
  "update-customer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateCustomer(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCustomer = createAsyncThunk(
  "remove-customer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await deleteCustomer(customerId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { customerId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

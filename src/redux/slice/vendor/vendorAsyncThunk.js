import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddVendor,
  deleteVendor,
  getVendor,
  getVendorDropDown,
  updateVendor,
} from "../../../services/vendor/vendor";

export const fetchVendorDropDowns = createAsyncThunk(
  "get-VendorDropDown",
  async (_, thunkAPI) => {
    const { data } = await getVendorDropDown();
    return data.data.map((i) => ({
      value: i._id,
      label: `${i.firstName} ${i.lastName}`,
      firstName: i.firstName,
      lastName: i.lastName,
    }));
  }
);

export const fetchVendor = createAsyncThunk(
  "fetch-vendor",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getVendor();
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const insertVendor = createAsyncThunk(
  "add-vendor",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddVendor(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editVendor = createAsyncThunk(
  "update-vendor",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateVendor(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeVendor = createAsyncThunk(
  "users/removeVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await deleteVendor(vendorId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { vendorId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

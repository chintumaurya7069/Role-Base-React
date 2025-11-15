import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddUinGeneration,
  deleteUinGeneration,
  filterFig,
  getUinDataById,
  getUinGenerationById,
  getUinGenerationData,
  getUinGenerationDetails,
  updateUinGeneration,
} from "../../../services/uinGeneration/uinGeneration";

export const fetchUinGenerationDetails = createAsyncThunk(
  "get-UinGenerationDetails",
  async (id, thunkAPI) => {
    const { data } = await getUinGenerationDetails(id);
    return data.data.map((i) => ({
      value: i.uinDetailId,
      label: i.uin,
      status: i.status,
    }));
  }
);

// export const fetchUinGenerationById = createAsyncThunk(
//   "get-UinGenerationById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await getUinGenerationById(id);
//       if (!data.status) {
//         return rejectWithValue(data);
//       }
//       return { data }; // Return the full response data
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const fetchUinGenerationById = createAsyncThunk(
  "get-UinGenerationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUinGenerationById(id);
      if (!response.data.status) {
        return rejectWithValue(response.data);
      }
      // Return both main data and nested data
      return {
        data: {
          ...response.data.data,
          uinDetails: response.data.data.uinDetails || [],
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDataById = createAsyncThunk(
  "get-uinDataById",
  async (id, thunkAPI) => {
    const { data } = await getUinDataById(id);
    return data;
  }
);

export const fetchUinGenerationData = createAsyncThunk(
  "fetch-getUinData",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getUinGenerationData();
      if (!response.status) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);

export const insertUinGeneration = createAsyncThunk(
  "add-UinGeneration",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddUinGeneration(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editUinGeneration = createAsyncThunk(
  "update-UinGeneration",
  async ({ mainId, subId, body }, { rejectWithValue }) => {
    try {
      const response = await updateUinGeneration(mainId, subId, body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      // Return the data in the format your reducer expects
      return {
        mainId,
        subId,
        updatedData: body, // Just the fields that were updated
        fullUpdatedRecord: response.data, // The complete updated record
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeUinGeneration = createAsyncThunk(
  "users/removeUinGeneration",
  async ({id, deleteReason}, { rejectWithValue }) => {
    try {
      const response = await deleteUinGeneration(id, deleteReason);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { UinGenerationId:id, deleteReason: deleteReason.trim(), data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchFigIdByVendor = createAsyncThunk(
  "get-UinGenerationByVendor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await filterFig(id);
      if (!response.data.status) {
        return rejectWithValue(response.data);
      }
      // Return both main data and nested data
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
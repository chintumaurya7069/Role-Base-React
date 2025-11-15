import { createAsyncThunk } from "@reduxjs/toolkit";
import { addGenre, deleteGenre, getGenre, getGenreData, updateGenre } from "../../../services/genre/genre";

export const fetchGenres = createAsyncThunk(
  "get-genres",
  async (_, thunkAPI) => {
    const { data } = await getGenre();
    return data.data.map((i) => ({
      value: i._id,
      label: i.name,
    }));
  }
);

export const fetchGenreData = createAsyncThunk(
  "fetch-genre",
  async (_body, { rejectWithValue }) => {
    try {
      const response = await getGenreData();
      if (!response.status) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue([error.response.data]);
    }
  }
);


export const insertGenre = createAsyncThunk(
  "add-genre",
  async (body, { rejectWithValue }) => {
    try {
      const response = await addGenre(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const editGenre = createAsyncThunk(
  "update-genre",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateGenre(body);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeGenre = createAsyncThunk(
  "users/removeGenre",
  async (genreId, { rejectWithValue }) => {
    try {
      const response = await deleteGenre(genreId);
      if (response.status === 401) {
        return rejectWithValue(response.data);
      }
      return { genreId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

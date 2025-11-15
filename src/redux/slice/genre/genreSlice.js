import { createSlice } from "@reduxjs/toolkit";
import { editGenre, fetchGenreData, fetchGenres, insertGenre, removeGenre } from "./genreAsyncThunk";


const genreSlice = createSlice({
  name: "genres",
  initialState: {
    genre: [],
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
      // Fetch genre
      .addCase(fetchGenres.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.genre = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchGenreData.pending, (state) => {
        state.mainLoader = true;
      })
      .addCase(fetchGenreData.fulfilled, (state, action) => {
        state.mainLoader = false;
        state.genre = action.payload;
      })
      .addCase(fetchGenreData.rejected, (state, action) => {
        state.mainLoader = false;
        state.error = action.payload?.message;
      })

      // create genre
      .addCase(insertGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.genre = [...state.genre, { ...action.payload }];
      })
      .addCase(insertGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(editGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(editGenre.fulfilled, (state, action) => {
        state.loading = false;
        const updateGenre = action.payload;
        state.genre = state.genre.map((genre) =>
          genre._id === updateGenre._id
            ? updateGenre
            : genre
        );
      })
      .addCase(editGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeGenre.pending, (state) => {
        // state.deleteStatus = "loading";
        state.deleteLoading = true;
      })
      .addCase(removeGenre.fulfilled, (state, action) => {
        // state.deleteStatus = "succeeded";
        state.genre = state.genre.filter(
          (genre) => genre._id !== action.payload.genreId
        );
        state.deleteLoading = false;
      })
      .addCase(removeGenre.rejected, (state, action) => {
        // state.genre = "failed";
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = genreSlice.actions;
export default genreSlice.reducer;

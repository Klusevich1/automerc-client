// redux/favoriteSlice.ts
import { Product } from "@/interfaces/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FavoriteState = {
  ids: Product[];
};

const initialState: FavoriteState = {
  ids: [],
};

export const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Product>) => {
      const existingItem = state.ids.find(
        (item) => item.article === action.payload.article
      );
      if (!existingItem) {
        state.ids.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<{ article: string }>) => {
      state.ids = state.ids.filter(
        (item) => item.article !== action.payload.article
      );
    },
    setFavorites: (state, action: PayloadAction<Product[]>) => {
      state.ids = action.payload;
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites, clearFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;

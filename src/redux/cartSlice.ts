import { Product } from "@/interfaces/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { items: Product[] } = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.article === action.payload.article
      );
      if (existingItem) {
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ article: string }>) => {
      state.items = state.items.filter(
        (item) => item.article !== action.payload.article
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addToCart, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

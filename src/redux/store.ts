import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import loadingReducer from "./loadingSlice";
import selectedUserCarReducer from "./selectedUserCarSlice";
import favoritesReducer from "./favoriteSlice";
import uiTopNoticeReducer from "./uiTopNoticeSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  favorites: favoritesReducer,
  loading: loadingReducer,
  selectedUserCar: selectedUserCarReducer,
  uiTopNotice: uiTopNoticeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "favorites"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Типы
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

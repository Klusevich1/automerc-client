import { initialBrand, initialGeneration, initialModel } from "@/initialStates/initialVehicle";
import { Brand } from "@/interfaces/Brand";
import { Generation } from "@/interfaces/Generation";
import { Model } from "@/interfaces/Model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface selectedUserCarState {
  make: Brand;
  model: Model;
  modification: Generation;
}

const initialState: selectedUserCarState = {
  make: initialBrand,
  model: initialModel,
  modification: initialGeneration,
};

const selectedUserCarSlice = createSlice({
  name: "selectedUserCar",
  initialState,
  reducers: {
    setBrand(state, action: PayloadAction<Brand>) {
      state.make = action.payload;
    },
    setModel(state, action: PayloadAction<Model>) {
      state.model = action.payload;
    },
    setModification(state, action: PayloadAction<Generation>) {
      state.modification = action.payload;
    },
    setAll(state, action: PayloadAction<selectedUserCarState>) {
      state.make = action.payload.make;
      state.model = action.payload.model;
      state.modification = action.payload.modification;
    },
  },
});

export const { setBrand, setModel, setModification, setAll } =
  selectedUserCarSlice.actions;
export default selectedUserCarSlice.reducer;

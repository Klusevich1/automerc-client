import { Model } from "@/interfaces/Model";
import { Brand } from "@/interfaces/Brand";
import { Generation } from "@/interfaces/Generation";

export const initialBrand: Brand = {
  id: 0,
  name: "",
  slug: "",
};

export const initialModel: Model = {
  id: 0,
  name: "",
  brand_id: 0,
  slug: "",
};

export const initialGeneration: Generation = {
  id: 0,
  model_id: 0,
  brand_id: 0,
  name: "",
  slug: "",
};

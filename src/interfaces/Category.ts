import { Subcategory } from "./Subcategory";

export interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Subcategory[];
  name_accusative: string;
}

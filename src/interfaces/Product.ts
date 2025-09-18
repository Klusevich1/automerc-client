import { Brand } from "./Brand";
import { Generation } from "./Generation";
import { Model } from "./Model";
import { TecDocDetailInfo } from "./TecDocDetailInfo";

export interface Product {
  id: number;
  article: string;
  name: string;
  nameWithInfo: string;

  brand: Brand;
  brand_id: number;

  model: Model;
  model_id: number;
  model_with_generation: string;

  generations: any;
  generation_id: number;

  body: string | null;
  number: string;
  year: string | number;
  color: string | null;

  note: string;
  category_id: number | null;

  price: string;
  availability: string;
  photos: string;
  condition: string;
  supplier: string;
  created_at: string;
  engine_id: number | null;
  TecDocDetailInfo: TecDocDetailInfo[];
}

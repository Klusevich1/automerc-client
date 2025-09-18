import { Product } from "@/interfaces/Product";
import { Address } from "./Address";
import { Order } from "@/interfaces/Order";

export type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  addresses: Address[];
  favorites: Product[];
  orders: Order[];
  selectedAddress: Address;
  cars: {
    brand_id: number;
    generation_id: number;
    id: number;
    model_id: number;
    name: string;
    slug: string;
  }[];
  selectedCar: {
    id: number;
    name: string;
    brand_id: number;
    model_id: number;
    generation_id: number;
  };
  selected_address_id: null;
  selected_car_id: 21;
};

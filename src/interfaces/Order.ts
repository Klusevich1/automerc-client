import { UserData } from "@/Types/UserData";

export interface Order {
  id: number;
  firstName: string;
  middleName: string;
  lastname: string;
  email: string;
  orderNumber: number;
  delivery: "pickup" | "courier" | "post" | "courierService" | "sdek" | "kit";
  country: string;
  region: string;
  city: string;
  street: string;
  intercom: string;
  entrance: string;
  floor: string;
  apartment: string;
  payment: "cash" | "online" | "erip" | "installmentCard";
  phoneCode: string;
  phoneNumber: string;
  promoCode: string;
  bynSum: number;
  rubSum: number;
  usdSum: number;
  // items: {
  //   article: number;
  //   name: string;
  //   photo: string;
  //   rubPrice: number;
  //   bynPrice: number;
  //   usdPrice: number;
  // }[];
  items: {
    article: number;
    name: string;
    photo: string;
    rubPrice: number;
    bynPrice: number;
    usdPrice: number;
  }[];
  status: "Ожидается" | "Выполнен" | "Отменен";
  createdAt: string;
  orderedBy: UserData[];
}

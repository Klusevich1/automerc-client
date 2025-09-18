import { AppDispatch } from "@/redux/store";
import { bynToUsd, getNbrbRates, rubToByn } from "./nbrb";
import { clearCart } from "@/redux/cartSlice";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { UserData } from "@/Types/UserData";
import { Product } from "@/interfaces/Product";

export const createOrder = async (
  data: any,
  cartItems: any[],
  bynSum: number,
  rubSum: number,
  usdSum: number,
  dispatch: AppDispatch,
  user: UserData | null
) => {
  const { rub, usd } = await getNbrbRates();
  const items = cartItems.map((item: Product) => {
    const rubPrice = Number(item.price);
    const byn = rubToByn(rubPrice, rub);
    const usdPrice = bynToUsd(byn, usd);

    const fixedImages: string[] = JSON.parse(item.photos);

    return {
      article: item.article,
      name: `${item.name} ${item.brand.name} ${item.model_with_generation}`,
      photo: fixedImages[0],
      rubPrice: rubPrice,
      bynPrice: Number(byn.toFixed(2)),
      usdPrice: Number(usdPrice.toFixed(2)),
    };
  });

  const body = {
    ...data,
    bynSum,
    rubSum,
    usdSum,
    items,
  };

  const res = await defaultFetch(`/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Ошибка создания заказа: ${res.status} ${res.statusText} ${text}`
    );
  }

  if (user) {
    const resClear = await defaultFetch(`/users/cart`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resClear.ok)
      throw new Error("Не удалось добавить в серверную корзину");
  }

  dispatch(clearCart());
  const resData: { success: boolean; message: string; orderNumber: number } =
    await res.json();
  return resData;
};

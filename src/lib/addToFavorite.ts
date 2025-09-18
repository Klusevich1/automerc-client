import { Product } from "@/interfaces/Product";
import {
  addFavorite,
  removeFavorite,
  setFavorites,
} from "@/redux/favoriteSlice";
import { AppDispatch } from "@/redux/store";
import { UserData } from "@/Types/UserData";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export async function toggleFavorite(
  product: Product,
  isFavorite: boolean,
  dispatch: AppDispatch,
  user: UserData | null
) {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/favorites/${product.id}`;

  if (isFavorite) {
    dispatch(removeFavorite({ article: product.article }));
  } else {
    dispatch(addFavorite(product));
  }

  if (user) {
    const res = await defaultFetch(`/users/favorites/${product.id}`, {
      method: isFavorite ? "DELETE" : "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      throw new Error("Требуется авторизация");
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ошибка ${res.status}: ${text || res.statusText}`);
    }

    const serverFavorites = await res.json();
    dispatch(setFavorites(serverFavorites));
  }
}

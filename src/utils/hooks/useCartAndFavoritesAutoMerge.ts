// hooks/useCartAutoMerge.ts
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCart } from "@/redux/cartSlice";
import { useUser } from "@/utils/hooks/useUser";
import { defaultFetch } from "../fetch's/defaultFetch";
import { setFavorites } from "@/redux/favoriteSlice";

export async function mergeLocalCartToServer(
  type: "favorites" | "cart",
  sparePartIds: number[]
) {
  console.log();
  const res = await defaultFetch(`/users/${type}/merge`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sparePartIds }),
  });
  if (!res.ok) throw new Error("Не удалось слить гостевую корзину в серверную");
  return res.json(); // ожидаем серверную корзину целиком
}

export function useCartAndFavoritesAutoMerge() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const localItems = useSelector((s: RootState) => s.cart.items);
  const favoriteIds = useSelector((s: RootState) => s.favorites.ids);

  const wasAuthenticated = useRef<boolean>(false);

  useEffect(() => {
    const becameAuthenticated = !!user && !wasAuthenticated.current;

    if (becameAuthenticated && localItems?.length > 0) {
      (async () => {
        try {
          const serverCart = await mergeLocalCartToServer(
            "cart",
            localItems.map((i) => i.id)
          );
          dispatch(setCart(serverCart));
        } catch (e) {
          // опционально можно показать уведомление, но корзину гостя не трогаем
          console.error(e);
        }
      })();
    }

    if (becameAuthenticated && favoriteIds?.length > 0) {
      (async () => {
        try {
          const serverFavorites = await mergeLocalCartToServer(
            "favorites",
            favoriteIds.map((i) => i.id)
          );
          dispatch(setFavorites(serverFavorites));
        } catch (e) {
          // опционально можно показать уведомление, но корзину гостя не трогаем
          console.error(e);
        }
      })();
    }

    wasAuthenticated.current = !!user;
  }, [user, localItems, dispatch]);
}

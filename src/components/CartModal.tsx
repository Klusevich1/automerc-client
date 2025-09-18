import React, { useEffect, useState } from "react";
import H1 from "./headers/H1";
import H3 from "./headers/H3";
import Image from "next/image";
import Text from "./headers/Text";
import H2 from "./headers/H2";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart, removeFromCart, setCart } from "@/redux/cartSlice";
import { useSwipeable } from "react-swipeable";
import { Product } from "@/interfaces/Product";
import { useUser } from "@/utils/hooks/useUser";
import { UserData } from "@/Types/UserData";
import { toggleFavorite } from "@/lib/addToFavorite";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { CgClose } from "react-icons/cg";
import { getNbrbRates, rubToByn } from "@/lib/nbrb";

interface RowProps {
  label: string;
  value: string | number;
  colorLabel?: string;
  colorValue?: string;
}

interface CartCardProps {
  item: Product;
  user: UserData | null;
}

interface CartModalProps {
  // cartItems: CartItem[];
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const [promocode, setPromocode] = useState<string>("");
  const [isOpenTrash, setIsOpenTrash] = useState<boolean>(false);
  const [bynTotalPrice, setBynTotalPrice] = useState<number>(0);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRatesLoading(true);
        const { rub, usd } = await getNbrbRates();

        const byn = rubToByn(
          Number(
            cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)
          ),
          rub
        );

        if (mounted) {
          setBynTotalPrice(byn);
          setRatesError(null);
        }
      } catch (e: any) {
        if (mounted) setRatesError(e?.message ?? "Ошибка получения курса");
      } finally {
        if (mounted) setRatesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [cartItems]);

  return (
    <div className="flex justify-center h-full">
      {cartItems.length > 0 ? (
        <>
          {isOpenTrash ? (
            <div className="w-full flex flex-col items-center gap-12">
              <div className="w-full flex justify-end">
                <Image
                  src={"/resources/cross.svg"}
                  width={24}
                  height={24}
                  alt="Cross"
                  onClick={() => setIsOpenTrash(false)}
                  className="cursor-pointer"
                />
              </div>
              <div className="w-full flex flex-col lg:gap-12 gap-7 sm:max-w-[380px]">
                <div className="flex flex-col gap-4">
                  <H1
                    children="Очистить корзину?"
                    className="lg:max-w-[200px] lg:text-[32px] text-[24px] !font-bold"
                  />
                  <Text
                    variant="Body"
                    children="Отменить удаление продуктов из корзины будет невозможно."
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    styles="w-full py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                    text="Удалить"
                    onClick={() => dispatch(clearCart())}
                  />
                  <Button
                    styles="w-full py-[16px] text-center border-[1px] border-black rounded-[8px] text-[16px] font-semibold text-black outline-none"
                    text="Нет, оставить"
                    onClick={() => setIsOpenTrash(false)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col justify-between gap-12">
              <div className="flex flex-col gap-9">
                <div className="flex flex-col lg:gap-4 gap-3">
                  <div className="md:hidden flex justify-end mb-[4px]">
                    <Image
                      src={"/resources/cross.svg"}
                      width={24}
                      height={24}
                      alt="Cross"
                      onClick={onClose}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-end">
                    <div className="flex flex-row items-end lg:gap-2 gap-1">
                      <H1 className="lg:text-[32px] text-[24px] !font-bold">
                        Корзина
                      </H1>
                      <H3 className="lg:text-[20px] text-[16px] !font-bold">
                        /1шт.
                      </H3>
                    </div>
                    <div className="flex flex-row md:gap-3 gap-2 items-center">
                      <div
                        onClick={() => setIsOpenTrash(true)}
                        className="flex flex-row items-center gap-2 cursor-pointer"
                      >
                        <Image
                          src={"/resources/trash.svg"}
                          width={24}
                          height={24}
                          alt="Trash"
                        />
                        <Text
                          variant="Small"
                          className="md:hidden block text-[12px] font-normal"
                        >
                          Удалить все
                        </Text>
                      </div>

                      <div className="h-[24px] w-[1px] bg-black_40 md:block hidden"></div>
                      <Image
                        src={"/resources/cross.svg"}
                        width={24}
                        height={24}
                        alt="Cross"
                        onClick={onClose}
                        className="cursor-pointer md:block hidden md:w-[24px] w-[20px]"
                      />
                    </div>
                  </div>
                  {/* <div className="flex px-2 py-1 bg-green text-white w-fit">
                    <Text variant="Small" className="!font-bold">
                      Бесплатная доставка
                    </Text>
                  </div> */}
                </div>
                <div className="flex flex-col">
                  {cartItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`w-full ${
                        idx === 0
                          ? "pb-5 border-none"
                          : idx === cartItems.length - 1
                          ? "pt-5"
                          : "py-5"
                      } border-t-[1px] border-stroke`}
                    >
                      <CartCard item={item} user={user} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-12 ">
                <div className="p-4 flex flex-row items-center border-dashed border-[1px] rounded-[8px] border-black_36">
                  <input
                    type="text"
                    placeholder="Введите промокод"
                    value={promocode}
                    onChange={(e) => setPromocode(e.target.value)}
                    className="w-full text-[14px] font-medium bg-transparent outline-none text-black_60"
                  />
                  <div className="min-w-[20px] p-1 bg-black_36 rounded-full">
                    <Image
                      src={"/resources/arrow-right.svg"}
                      width={12}
                      height={12}
                      alt="Arrow"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-6">
                  <div className="w-full flex flex-col sm:gap-5 gap-3">
                    <H3>Сумма заказа</H3>
                    <InfoRow
                      label="Стоимотсь запчастей"
                      value={`${bynTotalPrice.toFixed(2)} BYN`}
                    />
                    <InfoRow
                      label="Скидка"
                      value={"-0,00 BYN"} // пока фиксированная, можно улучшить
                      colorLabel="blue_main"
                      colorValue="blue_main"
                    />
                  </div>
                  <div className="flex lg:flex-row flex-col items-end lg:gap-4 gap-1">
                    <Text variant="Body" className="lg:!font-medium !font-bold">
                      Итого
                    </Text>
                    <H2 className="sm:!text-[32px] text-[24px] !font-bold">
                      {bynTotalPrice.toFixed(2)} BYN
                    </H2>
                  </div>
                  <Button
                    href="/checkout"
                    styles="w-full py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                    text="Оформить заказ"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="w-full flex justify-end">
            <Image
              src={"/resources/cross.svg"}
              width={24}
              height={24}
              alt="Cross"
              onClick={onClose}
              className="cursor-pointer"
            />
          </div>
          <div className="w-full flex flex-col lg:gap-12 gap-7 max-w-[380px]">
            <div className="flex flex-col gap-4">
              <H1 className="lg:max-w-[200px] lg:text-[32px] text-[24px] !font-bold">
                В корзине ничего нет...
              </H1>
              <Text variant="Body">Но это никто не поздно исправить!</Text>
            </div>
            <Button
              styles="w-full py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
              text="Вернуться к покупкам"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CartCard: React.FC<CartCardProps> = ({ item, user }) => {
  const dispatch = useDispatch();

  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [bynPrice, setBynPrice] = useState<number>(0);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesError, setRatesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRatesLoading(true);
        const { rub, usd } = await getNbrbRates();

        const byn = rubToByn(Number(item.price), rub);

        if (mounted) {
          setBynPrice(byn);
          setRatesError(null);
        }
      } catch (e: any) {
        if (mounted) setRatesError(e?.message ?? "Ошибка получения курса");
      } finally {
        if (mounted) setRatesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [item.price]);

  const favorites = useSelector(
    (state: RootState) => state.favorites?.ids ?? []
  );
  const isFavorite: boolean = Array.isArray(favorites)
    ? favorites.some((f) => f.article === item.article)
    : false;

  useEffect(() => {
    if (isOpenSettings) {
      setTimeout(() => setIsVisible(true), 10); // немного задержки, чтобы применился transition
    } else {
      setIsVisible(false);
    }
  }, [isOpenSettings]);

  const handlers = useSwipeable({
    onSwipedDown: () => setIsOpenSettings(false),
  });

  const handleRemoveFromCart = async () => {
    try {
      if (user) {
        const res = await defaultFetch(`/users/cart/${item.id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Не удалось добавить в серверную корзину");

        const serverCart = await res.json();
        console.log(serverCart);
        dispatch(setCart(serverCart));
      } else {
        dispatch(removeFromCart({ article: item.article }));
      }
    } catch (e) {
      dispatch(removeFromCart({ article: item.article }));
    }
  };

  const fixedImages: string[] = JSON.parse(item.photos);

  return (
    <>
      <div className="flex flex-row gap-4 w-full group relative">
        <div className="relative xl:min-w-[120px] lg:min-w-[90px] sm:min-w-[120px] min-w-[90px] xl:w-[120px] lg:w-[90px] sm:w-[120px] w-[90px] xl:h-[120px] lg:h-[90px] sm:h-[120px] h-[90px] rounded-[8px] overflow-hidden">
          <Image
            src={fixedImages[0]}
            alt="Product"
            fill
            className="object-cover rounded-[8px]"
          />
          <div
            className="md:block hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 p-3 w-[44px] h-[44px] bg-black rounded-full group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            onClick={() => toggleFavorite(item, isFavorite, dispatch, user)}
          >
            <Image
              src="/resources/Heart-white.svg"
              width={20}
              height={20}
              alt="Heart"
              className={`${
                isFavorite ? "hidden" : ""
              } absolute inset-0 m-auto transition-all duration-150 opacity-100 active:scale-90`}
            />
            <Image
              src="/resources/Heart-fill_white.svg"
              width={20}
              height={20}
              alt="Heart red"
              className={`${
                isFavorite ? "opacity-100" : ""
              } absolute inset-0 m-auto transition-all duration-150 opacity-0 active:scale-90`}
            />
          </div>
          {/* <div className="">
            <Image
              src="/resources/Heart_white.svg"
              alt="Добавить в избранное"
              width={20}
              height={20}
              className=""
              onClick={() => console.log("Добавить в избранное", item.id)}
            />
          </div> */}
        </div>
        <div className="flex flex-col items-end justify-between sm:gap-1 gap-4 w-full">
          <div className="flex flex-row items-start justify-between xl:gap-[40px] gap-[20px] w-full">
            <div className="flex flex-col gap-2">
              <Text variant="Bold">
                {item.name} {item.brand.name} {item.model_with_generation}
              </Text>
              <div className="flex flex-row items-center gap-2">
                <Text variant="Body">Артикул:</Text>
                <div className="p-2 rounded-[8px] bg-gray_back">
                  <Text variant="Body">{item.article}</Text>
                </div>
              </div>
            </div>
            <div className="sm:flex hidden flex-row xl:gap-6 gap-3 items-center">
              <button
                type="button"
                onClick={handleRemoveFromCart}
                className="p-2 bg-gray_back rounded-full w-fit min-w-[30px] max-h-[30px] max-w-[30px] min-h-[30px] text-center transition-all hover:bg-blue_main hover:text-white hover:rotate-90 "
              >
                <CgClose className="w-[14px] h-[14px] mx-auto" />
              </button>
            </div>
            <div
              className="sm:hidden block cursor-pointer min-w-[10px]"
              onClick={() => setIsOpenSettings(true)}
            >
              <Image
                src={"/resources/dots.svg"}
                width={3}
                height={10}
                alt="Dots"
              />
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <H3 className="text-[20px] !font-bold">{bynPrice.toFixed(2)}</H3>
            <H3 className="text-[20px] !font-bold">BYN</H3>
          </div>
        </div>
      </div>
      {isOpenSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 sm:hidden flex items-end">
          <div
            className="absolute inset-0"
            onClick={() => setIsOpenSettings(false)}
          ></div>

          {/* Анимируемая часть */}
          <div
            className={`relative w-full bg-white px-4 py-2 z-10 transform transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div
              className="w-[60px] h-[2px] bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
              onClick={() => setIsOpenSettings(false)}
            ></div>
            <div className="flex flex-row justify-between py-4">
              <button
                onClick={() => {
                  dispatch(removeFromCart({ article: item.article }));
                  setIsOpenSettings(false);
                }}
                className=""
              >
                <Text variant="Body">Удалить</Text>
              </button>
              <button
                className="flex flex-row items-center gap-2"
                onClick={() => {
                  setIsOpenSettings(false);
                  toggleFavorite(item, isFavorite, dispatch, user);
                }}
              >
                <Image
                  src={"/resources/Heart.svg"}
                  width={20}
                  height={20}
                  alt="Heart"
                  className={`${isFavorite ? "hidden" : ""}`}
                />
                <Image
                  src="/resources/Heart_red.svg"
                  width={20}
                  height={20}
                  alt="Heart"
                  className={`${!isFavorite ? "hidden" : ""}`}
                />
                <Text variant="Body">
                  {isFavorite ? "В избранном" : "В избранное"}
                </Text>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InfoRow: React.FC<RowProps> = ({
  label,
  value,
  colorLabel = "black_60",
  colorValue = "black",
}) => {
  return (
    <div className={`flex items-end text-sm`}>
      <Text variant="Body" className={`text-${colorLabel}`}>
        {label}
      </Text>
      <div
        className={`${
          colorLabel === "blue_main" ? "separator-line-blue" : "separator-line"
        } mx-2 flex-1 h-[3px]`}
      ></div>
      <Text variant="Bold" className={`text-${colorValue}`}>
        {value}
      </Text>
    </div>
  );
};

export default CartModal;

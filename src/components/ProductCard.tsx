import Image from "next/image";
import React, { useEffect, useState } from "react";
import Text from "./headers/Text";
import H3 from "./headers/H3";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "@/redux/cartSlice";
import { Product } from "@/interfaces/Product";
import { RootState } from "@/redux/store";
import { parseNoteToFields } from "@/lib/parseNoteFields";
import { bynToUsd, formatMoney, getNbrbRates, rubToByn } from "@/lib/nbrb";
import { toggleFavorite } from "@/lib/addToFavorite";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { UserData } from "@/Types/UserData";
import { showTopNotice } from "@/redux/uiTopNoticeSlice";
import Link from "next/link";
import { startLoading } from "@/redux/loadingSlice";

interface ProductCardProps {
  product: Product;
  user: UserData | null;
}

interface RowProps {
  label: string;
  value: string | number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, user }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [bynPrice, setBynPrice] = useState<number>(0);
  const [usdPrice, setUsdPrice] = useState<number>(0);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: RootState) => state.favorites?.ids ?? []
  );
  const isFavorite: boolean = Array.isArray(favorites)
    ? favorites.some((f) => f.article === product.article)
    : false;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRatesLoading(true);
        const { rub, usd } = await getNbrbRates();

        const byn = rubToByn(Number(product.price), rub);

        const usdApprox = bynToUsd(byn, usd);

        if (mounted) {
          setBynPrice(byn);
          setUsdPrice(usdApprox);
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
  }, [product.price]);

  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);
  const isInCart: boolean = Array.isArray(cartItems)
    ? cartItems.some((c) => c.article === product.article)
    : false;

  const fixedImages: string[] = JSON.parse(product.photos);
    
  const handleAddToCart = async () => {
    try {
      if (!isInCart) {
        if (user) {
          const res = await defaultFetch(`/users/cart/${product.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok)
            throw new Error("Не удалось добавить в серверную корзину");

          const serverCart = await res.json();
          dispatch(setCart(serverCart));
        } else {
          dispatch(addToCart(product));
        }

        dispatch(
          showTopNotice({
            variant: "success",
            title: "Добавлен в корзину",
            subtitle: product?.name ?? undefined,
            imageUrl: fixedImages[0] ?? undefined,
            href: "/cart",
            autoHideMs: 3000,
          })
        );
      }
    } catch (e) {
      dispatch(addToCart(product));
      dispatch(
        showTopNotice({
          variant: "success",
          title: "",
          subtitle: product?.name ?? undefined,
          imageUrl: fixedImages[0] ?? undefined,
          href: "/cart",
          autoHideMs: 3000,
        })
      );
    }
  };

  return (
    <div className="h-full flex flex-col xxlg:max-w-[280px] w-full sm:gap-4 gap-3">
      <div className="relative sm:h-[200px] h-[180px] shrink-0">
        <div
          className="absolute z-[1] top-[8px] right-[8px] p-[18px] bg-white rounded-full group cursor-pointer w-[24px] h-[24px]"
          onClick={() => toggleFavorite(product, isFavorite, dispatch, user)}
        >
          <Image
            src="/resources/Heart.svg"
            width={20}
            height={20}
            alt="Heart"
            className={`${
              isFavorite ? "hidden" : ""
            } absolute inset-0 m-auto transition-all duration-150 opacity-100 group-hover:opacity-0 active:scale-90`}
          />
          <Image
            src="/resources/Heart_red.svg"
            width={20}
            height={20}
            alt="Heart red"
            className={`${
              isFavorite ? "opacity-100" : ""
            } absolute inset-0 m-auto transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-90`}
          />
        </div>

        <Link
          href={`/product/${product.article}`}
          onClick={() => dispatch(startLoading())}
          className="absolute inset-0 block"
        >
          <Image
            src={fixedImages[0]}
            alt={product.article}
            fill
            className="object-cover rounded-[8px]"
            sizes="(min-width: 640px) 200px, 180px"
          />
        </Link>
      </div>
      <div className="h-full flex flex-col justify-between">
        <div>
          <Text
            variant="PreTitle"
            className="sm:hidden block w-full text-right mb-1"
          >
            Артикул: {product.article}
          </Text>
          <Link
            href={`/product/${product.article}`}
            onClick={() => dispatch(startLoading())}
          >
            <H3 className="lg:!text-[16px] !text-[14px] !font-semibold overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] break-all">
              {product.name} {product.brand.name}{" "}
              {product.model_with_generation}
            </H3>
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-[4px] mt-[8px] mb-[4px]">
            <H3 className="lg:text-[20px] !text-[16px] !font-bold">
              {bynPrice ? formatMoney(bynPrice) : "—"}
            </H3>
            <H3 className="lg:text-[20px] !text-[16px] !font-bold">BYN</H3>
          </div>
          <Text variant="Bold" className="text-black_60">
            {ratesLoading || usdPrice === undefined
              ? "~ — $"
              : `~ ${formatMoney(usdPrice)}$`}
          </Text>
          <div className="sm:block hidden mt-[8px]">
            {product.note &&
              parseNoteToFields(product.note, product.model_with_generation)
                .filter(
                  (param) => param.label === "Артикул" || param.label === "Авто"
                )
                .map((param, idx) => (
                  <InfoRow key={idx} label={param.label} value={param.value} />
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <Button
          styles={`block w-full h-[48px] flex justify-center items-center text-center ${
            isInCart
              ? "border border-blue_main text-black"
              : "bg-blue_main text-white h-[48px] hover:bg-dark_blue_main transition"
          } rounded-[8px] text-[16px] font-semibold outline-none`}
          text={isInCart ? "В корзине" : "В корзину"}
          onClick={handleAddToCart}
        />
      </div>
      {/* <Image /> */}
    </div>
  );
};

const InfoRow: React.FC<RowProps> = ({ label, value }) => {
  return (
    <div className="flex items-end text-sm text-[#4B4B4B] mb-1">
      <Text variant="Small" className="text-black_60" children={label} />
      <span className="border-b border-dashed flex-1" />
      <Text variant="Small" className="text-black" children={value} />
    </div>
  );
};

export default ProductCard;

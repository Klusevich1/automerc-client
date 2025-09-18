import React, { useEffect, useState } from "react";
import H2 from "./headers/H2";
import Text from "./headers/Text";
import Button from "./Button";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getNbrbRates, rubToByn } from "@/lib/nbrb";
import { useFormContext, useFormState } from "react-hook-form";
import Spinner from "./Spinner";
import z from "zod";

interface RowProps {
  label: string;
  value: string | number;
}

const OrderAmount: React.FC<{
  orderLoading: boolean;
  setOrderLoading: (orderLoading: boolean) => void;
}> = ({ orderLoading, setOrderLoading }) => {
  const { control } = useFormContext();
  const { isValid, isSubmitted } = useFormState({ control });

  const [promocode, setPromocode] = useState<string>("");
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
    <div className="flex flex-col gap-7 max-w-[380px] rounded-[8px] p-[28px] bg-gray_back h-max">
      <div className="flex flex-col gap-5">
        <H2 className="sm:!text-[32px] text-[24px] !font-bold">Сумма заказа</H2>
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
        <div className="flex flex-col gap-4">
          <InfoRow
            label="Стоимотсь запчастей"
            value={bynTotalPrice.toFixed(2)}
          />
          {/* <InfoRow label="Доставка" value={"Бесплатно"} /> */}
        </div>
      </div>
      <div className="flex flex-col items-end gap-5">
        <div className="flex flex-col gap-1">
          <Text variant="Bold" children="Итого" />
          <H2 className="sm:!text-[32px] text-[24px] !font-bold">
            {bynTotalPrice.toFixed(2)} BYN
          </H2>
        </div>
        <button
          type="submit"
          className={`flex items-center justify-center w-[324px] py-[16px] disabled:bg-black_36 bg-blue_main disabled:cursor-default cursor-pointer text-center rounded-[8px] text-[16px] font-semibold text-white outline-none`}
          disabled={!isValid || cartItems.length === 0}
          form="checkoutForm"
          onClick={() => setOrderLoading(true)}
        >
          {orderLoading ? (
            <Spinner label="Оформление" showLabel={true} color="text-white" />
          ) : (
            "Оформить заказ"
          )}
        </button>
      </div>
    </div>
  );
};

const InfoRow: React.FC<RowProps> = ({ label, value }) => {
  return (
    <div className="flex items-end text-sm text-[#4B4B4B] mb-1">
      <Text variant="Body" className="text-black" children={label} />
      <span className="border-b border-dashed flex-1" />
      <Text variant="Bold" className="text-black" children={value} />
    </div>
  );
};

export default OrderAmount;

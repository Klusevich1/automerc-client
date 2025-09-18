"use client";
import Checkbox from "@/components/Checkbox";
import CustomSelect from "@/components/CustomSelect";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import Input from "@/components/Input";
import Radio from "@/components/Radio";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import OrderItem from "./OrderItem";
import H2 from "@/components/headers/H2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUser } from "@/utils/hooks/useUser";
import { getNbrbRates, rubToByn } from "@/lib/nbrb";
import { createOrder } from "@/lib/createOrder";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Spinner from "@/components/Spinner";

interface OrderListProps {
  setOrderPlaced: (orderPlaced: boolean) => void;
  bynSum: number;
  rubSum: number;
  usdSum: number;
  orderLoading: boolean;
  setOrderLoading: (orderLoading: boolean) => void;
  setOrderNumber: (orderNumber: number) => void;
}

const DELIVERY_OPTIONS: Record<string, Record<string, any[]>> = {
  by: {
    minsk: [
      {
        value: "pickup",
        title: "Самовывоз",
        note: "Бесплатно",
        description: "Привольный Луговослободской сельсовет, 16/5",
      },
      { value: "courier", title: "Курьер", description: "Служба доставки" },
    ],
    other: [
      { value: "post", title: "Почта", description: "Доставка через Белпочту" },
      {
        value: "courierService",
        title: "Курьерская служба",
        description: "Служба доставки",
      },
    ],
  },
  ru: {
    default: [
      {
        value: "sdek",
        title: "СДЭК",
        note: "Бесплатно",
        description: "Стоимость рассчитывается индивидуально",
      },
      {
        value: "kit",
        title: "КИТ",
        description: "Стоимость рассчитывается индивидуально",
      },
    ],
  },
};

const COUNTRIES = [
  { value: "by", label: "Беларусь", icon: "/resources/belarus.svg" },
  { value: "ru", label: "Россия", icon: "/resources/russia.svg" },
];

const REGIONS_BY = [
  { value: "minsk", label: "Минская область" },
  { value: "brest", label: "Брестская область" },
  { value: "vitebsk", label: "Витебская область" },
  { value: "gomel", label: "Гомельская область" },
  { value: "grodno", label: "Гродненская область" },
  { value: "mogilev", label: "Могилевская область" },
];

const OrderList: React.FC<OrderListProps> = ({
  setOrderPlaced,
  bynSum,
  rubSum,
  usdSum,
  orderLoading,
  setOrderLoading,
  setOrderNumber,
}) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  const [bynTotalPrice, setBynTotalPrice] = useState<number>(0);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitted },
  } = useFormContext();

  const region = watch("region");
  const deliveryCountry = watch("country");
  const deliveryType = watch("delivery");
  const values = watch();

  useEffect(() => {
    if (deliveryCountry === "by") {
      setValue("phoneCode", "+375", { shouldValidate: true });
    }
    if (deliveryCountry === "ru") {
      setValue("phoneCode", "+7", { shouldValidate: true });
    }
  }, [deliveryCountry, setValue]);

  const getDeliveryOptions = () => {
    if (deliveryCountry === "ru") return DELIVERY_OPTIONS.ru.default;

    if (deliveryCountry === "by") {
      const regionLower = region.toLowerCase();
      if (regionLower.includes("minsk")) {
        return DELIVERY_OPTIONS.by.minsk;
      } else {
        return DELIVERY_OPTIONS.by.other;
      }
    }

    return [];
  };

  const deliveryOptions = getDeliveryOptions();

  useEffect(() => {
    if (!user) return;
    setValue("email", user.email ?? "", { shouldValidate: true });
    setValue("firstName", user.firstName ?? "", { shouldValidate: true });
    setValue("lastName", user.lastName ?? "", { shouldValidate: true });
    setValue("middleName", user.middleName ?? "", { shouldValidate: true });
    setValue("street", user.selectedAddress?.street ?? "", {
      shouldValidate: true,
    });
    setValue("intercom", user.selectedAddress?.intercom ?? "", {
      shouldValidate: true,
    });
    setValue("entrance", user.selectedAddress?.entrance ?? "", {
      shouldValidate: true,
    });
    setValue("floor", user.selectedAddress?.floor ?? "", {
      shouldValidate: true,
    });
    setValue("apartment", user.selectedAddress?.apartment ?? "", {
      shouldValidate: true,
    });
  }, [user, setValue]);

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

  const onSubmit = async (data: any) => {
    try {
      setOrderLoading(true);
      const response = await createOrder(
        data,
        cartItems,
        bynSum,
        rubSum,
        usdSum,
        dispatch,
        user
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOrderNumber(response.orderNumber);
      setOrderPlaced(true);
      console.log("Заказ успешно создан:", response.orderNumber);
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const isStep1Valid = (values: any) => {
    return (
      values.country &&
      values.region &&
      values.city &&
      values.delivery &&
      (values.delivery === "pickup" || values.street)
    );
  };

  const isStep2Valid = (values: any) => {
    return (
      values.phoneCode &&
      values.phoneNumber &&
      values.lastName &&
      values.firstName &&
      values.acceptedPolitics &&
      values.acceptedNotifications
    );
  };

  useEffect(() => {
    const options = getDeliveryOptions();
    const currentDelivery = watch("delivery");

    const isCurrentValid = options.some((opt) => opt.value === currentDelivery);
    if (!isCurrentValid && options.length > 0) {
      setValue("delivery", options[0].value);
    }
  }, [deliveryCountry, region]);

  useEffect(() => {
    const currentRegion = watch("region");
    const options = REGIONS_BY;
    const isBelRegion = options?.some((opt) => opt.value === currentRegion);

    if (
      deliveryCountry === "by" &&
      !isBelRegion &&
      options &&
      options?.length > 0
    ) {
      setValue("region", options[0].value);
    }
    if (isBelRegion && deliveryCountry === "ru") {
      setValue("region", "");
    }
  }, [deliveryCountry]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="checkoutForm">
      <ul className="w-full flex flex-col gap-12">
        <OrderItem
          title="Адрес и способ доставки"
          step="1 / 3"
          label="Выберите способ доставки"
          defaultOpen
        >
          <>
            <H3 className="text-right hidden xl:inline">Населённый пункт</H3>
            <div className="flex flex-col gap-[20px] xl:max-w-[380px]">
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={COUNTRIES}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {deliveryCountry === "ru" ? (
                <Input
                  {...register("region", { required: true })}
                  placeholder="Введите область*"
                  onChange={(e) => register("region").onChange(e)}
                  error={getErrorMessage(errors.region)}
                />
              ) : (
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      options={REGIONS_BY || []}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
              )}

              <Input
                {...register("city", { required: true })}
                placeholder="Введите город* "
                onChange={(e) => register("city").onChange(e)}
                error={getErrorMessage(errors.city)}
              />
            </div>

            <H3 className="text-right hidden xl:inline">Способ доставки</H3>
            <div>
              <Controller
                name="delivery"
                control={control}
                render={({ field }) => (
                  <Radio
                    name="delivery"
                    selected={field.value}
                    onChange={field.onChange}
                    options={deliveryOptions}
                  />
                )}
              />
            </div>

            {deliveryType !== "pickup" && (
              <>
                <H3 className="text-right hidden xl:inline">Адрес</H3>
                <div className="flex flex-col gap-[20px]">
                  <Input
                    {...register("street")}
                    placeholder="Улица и дом*"
                    onChange={(e) =>
                      register("street", { required: true }).onChange(e)
                    }
                    error={getErrorMessage(errors.street)}
                  />
                  {deliveryCountry === "by" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
                      <Input
                        {...register("intercom")}
                        placeholder="Домофон"
                        onChange={(e) => register("intercom").onChange(e)}
                      />
                      <Input
                        {...register("entrance")}
                        placeholder="Подъезд"
                        onChange={(e) => register("entrance").onChange(e)}
                      />
                      <Input
                        {...register("floor")}
                        placeholder="Этаж"
                        onChange={(e) => register("floor").onChange(e)}
                      />
                      <Input
                        {...register("apartment")}
                        placeholder="Кв./офис"
                        onChange={(e) => register("apartment").onChange(e)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* <div className="flex flex-col gap-5">
              <div className="flex gap-2">
                <div className="bg-gray_stroke w-[80px] h-[80px] rounded-lg"></div>
                <div className="bg-gray_stroke w-[80px] h-[80px] rounded-lg"></div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex w-full">
                  <Text>Стоимость запчастей </Text>

                  <span className="border-b border-dashed flex-1" />

                  <Text variant="Bold">89,87 BYN</Text>
                </div>

                <div className="flex w-full">
                  <Text>Доставка</Text>

                  <span className="border-b border-dashed flex-1" />

                  <Text variant="Bold">Индивидуально</Text>
                </div>
              </div>
            </div> */}
          </>
        </OrderItem>

        <OrderItem
          title="Получатель"
          step="2 / 3"
          label="Введите контактные данные"
          disabled={!isStep1Valid(values)}
        >
          <>
            <H3 className="text-right hidden xl:inline">Контакты</H3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="max-w-[80px]">
                  <Controller
                    name="phoneCode"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="phone"
                        placeholder="+375*"
                        maxLength={4}
                        error={getErrorMessage(errors.phoneCode)}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="phone"
                      placeholder="290000000*"
                      maxLength={10}
                      error={getErrorMessage(errors.phoneNumber)}
                    />
                  )}
                />
              </div>

              <Input {...register("email")} placeholder="email" type="email" />
            </div>

            <H3 className="text-right hidden xl:inline">Ваши данные</H3>
            <div className="flex flex-col gap-5">
              <Input
                {...register("lastName", { required: true })}
                placeholder="Фамилия*"
                error={getErrorMessage(errors.lastName)}
              />
              <Input
                {...register("firstName", { required: true })}
                placeholder="Имя*"
                error={getErrorMessage(errors.firstName)}
              />
              <Input {...register("middleName")} placeholder="Отчество" />

              <Controller
                name="acceptedPolitics"
                control={control}
                rules={{
                  required: "Подтвердите, что вы ознакомились с документами",
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Checkbox
                    checked={value!}
                    onChange={onChange}
                    label="Я даю согласие на обработку персональных данных в соответствии с Политикой обработки персональных данных"
                    error={isSubmitted ? error?.message : undefined}
                  />
                )}
              />

              <Controller
                name="acceptedNotifications"
                control={control}
                rules={{
                  required: "Подтвердите, что вы ознакомились с документами",
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Checkbox
                    checked={value!}
                    onChange={onChange}
                    label="Я даю согласие на получение рекламных рассылок в виде e-mail, sms, push или в мессенджерах"
                    error={isSubmitted ? error?.message : undefined}
                  />
                )}
              />
            </div>
          </>
        </OrderItem>

        <OrderItem
          title="Способы оплаты"
          step="3 / 3"
          label="Выберите способ оплаты"
          disabled={!isStep2Valid(values) || !isStep1Valid(values)}
        >
          <>
            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <Radio
                  className="xl:col-start-2"
                  name="payment"
                  selected={field.value}
                  onChange={field.onChange}
                  size="small"
                  options={[
                    {
                      value: "cash",
                      title: "При получении наличными",
                      icon: "/resources/wallet-2.svg",
                    },
                    // {
                    //   value: "online",
                    //   title: "Оплата онлайн",
                    //   icon: "/resources/card.svg",
                    // },
                    // {
                    //   value: "erip",
                    //   title: "ЕРИП",
                    //   icon: "/resources/erip.svg",
                    //   iconWidth: 56,
                    //   iconHeight: 24,
                    // },
                    // {
                    //   value: "installmentCard",
                    //   title: "Карта рассрочки онлайн",
                    //   icon: "/resources/coin.svg",
                    // },
                  ]}
                />
              )}
            />

            <div className="flex flex-col gap-5 lg:hidden">
              <div className="p-4 flex flex-row items-center border-dashed border-[1px] rounded-[8px] border-black_36">
                <input
                  placeholder="Введите промокод"
                  className="w-full text-[14px] font-medium bg-transparent outline-none text-black_60"
                  {...register("promocode")}
                  onChange={(e) => register("promocode").onChange(e)}
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
              <div className="flex flex-col gap-3">
                <div className="flex w-full">
                  <Text>Стоимость запчастей </Text>

                  <span className="border-b border-dashed flex-1" />

                  <Text variant="Bold">{bynTotalPrice.toFixed(2)} BYN</Text>
                </div>

                <div className="flex w-full">
                  <Text>Скидка</Text>

                  <span className="border-b border-dashed flex-1" />

                  <Text variant="Bold">
                    -{(bynTotalPrice * 0.1).toFixed(2)} BYN
                  </Text>
                </div>
              </div>

              <div className="flex self-end flex-col gap-1">
                <p className="font-bold text-right">Итого</p>
                <H2 className="!font-bold !text-[24px] font-manrope -tracking-[0.02em]">
                  {bynTotalPrice.toFixed(2)} BYN
                </H2>
              </div>
            </div>
          </>
        </OrderItem>
      </ul>

      <div className="grid xl:grid-cols-[210px_1fr] pt-7">
        <button
          type="submit"
          className={`flex items-center justify-center xl:col-start-2 py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none ${
            !isValid || cartItems.length === 0 ? "" : "cursor-pointer"
          }  disabled:bg-black_36`}
          disabled={!isValid || cartItems.length === 0}
        >
          {orderLoading ? (
            <Spinner label="Оформление" showLabel={true} color="text-white" />
          ) : (
            "Оформить заказ"
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderList;

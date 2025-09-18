import Breadcrumbs from "@/components/Breadcrumbs";
import OrderAmount from "@/components/OrderAmount";
import BasicLayout from "@/layouts/BasicLayout";
import React, { useEffect, useState } from "react";
import OrderList from "./components/OrderList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { bynToUsd, getNbrbRates, rubToByn } from "@/lib/nbrb";
import H1 from "@/components/headers/H1";
import Text from "@/components/headers/Text";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { phone } from "phone";
import { useUser } from "@/utils/hooks/useUser";
import H2 from "@/components/headers/H2";

const PAGE_NAME = "checkout";
const BREADCRUMB_PAGE_NAME = "Оформление заказа";

const BREADCRUMBS = [
  { name: "Главная", link: "/" },
  { name: BREADCRUMB_PAGE_NAME, link: `/${PAGE_NAME}` },
];

const validationSchema = yup.object().shape({
  country: yup.string().required("Страна обязательна"),
  region: yup.string().required("Область обязательна"),
  city: yup.string().required("Город обязателен"),
  delivery: yup.string().required("Выберите способ доставки"),
  street: yup.string().when("delivery", {
    is: (val: string) => val !== "pickup",
    then: (schema) => schema.required("Улица и дом обязательны"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneCode: yup.string().required("Код обязателен"),

  phoneNumber: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Некорректный номер", function (val) {
      const { country } = this.parent;

      if (!val || !country) return false;

      const countryCode = country === "by" ? "BY" : "RU";
      return phone(val, { country: countryCode }).isValid;
    }),
  email: yup.string().email("Некорректный email").nullable().notRequired(),
  lastName: yup.string().required("Фамилия обязательна"),
  firstName: yup.string().required("Имя обязательно"),
  middleName: yup.string().notRequired(),
  acceptedPolitics: yup
    .boolean()
    .oneOf([true], "Необходимо согласие на обработку данных"),
  acceptedNotifications: yup
    .boolean()
    .oneOf([true], "Необходимо согласие на уведомления"),
  payment: yup.string().required("Выберите способ оплаты"),
  intercom: yup.string().notRequired(),
  entrance: yup.string().notRequired(),
  floor: yup.string().notRequired(),
  apartment: yup.string().notRequired(),
  promocode: yup.string().notRequired(),
});

const Checkout: React.FC = () => {
  const { user } = useUser();

  const methods = useForm({
    defaultValues: {
      country: "by",
      region: "minsk",
      city: "",
      delivery: "pickup",
      street: "",
      intercom: "",
      entrance: "",
      floor: "",
      apartment: "",
      phoneCode: "+375",
      phoneNumber: "",
      email: user?.email || "",
      lastName: "",
      firstName: "",
      middleName: "",
      payment: "cash",
      acceptedPolitics: false,
      acceptedNotifications: false,
      promocode: "",
    },
    mode: "onChange", // чтобы isValid обновлялся по вводу
    resolver: yupResolver(validationSchema),
  });
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<number>(0);

  const [bynSum, setBynSum] = useState<number>(0);
  const [rubSum, setRubSum] = useState<number>(0);
  const [usdSum, setUsdSum] = useState<number>(0);
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

        const usdApprox = bynToUsd(byn, usd);

        if (mounted) {
          setBynSum(Number(byn.toFixed(2)));
          setRubSum(
            Number(
              cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)
            )
          );
          setUsdSum(Number(usdApprox.toFixed(2)));
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
    <>
      <BasicLayout>
        {/* <Header /> */}
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        {orderPlaced ? (
          <div className="flex flex-col items-center gap-3">
            <H2 className="lg:!text-[32px] !text-[24px] !font-bold">Заказ №{orderNumber} оформлен!</H2>
            <Text variant="Body" className="lg:!text-[20px] !text-[16px] text-center">
              Наш менеджер свяжется с Вами для подтверждения заказа
            </Text>
          </div>
        ) : (
          <>
            <h1 className="font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em] ">
              Оформление заказа
            </h1>
            <FormProvider {...methods}>
              <div className="flex gap-[120px] mt-7">
                <div className="flex-1 min-h-full">
                  <OrderList
                    setOrderPlaced={setOrderPlaced}
                    bynSum={bynSum}
                    rubSum={rubSum}
                    usdSum={usdSum}
                    orderLoading={orderLoading}
                    setOrderLoading={setOrderLoading}
                    setOrderNumber={setOrderNumber}
                  />
                </div>
                <div className="hidden lg:block">
                  <OrderAmount
                    orderLoading={orderLoading}
                    setOrderLoading={setOrderLoading}
                  />
                </div>
              </div>
            </FormProvider>
          </>
        )}
      </BasicLayout>
    </>
  );
};

export default Checkout;

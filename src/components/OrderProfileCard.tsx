import { Order } from "@/interfaces/Order";
import React from "react";
import Text from "./headers/Text";
import H3 from "./headers/H3";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const OrderProfileCard: React.FC<{ order: Order; idx: number }> = ({
  order,
  idx,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  console.log(order);

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("ru-RU", options);
  };

  // Функция для добавления одного дня к дате
  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("ru-RU", options);
  };
  return (
    <div
      className={`max-w-[880px] w-full pb-7 ${
        idx > 0 ? "py-7 border-t border-stroke" : "pb-7"
      } flex lg:flex-row flex-col justify-between`}
    >
      <div className="flex lg:flex-row flex-col items-stretch lg:gap-0 gap-4 lg:mb-0 mb-4">
        <div className="lg:max-w-[280px] flex flex-col justify-between items-stretch">
          <div className="flex flex-row items-center gap-4 lg:mb-0 mb-4">
            <div
              className={`py-1 px-2 text-[14px] font-bold text-white ${
                order.status === "Ожидается"
                  ? "bg-black_36"
                  : order.status === "Выполнен"
                  ? "bg-green"
                  : order.status === "Отменен"
                  ? "bg-red"
                  : ""
              } bg-black_36 rounded-[8px]`}
            >
              {order.status}
            </div>
            <Text variant="Body">{order.orderNumber}</Text>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-col flex-none gap-1">
              <H3 className="l">{formatDate(order.createdAt)}</H3>
              <Text variant="Small">Дата заказа</Text>
            </div>
            <div className="lg:w-[60px] w-full h-[1px] bg-black"></div>
            <div className="flex flex-col flex-none gap-1">
              <H3>{addOneDay(order.createdAt)}</H3>{" "}
              <Text variant="Small">{order.status}</Text>
            </div>
          </div>
        </div>
        <div className="lg:ml-[55px] flex flex-col justify-start gap-2">
          <Text variant="Bold" className="">
            Состав / {order.items.length} шт.
          </Text>
          <div className="w-full flex flex-row justify-start gap-2">
            {order.items.length > 2 && window.innerWidth > 1023 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={8}
                slidesPerView={2.1}
                navigation
                pagination={{ clickable: true }}
                className="w-fit lg:max-w-[200px] swiper-orders"
              >
                {order.items.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      className="w-[80px] h-[80px] cursor-pointer"
                      onClick={() => {
                        dispatch(startLoading());
                        router.push(`/product/${item.article}`);
                      }}
                    >
                      <Image
                        src={item.photo}
                        width={80}
                        height={80}
                        alt={`${item.article}`}
                        className="object-cover h-full rounded-[8px] min-h-[80px]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[80px] h-[80px] cursor-pointer"
                  onClick={() => {
                    dispatch(startLoading());
                    router.push(`/product/${item.article}`);
                  }}
                >
                  <Image
                    src={item.photo}
                    width={80}
                    height={80}
                    alt={`${item.article}`}
                    className="object-cover h-full rounded-[8px] min-h-[80px]"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:gap-2 gap-1 lg:items-end items-start">
        <Text variant="Small">Сумма</Text>
        <H3 className="!text-[20px] !font-bold">{order.bynSum} BYN</H3>
      </div>
    </div>
  );
};

export default OrderProfileCard;

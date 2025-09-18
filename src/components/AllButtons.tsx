import React from "react";
import Button from "./Button";

const AllButtons = () => {
  return (
    <>
      {/* Все кнопки */}
      <div className="flex flex-col">
        <Button
          styles="m-4 w-[219px] py-[16px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
          text="Добавить в корзину"
        />
        <Button
          styles="m-4 w-[219px] py-[16px] text-center border border-blue_main rounded-[8px] text-black font-semibold text-white outline-none"
          text="Добавлено в корзину"
        />
        <Button
          styles="m-4 w-[167px] py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
          text="Начать поиск"
        />
        <Button
          styles="m-4 w-[176px] py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
          text="В корзину"
        />
        <Button
          styles="m-4 w-[496px] py-[16px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
          text="Оформить заказ"
        />
        <Button
          styles="m-4 w-[280px] py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
          text="В корзину"
        />
        <Button
          styles="m-4 w-[280px] py-[12px] text-center border border-blue_main rounded-[8px] text-black font-semibold text-white outline-none"
          text="Подробнее"
        />
      </div>
    </>
  );
};

export default AllButtons;

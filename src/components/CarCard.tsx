import Image from "next/image";
import React, { useState } from "react";
import Text from "./headers/Text";
import H3 from "./headers/H3";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { Product } from "@/interfaces/Product";
import { RootState } from "@/redux/store";
import { Car } from "@/interfaces/Car";

interface CarCardProps {
  car: Car;
}

interface RowProps {
  label: string;
  value: string | number;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="flex flex-col lg:max-w-[280px] sm:gap-4 gap-3">
      <div className="relative bg-black_8 sm:h-[200px] h-[180px] rounded-[10px]">
      </div>
      <div>
        <H3>
          {car.make} {car.model} {car.generation}
        </H3>
        <div className="sm:block hidden mt-[8px]">
          {car.parameters.map((param, idx) => (
            <InfoRow key={idx} label={param.name} value={param.value} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <Button
          styles={
            "sm:block hidden w-full py-[12px] text-center border border-blue_main text-black rounded-[8px] text-[16px] font-semibold outline-none`}"
          }
          text="Подробнее"
          href={`/cars/${car.slug}`}
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

export default CarCard;

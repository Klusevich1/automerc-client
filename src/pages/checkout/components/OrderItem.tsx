"use client";
import H2 from "@/components/headers/H2";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface OrderItemProps {
  children: React.ReactNode;
  title: string;
  step: string;
  label: string;
  disabled?: boolean;
  defaultOpen?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({
  children,
  step,
  title,
  label,
  disabled = false,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);
  return (
    <li
      className={`rounded-lg transition duration-300 ${
        !disabled ? "text-black h-max" : "text-black_60 h-max"
      }`}
    >
      <div
        className={`flex h-[33px] justify-between cursor-pointer items-center`}
        onClick={handleOpen}
      >
        <div className="flex gap-3 xl:grid xl:grid-cols-[140px_1fr] xl:gap-x-[60px]">
          <H3 className="text-right !font-bold !text-[20px] xl:!text-[24px] font-manrope -tracking-[0.02em] ">
            {step}
          </H3>
          <H3 className="!font-bold !text-[20px] xl:!text-[24px] font-manrope -tracking-[0.02em] ">
            {title}
          </H3>
        </div>

        <div className={`flex align-center ${isOpen ? "rotate-180" : ""}`}>
          <Image
            src="/resources/arrow-down.svg"
            width={24}
            height={24}
            alt="Arrow"
          />
        </div>
      </div>

      {!isOpen ? (
        <Text className="text-black_60 ml-[52px] xl:ml-[200px] mt-4">
          {label}
        </Text>
      ) : (
        <div className="grid xl:grid-cols-[140px_1fr] xl:gap-x-[60px] gap-y-12 mt-7">
          {children}
        </div>
      )}
    </li>
  );
};

export default OrderItem;

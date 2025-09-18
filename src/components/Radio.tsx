"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";
import H3 from "./headers/H3";
import Text from "./headers/Text";

interface RadioOption {
  value: string;
  title: string;
  description?: string;
  note?: string;
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
}

interface RadioProps {
  name: string;
  selected: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  size?: "small" | "large";
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  name,
  selected,
  onChange,
  options,
  size = "large",
  className,
}) => {
  const sizeClasses = size === "small" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start gap-3 cursor-pointer border-b border-stroke pb-4"
        >
          <div className="flex items-center pt-1">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className={clsx(
                "appearance-none rounded-full border border-gray-400 checked:border-[5px] checked:border-black cursor-pointer",
                sizeClasses
              )}
            />
          </div>
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col justify-between gap-2 font-medium text-sm">
              {size === "small" ? (
                <Text variant="Bold" className="!font-bold">{option.title}</Text>
              ) : (
                <H3 className="!font-bold">{option.title}</H3>
              )}
              {option.description && <Text variant="Small" className="lg:!text-[16px] !text-[14px]">{option.description}</Text>}
            </div>
            <div>
              {option.note && !option.icon && <Text variant="Bold">{option.note}</Text>}
              {option.icon && (
                <Image
                  src={option.icon}
                  alt={option.title}
                  width={option.iconWidth ?? 24}
                  height={option.iconHeight ?? 24}
                />
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default Radio;

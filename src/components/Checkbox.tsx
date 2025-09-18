"use client";

import clsx from "clsx";
import React from "react";
import Text from "./headers/Text";

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  error?: string;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, error, id }) => {
  const checkboxId = id || `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={checkboxId} className="flex items-start gap-2 cursor-pointer select-none">
        <div className="relative min-w-[16px] h-4 mt-1">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="opacity-0 absolute w-full h-full z-10 cursor-pointer"
          />
          <div
            className={clsx(
              "w-full h-full box-border transition-all duration-150 bg-white border border-black",
              checked && "border-[5px]"
            )}
          />
        </div>
        <Text variant="Small">{label}</Text>
      </label>
      {error && (
        <Text variant="PreTitle" className="text-red ml-6 font-medium">
          {error}
        </Text>
      )}
    </div>
  );
};

export default Checkbox;

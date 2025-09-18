"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Text from "./headers/Text";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(
    options.find((opt) => opt.value === value) || options[0]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const newSelected = options.find((opt) => opt.value === value);
    if (newSelected) setSelected(newSelected);
  }, [value, options]);

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        className="w-full flex items-center justify-between py-2 border-b border-stroke cursor-pointer bg-white"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <div className="flex items-center gap-2">
          {selected?.icon && (
            <img src={selected.icon} alt={selected.label} className="w-5 h-5 rounded-full" />
          )}
          <Text>{selected?.label}</Text>
        </div>

        <div
          className={`flex align-center transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <Image src="/resources/arrow-down.svg" width={24} height={24} alt="Arrow" />
        </div>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white rounded-lg shadow-custom flex flex-col mt-[8px]">
          {options.map((option) => (
            <li
              key={option.value}
              className="flex items-center gap-2 hover:bg-gray-100 w-full py-[6px] cursor-pointer px-[12px]"
              onClick={() => handleSelect(option)}
            >
              {option.icon && (
                <img src={option.icon} alt={option.label} className="w-5 h-5 rounded-full" />
              )}
              <Text>{option.label}</Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

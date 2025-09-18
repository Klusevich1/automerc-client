import { useState, useRef, useEffect } from "react";
import Text from "./headers/Text";
import Image from "next/image";

export interface Option<T> {
  id: number | string;
  label: string;
  data: T;
}

interface CustomSortSelectProps<T> {
  value: number | string;
  options: Option<T>[];
  placeholder?: string;
  type: string;
  onChange: (selected: T) => void;
  disabled?: boolean;
  forceOpen?: boolean;
  selectWidth?: string;
  openWidth?: string;
}

function CustomSortSelect<T>({
  value,
  options,
  placeholder = "Select...",
  type,
  onChange,
  disabled = false,
  forceOpen,
  selectWidth = "sm:w-[150px] w-full",
  openWidth = "w-[400px]",
}: CustomSortSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  return (
    <div
      className={`relative ${selectWidth} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={ref}
    >
      <div
        className={`h-[35px] px-3 rounded-full ${
          type === "sort" ? "" : "border border-black"
        } text-[15px] text-black flex items-center justify-between cursor-pointer bg-white`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Text variant="Bold" className={`truncate ${selectWidth} text-center`}>
          {selectedOption?.label || placeholder}
        </Text>
        <Image
          src={"/resources/arrow-thin.svg"}
          width={16}
          height={26}
          alt="Arrow"
          className="min-w-[16px]"
        />
      </div>
      {isOpen && (
        <ul
          className={`absolute right-0 z-10 mt-1 ${openWidth} max-h-[300px] overflow-auto bg-white shadow-[0_0_10px_rgba(96,82,234,0.3)] rounded-[8px]`}
        >
          {options.map((opt, idx) => (
            <li
              key={opt.id}
              className={`px-3 ${
                idx === 0 ? "pt-3" : idx === options.length - 1 ? "pb-3" : ""
              } py-[6px] text-[14px] truncate cursor-pointer hover:bg-gray-100`}
              title={opt.label}
              onClick={() => {
                onChange(opt.data);
                setIsOpen(false);
              }}
            >
              <Text variant={opt.id === selectedOption?.id ? "Bold" : "Body"}>
                {opt.label}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSortSelect;

import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  label: string;
  value: string;
  count: number;
}

interface DropdownListProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({
  options,
  value,
  onChange,
  placeholder = "Выберите...",
  className = "",
  showSearch = true,
  searchValue,
  onSearchChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlledSearch = searchValue !== undefined && onSearchChange !== undefined;
  const currentSearch = isControlledSearch ? searchValue : internalSearch;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(currentSearch.toLowerCase())
  );

  const toggleValue = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSelected = (val: string) => value === val;

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        className=" font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedLabel}
        <svg className="w-2.5 h-2.5 ml-2" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`absolute z-10 mt-2 p-5 bg-white rounded-lg shadow-sm w-60 transition-all duration-200 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
      >
        {showSearch && (
          <div className="mb-2">
            <div className="relative">
              <input
                type="text"
                className="block w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Найти"
                value={currentSearch}
                onChange={(e) =>
                  isControlledSearch
                    ? onSearchChange?.(e.target.value)
                    : setInternalSearch(e.target.value)
                }
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M19 19L15 15M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        <ul className="h-48 overflow-y-auto custom-scrollbar text-sm pb-3">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              className="flex items-center mb-2 pr-6 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleValue(opt.value)}
            >
              <input
                type="radio"
                id={`dropdown-${opt.value}`}
                checked={isSelected(opt.value)}
                onChange={() => toggleValue(opt.value)}
                className="hidden"
              />
              <label
                htmlFor={`dropdown-${opt.value}`}
                className="text-sm font-medium"
              >
                {opt.label} 
                <span className="text-black_40 pl-1">
                    {opt.count}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownList;

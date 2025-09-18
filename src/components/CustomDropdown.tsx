import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Text from "./headers/Text";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import { useRouter } from "next/router";
import { initialCategory } from "@/initialStates/initialCategory";
import { Subcategory } from "@/interfaces/Subcategory";

interface BaseDropdownItem {
  id: number;
  name: string;
  slug: string;
}

interface CustomDropdownProps<T extends BaseDropdownItem> {
  name: string;
  placeholder: string;
  value: T | null;
  options: T[];
  forceOpen: boolean;
  index: number;
  // onToggle: (name: string) => void;
  onChange: (selected: T, index: number) => void;
  initialValue: T;

  getChildren?: (parent: T) => Subcategory[] | undefined; // вернуть subcategories
  childValue?: Subcategory | null; // выбранная подкатегория
  childPlaceholder?: string; // плейсхолдер для подкатегорий
  onChangeChild?: (child: Subcategory, index: number) => void; // выбор подкатегории
  // onSelect?: (item: T) => void; // если нужно передать выбранный объект наружу
}

function CustomDropdown<T extends BaseDropdownItem>({
  name,
  placeholder,
  options,
  value,
  index,
  forceOpen,
  onChange,
  initialValue,
  getChildren,
  childValue,
  childPlaceholder = "Выберите подкатегорию",
  onChangeChild,
}: CustomDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<"parent" | "child">("parent");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setStage("parent");
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

  useEffect(() => {
    if (!value) setStage("parent");
  }, [value]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectParent = (option: T) => {
    if (name !== "sparepart" || !getChildren) {
      setIsOpen(false);
      onChange(option, index);
      setSearch("");
      return;
    }
    onChange(option, index);
    setSearch("");
    setStage("child");
    setIsOpen(true);
  };

  const handleSelectChild = (child: Subcategory) => {
    onChangeChild?.(child, index + 1);
    setSearch("");
    setStage("parent");
    setIsOpen(false);
  };

  const handleBackToParents = () => {
    setSearch("");
    setStage("parent");
    if (initialValue) onChange(initialValue, index);
  };

  const childOptions: Subcategory[] =
    name === "sparepart" && getChildren && value
      ? getChildren(value) ?? []
      : [];

  const filteredChildren = childOptions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full flex-1 min-w-0" ref={ref}>
      {name === "sortSelect" ? (
        <div className="flex flex-row items-center gap-7 px-5 py-2">
          <div className={`w-full cursor-pointer transition-colors`}>
            <Text variant="Bold">{value?.name || placeholder}</Text>
          </div>
          <div className="min-w-[16px]">
            <Image
              src="/resources/arrow-thin.svg"
              width={16}
              height={16}
              alt="Arrow"
            />
          </div>
        </div>
      ) : name === `subcategory-${index}` ? (
        <></>
      ) : (
        <>
          <div
            className={`w-full border ${
              isOpen ? "border-blue_main" : "border-stroke"
            } rounded-[8px] px-3 py-3 pr-10 cursor-pointer transition-colors ${
              value?.name === "" ? "text-black_60" : "text-black"
            } overflow-hidden text-ellipsis whitespace-nowrap `}
            style={{ maxWidth: "100%" }}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {value?.name || placeholder}{" "}
            {childValue?.name && ` - ${childValue.name}`}
          </div>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Image
              src="/resources/arrow-down.svg"
              width={16}
              height={16}
              alt="Arrow"
            />
          </div>
        </>
      )}

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-1 bg-white ${
            name === "sortSelect"
              ? "w-[264px]"
              : "border border-stroke overflow-hidden"
          } shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-[8px]`}
        >
          {name === "sparepart" && (
            <>
              <Text variant="Bold" className="p-3 pb-0">
                {stage === "parent"
                  ? "Выберите категорию"
                  : "Выберите подкатегорию"}
              </Text>

              {stage === "child" && (
                <div
                  className="flex flex-row items-center gap-1 p-3 pb-0 cursor-pointer"
                  onClick={handleBackToParents}
                >
                  <Image
                    src={"/resources/arrow-down.svg"}
                    width={20}
                    height={20}
                    alt="Arrow"
                    className="rotate-90"
                  />
                  <Text variant="Small" className="leading-[20px]">
                    {value?.name}
                  </Text>
                </div>
              )}
            </>
          )}
          <div className="p-3">
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-[14px] font-medium border border-stroke rounded-[8px] outline-none text-black_60"
            />
          </div>
          <div className="max-h-60 overflow-y-auto pb-[10px] custom-scroll">
            {/* Режим категорий */}
            {(name !== "sparepart" || !getChildren || stage === "parent") && (
              <>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectParent(opt)}
                      className="px-3 py-[2px] hover:bg-gray-100 cursor-pointer text-sm text-black"
                    >
                      {opt.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Ничего не найдено
                  </div>
                )}
              </>
            )}

            {/* Режим подкатегорий */}
            {name === "sparepart" && getChildren && stage === "child" && (
              <>
                {filteredChildren.length > 0 ? (
                  filteredChildren.map((sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectChild(sub)}
                      className={`px-3 py-[2px] hover:bg-gray-100 cursor-pointer text-sm text-black ${
                        childValue?.id === sub.id ? "font-semibold" : ""
                      }`}
                    >
                      {sub.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Ничего не найдено
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;

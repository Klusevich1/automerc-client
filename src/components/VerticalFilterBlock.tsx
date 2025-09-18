import React, { useEffect, useMemo, useRef, useState } from "react";
import Text from "./headers/Text";
import Checkbox from "./Checkbox";
import Image from "next/image";
import H3 from "./headers/H3";
import H2 from "./headers/H2";
import Button from "./Button";
import BaseDialog from "./BaseDialog";
import { Category } from "@/interfaces/Category";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";

interface VerticalFilterBlockProps {
  total?: number;
  categories: { total: number; items: Category[] };
  isVisibleFilter: boolean;
  setIsVisibleFilter: (isVisibleFilter: boolean) => void;
  priceFrom?: number;
  priceTo?: number;
  primary?: { brand: string; model: string; generation: string };
  page?: "catalog" | "liked";
}

interface ParametersChoiceProps {
  label: string;
  items: string[];
}

interface CategoriesChoiceProps {
  label: string;
  items: Category[];
  primary?: { brand: string; model: string; generation: string };
}

interface PriceBlockProps {
  min: number;
  setMin: (min: number) => void;
  max: number;
  setMax: (max: number) => void;
}

interface RangeSliderProps {
  min: number;
  max: number;
  minLimit: number;
  maxLimit: number;
  rangeRef: React.RefObject<HTMLDivElement | null>;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
}

const VerticalFilterBlock: React.FC<VerticalFilterBlockProps> = ({
  categories,
  total = 0,
  isVisibleFilter,
  setIsVisibleFilter,
  priceFrom,
  priceTo,
  primary,
  page = "catalog",
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [min, setMin] = useState(priceFrom || 0);
  const [max, setMax] = useState(priceTo || 10000);

  const applyFilters = () => {
    dispatch(startLoading());
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 1,
        priceFrom: min,
        priceTo: max,
      },
    });
  };

  return (
    <>
      <div
        className={`bg-[#F9F9F9] w-fit h-fit lg:flex hidden flex-col gap-4 p-3 opacity-1`}
      >
        {total === 0 && page === "catalog" ? (
          <CategoriesChoice
            label="Поиск по категориям"
            items={categories.items}
            primary={primary}
          />
        ) : (
          <>
            <PriceBlock min={min} setMin={setMin} max={max} setMax={setMax} />
            {/* <ParametersChoice label="Производитель" items={TEST_MANUFACTURERS} /> */}
            <Button
              text="Применить"
              styles="w-full py-[12px] mt-1 text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
              onClick={applyFilters}
            />
          </>
        )}
      </div>

      <BaseDialog
        isOpen={isVisibleFilter}
        onClose={() => setIsVisibleFilter(false)}
      >
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4 lg:hidden overflow-y-auto">
          <div className="flex flex-row items-center justify-between mb-7">
            <H2 className="sm:!text-[32px] text-[24px] !font-bold">Фильтр</H2>
            <Image
              src={"/resources/cross.svg"}
              width={24}
              height={24}
              alt="Cross"
              onClick={() => setIsVisibleFilter(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-4">
            <PriceBlock min={min} setMin={setMin} max={max} setMax={setMax} />
            {/* <ParametersChoice label="Марка" items={TEST_BRANDS} />
            <ParametersChoice
              label="Производитель"
              items={TEST_MANUFACTURERS}
            /> */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200">
              <Button
                text="Применить"
                styles="w-full py-[12px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                onClick={() => {
                  setIsVisibleFilter(false);
                  applyFilters();
                }}
              />
            </div>
          </div>
        </div>
      </BaseDialog>
    </>
  );
};

const PriceBlock: React.FC<PriceBlockProps> = ({
  max,
  min,
  setMax,
  setMin,
}) => {
  const [isInStock, setIsInStock] = useState<boolean>(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  const minLimit = 0;
  const maxLimit = 10000;

  // Локальные текстовые состояния для безопасного ввода
  const [minText, setMinText] = useState<string>(String(min));
  const [maxText, setMaxText] = useState<string>(String(max));

  // Синхронизация, если min/max приходят извне (слайдер и т.п.)
  useEffect(() => setMinText(String(min)), [min]);
  useEffect(() => setMaxText(String(max)), [max]);

  // Коммит значения из текста с клампом, вызываем на blur или Enter
  const commitMin = () => {
    const raw = parseInt(minText, 10);
    const next = Number.isFinite(raw) ? raw : minLimit;
    const clamped = Math.max(minLimit, Math.min(next, max - 1));
    setMin(clamped);
    setMinText(String(clamped));
  };

  const commitMax = () => {
    const raw = parseInt(maxText, 10);
    const next = Number.isFinite(raw) ? raw : maxLimit;
    const clamped = Math.min(maxLimit, Math.max(next, min + 1));
    setMax(clamped);
    setMaxText(String(clamped));
  };

  // Обновляем прогресс-бары
  useEffect(() => {
    if (rangeRef.current) {
      const percent1 = ((min - minLimit) / (maxLimit - minLimit)) * 100;
      const percent2 = ((max - minLimit) / (maxLimit - minLimit)) * 100;
      rangeRef.current.style.left = `${percent1}%`;
      rangeRef.current.style.width = `${percent2 - percent1}%`;
    }
  }, [min, max]);

  // Позволяем временно пустые значения и любые цифры
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^[0-9]*$/.test(v)) setMinText(v);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^[0-9]*$/.test(v)) setMaxText(v);
  };

  // Коммит по Enter
  const onKeyDownMin = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitMin();
  };
  const onKeyDownMax = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitMax();
  };

  return (
    <div className="flex flex-col gap-4 md:w-[256px]">
      <Text variant="Bold" className="sm:text-[16px] text-[20px] !font-bold">
        Цена (BYN)
      </Text>

      <div className="flex flex-row gap-3 w-full">
        <input
          className="w-full px-2 py-1 border border-stroke rounded-[8px] text-[16px] font-medium outline-none"
          type="text" // важно: текстовый, чтобы не превращать '' в 0
          inputMode="numeric"
          placeholder={String(minLimit)}
          value={minText}
          onChange={handleMinChange}
          onBlur={commitMin}
          onKeyDown={onKeyDownMin}
        />
        <input
          className="w-full px-2 py-1 border border-stroke rounded-[8px] text-[16px] font-medium outline-none"
          type="text"
          inputMode="numeric"
          placeholder={String(maxLimit)}
          value={maxText}
          onChange={handleMaxChange}
          onBlur={commitMax}
          onKeyDown={onKeyDownMax}
        />
      </div>

      <RangeSlider
        min={min}
        max={max}
        minLimit={minLimit}
        maxLimit={maxLimit}
        rangeRef={rangeRef}
        setMin={(value) => {
          const v = Math.min(value, max - 1);
          setMin(v);
          setMinText(String(v));
        }}
        setMax={(value) => {
          const v = Math.max(value, min + 1);
          setMax(v);
          setMaxText(String(v));
        }}
      />
    </div>
  );
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  minLimit,
  maxLimit,
  rangeRef,
  setMin,
  setMax,
}) => {
  return (
    <div className="relative h-5 mt-2 w-full">
      <div className="absolute w-full h-1 bg-stroke top-2 rounded" />
      <div ref={rangeRef} className="absolute h-1 bg-blue-500 top-2 rounded" />

      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        className="absolute top-0 w-full appearance-none bg-transparent"
        style={{
          WebkitAppearance: "none",
          appearance: "none",
          height: "100%", // важно
        }}
      />
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        className="absolute top-0 w-full appearance-none bg-transparent"
        style={{
          WebkitAppearance: "none",
          appearance: "none",
          height: "100%", // важно
        }}
      />
    </div>
  );
};

const ParametersChoice: React.FC<ParametersChoiceProps> = ({
  label,
  items,
}) => {
  const [openDropdown, setOpenDropdown] = useState(true);
  const [isOpenedMore, setIsOpenedMore] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleDropdown = () => setOpenDropdown((prev) => !prev);

  const handleToggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const defaultCount = 8;
  const maxVisibleCount = 24;
  const needScroll = isOpenedMore && filteredItems.length > maxVisibleCount;

  const visibleItems = useMemo(() => {
    return isOpenedMore ? filteredItems : filteredItems.slice(0, defaultCount);
  }, [isOpenedMore, filteredItems]);

  return (
    <>
      <div
        className={`relative md:w-[256px] border-stroke ${
          label === "Марка" ? "border-t-[1px] pt-4" : "border-b-[1px] pb-4"
        }`}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <Text
            variant="Bold"
            className="sm:text-[16px] text-[20px] !font-bold"
          >
            {label}
          </Text>
          <div className="pointer-events-none">
            <Image
              src="/resources/arrow-down.svg"
              width={16}
              height={16}
              alt="Arrow"
              className={`${openDropdown ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {openDropdown && (
          <div className="flex flex-col gap-3 w-full mt-4">
            <div className="">
              <input
                type="text"
                placeholder="Найти"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stroke rounded-[8px] outline-none"
              />
            </div>

            <div
              className={`custom-scroll ${
                needScroll ? "overflow-y-auto" : ""
              } ${isOpenedMore ? "max-h-[720px]" : ""}`}
            >
              {visibleItems.length > 0 ? (
                visibleItems.map((item) => (
                  <label
                    key={item}
                    className="flex items-center py-1 hover:bg-gray-100 cursor-pointer text-sm gap-2"
                  >
                    <div className="relative min-w-[20px] h-5">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => handleToggleItem(item)}
                        className="opacity-0 absolute w-full h-full z-10 cursor-pointer"
                      />
                      <div
                        className={`
                        w-full h-full box-border transition-all duration-150 bg-white rounded-[4px]
                        ${
                          selectedItems.includes(item)
                            ? "border-[6px] border-blue_main"
                            : "border border-stroke"
                        }
                        transition-all duration-200`}
                      />
                    </div>
                    <Text variant="Body">{item}</Text>
                  </label>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  Ничего не найдено
                </div>
              )}
            </div>

            {filteredItems.length > defaultCount && (
              <div
                className="flex flex-row items-center gap-1 w-fit cursor-pointer"
                onClick={() => setIsOpenedMore((prev) => !prev)}
              >
                <Text
                  variant="Body"
                  children={isOpenedMore ? "Свернуть" : "Показать все"}
                  className="text-blue_main"
                />
                <Image
                  src="/resources/arrow-down-blue.svg"
                  width={20}
                  height={20}
                  alt="Arrow"
                  className={`transition-transform duration-200 ${
                    isOpenedMore ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const CategoriesChoice: React.FC<CategoriesChoiceProps> = ({
  label,
  items,
  primary,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isOpenedMore, setIsOpenedMore] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const handleCategoryToggle = (cat: Category) => {
    dispatch(startLoading());
    const path = [
      "catalog",
      cat.slug,
      primary?.brand,
      primary?.model,
      primary?.generation,
    ]
      .filter(Boolean)
      .join("/");

    router.push(`/${path}`);
  };

  return (
    <>
      <div className={`relative md:w-[256px] border-stroke`}>
        <div>
          <Text
            variant="Bold"
            className="sm:text-[16px] text-[20px] !font-bold"
          >
            {label}
          </Text>
        </div>

        <div className="flex flex-col gap-3 w-full mt-4">
          <div className="">
            <input
              type="text"
              placeholder="Найти"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stroke rounded-[8px] outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <label
                  key={item.slug}
                  onClick={() => handleCategoryToggle(item)}
                  className="w-fit flex items-center cursor-pointer hover:text-blue_main transition text-sm gap-2"
                >
                  <Text variant="Body">{item.name}</Text>
                </label>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerticalFilterBlock;

import React, { useEffect, useRef, useState } from "react";
import Text from "./headers/Text";
import Image from "next/image";
import CustomDropdown from "./CustomDropdown";
import { useClickOutside } from "@/utils/hooks/useClickOutside";
import Button from "./Button";
import { getGenerationsByModel, getModelsByBrand } from "@/lib/carInfo";
import { Brand } from "@/interfaces/Brand";
import { Model } from "@/interfaces/Model";
import { Generation } from "@/interfaces/Generation";
import { Category } from "@/interfaces/Category";
import {
  initialBrand,
  initialGeneration,
  initialModel,
} from "@/initialStates/initialVehicle";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import { setAll } from "@/redux/selectedUserCarSlice";
import { Capacity } from "@/interfaces/Capacity";
import { Fuel } from "@/interfaces/Fuel";
import { useRouter } from "next/router";
import { initialCategory } from "@/initialStates/initialCategory";
import { useUser } from "@/utils/hooks/useUser";
import { initialSubcategory } from "@/initialStates/inititalSubcategory";
import { Subcategory } from "@/interfaces/Subcategory";

interface ChooseButtonProps {
  value: string;
  selected: boolean;
  setSelectedButton: (selectedButton: string) => void;
}

interface FilterBlockProps {
  fetchCategories: {
    total: number;
    items: Category[];
  };
  fetchBrands: {
    total: number;
    items: Brand[];
  };
}

interface CustomSelectProps {
  options: string[];
  placeholder: string;
}

type VehiclePick = {
  brand: Brand | null;
  model: Model | null;
  generation: Generation | null;
};

const fetchCapacities: Capacity[] = [
  { id: 1, name: "1.4", slug: "1.4" },
  { id: 1, name: "1.6", slug: "1.6" },
  { id: 1, name: "2.0", slug: "2.0" },
];

const fetchFuels: Fuel[] = [
  { id: 1, name: "Бензин", slug: "benzin" },
  { id: 2, name: "Дизель", slug: "dizel" },
  { id: 3, name: "Гибрид", slug: "gibrid" },
];

const emptyPick: VehiclePick = { brand: null, model: null, generation: null };

const FilterBLock: React.FC<FilterBlockProps> = ({
  fetchCategories,
  fetchBrands,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useUser();

  const [modelsByRow, setModelsByRow] = useState<Record<number, Model[]>>({});
  const [gensByRow, setGensByRow] = useState<Record<number, Generation[]>>({});

  // const [localCapacity, setLocalCapacity] = useState<Capacity>();
  // const [localFuel, setLocalFuel] = useState<Fuel>();
  const [localCategory, setLocalCategory] = useState<Category>(initialCategory);
  const [localSubcategory, setLocalSubcategory] =
    useState<Subcategory>(initialSubcategory);

  const [rows, setRows] = useState<VehiclePick[]>([{ ...emptyPick }]);

  const [selectedButton, setSelectedButton] = useState<string>("По автомобилю");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOpenedParams, setIsOpenedParams] = useState<boolean>(false);
  const [isResetSelect, setIsResetSelect] = useState();

  useEffect(() => {
    const sc = user?.selectedCar;
    const brands = fetchBrands?.items ?? [];

    // нет выбранной машины — просто пустые значения
    if (!sc || !Number(sc.brand_id)) {
      setRows([{ ...emptyPick }]);
      setModelsByRow({});
      setGensByRow({});
      return;
    }

    // найти объект бренда по id из списка брендов
    const brandObj = brands.find((b) => b.id === Number(sc.brand_id)) ?? null;

    // если бренд не найден — оставляем пустые
    if (!brandObj) {
      setRows([{ ...emptyPick }]);
      setModelsByRow({});
      setGensByRow({});
      return;
    }

    // поставить бренд сразу, модели/поколения подгружаем асинхронно
    setRows([{ brand: brandObj, model: null, generation: null }]);

    (async () => {
      try {
        // модели для бренда
        const modelsRes = await getModelsByBrand(brandObj.id);
        const models = modelsRes?.items ?? [];
        console.log(models);
        setModelsByRow((prev) => ({ ...prev, 0: models }));

        const modelId = Number(sc.model_id);
        const modelObj = modelId
          ? models.find((m: any) => m.id === modelId) ?? null
          : null;

        // если модели нет — на этом остановимся
        if (!modelObj) {
          setRows([{ brand: brandObj, model: null, generation: null }]);
          setGensByRow((prev) => ({ ...prev, 0: [] }));
          return;
        }

        // выставляем модель
        setRows([{ brand: brandObj, model: modelObj, generation: null }]);

        // поколения для пары бренд+модель
        const gensRes = await getGenerationsByModel(brandObj.id, modelObj.id);
        const gens = gensRes?.items ?? [];
        setGensByRow((prev) => ({ ...prev, 0: gens }));

        const genId = Number(sc.generation_id);
        const genObj = genId
          ? gens.find((g: any) => g.id === genId) ?? null
          : null;

        // выставляем поколение если нашли
        setRows([{ brand: brandObj, model: modelObj, generation: genObj }]);
      } catch {
        // при любой ошибке — безопасно откатиться к бренду или к пустым
        setRows([{ brand: brandObj, model: null, generation: null }]);
        setGensByRow((prev) => ({ ...prev, 0: [] }));
      }
    })();
  }, [user?.selectedCar, fetchBrands?.items]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setOpenDropdown(null));

  const handleToggleParams = () => {
    setIsOpenedParams(!isOpenedParams);
    setOpenDropdown(null);
  };

  const handleAddRow = () => {
    setRows((prev) => (prev.length >= 3 ? prev : [...prev, { ...emptyPick }]));
  };

  const handleRemoveRow = (indexToRemove: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setModelsByRow((prev) => {
      const copy = { ...prev };
      delete copy[indexToRemove];
      return copy;
    });
    setGensByRow((prev) => {
      const copy = { ...prev };
      delete copy[indexToRemove];
      return copy;
    });
  };

  const handleBrandChange = async (brand: Brand, index: number) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { brand, model: null, generation: null };
      return next;
    });
    const models = brand?.id ? await getModelsByBrand(brand.id) : [];
    setModelsByRow((prev) => ({ ...prev, [index]: models.items || [] }));
    setGensByRow((prev) => ({ ...prev, [index]: [] }));
    setOpenDropdown(`model-${index}`);
  };

  const handleModelChange = async (model: Model, index: number) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], model, generation: null };
      return next;
    });
    const brandId = rows[index]?.brand?.id;
    const gens =
      brandId && model?.id
        ? await getGenerationsByModel(brandId, model.id)
        : [];
    setGensByRow((prev) => ({ ...prev, [index]: gens.items || [] }));
    setOpenDropdown(`generation-${index}`);
  };

  const handleGenerationChange = (gen: Generation | null, index: number) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], generation: gen };
      return next;
    });
  };

  // const handleCapacityChange = (capacity: Capacity, index: number) => {
  //   setLocalCapacity(capacity);
  //   setOpenDropdown(`fuel-${index}`);
  // };

  // const handleOilChange = (oil: Fuel, index: number) => {
  //   setLocalFuel(oil);
  //   setOpenDropdown(`sparepart-${index}`);
  // };

  const handleCategoryToggle = (category: Category, index: number) => {
    setLocalCategory(category);
    setLocalSubcategory(initialSubcategory);
  };

  const handleSubcategoryToggle = (sub: Subcategory, index: number) => {
    setLocalSubcategory(sub);
  };

  const packPick = (p: VehiclePick) => {
    if (!p?.brand?.slug) return null;
    const parts = [p.brand.slug];
    if (p.model?.slug) parts.push(p.model.slug);
    if (p.generation?.slug) parts.push(p.generation.slug);
    return parts.join("::");
  };

  function buildCatalogPath(
    primary: VehiclePick,
    categorySlug?: string,
    subcategorySlug?: string
  ) {
    const segs = ["/catalog"];
    if (categorySlug) segs.push(categorySlug);
    if (subcategorySlug) segs.push(subcategorySlug);
    if (primary?.brand?.slug) segs.push(primary.brand.slug);
    if (primary?.model?.slug) segs.push(primary.model.slug);
    if (primary?.generation?.slug) segs.push(primary.generation.slug);
    return segs.join("/");
  }

  const applyFilters = () => {
    dispatch(startLoading());

    const filled = rows.filter((r) => r.brand?.slug);
    const categorySlug = localCategory?.slug || undefined;
    const subcategorySlug = localSubcategory?.slug || undefined;

    const [primary, ...rest] = filled;
    const base = buildCatalogPath(primary, categorySlug, subcategorySlug);

    const alsoList = rest.map(packPick).filter(Boolean) as string[];
    const also = alsoList.slice(0, 2).sort((a, b) => a.localeCompare(b)); // максимум 2, отсортировано

    const url = also.length
      ? `${base}?also=${encodeURIComponent(also.join("~"))}`
      : base;
    router.push(url);
  };

  const resetAll = () => {
    setRows([{ ...emptyPick }]);
    setModelsByRow({});
    setGensByRow({});
    setLocalCategory(initialCategory);
    setLocalSubcategory(initialSubcategory);
    // setLocalCapacity(undefined);
    // setLocalFuel(undefined);
    setOpenDropdown(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:w-fit w-full rounded-t-[8px]">
        <ChooseButton
          value="По автомобилю"
          selected={selectedButton === "По автомобилю"}
          setSelectedButton={setSelectedButton}
        />
        {/* <ChooseButton
          value="По VIN автомобиля"
          selected={selectedButton === "По VIN автомобиля"}
          setSelectedButton={setSelectedButton}
        /> */}
      </div>
      <div
        className="flex flex-col lg:max-w-[680px] md:p-6 p-3 pt-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] bg-white rounded-[8px] rounded-tl-none"
        ref={wrapperRef}
      >
        {selectedButton === "По автомобилю" ? (
          <>
            {/* Desktop */}
            <div className="md:flex hidden flex-col">
              <div className="flex flex-col gap-4">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between gap-3"
                  >
                    <CustomDropdown<Brand>
                      name={`brand-${index}`}
                      options={fetchBrands.items ?? []}
                      placeholder="Марка"
                      value={row.brand}
                      forceOpen={openDropdown === `brand-${index}`}
                      index={index}
                      onChange={handleBrandChange}
                      initialValue={initialBrand}
                    />
                    <CustomDropdown<Model>
                      name={`model-${index}`}
                      options={modelsByRow[index] ?? []}
                      placeholder="Модель"
                      value={row.model}
                      forceOpen={openDropdown === `model-${index}`}
                      index={index}
                      onChange={handleModelChange}
                      initialValue={initialModel}
                    />
                    <CustomDropdown<Generation>
                      name={`generation-${index}`}
                      options={gensByRow[index] ?? []}
                      placeholder="Поколение"
                      value={row.generation}
                      forceOpen={openDropdown === `generation-${index}`}
                      index={index}
                      onChange={handleGenerationChange}
                      initialValue={initialGeneration}
                    />
                    <div
                      className="min-w-[32px] w-8 h-8 flex items-center justify-center rounded-[8px] border border-stroke cursor-pointer"
                      onClick={() =>
                        index === 0 ? handleAddRow() : handleRemoveRow(index)
                      }
                    >
                      <Image
                        src={
                          index === 0
                            ? "/resources/add.svg"
                            : "/resources/minus.svg"
                        }
                        width={24}
                        height={24}
                        alt={index === 0 ? "Add" : "Remove"}
                      />
                    </div>
                  </div>
                ))}

                {/* <div
                  className="w-fit flex flex-row items-center gap-1 cursor-pointer"
                  onClick={handleToggleParams}
                >
                  <Text
                    variant="Body"
                    children="Все параметры"
                    className="text-blue_main"
                  />
                  <div className="">
                    <Image
                      src="/resources/arrow-down-blue.svg"
                      width={20}
                      height={20}
                      alt="Arrow"
                      className={`${
                        isOpenedParams ? "rotate-180" : ""
                      } transition-all duration-200`}
                    />
                  </div>
                </div> */}
                {/* <div
                  className={`flex flex-row items-center justify-between gap-3 overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpenedParams
                        ? "max-h-[500px] overflow-visible opacity-1 mb-6"
                        : "max-h-0 opacity-0"
                    }`}
                >
                  <CustomDropdown<Capacity>
                    name="capacity"
                    options={fetchBrands.items ?? []}
                    placeholder="Объем двигателя"
                    value={localCapacity ?? null}
                    forceOpen={openDropdown === "capacity-1"}
                    index={1}
                    onChange={handleCapacityChange}
                    initialValue={}

                    // onToggle={handleToggle}
                  />
                  <CustomDropdown<Fuel>
                    name="fuel"
                    options={fetchBrands.items ?? []}
                    placeholder="Тип топлива"
                    value={localFuel ?? null}
                    forceOpen={openDropdown === "fuel-1"}
                    index={1}
                    onChange={handleOilChange}
                    // onToggle={handleToggle}
                  />
                  <div className="min-w-[32px] w-8 h-8"></div>
                </div> */}
              </div>
              <div className="flex flex-row items-start gap-3 mt-6">
                <CustomDropdown<Category>
                  name="sparepart"
                  options={fetchCategories.items ?? []}
                  placeholder="Выберите категорию"
                  value={localCategory ?? null}
                  forceOpen={openDropdown === "sparepart"}
                  onChange={handleCategoryToggle}
                  initialValue={initialCategory}
                  getChildren={(cat) => cat.subcategories}
                  childValue={localSubcategory}
                  childPlaceholder="Выберите подкатегорию"
                  onChangeChild={handleSubcategoryToggle}
                  index={1}
                />
                <div className="flex flex-col items-center gap-3">
                  <Button
                    styles="w-[204px] py-[12px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                    text="Начать поиск"
                    onClick={() => applyFilters()}
                  />
                  <div
                    className="flex flex-row gap-1 cursor-pointer"
                    onClick={resetAll}
                  >
                    <Text variant="Body" children="Сбросить" />
                    <Image
                      src="/resources/cross.svg"
                      width={20}
                      height={20}
                      alt="Cross"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div className="md:hidden flex flex-col">
              <div className="flex flex-col gap-5">
                {rows.map((row, index) => (
                  <div className="flex flex-col gap-3" key={index}>
                    <div className="flex flex-row items-center justify-between gap-3">
                      <CustomDropdown<Brand>
                        name={`brand-${index}`}
                        options={fetchBrands.items ?? []}
                        placeholder="Марка"
                        value={row.brand}
                        forceOpen={openDropdown === `brand-${index}`}
                        index={index}
                        onChange={handleBrandChange}
                        initialValue={initialBrand}
                      />
                      <CustomDropdown<Model>
                        name={`model-${index}`}
                        options={modelsByRow[index] ?? []}
                        placeholder="Модель"
                        value={row.model}
                        forceOpen={openDropdown === `model-${index}`}
                        index={index}
                        onChange={handleModelChange}
                        initialValue={initialModel}
                      />
                    </div>
                    <CustomDropdown<Generation>
                      name={`generation-${index}`}
                      options={gensByRow[index] ?? []}
                      placeholder="Поколение"
                      value={row.generation}
                      forceOpen={openDropdown === `generation-${index}`}
                      index={index}
                      onChange={handleGenerationChange}
                      initialValue={initialGeneration}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <CustomDropdown<Category>
                  name="sparepart"
                  options={fetchCategories.items ?? []}
                  placeholder="Выберите запчасть"
                  value={localCategory ?? null}
                  forceOpen={openDropdown === "sparepart"}
                  onChange={handleCategoryToggle}
                  initialValue={initialCategory}
                  getChildren={(cat) => cat.subcategories}
                  childValue={localSubcategory}
                  childPlaceholder="Выберите подкатегорию"
                  onChangeChild={handleSubcategoryToggle}
                  index={1}
                />
              </div>
              <div className="flex flex-row justify-between py-4">
                {/* <div
                  className="flex flex-row items-center gap-1 cursor-pointer"
                  onClick={handleToggleParams}
                >
                  <Text
                    variant="Body"
                    children="Все параметры"
                    className="text-blue_main"
                  />
                  <div className="">
                    <Image
                      src="/resources/arrow-down-blue.svg"
                      width={20}
                      height={20}
                      alt="Arrow"
                      className={`${
                        isOpenedParams ? "rotate-180" : ""
                      } transition-all duration-200`}
                    />
                  </div>
                </div> */}
                <div
                  className="min-w-[28px] w-7 h-7 flex items-center justify-center rounded-[8px] border border-stroke cursor-pointer"
                  onClick={() =>
                    rows.length === 1
                      ? handleAddRow()
                      : handleRemoveRow(rows.length - 1)
                  }
                >
                  <Image
                    src={
                      rows.length === 1
                        ? "/resources/add.svg"
                        : "/resources/minus.svg"
                    }
                    width={20}
                    height={20}
                    alt={rows.length === 1 ? "Add" : "Remove"}
                  />
                </div>
              </div>
              {/* <div
                className={`flex flex-col items-center justify-between gap-3 overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpenedParams
                        ? "max-h-[500px] overflow-visible opacity-1 mb-5"
                        : "max-h-0 opacity-0"
                    }`}
              >
                <CustomDropdown<Capacity>
                  name="capacity"
                  options={fetchBrands.items ?? []}
                  placeholder="Объем двигателя"
                  value={localCapacity ?? null}
                  forceOpen={openDropdown === "capacity-1"}
                  index={1}
                  onChange={handleCapacityChange}
                  // onToggle={handleToggle}
                />
                <CustomDropdown<Fuel>
                  name="fuel"
                  options={fetchBrands.items ?? []}
                  placeholder="Тип топлива"
                  value={localFuel ?? null}
                  forceOpen={openDropdown === "fuel-1"}
                  index={1}
                  onChange={handleOilChange}
                  // onToggle={handleToggle}
                />
              </div> */}
              <div className="flex flex-col items-center gap-3">
                <Button
                  styles="w-full py-[12px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                  text="Начать поиск"
                  onClick={() => applyFilters()}
                />
                <div
                  className="flex flex-row gap-1 cursor-pointer"
                  onClick={resetAll}
                >
                  <Text variant="Body" children="Сбросить" />
                  <Image
                    src="/resources/cross.svg"
                    width={20}
                    height={20}
                    alt="Cross"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* <div className="md:flex hidden flex-row items-start gap-3">
              <CustomDropdown
                name="vin"
                options={fetchCategories}
                placeholder="Введите VIN"
                forceOpen={openDropdown === "vin"}
                onToggle={handleToggle}
              />
              <div className="flex flex-col items-center gap-3">
                <Button
                  styles="w-[204px] py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
                  text="Начать поиск"
                />
                <div className="flex flex-row gap-1 cursor-pointer">
                  <Text variant="Body" children="Сбросить" />
                  <Image
                    src="/resources/cross.svg"
                    width={20}
                    height={20}
                    alt="Cross"
                  />
                </div>
              </div>
            </div>
            <div className="md:hidden flex flex-col items-start gap-3">
              <CustomDropdown
                name="vin"
                options={fetchCategories}
                placeholder="Введите VIN"
                forceOpen={openDropdown === "vin"}
                onToggle={handleToggle}
              />
              <div className="w-full flex flex-col items-center gap-3">
                <Button
                  styles="w-full py-[12px] text-center bg-blue_main rounded-[8px] text-[16px] font-semibold text-white outline-none"
                  text="Начать поиск"
                />
                <div className="flex flex-row gap-1 cursor-pointer">
                  <Text variant="Body" children="Сбросить" />
                  <Image
                    src="/resources/cross.svg"
                    width={20}
                    height={20}
                    alt="Cross"
                  />
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

const ChooseButton: React.FC<ChooseButtonProps> = ({
  value,
  selected,
  setSelectedButton,
}) => {
  return (
    <div
      className={`md:w-[226px] w-full py-[12px] bg-white text-center border-b-[2px] cursor-pointer ${
        selected ? "border-blue_main" : "border-stroke"
      } ${
        value === "По автомобилю" ? "rounded-tl-[8px]" : "rounded-tr-[8px]"
      } `}
      onClick={() => setSelectedButton(value)}
    >
      <Text variant="Body" children={value} />
    </div>
  );
};

export default FilterBLock;

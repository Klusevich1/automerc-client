import React, { useEffect, useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { Brand } from "@/interfaces/Brand";
import { Model } from "@/interfaces/Model";
import { Generation } from "@/interfaces/Generation";
import Image from "next/image";
import Text from "./headers/Text";
import { Category } from "@/interfaces/Category";
import { getAllCategories } from "@/lib/getAllCategories";
import { initialCategory } from "@/initialStates/initialCategory";
import {
  getAllBrands,
  getGenerationsByModel,
  getModelsByBrand,
} from "@/lib/carInfo";
import Button from "./Button";
import {
  initialBrand,
  initialGeneration,
  initialModel,
} from "@/initialStates/initialVehicle";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { useUser } from "@/utils/hooks/useUser";
import { CgClose } from "react-icons/cg";
import { UserData } from "@/Types/UserData";
import { useRouter } from "next/router";

type VehiclePick = {
  brand: Brand | null;
  model: Model | null;
  generation: Generation | null;
};

const emptyPick: VehiclePick = { brand: null, model: null, generation: null };

const GarageCar: React.FC<{ user: UserData }> = ({ user }) => {
  const router = useRouter();

  const [activeCar, setActiveCar] = useState<number | undefined>(
    user?.selectedCar?.id ?? user?.cars?.[0]?.id
  );

  const [selectedBrand, setSelectedBrand] = useState<Brand>(initialBrand);
  const [selectedModel, setSelectedModel] = useState<Model>(initialModel);
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation>(initialGeneration);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOpenedParams, setIsOpenedParams] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);

  const [fetchCategories, setFetchCategories] = useState<{
    total: number;
    items: Category[];
  }>({ total: 0, items: [] });
  const [fetchBrands, setFetchBrands] = useState<{
    total: number;
    items: Brand[];
  }>({ total: 0, items: [] });

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllCategories();
      setFetchCategories(categories);

      const brands = await getAllBrands();
      setFetchBrands(brands);
    };
    fetchData();
  }, []);

  const handleBrandChange = async (brand: Brand) => {
    setSelectedBrand(brand);
    const fetchModels = brand?.id ? await getModelsByBrand(brand.id) : [];
    console.log(fetchModels);
    setModels(fetchModels.items);
    setOpenDropdown(`models`);
  };

  const handleModelChange = async (model: Model) => {
    setSelectedModel(model);
    const fetchGenerations = model?.id
      ? await getGenerationsByModel(selectedBrand.id, model.id)
      : [];
    setGenerations(fetchGenerations.items);
    setOpenDropdown(`generations`);
  };

  const handleGenerationChange = async (generation: Generation) => {
    setSelectedGeneration(generation);
  };

  const addToGarage = async (
    brandId?: number,
    modelId?: number,
    generationId?: number
  ) => {
    try {
      const res = await defaultFetch(`/users/garage`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, modelId, generationId }),
      });

      if (!res.ok) throw new Error("Не удалось добавить машину в гараж");

      const selectedCarId = await res.json();
      setActiveCar(selectedCarId);

      router.reload();
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const deleteFromGarage = async (carId: number) => {
    try {
      const isActive = activeCar === carId;

      const fallbackId = user.cars.find((c) => c.id !== carId)?.id;

      if (isActive && fallbackId) {
        await selectCar(fallbackId);
      }

      const res = await defaultFetch(`/users/garage/${carId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Не удалось удалить машину из гаража");
      }

      router.reload();
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const selectCar = async (carId: number) => {
    try {
      const res = await defaultFetch(`/users/garage/select/${carId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Не удалось выбрать машину из гаража");
      setActiveCar(carId);
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-7">
      {user?.cars && user.cars.length > 0 ? (
        user.cars.map((item, index) => (
          <div className="flex flex-col gap-1">
            <div key={index} className="mt-2 flex flex-row w-full gap-2">
              <input
                type="radio"
                name={"carProfile"}
                value={item.name}
                checked={activeCar === item.id}
                onChange={() => selectCar(item.id)}
                className={`min-w-[16px] min-h-[16px] w-[16px] h-[16px] mt-1 appearance-none rounded-full border border-gray-400 checked:border-[5px] checked:border-black cursor-pointer`}
              />
              <Text variant="Body" className="w-full">
                {item.name}
              </Text>
              <button
                type="button"
                onClick={() => deleteFromGarage(item.id)}
                className="bg-[#F6F7F8] rounded-full max-h-[30px] w-full max-w-[30px] min-h-[30px] text-center transition-all hover:bg-blue_main hover:text-white hover:rotate-90 "
              >
                <CgClose className="w-[14px] h-[14px] mx-auto" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
      {/* Desktop */}
      <div className="w-full md:flex hidden flex-col">
        <div className="flex flex-col gap-4">
          <div className="min-w-full flex flex-row items-center justify-between gap-3">
            <CustomDropdown<Brand>
              name={`brands`}
              options={fetchBrands.items ?? []}
              placeholder="Марка"
              value={selectedBrand}
              forceOpen={openDropdown === `brands`}
              index={1}
              onChange={handleBrandChange}
              initialValue={initialBrand}
            />
            <CustomDropdown<Model>
              name={`models`}
              options={models ?? []}
              placeholder="Модель"
              value={selectedModel}
              forceOpen={openDropdown === `models`}
              index={1}
              onChange={handleModelChange}
              initialValue={initialModel}
            />
            <CustomDropdown<Generation>
              name={`generations`}
              options={generations ?? []}
              placeholder="Поколение"
              value={selectedGeneration}
              forceOpen={openDropdown === `generations`}
              index={1}
              onChange={handleGenerationChange}
              initialValue={initialGeneration}
            />
          </div>
        </div>
        <div className="flex flex-row items-start gap-3">
          <div className="flex flex-col items-center gap-3">
            <Button
              styles="w-[204px] py-[12px] mt-7 text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
              text="Сохранить"
              onClick={() =>
                addToGarage(
                  selectedBrand.id,
                  selectedModel.id,
                  selectedGeneration.id
                )
              }
            />
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="w-full md:hidden flex flex-col">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between gap-3">
              <CustomDropdown<Brand>
                name={`brands`}
                options={fetchBrands.items ?? []}
                placeholder="Марка"
                value={selectedBrand}
                forceOpen={openDropdown === `brands`}
                index={1}
                onChange={handleBrandChange}
                initialValue={initialBrand}
              />
              <CustomDropdown<Model>
                name={`models`}
                options={models ?? []}
                placeholder="Модель"
                value={selectedModel}
                forceOpen={openDropdown === `models`}
                index={1}
                onChange={handleModelChange}
                initialValue={initialModel}
              />
            </div>
            <CustomDropdown<Generation>
              name={`generations`}
              options={generations ?? []}
              placeholder="Поколение"
              value={selectedGeneration}
              forceOpen={openDropdown === `generations`}
              index={1}
              onChange={handleGenerationChange}
              initialValue={initialGeneration}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Button
            styles="w-full py-[12px] mt-7 text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
            text="Сохранить"
            onClick={() =>
              addToGarage(
                selectedBrand.id,
                selectedModel.id,
                selectedGeneration.id
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default GarageCar;

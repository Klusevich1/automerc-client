import Image from "next/image";
import React, { useState } from "react";
import { UserData } from "@/Types/UserData";
import { FaStarOfLife } from "react-icons/fa6";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import Text from "./headers/Text";
import { CgClose } from "react-icons/cg";

interface PersonalInformationProfileTabProps {
  user: UserData;
  refetch: () => Promise<void>;
}

const personalInfoSchema = z.object({
  lastName: z
    .string()
    .min(1, "Фамилия обязательна")
    .regex(/^[А-Яа-яA-Za-z]+$/, "Допустимы только буквы"),
  firstName: z
    .string()
    .min(1, "Имя обязательно")
    .regex(/^[А-Яа-яA-Za-z]+$/, "Допустимы только буквы"),
  middleName: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[А-Яа-яA-Za-z]+$/.test(val),
      "Допустимы только буквы"
    ),
  email: z.string().email("Некорректный email"),
  street: z.string().min(1, "Улица и дом обязательны"),
  intercom: z.string().optional(),
  entrance: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

const PersonalInformationProfileTab: React.FC<
  PersonalInformationProfileTabProps
> = ({ user, refetch }) => {
  const [activeAddress, setActiveAddress] = useState<number | undefined>(
    user?.selectedAddress?.id ?? user?.addresses?.[0]?.id
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      lastName: user.lastName ?? "",
      firstName: user.firstName ?? "",
      middleName: user.middleName ?? "",
      email: user.email ?? "",
      street: "",
      intercom: "",
      entrance: "",
      floor: "",
      apartment: "",
    },
  });

  const onSubmit = async (data: PersonalInfoForm) => {
    try {
      const res = await defaultFetch("/auth/user", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Ошибка входа");
      }

      refetch();
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      const res = await defaultFetch(`/auth/user/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Ошибка входа");
      }

      alert(`Данные успешно обновлены`);
      refetch();
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const chooseActiveAddress = async (id: number) => {
    try {
      const res = await defaultFetch(`/auth/user/address/select/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Ошибка входа");
      }

      refetch();
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full md:max-w-[400px]">
      <h3 className="font-bold text-xl">Личная информация</h3>
      <div className="flex flex-col">
        <div className="flex flex-row mt-6">
          <FaStarOfLife className="w-3 h-3 me-2" />
          <input
            {...register("lastName")}
            className="pb-3 border-b-[1px] outline-none border-black_60 w-full"
            type="text"
            placeholder="Фамилия"
          />
        </div>
        {errors.lastName && (
          <p className="text-red text-sm">{errors.lastName.message}</p>
        )}
        <div className="flex flex-row mt-5">
          <FaStarOfLife className="w-3 h-3 me-2" />
          <input
            {...register("firstName")}
            className="pb-3 border-b-[1px] outline-none border-black_60 w-full"
            type="text"
            placeholder="Имя"
          />
        </div>
        {errors.firstName && (
          <p className="text-red text-sm">{errors.firstName.message}</p>
        )}
        <div className="flex flex-row mt-5">
          <FaStarOfLife className="w-3 h-3 me-2 opacity-0" />
          <input
            {...register("middleName")}
            className="pb-3 border-b-[1px] outline-none border-black_60 w-full"
            type="text"
            placeholder="Отчество"
          />
        </div>
        {errors.middleName && (
          <p className="text-red text-sm">{errors.middleName.message}</p>
        )}
      </div>

      <h3 className="font-bold text-xl mt-7">Контакты</h3>
      <div className="flex flex-row mt-5">
        <FaStarOfLife className="w-3 h-3 me-2 opacity-0" />
        <input
          {...register("email")}
          className="pb-3 border-b-[1px] outline-none border-black_60 w-full"
          type="email"
          placeholder="Email"
        />
      </div>
      {errors.email && (
        <p className="text-red text-sm">{errors.email.message}</p>
      )}

      <h3 className="font-bold text-xl mt-7">Адреса доставки</h3>

      {user.addresses && user.addresses.length > 0 ? (
        user.addresses.map((item, index) => (
          <div key={index} className="mt-2 flex flex-row w-full gap-2">
            <input
              type="radio"
              name={"addressProfile"}
              value={activeAddress}
              checked={activeAddress === item.id}
              onChange={() => chooseActiveAddress(item.id)}
              className={`min-w-[16px] min-h-[16px] w-[16px] h-[16px] mt-1 appearance-none rounded-full border border-gray-400 checked:border-[5px] checked:border-black cursor-pointer`}
            />
            <Text variant="Body" className="w-full">
              {item.name}
            </Text>
            <button
              type="button"
              onClick={() => deleteAddress(item.id)}
              className="bg-[#F6F7F8] rounded-full max-h-[30px] w-full max-w-[30px] min-h-[30px] text-center transition-all hover:bg-blue_main hover:text-white hover:rotate-90 "
            >
              <CgClose className="w-[14px] h-[14px] mx-auto" />
            </button>
          </div>
        ))
      ) : (
        <></>
      )}

      {user.addresses && user.addresses.length > 4 ? (
        <></>
      ) : (
        <>
          <input
            {...register("street")}
            className="pb-3  mt-5 border-b-[1px] outline-none border-black_60 w-full"
            type="text"
            placeholder="Улица и дом"
          />
          {errors.street && (
            <p className="text-red text-sm">{errors.street.message}</p>
          )}
          <div className="flex flex-col">
            <div className="flex gap-3 flex-row">
              <div className="w-1/2">
                <input
                  {...register("intercom")}
                  className="pb-3  mt-5 border-b-[1px] outline-none border-black_60 w-full"
                  type="text"
                  placeholder="Домофон"
                />
              </div>
              <div className="w-1/2">
                <input
                  {...register("entrance")}
                  className="pb-3  mt-5 border-b-[1px] outline-none border-black_60 w-full"
                  type="text"
                  placeholder="Подъезд"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-row">
              <div className="w-1/2">
                <input
                  {...register("floor")}
                  className="pb-3  mt-5 border-b-[1px] outline-none border-black_60 w-full"
                  type="text"
                  placeholder="Этаж"
                />
              </div>
              <div className="w-1/2">
                <input
                  {...register("apartment")}
                  className="pb-3 mt-5 border-b-[1px] outline-none border-black_60 w-full"
                  type="text"
                  placeholder="Кв./офис"
                />
              </div>
            </div>
          </div>
        </>
      )}
      <Button
        type="submit"
        styles="w-full mt-7 py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
        text="Сохранить"
      />
    </form>
  );
};

export default PersonalInformationProfileTab;

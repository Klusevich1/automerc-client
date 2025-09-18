import React, { useState } from "react";
import Text from "./headers/Text";
import Image from "next/image";
import { NoteField } from "@/interfaces/NoteField";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";

interface ChooseButtonProps {
  value: string;
  selected: boolean;
  setSelectedButton: (selectedButton: string) => void;
}

interface RowProps {
  label: string;
  value: string | number;
}

const ProductInfoBlock: React.FC<{ params: NoteField[] }> = ({ params }) => {
  const dispatch = useDispatch();

  const [selectedButton, setSelectedButton] =
    useState<string>("Характеристики");
  const [openedSection, setOpenedSection] = useState<string | null>(
    "Характеристики"
  );

  const toggleSection = (section: string) => {
    setOpenedSection(openedSection === section ? null : section);
  };

  function splitArray<T>(array: T[]): [T[], T[]] {
    const middle = Math.ceil(array.length / 2);
    const firstPart = array.slice(0, middle);
    const secondPart = array.slice(middle);
    return [firstPart, secondPart];
  }
  return (
    <>
      <div className="sm:block hidden">
        <div className="flex flex-row items-end mb-6">
          <ChooseButton
            value="Характеристики"
            selected={selectedButton === "Характеристики"}
            setSelectedButton={setSelectedButton}
          />
          <div className="w-[28px] h-[1px] bg-stroke"></div>
          <ChooseButton
            value="Гарантия"
            selected={selectedButton === "Гарантия"}
            setSelectedButton={setSelectedButton}
          />
          <div className="w-[28px] h-[1px] bg-stroke"></div>
          <ChooseButton
            value="Доставка"
            selected={selectedButton === "Доставка"}
            setSelectedButton={setSelectedButton}
          />
          <div className="w-[28px] h-[1px] bg-stroke"></div>
          <ChooseButton
            value="Оплата"
            selected={selectedButton === "Оплата"}
            setSelectedButton={setSelectedButton}
          />
          <div className="w-[28px] h-[1px] bg-stroke"></div>
        </div>
        {selectedButton === "Характеристики" ? (
          <div className="max-w-[1040px] grid grid-cols-2 gap-[80px]">
            {(() => {
              const [firstColumn, secondColumn] = splitArray(params);

              return (
                <>
                  <ul>
                    {firstColumn.map((param, idx) => (
                      <li key={idx}>
                        <InfoRow label={param.label} value={param.value} />
                      </li>
                    ))}
                  </ul>
                  <ul>
                    {secondColumn.map((param, idx) => (
                      <li key={idx}>
                        <InfoRow label={param.label} value={param.value} />
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()}
          </div>
        ) : selectedButton === "Гарантия" ? (
          <div className="max-w-[580px] flex flex-col gap-5">
            <Text variant="Bold" children="Особые условия проверки" />
            <div>
              <div className="flex flex-row justify-between pb-4 border-b-[1px] border-stroke">
                <Text
                  variant="Body"
                  children="Двигатели с навесным или без навесного оборудования"
                />
                <Text
                  variant="Bold"
                  children="30 дней"
                  className="min-w-[80px] text-right"
                />
              </div>
              <div className="flex flex-row justify-between py-4 border-b-[1px] border-stroke">
                <Text
                  variant="Body"
                  children="Датчик давления топлива, насос вакуумный (тандемный), насос топливный, рампа топливная, регулятор давления топлива, ТНВД (бензин, дизель), форсунка бензиновая (дизельная) механическая (электрическая), инжектор (распределитель впрыска топлива), дозатор-распределитель топлива"
                />
                <Text
                  variant="Bold"
                  children="14 дней"
                  className="min-w-[80px] text-right"
                />
              </div>
              <div className="flex flex-row items-center gap-[3px] py-4">
                <Text
                  variant="Body"
                  children="Подробнее о гарантии в разделе"
                />
                <Link
                  href="/warranty"
                  onClick={() => dispatch(startLoading())}
                  className="underline decoration-[1px]"
                >
                  <Text variant="Body" children="Гарантия" />
                </Link>
              </div>
            </div>
          </div>
        ) : selectedButton === "Доставка" ? (
          <div className="max-w-[580px] flex flex-col gap-5">
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Пункты выдачи (самовывоз)"
                className="mb-4"
              />
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/resources/location.svg"}
                    width={20}
                    height={20}
                    alt="Location"
                  />
                  <Text
                    variant="Body"
                    children="Минск, Привольный Луговослободской сельсовет, 16/5"
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/resources/location.svg"}
                    width={20}
                    height={20}
                    alt="Location"
                  />
                  <Text
                    variant="Body"
                    children="Москва, Лианозовский проезд 8 строение 3"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Доставка по Минску и по всей Беларуси"
                className="mb-4"
              />
              <Text
                variant="Body"
                children="Мы доставим Ваш заказ курьеров по адресу или европочтой (стоимость доставки рассчитывается индивидуально)"
              />
            </div>
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Доставка по России"
                className="mb-4"
              />
              <Text
                variant="Body"
                children="Мы доставим Ваш заказ через СДЭК или КИТ (стоимость доставки рассчитывается индивидуально)"
              />
            </div>
            <div className="flex flex-row items-center gap-[3px]">
              <Text variant="Body" children="Подробнее в разделе" />
              <Link
                href="/delivery-and-payment"
                onClick={() => dispatch(startLoading())}
                className="underline decoration-[1px]"
              >
                <Text variant="Body" children="Доставка и Оплата" />
              </Link>
            </div>
          </div>
        ) : selectedButton === "Оплата" ? (
          <div className="max-w-[321px] flex flex-col gap-5">
            <Text variant="Bold" children="Способы оплаты" />
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 pb-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/wallet-2.svg"}
                  width={24}
                  height={24}
                  alt="Wallet"
                />
                <Text variant="Body" children="При получении наличными" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/card.svg"}
                  width={24}
                  height={24}
                  alt="Card"
                />
                <Text variant="Body" children="Оплата онлайн" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/erip.png"}
                  width={57}
                  height={24}
                  alt="ERIP"
                />
                <Text variant="Body" children="ЕРИП" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/coin.svg"}
                  width={24}
                  height={24}
                  alt="Installment"
                />
                <Text variant="Body" children="Карта рассрочки онлайн" />
              </div>
            </div>
            <div className="flex flex-row items-center gap-[3px]">
              <Text variant="Body" children="Подробнее в разделе" />
              <Link
                href="/delivery-and-payment"
                onClick={() => dispatch(startLoading())}
                className="underline decoration-[1px]"
              >
                <Text variant="Body" children="Доставка и Оплата" />
              </Link>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="sm:hidden flex flex-col">
        <div className="flex flex-col">
          <div
            className="flex justify-between pb-4 border-b-[1px] border-black outline-none cursor-pointer"
            onClick={() => toggleSection("Характеристики")}
          >
            <Text variant="Body" children="Характеристики" />
            <Image
              src={
                openedSection === "Характеристики"
                  ? "/resources/minus.svg"
                  : "/resources/add.svg"
              }
              width={24}
              height={24}
              alt="toggle"
            />
          </div>
          <ul
            className={`transition-all duration-700 overflow-hidden ${
              openedSection === "Характеристики"
                ? "opacity-1 max-h-[1000px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            {params.map((param, idx) => (
              <li key={idx}>
                <InfoRow label={param.label} value={param.value} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <div
            className="flex justify-between py-4 border-b-[1px] border-black outline-none cursor-pointer"
            onClick={() => toggleSection("Гарантия")}
          >
            <Text variant="Body" children="Гарантия" />
            <Image
              src={
                openedSection === "Гарантия"
                  ? "/resources/minus.svg"
                  : "/resources/add.svg"
              }
              width={24}
              height={24}
              alt="toggle"
            />
          </div>
          <div
            className={`flex flex-col gap-5 transition-all duration-700 overflow-hidden ${
              openedSection === "Гарантия"
                ? "opacity-1 max-h-[1000px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <Text variant="Bold" children="Особые условия проверки" />
            <div>
              <div className="flex flex-row justify-between pb-4 border-b-[1px] border-stroke">
                <Text
                  variant="Body"
                  children="Двигатели с навесным или без навесного оборудования"
                />
                <Text
                  variant="Bold"
                  children="30 дней"
                  className="min-w-[80px] text-right"
                />
              </div>
              <div className="flex flex-row justify-between py-4 border-b-[1px] border-stroke">
                <Text
                  variant="Body"
                  children="Датчик давления топлива, насос вакуумный (тандемный), насос топливный, рампа топливная, регулятор давления топлива, ТНВД (бензин, дизель), форсунка бензиновая (дизельная) механическая (электрическая), инжектор (распределитель впрыска топлива), дозатор-распределитель топлива"
                />
                <Text
                  variant="Bold"
                  children="14 дней"
                  className="min-w-[80px] text-right"
                />
              </div>
              <div className="flex flex-row items-center gap-[3px] py-4">
                <Text
                  variant="Body"
                  children="Подробнее о гарантии в разделе"
                />
                <Link
                  href="/warranty"
                  onClick={() => dispatch(startLoading())}
                  className="underline decoration-[1px]"
                >
                  <Text variant="Body" children="Гарантия" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className="flex justify-between py-4 border-b-[1px] border-black outline-none cursor-pointer"
            onClick={() => toggleSection("Доставка")}
          >
            <Text variant="Body" children="Доставка" />
            <Image
              src={
                openedSection === "Доставка"
                  ? "/resources/minus.svg"
                  : "/resources/add.svg"
              }
              width={24}
              height={24}
              alt="toggle"
            />
          </div>
          <div
            className={`flex flex-col gap-5 transition-all duration-700 overflow-hidden ${
              openedSection === "Доставка"
                ? "opacity-1 max-h-[1000px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Пункты выдачи (самовывоз)"
                className="mb-4"
              />
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/resources/location.svg"}
                    width={20}
                    height={20}
                    alt="Location"
                  />
                  <Text
                    variant="Body"
                    children="Минск, Привольный Луговослободской сельсовет, 16/5"
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/resources/location.svg"}
                    width={20}
                    height={20}
                    alt="Location"
                  />
                  <Text
                    variant="Body"
                    children="Москва, Лианозовский проезд 8 строение 3"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Доставка по Минску и по всей Беларуси"
                className="mb-4"
              />
              <Text
                variant="Body"
                children="Мы доставим Ваш заказ курьеров по адресу или европочтой (стоимость доставки рассчитывается индивидуально)"
              />
            </div>
            <div className="flex flex-col">
              <Text
                variant="Bold"
                children="Доставка по России"
                className="mb-4"
              />
              <Text
                variant="Body"
                children="Мы доставим Ваш заказ через СДЭК или КИТ (стоимость доставки рассчитывается индивидуально)"
              />
            </div>
            <div className="flex flex-row items-center gap-[3px]">
              <Text variant="Body" children="Подробнее в разделе" />
              <Link
                href="/delivery-and-payment"
                onClick={() => dispatch(startLoading())}
                className="underline decoration-[1px]"
              >
                <Text variant="Body" children="Доставка и Оплата" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className="flex justify-between py-4 border-b-[1px] border-black outline-none cursor-pointer"
            onClick={() => toggleSection("Оплата")}
          >
            <Text variant="Body" children="Оплата" />
            <Image
              src={
                openedSection === "Оплата"
                  ? "/resources/minus.svg"
                  : "/resources/add.svg"
              }
              width={24}
              height={24}
              alt="toggle"
            />
          </div>
          <div
            className={`flex flex-col gap-5 transition-all duration-700 overflow-hidden ${
              openedSection === "Оплата"
                ? "opacity-1 max-h-[1000px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <Text variant="Bold" children="Способы оплаты" />
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 pb-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/wallet-2.svg"}
                  width={24}
                  height={24}
                  alt="Wallet"
                />
                <Text variant="Body" children="При получении наличными" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/card.svg"}
                  width={24}
                  height={24}
                  alt="Card"
                />
                <Text variant="Body" children="Оплата онлайн" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/erip.png"}
                  width={57}
                  height={24}
                  alt="ERIP"
                />
                <Text variant="Body" children="ЕРИП" />
              </div>
              <div className="flex flex-row gap-2 py-3 border-b-[1px] border-stroke">
                <Image
                  src={"/resources/coin.svg"}
                  width={24}
                  height={24}
                  alt="Installment"
                />
                <Text variant="Body" children="Карта рассрочки онлайн" />
              </div>
            </div>
            <div className="flex flex-row items-center gap-[3px]">
              <Text variant="Body" children="Подробнее в разделе" />
              <Link
                href="/delivery-and-payment"
                onClick={() => dispatch(startLoading())}
                className="underline decoration-[1px]"
              >
                <Text variant="Body" children="Доставка и Оплата" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ChooseButton: React.FC<ChooseButtonProps> = ({
  value,
  selected,
  setSelectedButton,
}) => {
  return (
    <div
      className={`py-[8px] bg-white text-center cursor-pointer transition ${
        selected
          ? "border-b-[2px] border-blue_main pb-[7px]"
          : "border-b-[1px] border-stroke"
      }`}
      onClick={() => setSelectedButton(value)}
    >
      <Text variant="Body" children={value} />
    </div>
  );
};

const InfoRow: React.FC<RowProps> = ({ label, value }) => {
  return (
    <div className="flex items-end text-sm text-[#4B4B4B] mb-4">
      <Text variant="Small" className="flex-none text-black_60" children={label} />
      <span className="min-w-[40px] border-b border-dashed border-stroke flex-1" />
      <Text
        variant="Small"
        className="w-fit text-black text-end"
        children={value}
      />
    </div>
  );
};

export default ProductInfoBlock;

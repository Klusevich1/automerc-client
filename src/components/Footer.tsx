import { startLoading } from "@/redux/loadingSlice";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

const Footer = () => {
  const dispatch = useDispatch();

  return (
    <div className="bg-black text-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-[50px]">
        <div className="py-[48px] flex smlg:flex-row smlg:gap-0 gap-[36px] flex-col justify-between pb-[48px] border-b-[1px] border-stroke">
          <div className="flex flex-col lg:w-4/12 smlg:w-1/2 w-full">
            <h3 className="text-[20px] font-bold mb-[20px]">Контакты</h3>
            <div className="flex flex-col gap-[8px] text-[16px] font-medium mb-[16px]">
              <div>
                <p className="mb-[4px]">Минск</p>
                <p>Привольный Луговослободской сельсовет, 16/5</p>
              </div>
              <p>ежедневно, 10:00 - 20:00</p>
              <p>
                <a href="tel:+375296442190">+375 (29) 644-21-90</a>
              </p>
            </div>
            <div className="flex flex-col gap-[8px] text-[16px] font-medium mb-[16px]">
              <div>
                <p className="mb-[4px]">Москва</p>
                <p>Лианозовский проезд 8 строение 3</p>
              </div>
              <p>ежедневно, 10:00 - 20:00</p>
              <p>
                <a href="tel:+79206172888">+7 (920) 617-28-88</a>
              </p>
            </div>
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px] font-medium">Почта</p>
              <div className="text-[14px] font-medium flex flex-row gap-[12px]">
                <a
                  href="https://t.me/Automerc"
                  target="_blank"
                  className="flex flex-row gap-[8px]"
                >
                  <Image
                    src={"/resources/Telegram.png"}
                    width={20}
                    height={20}
                    alt="Telegram"
                  />
                  <span>Telegram</span>
                </a>
                <a
                  href="viber://chat?number=375296442190"
                  target="_blank"
                  className="flex flex-row gap-[8px]"
                >
                  <Image
                    src={"/resources/Viber.png"}
                    width={20}
                    height={20}
                    alt="Viber"
                  />
                  <span>Viber</span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:w-7/12 smlg:w-5/12 w-full">
            <h3 className="text-[20px] font-bold mb-[20px]">Полезные ссылки</h3>
            <ul className="flex flex-col gap-[12px] text-[16px] font-medium">
              <li>
                <Link href="/about" onClick={() => dispatch(startLoading())}>
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-and-payment"
                  onClick={() => dispatch(startLoading())}
                >
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/warranty" onClick={() => dispatch(startLoading())}>
                  Гарантия
                </Link>
              </li>
              <li>
                <Link href="/contacts" onClick={() => dispatch(startLoading())}>
                  Контакты
                </Link>
              </li>
              <li>Политика конфиденциальности</li>
            </ul>
          </div>
        </div>
        <div className="py-[24px] text-[14px] font-medium">
          <p>Частное предприятие "Территория запчастей", УНП 691594401</p>
          <p>В торговом реестре РБ c 22 июня 2016г. Рег. номер: 336162.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

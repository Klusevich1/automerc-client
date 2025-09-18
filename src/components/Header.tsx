import Image from "next/image";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { CgClose } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineHome } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { CiShoppingBasket } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
import DialogAuth from "./DialogAuth";
import Link from "next/link";
import Dialog from "./BaseDialog";
import CartModal from "./CartModal";
import BaseDialog from "./BaseDialog";
import Text from "./headers/Text";
import { getAllCategories } from "@/lib/getAllCategories";
import { Category } from "@/interfaces/Category";
import { SearchInput } from "./SearchInput";
import { useUser } from "@/utils/hooks/useUser";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { startLoading } from "@/redux/loadingSlice";

const POPULAR_ITEMS = ["Тормозные диски", "Сцепление", "Кузовной двигатель"];

interface BaseHeaderButtonProps {
  text: string;
  hrefLink: string;
  imageLink: string;
  hoverImageLink: string;
  onClick?: () => void;
  // onClick?: (
  //     event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  //    ) => void;
}

interface ActiveGarageProps {
  total: number;
  selectedCar: {
    id: number;
    name: string;
    brand_id: number;
    model_id: number;
    generation_id: number;
  };
}

interface HeaderButtonProps extends BaseHeaderButtonProps {
  isVisibleOnMobile?: boolean;
}

const MOBILE_MENU_ITEMS = [
  {
    text: "Гараж",
    hrefLink: "/garage",
    imageLink: "/resources/Garage.svg",
    hoverImageLink: "/resources/Garage_blue.svg",
  },
  {
    text: "Избранное",
    hrefLink: "",
    imageLink: "/resources/Heart.svg",
    hoverImageLink: "/resources/Heart_blue.svg",
  },
  {
    text: "Корзина",
    hrefLink: "",
    imageLink: "/resources/Bag.svg",
    hoverImageLink: "/resources/Bag_blue.svg",
  },
  // { text: "Войти", hrefLink: "", imageLink: "/resources/Login.svg" },
];

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<Category[]>();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<
    null | "address" | "forclients" | "phone"
  >(null);

  const addressTriggerRef = useRef<HTMLDivElement | null>(null);
  const phoneTriggerRef = useRef<HTMLDivElement | null>(null);
  const clientsTriggerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 52) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedOutsideModal =
        modalRef.current && !modalRef.current.contains(target);
      const clickedOutsideAddressTrigger =
        addressTriggerRef.current &&
        !addressTriggerRef.current.contains(target);
      const clickedOutsidePhoneTrigger =
        phoneTriggerRef.current && !phoneTriggerRef.current.contains(target);
      const clickedOutsideClientsTrigger =
        clientsTriggerRef.current &&
        !clientsTriggerRef.current.contains(target);

      if (
        clickedOutsideModal &&
        clickedOutsideAddressTrigger &&
        clickedOutsidePhoneTrigger &&
        clickedOutsideClientsTrigger
      ) {
        setActiveModal(null);
      }
    };

    const handleScroll = () => {
      setActiveModal(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await getAllCategories();
      setCategories(fetchCategories.items);
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full transition-transform ${
          isSticky && window.innerWidth > 1024
            ? "bg-transparent translate-y-[-45px]"
            : `${window.innerWidth > 1024 ? "bg-white" : ""} translate-y-0`
        } lg:border-b-[1px] border-stroke z-[49]`}
      >
        <div
          className={`flex flex-col max-w-[1280px] z-[49] mx-auto px-4 lg:px-[50px] lg:border-0 border-b-[1px] border-stroke bg-white`}
        >
          <div
            className={`hidden lg:flex justify-between items-center  pt-3 pb-2 transition-transform`}
          >
            <div
              ref={addressTriggerRef}
              className="flex flex-row gap-1 cursor-pointer select-none"
              onClick={() =>
                setActiveModal((prev) =>
                  prev === "address" ? null : "address"
                )
              }
            >
              <Text variant="Body">
                Минск, Привольный Луговослободской сельсовет, 16/5
              </Text>
              <Image
                src={"/resources/arrow-down.svg"}
                width={20}
                height={20}
                alt="Arrow"
                className={`${
                  activeModal === "address" ? "rotate-180" : ""
                } transition-all duration-150`}
              />
            </div>
            <div
              ref={phoneTriggerRef}
              className="flex flex-row gap-1 cursor-pointer select-none"
              onClick={() =>
                setActiveModal((prev) => (prev === "phone" ? null : "phone"))
              }
            >
              <Text variant="Body">+375 (29) 644-21-90</Text>
              <Image
                src={"/resources/arrow-down.svg"}
                width={20}
                height={20}
                alt="Arrow"
                className={`${
                  activeModal === "phone" ? "rotate-180" : ""
                } transition-all duration-150`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <a href="https://t.me/Automerc" target="_blank">
                <Image
                  src="/resources/Telegram.png"
                  width={24}
                  height={24}
                  alt="Telegram"
                />
              </a>
              <a href="viber://add?number=375296442190">
                <Image
                  src="/resources/Viber.png"
                  width={24}
                  height={24}
                  alt="Viber"
                />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div
                ref={clientsTriggerRef}
                className="flex flex-row gap-1 cursor-pointer select-none"
                onClick={() =>
                  setActiveModal((prev) =>
                    prev === "forclients" ? null : "forclients"
                  )
                }
              >
                <Text variant="Body">Клиентам</Text>
                <Image
                  src={"/resources/arrow-down.svg"}
                  width={20}
                  height={20}
                  alt="Arrow"
                  className={`${
                    activeModal === "forclients" ? "rotate-180" : ""
                  } transition-all duration-150`}
                />
              </div>
              <Link
                href="/contacts"
                className="hover:text-blue_main"
                onClick={() => dispatch(startLoading())}
              >
                <Text variant="Body">Контакты</Text>
              </Link>
            </div>
          </div>

          <div
            className={`bg-white flex items-center justify-between pt-2 pb-2 lg:pb-3`}
          >
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMenuOpen(true)}>
                <Image
                  src={"/resources/BurgerMenu.svg"}
                  width={29}
                  height={24}
                  alt="Burger"
                />
              </button>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link
                href="/"
                className="text-[18px] lg:text-[20px] font-sans font-extrabold text-blue_main italic"
                onClick={() => dispatch(startLoading())}
              >
                AUTOMERC
              </Link>
            </div>
            {/* <Link
              href="/"
              className="text-[18px] lg:text-[20px] font-sans font-extrabold text-blue_main italic"
            >
              AUTOMERC
            </Link> */}
            <div
              className="hidden lg:flex px-[24px] items-center hover:text-blue_main transition cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Image
                src={"/resources/BurgerMenu.svg"}
                width={24}
                height={20}
                alt="Burger"
                className="w-full min-w-[24px]"
              />
              <Text variant="Body" className="ml-2">
                Каталог
              </Text>
            </div>
            <div
              className={`hidden lg:block w-full ${
                user?.selectedCar ? "" : "px-[24px]"
              }`}
            >
              <SearchInput />
            </div>
            <div className="flex flex-row gap-4">
              {user?.selectedCar ? (
                <ActiveGarage
                  total={user?.cars.length}
                  selectedCar={user?.selectedCar}
                />
              ) : (
                <HeaderButton
                  text="Гараж"
                  hrefLink=""
                  imageLink="/resources/Garage.svg"
                  hoverImageLink="/resources/Garage_blue.svg"
                  onClick={() => {
                    if (user) {
                      dispatch(startLoading());
                      router.push("/profile?tab=garage");
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                />
              )}
              <HeaderButton
                text="Избранное"
                hrefLink="/liked"
                imageLink="/resources/Heart.svg"
                hoverImageLink="/resources/Heart_blue.svg"
                onClick={() => dispatch(startLoading())}
              />
              <HeaderButton
                text="Корзина"
                hrefLink=""
                imageLink="/resources/Bag.svg"
                hoverImageLink="/resources/Bag_blue.svg"
                onClick={() => setOpenCart(true)}
              />
              <HeaderButton
                text={user ? "Профиль" : "Войти"}
                hrefLink=""
                imageLink="/resources/Login.svg"
                hoverImageLink="/resources/Login_blue.svg"
                onClick={() => {
                  if (user) {
                    dispatch(startLoading());
                    router.push("/profile");
                  } else {
                    setOpenLogin(true);
                  }
                }}
                isVisibleOnMobile={false}
              />
              {/* <div className="hidden lg:block">
                <DialogAuth />
              </div> */}
            </div>
          </div>
        </div>
        <div
          className={`lg:hidden flex z-[49] py-3 px-4 transition-transform ${
            isSticky ? "translate-y-[-105px]" : ""
          }`}
        >
          <SearchInput />
        </div>
        <div
          className={`lg:flex hidden justify-center fixed top-[0px] left-1/2 -translate-x-1/2 h-[calc(100vh - 50px)] h-screen w-full bg-white z-[49] transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-y-[117px]" : "-translate-y-[-200%]"
          } `}
        >
          <div className={`lg:block hidden max-w-[1280px] w-full`}>
            <div
              className={`flex justify-between items-start ${
                menuOpen ? "py-7" : ""
              } lg:px-[50px] px-4`}
            >
              <nav className="flex flex-col space-y-6 text-lg font-medium mr-8">
                <ul className="min-w-[250px] w-full flex flex-col gap-[6px]">
                  {categories?.map((item) => (
                    <li
                      key={item.slug}
                      className="relative group"
                      onMouseEnter={() => setHoveredCategory(item.slug)}
                      // onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="flex flex-row items-center justify-between cursor-pointer py-[3px]">
                        <Link
                          href={`/catalog/${item.slug}`}
                          onClick={() => {
                            setMenuOpen(false);
                            dispatch(startLoading());
                          }}
                          className="flex-grow"
                        >
                          <Text
                            className={`${
                              hoveredCategory === item.slug
                                ? "!font-bold !text-black"
                                : "!font-medium text-gray-700"
                            } transition-all duration-200`}
                          >
                            {item.name}
                          </Text>
                        </Link>

                        {/* Стрелка только если есть подкатегории */}
                        {item.subcategories &&
                          item.subcategories.length > 0 && (
                            <div
                              className={`ml-2 transition-transform duration-200 ${
                                hoveredCategory === item.slug
                                  ? "-rotate-90"
                                  : "rotate-0"
                              }`}
                            >
                              <Image
                                src={"/resources/arrow-down.svg"}
                                width={16}
                                height={16}
                                alt="Arrow"
                              />
                            </div>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Правая колонка с подкатегориями */}
              <div className="min-w-[250px] w-full border-l border-gray-200 pl-8">
                {hoveredCategory && (
                  <div className="sticky top-0">
                    {categories
                      ?.filter((item) => item.slug === hoveredCategory)
                      .map((item) => (
                        <div key={item.slug}>
                          {/* Заголовок категории */}
                          <h3 className="text-lg font-bold text-black mb-2">
                            {item.name}
                          </h3>

                          {/* Список подкатегорий */}
                          {item.subcategories &&
                          item.subcategories.length > 0 ? (
                            <ul className="max-h-[70vh] space-y-1 overflow-y-auto custom-scroll">
                              {item.subcategories.map((subcat) => (
                                <li key={subcat.slug}>
                                  <Link
                                    href={`/catalog/${item.slug}/${subcat.slug}`}
                                    onClick={() => dispatch(startLoading())}
                                    className="block py-1 px-3 hover:bg-gray-50 rounded-md transition text-base text-gray-700 hover:text-blue_main"
                                  >
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              Нет подкатегорий
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <button onClick={() => setMenuOpen(false)}>
                <Image
                  src={"/resources/cross.svg"}
                  width={24}
                  height={24}
                  alt="Cross"
                />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`fixed top-0 left-[-100%] h-screen w-full bg-white z-[49] transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-full" : "translate-x-0"
          } lg:hidden`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                setIsCatalogOpen(false);
              }}
            >
              <CgClose className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex mx-4 flex-col items-center space-y-4 font-medium">
            {!isCatalogOpen ? (
              <>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex flex-row items-center gap-1">
                    <Image
                      src={"/resources/location.svg"}
                      width={24}
                      height={24}
                      alt="Location"
                    />
                    <div className="flex flex-row items-center gap-1">
                      <Text variant="Body">Минск</Text>
                      <div className="w-[1px] h-[20px] bg-stroke"></div>
                      <Text variant="PreTitle" className="!font-medium">
                        Привольный с/с, 16/5
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href="tel:+375296442190" className="w-fit">
                      <Text
                        variant="Body"
                        className="hover:text-blue_main transition"
                      >
                        +375 (29) 644-21-90
                      </Text>
                    </a>
                    <a href="tel:+79206172888" className="w-fit">
                      <Text
                        variant="Body"
                        className="hover:text-blue_main transition"
                      >
                        +7 (920) 617-28-88
                      </Text>
                    </a>
                  </div>
                </div>
                <ul className="w-full pt-4 border-t-[1px] border-stroke">
                  <MobileMenuButtonItem
                    text={user ? "Профиль" : "Войти"}
                    hrefLink=""
                    imageLink="/resources/Login.svg"
                    hoverImageLink="/resources/Login_blue.svg"
                    onClick={() => {
                      if (user) {
                        dispatch(startLoading());
                        router.push("/profile");
                      } else {
                        setOpenLogin(true);
                      }
                    }}
                  />
                  <MobileMenuButtonItem
                    key={1}
                    text={"Гараж"}
                    hrefLink={""}
                    onClick={() => {
                      if (user) {
                        dispatch(startLoading());
                        router.push("/profile?tab=garage");
                      } else {
                        setOpenLogin(true);
                      }
                    }}
                    imageLink={"/resources/Garage.svg"}
                    hoverImageLink={"/resources/Garage_blue.svg"}
                  />
                  <li
                    className="pb-4 w-fit hover:text-blue_main transition cursor-pointer"
                    onClick={() => setIsCatalogOpen(true)}
                  >
                    <Text variant="Body">Каталог</Text>
                  </li>
                  <li className="pb-4 w-fit hover:text-blue_main transition">
                    <Link href="/cars" onClick={() => dispatch(startLoading())}>
                      <Text variant="Body">Машины на разбор</Text>
                    </Link>
                  </li>
                  <li className="pb-4 w-fit hover:text-blue_main transition">
                    <Link
                      href="/about"
                      onClick={() => dispatch(startLoading())}
                    >
                      <Text variant="Body">О нас</Text>
                    </Link>
                  </li>
                  <li className="pb-4 w-fit hover:text-blue_main transition">
                    <Link
                      href="/contacts"
                      onClick={() => dispatch(startLoading())}
                    >
                      <Text variant="Body">Контакты</Text>
                    </Link>
                  </li>
                  <li className="pb-4 w-fit hover:text-blue_main transition">
                    <Link
                      href="/warranty"
                      onClick={() => dispatch(startLoading())}
                    >
                      <Text variant="Body">Гарантия</Text>
                    </Link>
                  </li>
                  <li className="pb-4 w-fit hover:text-blue_main transition">
                    <Link
                      href="/delivery-and-payment"
                      onClick={() => dispatch(startLoading())}
                    >
                      <Text variant="Body">Доставка и оплата</Text>
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div
                  className="w-full flex flex-row gap-3 items-center hover:text-blue_main transition cursor-pointer"
                  onClick={() => {
                    setIsCatalogOpen(false);
                    setHoveredCategory(null);
                  }}
                >
                  <Image
                    src={"/resources/arrow-left.svg"}
                    width={24}
                    height={24}
                    alt="Arrow"
                  />
                  <Text variant="Small">Каталог</Text>
                </div>

                {!hoveredCategory ? (
                  <ul className="w-full pt-1 flex flex-col gap-3">
                    {categories?.map((item) => (
                      <li
                        key={item.slug}
                        className="hover:text-blue_main transition w-fit cursor-pointer"
                        onClick={() => setHoveredCategory(item.slug)}
                      >
                        <Text>{item.name}</Text>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    {categories
                      ?.filter((item) => item.slug === hoveredCategory)
                      .map((item) => (
                        <>
                          <h3 className="w-full text-lg font-bold text-black">
                            {item.name}
                          </h3>
                          <ul className="w-full pt-1 flex flex-col gap-3">
                            {item.subcategories.map((sub, idx) => (
                              <li key={sub.slug} className="">
                                <Link
                                  href={`/catalog/${item.slug}/${sub.slug}`}
                                  onClick={() => dispatch(startLoading())}
                                  className="hover:text-blue_main transition cursor-pointer"
                                >
                                  <Text>{sub.name}</Text>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ))}
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      {activeModal === "address" && (
        <div
          ref={modalRef}
          className="fixed lg:top-[50px] top-[145px] lg:left-[max(calc(50%-640px+47px),45px)] left-[16px] z-[150] bg-white flex flex-col gap-2 py-3 px-4 rounded-[16px] shadow-[0_0px_5px_rgba(0,0,0,0.1)] text-[16px] font-medium"
        >
          <p>Минск, Привольный Луговослободской сельсовет, 16/5</p>
          <p>Москва, проезд Полесский, 16, стр 2</p>
        </div>
      )}
      {activeModal === "phone" && (
        <div
          ref={modalRef}
          className="fixed lg:top-[50px] top-[145px] lg:right-[max(calc(50%-200px+60px),45px)] right-[16px] z-[150] bg-white flex flex-col gap-2 py-3 px-4 rounded-[16px] shadow-[0_0px_5px_rgba(0,0,0,0.1)] text-[16px] font-medium"
        >
          <a
            href="tel:+375296442190"
            className="hover:text-blue_main transition"
          >
            +375 (29) 644-21-90
          </a>
          <a
            href="tel:+79206172888"
            className="hover:text-blue_main transition"
          >
            +7 (920) 617-28-88
          </a>
        </div>
      )}
      {activeModal === "forclients" && (
        <div
          ref={modalRef}
          className="fixed top-[50px] right-[max(calc(50%-640px+117px),45px)] z-[150] bg-white flex flex-col gap-2 py-3 px-4 rounded-[16px] shadow-[0_0px_5px_rgba(0,0,0,0.1)] text-[16px] font-medium"
        >
          <Link
            href="/cars"
            className="hover:text-blue_main transition"
            onClick={() => dispatch(startLoading())}
          >
            Машины на разбор
          </Link>
          <Link
            href="/about"
            className="hover:text-blue_main transition"
            onClick={() => dispatch(startLoading())}
          >
            О нас
          </Link>
          <Link
            href="/warranty"
            className="hover:text-blue_main transition"
            onClick={() => dispatch(startLoading())}
          >
            Гарантия
          </Link>
          <Link
            href="/delivery-and-payment"
            className="hover:text-blue_main transition"
            onClick={() => dispatch(startLoading())}
          >
            Доставка и оплата
          </Link>
        </div>
      )}
      <div className="mt-[93px] lg:mt-[116px]"></div>
      <BaseDialog isOpen={openCart} onClose={() => setOpenCart(false)}>
        <CartModal onClose={() => setOpenCart(false)} />
      </BaseDialog>
      <DialogAuth open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default Header;

export const HeaderButton: React.FC<HeaderButtonProps> = ({
  text,
  hrefLink,
  imageLink = "",
  hoverImageLink = "",
  onClick,
  isVisibleOnMobile = true,
}) => {
  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);

  const [currentImage, setCurrentImage] = useState(imageLink);

  return (
    <>
      {hrefLink ? (
        <Link
          href={hrefLink}
          onClick={onClick}
          className={
            "flex-col items-center transition duration-300 hover:text-blue_main cursor-pointer " +
            (isVisibleOnMobile ? "flex" : "lg:flex hidden")
          }
          onMouseEnter={() => {
            if (hoverImageLink) setCurrentImage(hoverImageLink);
          }}
          onMouseLeave={() => setCurrentImage(imageLink)}
        >
          <Image src={currentImage} alt={text} width={24} height={24} />
          <Text variant="Small" className="hidden lg:block transition">
            {text}
          </Text>
        </Link>
      ) : (
        <div
          onClick={onClick}
          className={
            "relative flex-col items-center transition duration-300 hover:text-blue_main cursor-pointer " +
            (isVisibleOnMobile ? "flex" : "lg:flex hidden")
          }
          onMouseEnter={() => {
            if (hoverImageLink) setCurrentImage(hoverImageLink);
          }}
          onMouseLeave={() => setCurrentImage(imageLink)}
        >
          {text === "Корзина" && (
            <p className="absolute top-0 left-[-3px] flex items-center justify-center lg:text-[12px] text-[10px] lg:h-[18px] h-[14px] lg:w-[18px] w-[14px] text-white  bg-blue_main rounded-full">
              {cartItems.length}
            </p>
          )}
          <Image src={currentImage} alt={text} width={24} height={24} />
          <Text variant="Small" className="hidden lg:block transition">
            {text}
          </Text>
        </div>
      )}
    </>
  );
};

export const MobileMenuButtonItem: React.FC<BaseHeaderButtonProps> = ({
  text,
  hrefLink,
  onClick,
  imageLink = "",
}) => {
  const dispatch = useDispatch();
  return (
    <li
      className="w-fit pb-4 lg:hidden hover:text-blue_main transition"
      onClick={onClick}
    >
      {hrefLink ? (
        <Link
          href={hrefLink}
          className="w-full flex flex-row items-center"
          onClick={() => dispatch(startLoading())}
        >
          <Image src={imageLink} alt={text} width={24} height={24} />
          <p className="pl-3 font-medium text-[16px]">{text}</p>
        </Link>
      ) : (
        <div className="w-full flex flex-row items-center cursor-pointer">
          <Image src={imageLink} alt={text} width={24} height={24} />
          <p className="pl-3 font-medium text-[16px]">{text}</p>
        </div>
      )}
    </li>
  );
};

const ActiveGarage: React.FC<ActiveGarageProps> = ({ selectedCar, total }) => {
  return (
    <>
      <Link
        className="min-w-[206px] lg:flex hidden flex-row items-center gap-[15px] px-3 py-[10px] ml-6 rounded-[8px] bg-blue_main"
        href="/profile?tab=garage"
      >
        <div className="relative">
          <Image
            src={"/resources/Garage_white.svg"}
            width={24}
            height={24}
            alt="Garage"
          />
          <div className="absolute top-0 right-[-8px] flex items-center justify-center bg-white w-[18px] h-[18px] rounded-full">
            <Text variant="PreTitle">{total}</Text>
          </div>
        </div>
        <Text variant="Small" className="text-white truncate max-w-[143px]">
          {selectedCar.name}
        </Text>
      </Link>
      <Link className="lg:hidden" href="/profile?tab=garage">
        <div className="relative">
          <Image
            src={"/resources/Garage.svg"}
            width={24}
            height={24}
            alt="Garage"
          />
          <div className="absolute top-0 right-[-3px] flex items-center justify-center bg-blue_main w-[14px] h-[14px] rounded-full">
            <Text variant="PreTitle" className="text-white !text-[10px]">
              {total}
            </Text>
          </div>
        </div>
      </Link>
    </>
  );
};

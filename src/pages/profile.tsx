import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BasicLayout from "@/layouts/BasicLayout";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import Text from "@/components/headers/Text";
import Image from "next/image";
import PersonalInformationProfileTab from "@/components/PersonalInformationProfileTab";
import { useUser } from "@/utils/hooks/useUser";
import { GoArrowLeft, GoTriangleRight } from "react-icons/go";
import BaseDialog from "@/components/BaseDialog";
import CartModal from "@/components/CartModal";
import OrderProfileCard from "@/components/OrderProfileCard";
import { GetServerSidePropsContext } from "next";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import AdminOrderStatusPanel from "@/components/AdminOrderStatusPanel";
import GarageCar from "@/components/GarageCar";
import FilterBLock from "@/components/FilterBLock";
import { getAllCategories } from "@/lib/getAllCategories";
import { getAllBrands } from "@/lib/carInfo";
import { Category } from "@/interfaces/Category";
import { Brand } from "@/interfaces/Brand";
import SEO, { ListItem } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const PAGE_NAME = "profile";
const BREADCRUMB_PAGE_NAME = "Личный кабинет";

const BREADCRUMBS = [
  { name: "Главная", link: "/" },
  { name: BREADCRUMB_PAGE_NAME, link: `/${PAGE_NAME}` },
];

const breadcrumbsSchema: ListItem[] = BREADCRUMBS.map((item, index) => ({
  "@type": "ListItem",
  position: index + 1,
  name: item.name,
  item: `https://hazparts.com${item.link}`,
}));

const PROFILE_TABS = {
  PERSONAL_INFO: "Личные данные",
  CART: "Корзина",
  ORDERS: "Заказы",
  FAVORITES: "Избранное",
  GARAGE: "Гараж",
  DEFAULT: "",
};

interface UserPageProps {
  userRole: "user" | "admin";
  fetchCategories: {
    total: number;
    items: Category[];
  };
  fetchBrands: {
    total: number;
    items: Brand[];
  };
}

const TAB_LIST = Object.values(PROFILE_TABS);

const UserPage: React.FC<UserPageProps> = ({
  userRole,
  fetchBrands,
  fetchCategories,
}) => {
  console.log(userRole);
  const router = useRouter();
  const { tab } = router.query;

  const { user, loading, refetch } = useUser();
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.PERSONAL_INFO);
  const [visibleTab, setVisibleTab] = useState(PROFILE_TABS.PERSONAL_INFO);
  const [isFading, setIsFading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setActiveTab(PROFILE_TABS.DEFAULT);
      setVisibleTab(PROFILE_TABS.DEFAULT);
      if (tab === "garage") {
        setActiveTab("Гараж");
        setVisibleTab("Гараж");
      }
    } else {
      setActiveTab(PROFILE_TABS.PERSONAL_INFO);
      setVisibleTab(PROFILE_TABS.PERSONAL_INFO);
      if (tab === "garage") {
        setActiveTab("Гараж");
        setVisibleTab("Гараж");
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (activeTab === PROFILE_TABS.DEFAULT) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } else {
      setIsDisabled(false);
    }
  }, [isMobile, activeTab]);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === PROFILE_TABS.CART) {
      setOpenCart(true);
      return;
    }
    if (tab === PROFILE_TABS.FAVORITES) {
      router.push("/liked");
      return;
    }

    if (tab === activeTab) return;

    setIsFading(true);
    setTimeout(() => {
      setVisibleTab(tab);
      setActiveTab(tab);
      setIsFading(false);
    }, 200);
  };

  const logoutProfile = async () => {
    try {
      const res = await defaultFetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Ошибка входа");
      }

      router.push("/");
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const deleteProfile = async () => {
    try {
      const res = await defaultFetch(`/users/${user?.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Ошибка удаления");
      }

      router.push("/");
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <>
      <SEO
        title="Личный кабинет пользователя | Automerc.by - магазин б/у автозапчастей"
        description="Войдите в личный кабинет, чтобы отслеживать заказы, сохранять автомобили, управлять избранными товарами и данными профиля. Удобный сервис для постоянных клиентов Automerc.by."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <h1
          onClick={
            isDisabled
              ? () => {
                  setActiveTab(PROFILE_TABS.DEFAULT);
                  setVisibleTab(PROFILE_TABS.DEFAULT);
                }
              : () => {}
          }
          className={
            (isDisabled
              ? "font-medium text-[14px] cursor-pointer"
              : "text-[24px] font-bold") +
            " w-fit flex items-center transition-all duration-200 xl:text-[32px] font-manrope -tracking-[0.02em] "
          }
        >
          <GoArrowLeft
            className={
              (isDisabled ? "block me-3" : "hidden") +
              " transition-all duration-200 w-6 h-6"
            }
          />
          <span>Личный кабинет</span>
        </h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : user ? (
          <div className="flex flex-col md:flex-row mt-6 xl:gap-[120px] lg:gap-[60px] gap-4 w-full">
            <div className="md:min-w-[192px] md:w-48 flex flex-col">
              {isMobile && isDisabled ? (
                <></>
              ) : (
                <div className="flex justify-between items-end md:flex-col mb-6 md:mb-0">
                  <div className="md:mb-5">
                    <Text
                      variant="Body"
                      className="!font-bold md:text-right md:!text-[16px] !text-[20px]"
                    >
                      {user.firstName}
                    </Text>
                    <Text
                      variant="Body"
                      className="!font-bold md:text-right md:!text-[16px] !text-[20px]"
                    >
                      {user.lastName}
                    </Text>
                  </div>
                  {/* <Text variant="Small" className="md:mt-2 md:mb-5 text-right">
                    бонусы <span className="font-bold">3,14</span>
                  </Text> */}
                </div>
              )}

              {TAB_LIST.map((tab) => (
                <h3
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`mb-3 flex w-full items-center justify-between cursor-pointer md:justify-end font-bold text-[16px] md:text-[20px] transition-all 
                                ${
                                  activeTab === tab && !isMobile
                                    ? "text-blue_main"
                                    : "text-black hover:text-blue_main"
                                }
                                ${
                                  isMobile &&
                                  activeTab !== tab &&
                                  activeTab !== PROFILE_TABS.DEFAULT
                                    ? "hidden"
                                    : "block text-[16px]"
                                }
                                ${
                                  isMobile &&
                                  activeTab === tab &&
                                  activeTab !== PROFILE_TABS.DEFAULT
                                    ? "text-[24px] !text-black"
                                    : "text-[16px]"
                                }`}
                >
                  <span>{tab}</span>
                  {isMobile && activeTab === PROFILE_TABS.DEFAULT ? (
                    <GoTriangleRight className="w-[16px] h-[16px]" />
                  ) : (
                    <></>
                  )}
                </h3>
              ))}
              {userRole === "admin" && (
                <h3
                  onClick={() => handleTabChange("Изменить статус")}
                  className={`mb-3 flex w-full items-center justify-between cursor-pointer md:justify-end font-bold text-[16px] md:text-[20px] transition-all 
                                ${
                                  activeTab === "Изменить статус" && !isMobile
                                    ? "text-blue_main"
                                    : "text-black hover:text-blue_main"
                                }
                                ${
                                  isMobile &&
                                  activeTab !== "Изменить статус" &&
                                  activeTab !== PROFILE_TABS.DEFAULT
                                    ? "hidden"
                                    : "block text-[16px]"
                                }
                                ${
                                  isMobile &&
                                  activeTab === "Изменить статус" &&
                                  activeTab !== PROFILE_TABS.DEFAULT
                                    ? "text-[24px] !text-black"
                                    : "text-[16px]"
                                }`}
                >
                  <span>Изменить статус</span>
                  {isMobile && activeTab === PROFILE_TABS.DEFAULT ? (
                    <GoTriangleRight className="w-[16px] h-[16px]" />
                  ) : (
                    <></>
                  )}
                </h3>
              )}

              <div
                className={
                  (isDisabled ? "hidden" : "flex") +
                  " w-full md:justify-end flex-col md:gap-2"
                }
              >
                <button
                  type="button"
                  onClick={logoutProfile}
                  className="md:my-6 md:border-none border-t-[1px] md:py-0 py-4 flex md:justify-end items-center text-right transition-all hover:text-red"
                >
                  <Image
                    src="/resources/logout.svg"
                    width={20}
                    height={20}
                    alt="Выйти"
                  />
                  <span className="ms-2">Выйти</span>
                </button>
                <button
                  type="button"
                  onClick={deleteProfile}
                  className="flex md:border-none border-y-[1px] md:py-0 py-4 md:justify-end items-center text-right transition-all hover:text-red"
                >
                  <Image
                    src="/resources/trash.svg"
                    width={20}
                    height={20}
                    alt="Удалить профиль"
                  />
                  <span className="ms-2">Удалить профиль</span>
                </button>
              </div>
            </div>

            <div
              className={`w-full flex transition-opacity duration-200 ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {visibleTab === PROFILE_TABS.PERSONAL_INFO && (
                <PersonalInformationProfileTab user={user} refetch={refetch} />
              )}
              {visibleTab === PROFILE_TABS.CART && <p>Корзина пока пуста.</p>}
              {visibleTab === PROFILE_TABS.ORDERS && (
                <div className="w-full">
                  {user.orders.length > 0 ? (
                    user.orders.map((ord, idx) => (
                      <div key={idx}>
                        <OrderProfileCard idx={idx} order={ord} />
                      </div>
                    ))
                  ) : (
                    <p>Здесь будут ваши заказы.</p>
                  )}
                </div>
              )}
              {visibleTab === PROFILE_TABS.FAVORITES && (
                <p>Здесь будут ваши избранные товары.</p>
              )}
              {visibleTab === PROFILE_TABS.GARAGE && <GarageCar user={user} />}
              {visibleTab === "Изменить статус" && <AdminOrderStatusPanel />}
              {visibleTab === PROFILE_TABS.DEFAULT && <></>}
            </div>
          </div>
        ) : (
          <p>Пользователь не найден.</p>
        )}
        <BaseDialog isOpen={openCart} onClose={() => setOpenCart(false)}>
          <CartModal onClose={() => setOpenCart(false)} />
        </BaseDialog>
      </BasicLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let userRole: string | null = null;
  try {
    const cookiesHeader = context.req.headers.cookie ?? "";
    const cookies = parseCookie(cookiesHeader);
    const token = cookies["jwt"];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.AUTH_JWT_SECRET as string
      ) as {
        id: number;
        role?: string;
        iat?: number;
        exp?: number;
      };
      userRole = decoded?.role ?? null;
    }

    const fetchCategories = await getAllCategories();
    const fetchBrands = await getAllBrands();
    return { props: { userRole, fetchBrands, fetchCategories } };
  } catch {
    userRole = null;
    return { props: { userRole, fetchBrands: [], fetchCategories: [] } };
  }
}

export default UserPage;

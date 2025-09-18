import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import DialogAuth from "@/components/DialogAuth";
import H1 from "@/components/headers/H1";
import H2 from "@/components/headers/H2";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import ProductCard from "@/components/ProductCard";
import ProductInfoBlock from "@/components/ProductInfoBlock";
import SEO, { ListItem } from "@/components/SEO";
import VerticalSlider from "@/components/VerticalSlider";
import { Applicability } from "@/interfaces/Applicability";
import { Product } from "@/interfaces/Product";
import { TecDocDetailInfo } from "@/interfaces/TecDocDetailInfo";
import BasicLayout from "@/layouts/BasicLayout";
import { toggleFavorite } from "@/lib/addToFavorite";
import { getProductParams } from "@/lib/getProductsParams";
import { getNbrbRates, rubToByn } from "@/lib/nbrb";
import { parseNoteToFields } from "@/lib/parseNoteFields";
import { parseNoteString } from "@/lib/parseNoteString";
import { addToCart, setCart } from "@/redux/cartSlice";
import { startLoading, stopLoading } from "@/redux/loadingSlice";
import { RootState } from "@/redux/store";
import { showTopNotice } from "@/redux/uiTopNoticeSlice";
import { UserData } from "@/Types/UserData";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { useUser } from "@/utils/hooks/useUser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProductPageProps {
  product: { SparePart: Product; TecDocDetailInfo: TecDocDetailInfo };
  analogues: { data: Product[]; total: number };
  applicabilityBrands: {
    total: number;
    data: {
      total: number;
      mfa_id: number;
      mfa_brand: string;
    }[];
  };
}

interface ApplicabilityBlockProps {
  applicabilityBrands: {
    total: number;
    data: {
      total: number;
      mfa_id: number;
      mfa_brand: string;
    }[];
  };
  article: string;
}

const BRANDS_TEST = [
  {
    name: "CHEVROLET",
    imageUrl: "/resources/chevrolet.svg",
  },
  {
    name: "LEXUS",
    imageUrl: "/resources/lexus.svg",
  },
  {
    name: "MERCEDES-BENZ",
    imageUrl: "/resources/mercedes-logo.svg",
  },
  {
    name: "TOYOTA",
    imageUrl: "/resources/mercedes-logo.svg",
  },
  {
    name: "VOLKSWAGEN",
    imageUrl: "/resources/mercedes-logo.svg",
  },
];

// const TEST_PRODUCT: Product = {
//   id: 1,
//   name: "Моторное масло",
//   articleId: '000000',
//   price: "89,90",
//   params: [
//     {
//       label: "VIN",
//       value: "WBAPD52040WC92486",
//     },
//     {
//       label: "Год",
//       value: "2006",
//     },
//     {
//       label: "VIN",
//       value: "WBAPD52040WC92486",
//     },
//   ],
// };

// const PRODUCT_ANALOGUES = [
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
//   TEST_PRODUCT,
// ];

const productPage: React.FC<ProductPageProps> = ({
  product,
  analogues,
  applicabilityBrands,
}) => {
  const breadcrumbs = [
    { name: "Главная", link: `/` },
    {
      name: `${product.SparePart.name} ${product.SparePart.article}`,
      link: `/product/${product.SparePart.article}`,
    },
  ];

  const breadcrumbsSchema: ListItem[] = breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `https://hazparts.com${item.link}`,
  }));

  const { user } = useUser();

  return (
    <>
      <SEO
        title={`${product.SparePart.nameWithInfo} купить в Минске | Запчасти и аксессуары для авто на Automerc.by`}
        description={`Купить ${product.SparePart.nameWithInfo} в Минске - оригинальные детали для всех автомобилей. Полные характеристики, совместимость по марке и модели, гарантия, быстрая доставка по Минску и всей Беларуси. Automerc.by ваш надежный партнер.`}
        canonical={`https://automerc.by/product/${product.SparePart.article}`}
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <H1 className="lg:mb-7 mb-5 lg:text-[32px] text-[24px] !font-bold">
          {product.SparePart.nameWithInfo}
        </H1>
        <div className="flex lg:flex-row lg:items-start items-center flex-col xl:gap-[120px] lg:gap-[60px] gap-[20px] lg:mb-8 mb-12">
          <VerticalSlider images={product.SparePart.photos} />
          <ProductDescription
            price={product.SparePart.price}
            user={user}
            product={product}
          />
        </div>
        <ProductInfoBlock params={getProductParams(product)} />
        {applicabilityBrands.total > 0 && (
          <ApplicabilityBlock
            applicabilityBrands={applicabilityBrands}
            article={product.SparePart.article}
          />
        )}
        <AnaloguesBlock analogues={analogues} user={user} />
      </BasicLayout>
    </>
  );
};

const ProductDescription: React.FC<{
  price: string;
  user: UserData | null;
  product: { SparePart: Product; TecDocDetailInfo: TecDocDetailInfo };
}> = ({ price, user, product }) => {
  const dispatch = useDispatch();
  const [bynPrice, setBynPrice] = useState<number>(0);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [isShowAuth, setIsShowAuth] = useState<boolean>(false);

  const [activeModal, setActiveModal] = useState<null | "phone">(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedOutsideModal =
        modalRef.current && !modalRef.current.contains(target);
      if (clickedOutsideModal) {
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
    let mounted = true;
    dispatch(startLoading());
    (async () => {
      try {
        const { rub, usd } = await getNbrbRates();

        const byn = rubToByn(Number(price), rub);

        if (mounted) {
          setBynPrice(byn);
          setRatesError(null);
        }
      } catch (e: any) {
        if (mounted) setRatesError(e?.message ?? "Ошибка получения курса");
      } finally {
        if (mounted) {
          dispatch(stopLoading());
          setRatesLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [price]);

  const favorites = useSelector(
    (state: RootState) => state.favorites?.ids ?? []
  );
  const isFavorite: boolean = Array.isArray(favorites)
    ? favorites.some((f) => f.article === product.SparePart.article)
    : false;

  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);
  const isInCart: boolean = Array.isArray(cartItems)
    ? cartItems.some((c) => c.article === product.SparePart.article)
    : false;

  const fixedImages: string[] = JSON.parse(product.SparePart.photos);

  const handleAddToCart = async () => {
    try {
      if (!isInCart) {
        if (user) {
          const res = await defaultFetch(
            `/users/cart/${product.SparePart.id}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok)
            throw new Error("Не удалось добавить в серверную корзину");

          const serverCart = await res.json();
          dispatch(setCart(serverCart));
        } else {
          dispatch(addToCart(product.SparePart));
        }

        dispatch(
          showTopNotice({
            variant: "success",
            title: "Добавлен в корзину",
            subtitle: product?.SparePart.name ?? undefined,
            imageUrl: fixedImages[0] ?? undefined,
            href: "/cart",
            autoHideMs: 3000,
          })
        );
      }
    } catch (e) {
      dispatch(addToCart(product.SparePart));
      dispatch(
        showTopNotice({
          variant: "success",
          title: "Добавлен в корзину",
          subtitle: product?.SparePart.name ?? undefined,
          imageUrl: fixedImages[0] ?? undefined,
          href: "/cart",
          autoHideMs: 3000,
        })
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 h-fit lg:w-fit w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
              <Text variant="Body">Артикул:</Text>
              <div className="p-2 rounded-[8px] bg-gray_back">
                <Text variant="Body">{product.SparePart.article}</Text>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-fit px-2 py-1 border border-red rounded-[4px] text-red">
                <Text variant="Small">Супер цена</Text>
              </div>
              <div className="flex flex-row items-end gap-2">
                <H2 className="lg:!text-[24px] !text-[20px] !font-bold">
                  {bynPrice.toFixed(2)} BYN
                </H2>
                <H3 className="line-through !text-[20px] !font-bold !text-black_40">
                  {(bynPrice * 1.1).toFixed(2)}
                </H3>
                <H3 className="!text-[20px] !font-bold !text-red">-10%</H3>
              </div>
            </div>
            <div className="flex flex-row item-center gap-2">
              <Image
                src={"/resources/Info.svg"}
                width={20}
                height={20}
                alt="Info"
              />
              <Text variant="Body">
                <span
                  className="border-b-[1px] border-black hover:text-blue_main hover:border-blue_main transition cursor-pointer"
                  onClick={() => setIsShowAuth(true)}
                >
                  авторизируйся
                </span>{" "}
                и получай бонусы
              </Text>
            </div>
          </div>
          <div className="lg:flex hidden flex-row items-center gap-2">
            <Button
              styles={`w-[219px] py-[16px] text-center rounded-[8px] text-[16px] font-semibold outline-none ${
                isInCart
                  ? "bg-white border border-blue_main text-black"
                  : "bg-blue_main text-white hover:bg-dark_blue_main transition"
              }`}
              text={isInCart ? "В корзине" : "Добавить корзину"}
              onClick={handleAddToCart}
            />
            <div
              className={`relative group flex justify-center min-w-[54px] h-[54px] border cursor-pointer ${
                isFavorite
                  ? "bg-white border-blue_main"
                  : "bg-blue_main border-transparent"
              } py-[15px] rounded-[8px]`}
              onClick={() =>
                toggleFavorite(product.SparePart, isFavorite, dispatch, user)
              }
            >
              <Image
                src={"/resources/Heart-white.svg"}
                width={24}
                height={24}
                alt="Cart"
                className={`${
                  isFavorite ? "hidden" : ""
                } absolute inset-0 m-auto transition-all duration-150 opacity-100 group-hover:opacity-0 active:scale-90`}
              />
              <Image
                src={"/resources/Heart_red.svg"}
                width={24}
                height={24}
                alt="Cart"
                className={`${
                  isFavorite ? "opacity-100" : ""
                } absolute inset-0 m-auto transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-90`}
              />
            </div>
          </div>
          <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 p-4">
            <div className="flex items-center gap-3">
              <Button
                styles={`flex-1 py-[14px] rounded-[8px] text-[16px] font-semibold text-center ${
                  isInCart
                    ? "bg-white border border-blue_main text-black"
                    : "bg-blue_main text-white h-[48px] hover:bg-dark_blue_main transition"
                } `}
                text={isInCart ? "В корзине" : "Добавить корзину"}
                onClick={handleAddToCart}
              />
              <div
                className="relative min-w-[50px] w-[50px] h-[48px] bg-blue_main rounded-[8px] flex items-center justify-center cursor-pointer"
                onClick={() =>
                  toggleFavorite(product.SparePart, isFavorite, dispatch, user)
                }
              >
                <Image
                  src={"/resources/Heart-white.svg"}
                  width={24}
                  height={24}
                  alt="Cart"
                  className={`${
                    isFavorite ? "hidden" : ""
                  } absolute inset-0 m-auto transition-all duration-150 opacity-100 group-hover:opacity-0 active:scale-90`}
                />
                <Image
                  src={"/resources/Heart_red.svg"}
                  width={24}
                  height={24}
                  alt="Cart"
                  className={`${
                    isFavorite ? "opacity-100" : ""
                  } absolute inset-0 m-auto transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-90`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          {/* <Image
            src={"/resources/Chat.svg"}
            width={24}
            height={24}
            alt="Chat"
          /> */}
          <div className="relative">
            <div
              className="py-[12px] px-[32px] border border-blue_main text-blue_main hover:bg-[#E2E3FF] transition cursor-pointer rounded-[8px]"
              onClick={() =>
                setActiveModal((prev) => (prev === "phone" ? null : "phone"))
              }
            >
              <Text variant="ButtonText">Позвонить</Text>
            </div>
            {activeModal === "phone" && (
              <div
                ref={modalRef}
                className="absolute lg:top-[50px] z-[48] w-[188px] bg-white flex flex-col gap-2 py-3 px-4 rounded-[16px] shadow-[0_0px_5px_rgba(0,0,0,0.1)] text-[16px] font-medium"
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
          </div>
          <div className="flex flex-col gap-1">
            <Text variant="Body" className="text-black_60">
              Нужна помощь?
            </Text>
            <Text variant="Body">Ответим на все вопросы</Text>
          </div>
        </div>
      </div>
      <DialogAuth open={isShowAuth} setOpen={setIsShowAuth} />
    </>
  );
};

const ApplicabilityBlock: React.FC<ApplicabilityBlockProps> = ({
  applicabilityBrands,
  article,
}) => {
  const [activeBrand, setActiveBrand] = useState(
    applicabilityBrands.data[0].mfa_id || 0
  );
  const [applicabilities, setApplicabilities] = useState<Applicability[]>([
    {
      id: 0,
      Typel: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const applicabilityRes = await defaultFetch(
        `/spare-parts/applicability/${article}/${activeBrand}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "force-cache",
        }
      );
      const data = await applicabilityRes.json();
      console.log(data.applicability);
      setApplicabilities(data.applicability);
    };
    fetchData();
  }, [activeBrand]);

  return (
    <div className="flex flex-col gap-7 mt-12">
      <H1 className="lg:text-[32px] text-[24px] !font-bold">Применимость</H1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap gap-3 items-center">
          {applicabilityBrands.data.map((brand, idx) => (
            <div
              className={`flex flex-row items-center gap-1 p-2 bg-backstroke rounded-[8px] border ${
                brand.mfa_id === activeBrand
                  ? "border-blue_main"
                  : "border-transparent"
              } transition-all duration-150 cursor-pointer`}
              onClick={() => setActiveBrand(brand.mfa_id)}
              key={idx}
            >
              {/* <Image
                src={brand.imageUrl}
                width={28}
                height={28}
                alt="Brand Logo"
              /> */}
              <Text variant="Small">{brand.mfa_brand}</Text>
            </div>
          ))}
        </div>
        <ul className="max-w-[786px] max-h-[70vh] overflow-hidden overflow-y-scroll custom-scroll">
          {applicabilities.map((mod, idx) => (
            <li
              key={idx}
              className={`px-3 ${
                idx === 0 ? "pb-4" : "py-4"
              } border-b-[1px] border-stroke`}
            >
              <Text variant="Body">{mod.Typel}</Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AnaloguesBlock: React.FC<{
  analogues: { data: Product[]; total: number };
  user: UserData | null;
}> = ({ analogues, user }) => {
  const swiperProjRef = useRef<any>(null);

  return (
    <div className="mt-12">
      <div className="flex flex-row justify-between items-center mb-7">
        <H1 className="lg:text-[32px] text-[24px] !font-bold">Аналоги</H1>
        <div className="md:flex hidden flex-row gap-8">
          <div className="custom-prev-analogue z-10 cursor-pointer [&.swiper-button-disabled]:opacity-40">
            <Image
              src="/resources/arrow-left.svg"
              alt="prev"
              width={24}
              height={24}
            />
          </div>
          <div className="custom-next-analogue z-10 cursor-pointer [&.swiper-button-disabled]:opacity-40">
            <Image
              src="/resources/arrow-left.svg"
              alt="next"
              width={24}
              height={24}
              className="rotate-180"
            />
          </div>
        </div>
      </div>

      {/* Аналоги */}
      <div className="md:block hidden">
        <Swiper
          watchSlidesProgress={true}
          centeredSlides={false}
          freeMode={false}
          slidesPerView={4}
          spaceBetween={20}
          onSwiper={(swiper) => (swiperProjRef.current = swiper)}
          modules={[Thumbs, Navigation]}
          navigation={{
            nextEl: ".custom-next-analogue",
            prevEl: ".custom-prev-analogue",
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="h-full swiper-analogues"
        >
          {analogues.data.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard product={product} user={user} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="md:hidden grid grid-cols-2 gap-x-4 gap-y-6">
        {analogues.data.map((product, idx) => (
          <div key={idx}>
            <ProductCard product={product} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const article = context.params?.article as string;

  console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/spare-parts/${article}`);
  const res = await defaultFetch(`/spare-parts/${article}`);
  if (!res.ok) return { props: { product: null } };

  const product: { SparePart: Product; TecDocDetailInfo: any } =
    await res.json();
  const analoguesRes = await defaultFetch(
    `/spare-parts/analogues/search?categoryId=${
      product.SparePart.category_id
    }&generationId=${product.SparePart.generations[0]?.id ?? ""}&limit=8`
  );
  const analogues: any = await analoguesRes.json();

  if (product.TecDocDetailInfo) {
    const applicabilityBrandsRes = await defaultFetch(
      `/spare-parts/applicability/${article}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      }
    );
    const applicabilityBrands = await applicabilityBrandsRes.json();

    return {
      props: {
        product,
        analogues,
        applicabilityBrands,
      },
    };
  } else {
    return {
      props: {
        product,
        analogues,
        applicabilityBrands: { total: 0, data: [] },
      },
    };
  }
};

export default productPage;

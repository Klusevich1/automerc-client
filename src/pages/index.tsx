import MainSlider, { Slide } from "@/components/MainSlider";
import BasicLayout from "@/layouts/BasicLayout";
import H2 from "@/components/headers/H2";
import React, { useState } from "react";
import FilterBLock from "@/components/FilterBLock";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/Product";
import PopularCategoriesBlock from "@/components/PopularCategoriesBlock";
import QuestionAnswerBlock from "@/components/QuestionAnswerBlock";
import { GetServerSidePropsContext } from "next";
import { getAllCategories } from "@/lib/getAllCategories";
import { getAllBrands } from "@/lib/carInfo";
import { Category } from "@/interfaces/Category";
import { Brand } from "@/interfaces/Brand";
import { getProductsByFilters } from "@/lib/getProductsByFilters";
import { useUser } from "@/utils/hooks/useUser";
import { getRandomProducts } from "@/lib/getRandomProducts";
import { getAllPromos } from "@/lib/getAllPromos";
import { Promo } from "@/interfaces/Promo";
import CarsForDisassembly from "@/components/CarsForDisassembly";
import SEO, { ListItem } from "@/components/SEO";

const PAGE_NAME = "";
const BREADCRUMB_PAGE_NAME = "Главная";

const BREADCRUMBS = [{ name: "Главная", link: "/" }];

const breadcrumbsSchema: ListItem[] = BREADCRUMBS.map((item, index) => ({
  "@type": "ListItem",
  position: index + 1,
  name: item.name,
  item: `https://hazparts.com${item.link}`,
}));

const SLIDES: Slide[] = [
  {
    id: 1,
    content: "/resources/banners/banner1.png",
    contentSmall: "/resources/banners/banner1_small.png",
    href: "https://www.avito.ru/brands/i178902457/all?sellerId=570620353aa379e6287a9933d600367b",
  },
  {
    id: 2,
    content: "/resources/banners/banner2.png",
    contentSmall: "/resources/banners/banner2_small.png",
  },
  {
    id: 3,
    content: "/resources/banners/banner3.png",
    contentSmall: "/resources/banners/banner3_small.png",
  },
];

interface HomeProps {
  fetchCategories: {
    total: number;
    items: Category[];
  };
  fetchBrands: {
    total: number;
    items: Brand[];
  };
  fetchPopProducts: {
    total: number;
    spareParts: Product[];
  };
  fetchPromos: Promo[];
}

const Home: React.FC<HomeProps> = ({
  fetchCategories,
  fetchBrands,
  fetchPopProducts,
  fetchPromos,
}) => {
  const { user } = useUser();

  return (
    <>
      <SEO
        title="Автозапчасти б/у для легковых автомобилей | Купить б/у детали в Минске"
        description="Интернет-магазин б/у автозапчастей Automerc.by - широкий выбор оригинальных деталей и аналогов для легковых автомобилей. Подбор по марке, модели и модификации, быстрая доставка по Минску и всей Беларуси."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <div className="flex lg:flex-row flex-col-reverse gap-5">
          <FilterBLock
            fetchCategories={fetchCategories}
            fetchBrands={fetchBrands}
          />
          <MainSlider slides={SLIDES} />
        </div>
        <PopularCategoriesBlock />
        <div>
          <H2 className="sm:!text-[32px] text-[24px] !font-bold mb-7">
            Популярные товары
          </H2>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-x-5 gap-y-8">
            {fetchPopProducts.spareParts &&
              fetchPopProducts.spareParts.map((prod, idx) => (
                <ProductCard product={prod} user={user} />
              ))}
          </div>
        </div>
        <CarsForDisassembly promos={fetchPromos} />
        <QuestionAnswerBlock
          data={[
            {
              title: "Как быстро вы отправляете заказанные запчасти?",
              description:
                "Все позиции, которые есть на складе в Минске, мы отправляем в течение 24 часов. Доставка по РБ занимает 1–2 дня, в Москву и регионы РФ — от 1 дня, в зависимости от транспортной компании.",
            },
            {
              title:
                "Вы продаёте только оригинальные запчасти или аналоги тоже?",
              description:
                "Мы работаем только с оригинальными б/у запчастями, снятыми с автомобилей с минимальным пробегом. Все детали проходят проверку на исправность перед отправкой.",
            },
            {
              title: "Есть ли у вас гарантия на б/у автозапчасти?",
              description:
                "Да, на все запчасти предоставляется гарантия на проверку и установку — 14 дней. Если деталь не подошла или есть скрытый дефект, мы заменим её или вернём деньги.",
            },
          ]}
          isOnlyTopPadding={true}
        />
      </BasicLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const locale = "en";

  try {
    console.log('index ssr')
    const fetchCategories = await getAllCategories();
    const fetchBrands = await getAllBrands();
    const fetchPopProducts = await getRandomProducts(8);
    const fetchPromos = await getAllPromos();

    return {
      props: {
        fetchCategories,
        fetchBrands,
        fetchPopProducts,
        fetchPromos,
      },
    };
  } catch (error) {
    console.error("Error fetching categories or brands:", error);
    return {
      props: {
        fetchCategories: [],
        fetchBrands: [],
        fetchPopProducts: { total: 0, spareParts: [] },
        fetchPromos: [],
      },
    };
  }
}

export default Home;

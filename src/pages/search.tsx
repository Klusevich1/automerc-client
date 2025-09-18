import { GetServerSideProps } from "next";
import BasicLayout from "@/layouts/BasicLayout";
import FilterBLock from "@/components/FilterBLock";
import MainSlider, { Slide } from "@/components/MainSlider";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/Product";
import { getAllCategories } from "@/lib/getAllCategories";
import { getAllBrands } from "@/lib/carInfo";
import { Brand } from "@/interfaces/Brand";
import { Category } from "@/interfaces/Category";
import H2 from "@/components/headers/H2";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import H1 from "@/components/headers/H1";
import { useUser } from "@/utils/hooks/useUser";
import SEO, { ListItem } from "@/components/SEO";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

interface SearchPageProps {
  searchProducts: {
    total: number;
    items: Product[];
  };
  searchQuery: string;
}

const PAGE_NAME = "search";
const BREADCRUMB_PAGE_NAME = "Поиск по сайту";
const LIMIT = 24;

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

const SearchPage: React.FC<SearchPageProps> = ({
  searchProducts,
  searchQuery,
}) => {
  const [categories, setCategories] = useState<{
    total: number;
    items: Category[];
  }>({ total: 0, items: [] });
  const [brands, setBrands] = useState<{ total: number; items: Brand[] }>({
    total: 0,
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await getAllCategories();
      setCategories(fetchCategories);
      const fetchBrands = await getAllBrands();
      setBrands(fetchBrands);
    };
    fetchData();
  }, []);
  return (
    <>
      <SEO
        title="Поиск автозапчастей | Automerc.by"
        description="Используйте поиск, чтобы быстро найти нужные автозапчасти. Подбор по названию, артикулу, марке, модели и модификации. Automerc.by - удобный интернет-магазин б/у автозапчастей для любых автомобилей."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <div className="flex lg:flex-row flex-col-reverse gap-5">
          <FilterBLock fetchBrands={brands} fetchCategories={categories} />
          <MainSlider slides={SLIDES} />
        </div>
        <CatalogBlock
          searchProducts={searchProducts}
          searchQuery={searchQuery}
        />
      </BasicLayout>
    </>
  );
};

const CatalogBlock: React.FC<SearchPageProps> = ({
  searchProducts,
  searchQuery,
}) => {
  const { user } = useUser();
  const [items, setItems] = useState<Product[]>(searchProducts.items);

  return (
    <div className="pt-12">
      <H1 className="mb-7 sm:!text-[32px] text-[24px] !font-bold">
        Результаты поиска по "{searchQuery}"
      </H1>
      <div className="flex flex-row gap-5">
        <div className="w-full flex flex-col items-center gap-6">
          {searchProducts.total === 0 ? (
            <H2 className="sm:!text-[32px] !text-[20px] !font-bold text-center">
              По вашему запросу ничего не найдено
            </H2>
          ) : (
            <>
              <div className="w-full flex justify-end">
                <div className="w-full flex md:flex-row flex-row-reverse items-center justify-between">
                  <p>{searchProducts.total} запчастей</p>
                </div>
              </div>
              <div className="w-full grid lg:grid-cols-4 grid-cols-2 sm:gap-x-5 gap-x-4 sm:gap-y-7 gap-y-6">
                {items.map((product, idx) => (
                  <div key={idx}>
                    <ProductCard product={product} user={user} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;
  const searchQuery = query.q || "";

  if (!searchQuery) {
    return {
      props: {
        searchProducts: { total: 0, items: [] },
        searchQuery: "",
      },
    };
  }

  const res = await defaultFetch(
    `/spare-parts/search/${searchQuery}`
  );

  if (!res.ok) {
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }

  const data = await res.json();
  return {
    props: {
      searchProducts: data,
      searchQuery,
    },
  };
};

export default SearchPage;

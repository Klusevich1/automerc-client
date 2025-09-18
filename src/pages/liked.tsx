import AdminPromoForm from "@/components/AdminPromoForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import ProductCard from "@/components/ProductCard";
import SEO, { ListItem } from "@/components/SEO";
import { Promo } from "@/interfaces/Promo";
import BasicLayout from "@/layouts/BasicLayout";
import { getAllPromos } from "@/lib/getAllPromos";
import { RootState } from "@/redux/store";
import { useUser } from "@/utils/hooks/useUser";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type CarCardProps = {
  title: string;
  text: string;
  images: { id: number; url: string }[];
};

const PAGE_NAME = "liked";
const BREADCRUMB_PAGE_NAME = "Избранное";

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

const liked: React.FC<{ fetchPromos: Promo[] }> = ({ fetchPromos }) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(true);

  return (
    <>
      <SEO
        title="Избранные товары на сайте | Automerc.by - магазин б/у автозапчастей"
        description="Сохраняйте и просматривайте понравившиеся автозапчасти в разделе «Избранное». Легко вернуться к нужным деталям для заказа. Automerc.by - удобный интернет-магазин б/у автозапчастей в Беларуси."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <CarsListBlock />
      </BasicLayout>
    </>
  );
};

const CarsListBlock = () => {
  const router = useRouter();
  const [isVisibleFilter, setIsVisibleFilter] = useState<boolean>(false);
  const [bynPrice, setBynPrice] = useState<number>(0);

  const { priceFrom, priceTo } = router.query;

  const { user } = useUser();

  const favorites = useSelector(
    (state: RootState) => state.favorites?.ids ?? []
  );

  return (
    <>
      <H1 className="mb-7 !font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em]">
        Избранное
      </H1>
      {favorites.length === 0 ? (
        <p>Здесь будут ваши избранные товары.</p>
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-[20px] gap-y-[32px] w-full">
          {favorites.map((card, idx) => (
            <div key={idx}>
              <ProductCard product={card} user={user} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const fetchPromos = await getAllPromos();

    return {
      props: {
        fetchPromos,
      },
    };
  } catch (error) {
    console.error("Error fetching categories or brands:", error);
    return {
      props: {
        fetchPromos: [],
      },
    };
  }
}

export default liked;
